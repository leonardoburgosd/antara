import { useEffect, useState } from "react";
import { ApiError } from "../services/api/apiClient";
import { fetchPlainLyrics, fetchSynchronizedLyrics } from "../services/api/lyricsService";
import { useServers } from "../stores/servers";
import { useSession } from "../stores/session";
import { parseLrc, type LyricLine } from "../utils/lrc";

export type LyricsStatus = "idle" | "loading" | "ready" | "unavailable" | "error";

export type LyricsState = {
  status: LyricsStatus;
  /** Líneas con marca de tiempo, solo cuando hay letra sincronizada. */
  lines: LyricLine[];
  /** Letra sin marcas de tiempo cuando no existe versión sincronizada. */
  plain: string | null;
};

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Marca de tiempo LRC: si aparece, la letra venía sincronizada. */
const LRC_TIME_TAG = /\[\d{1,3}:\d{1,2}/;

/** Solo las pistas del backend tienen id GUID; los audios locales no tienen letra. */
export function isBackendTrackId(id: string | undefined): boolean {
  return !!id && GUID.test(id);
}

/**
 * Consulta la letra solo mientras `enabled` sea `true` (panel abierto). Al
 * cerrarlo o cambiar de pista se aborta la petición pendiente y se descarta el
 * estado para no consumir los endpoints en segundo plano.
 *
 * Orden de resolución:
 * 1. `GET /api/pista/{id}/letra-sincronizada` (LRCLIB). Solo responde cuando
 *    artista, título, álbum y duración (±2 s) coinciden, así que muchas pistas
 *    no tienen LRC.
 * 2. `GET /api/mis-pistas/{id}`, que trae la `letra` plana del catálogo: es la
 *    que el backend sí devuelve y la que antes no se mostraba.
 * 3. `plainFallback`, la letra que ya venga en la cola del reproductor.
 */
export function useSynchronizedLyrics(
  trackId: string | undefined,
  enabled: boolean,
  plainFallback?: string | null,
): LyricsState {
  const { token } = useSession();
  const { activeServer } = useServers();
  const [state, setState] = useState<LyricsState>({ status: "idle", lines: [], plain: null });

  const shouldLoad = enabled && isBackendTrackId(trackId) && !!token && !!activeServer;
  const fallback = plainFallback?.trim() ? plainFallback.trim() : null;

  useEffect(() => {
    if (!shouldLoad || !trackId || !token || !activeServer) {
      setState({ status: "idle", lines: [], plain: null });
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    setState({ status: "loading", lines: [], plain: null });

    const load = async () => {
      let lrc: string | null = null;

      try {
        lrc = await fetchSynchronizedLyrics(activeServer.address, token, trackId, signal);
      } catch (error) {
        if (signal.aborted) return;
        if (!(error instanceof ApiError && error.kind === "notFound")) {
          setState({ status: "error", lines: [], plain: null });
          return;
        }
      }

      if (signal.aborted) return;

      const lines = lrc ? parseLrc(lrc) : [];
      if (lines.length > 0) {
        setState({ status: "ready", lines, plain: null });
        return;
      }

      // El endpoint de LRC también puede devolver texto sin marcas de tiempo.
      const textoDelServidor = lrc && !LRC_TIME_TAG.test(lrc) ? lrc.trim() : null;
      if (textoDelServidor) {
        setState({ status: "ready", lines: [], plain: textoDelServidor });
        return;
      }

      let plain: string | null = null;
      try {
        plain = await fetchPlainLyrics(activeServer.address, token, trackId, signal);
      } catch {
        // Sin permisos o sin red: se intenta el respaldo de la cola.
        plain = null;
      }

      if (signal.aborted) return;

      const texto = plain ?? fallback;
      setState(
        texto
          ? { status: "ready", lines: [], plain: texto }
          : { status: "unavailable", lines: [], plain: null },
      );
    };

    void load();

    return () => controller.abort();
  }, [shouldLoad, trackId, token, activeServer, fallback]);

  return state;
}
