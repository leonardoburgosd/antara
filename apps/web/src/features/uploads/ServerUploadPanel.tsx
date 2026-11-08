import { useEffect, useRef, useState } from "react";
import { Icon } from "../../components/Icon";
import { ApiError } from "../../services/api/apiClient";
import {
  enrichTrackMetadata,
  fetchUploadRoutes,
  uploadTrackFile,
  uploadTrackFromUrl,
  type RutaSubidaDto,
  type SubidaPistaDto,
} from "../../services/api/uploadsService";
import { useServers } from "../../stores/servers";
import { useSession } from "../../stores/session";

/** Extensiones admitidas por el backend (`SubidaPistaService.ExtensionesAudio`). */
const EXTENSIONES_AUDIO = ".mp3,.flac,.wav,.m4a,.aac,.ogg,.opus,.wma,.aiff,.alac";

const INPUT_CLASS =
  "h-11 w-full rounded-md border border-border-strong bg-surface-elevated px-3 text-body text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none";

/** Rutas cargadas junto a la clave (servidor + token) con la que se pidieron. */
type RutasCargadas = { clave: string; rutas: RutaSubidaDto[] };

/** Estado del enriquecimiento de metadatos que sigue a cada subida. */
type EstadoMetadatos =
  | { estado: "buscando" }
  | { estado: "aplicado"; nombre: string; interprete: string | null; album: string | null }
  | { estado: "sinCoincidencias" }
  | { estado: "error"; mensaje: string };

function claveDeCarga(address: string, token: string): string {
  return `${address}\u0000${token}`;
}

/**
 * Subida al servidor: archivo de audio o enlace de YouTube. El destino se elige
 * entre las rutas registradas (`GET /api/pista/subir/rutas`); el backend decide
 * la carpeta final.
 *
 * La API está restringida a administradores por ahora: un `403` se muestra como
 * restricción temporal, sin ocultar el panel, para no cambiar la UI al liberarla.
 */
export function ServerUploadPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useSession();
  const { activeServer } = useServers();

  const [cargadas, setCargadas] = useState<RutasCargadas | null>(null);
  const [rutaId, setRutaId] = useState("");
  const [subcarpeta, setSubcarpeta] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [enviando, setEnviando] = useState<"archivo" | "url" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<SubidaPistaDto | null>(null);
  const [metadatos, setMetadatos] = useState<EstadoMetadatos | null>(null);

  const clave = activeServer && token ? claveDeCarga(activeServer.address, token) : null;

  useEffect(() => {
    if (!activeServer || !token) return;

    const claveActual = claveDeCarga(activeServer.address, token);
    const controller = new AbortController();
    let mounted = true;

    fetchUploadRoutes(activeServer.address, token, controller.signal)
      .then((data) => {
        if (mounted) setCargadas({ clave: claveActual, rutas: data });
      })
      .catch(() => {
        // Sin rutas disponibles el backend igualmente resuelve la predeterminada.
        if (mounted) setCargadas({ clave: claveActual, rutas: [] });
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [activeServer, token]);

  // Se descartan las rutas de otro servidor o sesión sin tocar estado en el efecto.
  const rutas = clave && cargadas?.clave === clave ? cargadas.rutas : null;

  const predeterminada =
    rutas?.find((ruta) => ruta.esPredeterminada && ruta.disponible && ruta.escribible)?.id ??
    rutas?.find((ruta) => ruta.disponible && ruta.escribible)?.id ??
    "";
  const rutaSeleccionada = rutaId || predeterminada;

  const puedeEnviar = Boolean(activeServer && token) && enviando === null;

  /**
   * Tras la subida busca la canción y aplica la primera coincidencia con
   * `POST /api/pista/{id}/metadatos` (ActualizarMetadatosAsync). Un fallo aquí
   * no invalida la subida: se informa en una línea aparte.
   */
  const completarMetadatos = async (dto: SubidaPistaDto) => {
    if (!activeServer || !token) return;

    setMetadatos({ estado: "buscando" });

    try {
      const aplicado = await enrichTrackMetadata(activeServer.address, token, dto);
      if (!aplicado) {
        setMetadatos({ estado: "sinCoincidencias" });
        return;
      }

      setMetadatos({
        estado: "aplicado",
        nombre: aplicado.pista.nombre?.trim() || dto.nombre,
        interprete: aplicado.pista.interprete?.trim() || null,
        album: aplicado.pista.albumNombre?.trim() || null,
      });
    } catch (cause) {
      setMetadatos({ estado: "error", mensaje: messageForMetadata(cause) });
    }
  };

  const subirArchivo = async () => {
    if (!activeServer || !token || !archivo) return;

    setEnviando("archivo");
    setError(null);
    setResultado(null);
    setMetadatos(null);

    try {
      const dto = await uploadTrackFile(activeServer.address, token, {
        rutaId: rutaSeleccionada || null,
        subcarpeta,
        archivo,
      });
      setResultado(dto);
      setArchivo(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      void completarMetadatos(dto);
    } catch (cause) {
      setError(messageForUpload(cause));
    } finally {
      setEnviando(null);
    }
  };

  const subirDesdeUrl = async () => {
    if (!activeServer || !token || !url.trim()) return;

    setEnviando("url");
    setError(null);
    setResultado(null);
    setMetadatos(null);

    try {
      const dto = await uploadTrackFromUrl(activeServer.address, token, {
        rutaId: rutaSeleccionada || null,
        subcarpeta,
        url,
      });
      setResultado(dto);
      setUrl("");
      void completarMetadatos(dto);
    } catch (cause) {
      setError(messageForUpload(cause));
    } finally {
      setEnviando(null);
    }
  };

  return (
    <section
      className="mt-6 rounded-xl border border-border bg-surface p-4 sm:p-6"
      aria-label="Subir al servidor"
    >
      <h2 className="text-h3 font-semibold text-text-primary">Subir al servidor</h2>
      <p className="mt-1 max-w-2xl text-body-sm text-text-secondary">
        Guarda el audio en una ruta registrada del servidor y queda en la biblioteca. Por ahora
        requiere una cuenta administradora.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-caption text-text-secondary">Ruta de destino</span>
          <select
            value={rutaSeleccionada}
            onChange={(event) => setRutaId(event.target.value)}
            className={INPUT_CLASS}
          >
            <option value="">Predeterminada del servidor</option>
            {(rutas ?? []).map((ruta) => (
              <option
                key={ruta.id}
                value={ruta.id}
                disabled={!ruta.disponible || !ruta.escribible}
              >
                {ruta.nombre}
                {ruta.esPredeterminada ? " (predeterminada)" : ""}
                {!ruta.disponible || !ruta.escribible ? " · no disponible" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-caption text-text-secondary">Subcarpeta (opcional)</span>
          <input
            type="text"
            value={subcarpeta}
            onChange={(event) => setSubcarpeta(event.target.value)}
            placeholder="Artista/Álbum"
            className={INPUT_CLASS}
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept={EXTENSIONES_AUDIO}
          aria-label="Seleccionar archivo de audio"
          className="sr-only"
          onChange={(event) => setArchivo(event.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-11 min-w-0 items-center gap-2 rounded-md border border-border-strong bg-surface-elevated px-4 text-button text-text-primary transition-colors duration-150 hover:bg-surface-hover"
        >
          <Icon name="upload_file" size={20} className="text-text-secondary" />
          <span className="max-w-[220px] truncate">{archivo ? archivo.name : "Elegir archivo"}</span>
        </button>
        <button
          type="button"
          onClick={subirArchivo}
          disabled={!archivo || !puedeEnviar}
          className="h-11 rounded-md bg-primary px-4 text-button text-on-primary transition-colors duration-150 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando === "archivo" ? "Subiendo…" : "Subir archivo"}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-caption text-text-secondary">Enlace de YouTube</span>
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className={INPUT_CLASS}
          />
        </label>
        <button
          type="button"
          onClick={subirDesdeUrl}
          disabled={!url.trim() || !puedeEnviar}
          className="h-11 shrink-0 rounded-md border border-border-strong bg-surface-elevated px-4 text-button text-text-primary transition-colors duration-150 hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando === "url" ? "Descargando…" : "Descargar y agregar"}
        </button>
      </div>

      {resultado ? (
        <p
          role="status"
          className="mt-4 rounded-md border border-success/40 bg-surface-elevated px-3 py-2 text-body-sm text-success"
        >
          {resultado.nombre}
          {resultado.interprete ? ` · ${resultado.interprete}` : ""} — {resultado.mensaje}
        </p>
      ) : null}

      {metadatos ? (
        <p
          role="status"
          className={`mt-2 rounded-md border bg-surface-elevated px-3 py-2 text-body-sm ${
            metadatos.estado === "error"
              ? "border-warning/40 text-warning"
              : "border-border text-text-secondary"
          }`}
        >
          {metadatos.estado === "buscando" ? "Buscando metadatos de la canción…" : null}
          {metadatos.estado === "sinCoincidencias"
            ? "No se encontraron coincidencias: la pista quedó con los datos de la subida."
            : null}
          {metadatos.estado === "aplicado"
            ? `Metadatos actualizados: ${metadatos.nombre}${
                metadatos.interprete ? ` · ${metadatos.interprete}` : ""
              }${metadatos.album ? ` — ${metadatos.album}` : ""}`
            : null}
          {metadatos.estado === "error"
            ? `La pista se subió, pero no se pudieron actualizar sus metadatos. ${metadatos.mensaje}`
            : null}
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-md border border-error/40 bg-surface-elevated px-3 py-2 text-body-sm text-error"
        >
          {error}
        </p>
      ) : null}
    </section>
  );
}

/** Traduce los errores del enriquecimiento de metadatos (403, sin red, etc.). */
function messageForMetadata(cause: unknown): string {
  if (!(cause instanceof ApiError)) {
    return "Inténtalo de nuevo más tarde.";
  }

  switch (cause.kind) {
    case "forbidden":
      return "La actualización de metadatos está restringida a cuentas administradoras por ahora.";
    case "unauthorized":
      return "Tu sesión expiró. Vuelve a iniciar sesión.";
    case "validation":
    case "notFound":
      return cause.message;
    case "network":
      return "No se pudo conectar con el servidor.";
    case "unavailable":
      return "El servidor no está disponible.";
    case "parsing":
      return "Respuesta inesperada del servidor.";
    case "server":
      return "Error del servidor.";
  }
}

/** Traduce los errores de subida (incluido el 403 temporal de rol). */
function messageForUpload(cause: unknown): string {
  if (!(cause instanceof ApiError)) {
    return "No se pudo completar la subida. Inténtalo de nuevo.";
  }

  switch (cause.kind) {
    case "forbidden":
      return "La subida al servidor está disponible solo para cuentas administradoras por ahora.";
    case "unauthorized":
      return "Tu sesión expiró. Vuelve a iniciar sesión.";
    case "validation":
    case "notFound":
    case "server":
      return cause.message;
    case "network":
      return "No se pudo conectar con el servidor. Revisa la dirección y tu red.";
    case "unavailable":
      return "El servidor no está disponible.";
    case "parsing":
      return "Respuesta inesperada del servidor.";
  }
}
