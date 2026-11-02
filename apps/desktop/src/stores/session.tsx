import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { SessionUser } from "../types/library";

/**
 * Sesión local mock mientras no exista backend (misma regla que Android, ADR-014):
 * cualquier email válido y contraseña de 6+ caracteres inicia sesión.
 * La app arranca con la sesión de desarrollo abierta.
 */
const DEFAULT_USER: SessionUser = { name: "Alex", email: "alex@antara.app" };

type SessionContextValue = {
  user: SessionUser | null;
  signIn: (email: string) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(DEFAULT_USER);

  const signIn = useCallback((email: string) => {
    const local = email.split("@")[0] ?? "";
    const name = local ? local.charAt(0).toUpperCase() + local.slice(1) : DEFAULT_USER.name;
    setUser({ name, email });
  }, []);

  const signOut = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession debe usarse dentro de SessionProvider");
  }

  return context;
}
