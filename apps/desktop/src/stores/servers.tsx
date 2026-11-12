import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

/** Servidor (IP o dominio) al que la aplicación puede conectarse. */
export type ServerConfig = {
  id: string;
  address: string;
};

export type AddServerResult = { ok: true } | { ok: false; error: string };

const SERVERS_KEY = "antara:servers";
const ACTIVE_KEY = "antara:active-server";

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readServers(): ServerConfig[] {
  try {
    const raw = window.localStorage.getItem(SERVERS_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((item) => {
      if (typeof item !== "object" || item === null) return [];
      const candidate = item as { id?: unknown; address?: unknown };
      if (typeof candidate.id !== "string" || typeof candidate.address !== "string") return [];
      return [{ id: candidate.id, address: candidate.address }];
    });
  } catch {
    return [];
  }
}

/**
 * Normaliza y valida una dirección de servidor (misma regla que Android):
 * acepta IP o dominio, con puerto y esquema opcionales.
 */
export function normalizeServerAddress(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (!url.hostname) return null;
  if (url.username || url.password) return null;
  if (url.port && (Number(url.port) < 1 || Number(url.port) > 65535)) return null;

  const path = url.pathname.replace(/\/+$/, "");
  return `${url.protocol}//${url.host}${path}`;
}

/** Texto legible sin el esquema: `192.168.1.10:8080` o `mi-servidor.com`. */
export function serverDisplayName(address: string): string {
  return address.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

type ServersContextValue = {
  servers: ServerConfig[];
  activeServer: ServerConfig | null;
  addServer: (raw: string) => AddServerResult;
  updateServer: (id: string, raw: string) => AddServerResult;
  removeServer: (id: string) => void;
  setActiveServer: (id: string) => void;
};

const ServersContext = createContext<ServersContextValue | null>(null);

export function ServersProvider({ children }: { children: ReactNode }) {
  const [servers, setServers] = useState<ServerConfig[]>(readServers);
  const [activeId, setActiveId] = useState<string | null>(() =>
    window.localStorage.getItem(ACTIVE_KEY),
  );

  const activeServer = useMemo(
    () => servers.find((server) => server.id === activeId) ?? servers[0] ?? null,
    [servers, activeId],
  );

  useEffect(() => {
    window.localStorage.setItem(SERVERS_KEY, JSON.stringify(servers));
    if (activeServer) {
      window.localStorage.setItem(ACTIVE_KEY, activeServer.id);
    } else {
      window.localStorage.removeItem(ACTIVE_KEY);
    }
  }, [servers, activeServer]);

  const addServer = useCallback(
    (raw: string): AddServerResult => {
      const normalized = normalizeServerAddress(raw);
      if (!normalized) {
        return {
          ok: false,
          error: "La dirección no es válida. Ejemplo: 192.168.1.10:8080",
        };
      }

      if (servers.some((server) => server.address.toLowerCase() === normalized.toLowerCase())) {
        return { ok: false, error: "Ese servidor ya está guardado" };
      }

      const server: ServerConfig = { id: newId(), address: normalized };
      setServers((current) => [...current, server]);
      setActiveId((current) => current ?? server.id);
      return { ok: true };
    },
    [servers],
  );

  const removeServer = useCallback((id: string) => {
    setServers((current) => current.filter((server) => server.id !== id));
    setActiveId((current) => (current === id ? null : current));
  }, []);

  const updateServer = useCallback(
    (id: string, raw: string): AddServerResult => {
      const normalized = normalizeServerAddress(raw);
      if (!normalized) {
        return {
          ok: false,
          error: "La dirección no es válida. Ejemplo: 192.168.1.10:8080",
        };
      }

      const duplicate = servers.some(
        (server) =>
          server.id !== id && server.address.toLowerCase() === normalized.toLowerCase(),
      );
      if (duplicate) {
        return { ok: false, error: "Ese servidor ya está guardado" };
      }

      setServers((current) =>
        current.map((server) =>
          server.id === id ? { ...server, address: normalized } : server,
        ),
      );
      return { ok: true };
    },
    [servers],
  );

  const setActiveServer = useCallback((id: string) => setActiveId(id), []);

  const value = useMemo(
    () => ({ servers, activeServer, addServer, updateServer, removeServer, setActiveServer }),
    [servers, activeServer, addServer, updateServer, removeServer, setActiveServer],
  );

  return <ServersContext.Provider value={value}>{children}</ServersContext.Provider>;
}

export function useServers() {
  const context = useContext(ServersContext);

  if (!context) {
    throw new Error("useServers debe usarse dentro de ServersProvider");
  }

  return context;
}
