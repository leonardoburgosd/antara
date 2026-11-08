import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { SessionUser } from "../types/library";

/**
 * Sesión autenticada contra el backend real (ADR-016).
 *
 * El token solo vive en esta capa de estado; los componentes consumen `user`
 * y nunca el token directamente. Se limpia al cerrar sesión.
 */
export type SignInPayload = {
  user: SessionUser;
  token: string;
  tipo: string;
};

type SessionContextValue = {
  user: SessionUser | null;
  token: string | null;
  tipo: string | null;
  signIn: (payload: SignInPayload) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);

  const signIn = useCallback((payload: SignInPayload) => {
    setUser(payload.user);
    setToken(payload.token);
    setTipo(payload.tipo);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    setTipo(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, tipo, signIn, signOut }),
    [user, token, tipo, signIn, signOut],
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
