import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { SessionUser } from "../types/library";

/**
 * Sesión autenticada contra el backend real (ADR-016).
 *
 * El usuario y el token se guardan en `localStorage` para que recargar la app
 * no obligue a iniciar sesión otra vez: el backend emite tokens con 8 h de
 * vigencia (`TokenExpiracionHoras`) y la sesión se restaura mientras el token
 * siga vivo. Al cerrar sesión se borra la entrada.
 *
 * Los componentes consumen `user` y nunca el token directamente.
 */
export type SignInPayload = {
  user: SessionUser;
  token: string;
  tipo: string;
};

type StoredSession = SignInPayload;

type SessionContextValue = {
  user: SessionUser | null;
  token: string | null;
  tipo: string | null;
  signIn: (payload: SignInPayload) => void;
  signOut: () => void;
};

const SESSION_KEY = "antara:session";

const SessionContext = createContext<SessionContextValue | null>(null);

/**
 * Segundos UNIX de expiración del token (`exp` del payload). El token es
 * `base64url(payload).firma`, así que basta decodificar la primera parte.
 */
export function tokenExpiresAt(token: string): number | null {
  const [payload] = token.split(".");
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const decoded = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

function isExpired(token: string): boolean {
  const expiresAt = tokenExpiresAt(token);
  return expiresAt !== null && expiresAt * 1000 <= Date.now();
}

/** Restaura la sesión guardada; descarta entradas vencidas o corruptas. */
function readStoredSession(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;

    const candidate = parsed as { user?: unknown; token?: unknown; tipo?: unknown };
    if (typeof candidate.token !== "string" || !candidate.token || isExpired(candidate.token)) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }

    const user = candidate.user as { name?: unknown; email?: unknown } | null | undefined;
    if (!user || typeof user.name !== "string" || typeof user.email !== "string") {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return {
      user: { name: user.name, email: user.email },
      token: candidate.token,
      tipo: typeof candidate.tipo === "string" && candidate.tipo ? candidate.tipo : "usuario",
    };
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(readStoredSession);

  const signIn = useCallback((payload: SignInPayload) => {
    setSession(payload);
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    } catch {
      // Sin almacenamiento disponible la sesión vive solo en memoria.
    }
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      // Nada que limpiar si el almacenamiento no está disponible.
    }
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      tipo: session?.tipo ?? null,
      signIn,
      signOut,
    }),
    [session, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession debe usarse dentro de SessionProvider");
  }

  return context;
}
