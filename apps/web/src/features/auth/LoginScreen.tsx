import { useState } from "react";
import type { FormEvent } from "react";
import { Icon } from "../../components/Icon";
import { ApiError } from "../../services/api/apiClient";
import { login } from "../../services/api/authService";
import { serverDisplayName, useServers } from "../../stores/servers";
import { useSession } from "../../stores/session";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

/**
 * Inicio de sesión real contra `POST /api/usuario/login` del servidor
 * configurado (ADR-016). La URL base la elige el usuario en Servidores; la ruta
 * `/api/usuario/login` sale del catálogo de endpoints.
 */
export function LoginScreen({ onOpenServers }: { onOpenServers: () => void }) {
  const { signIn } = useSession();
  const { activeServer } = useServers();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Introduce un email válido");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
      return;
    }

    if (!activeServer) {
      setError("Configura un servidor antes de iniciar sesión");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await login(activeServer.address, email.trim(), password);
      signIn(result);
    } catch (cause) {
      setError(messageFor(cause));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6 py-10 text-text-primary">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-full bg-primary text-on-primary">
            <Icon name="music_note" size={22} />
          </span>
          <span className="text-h2 font-semibold">Antara</span>
        </div>

        <h1 className="mt-6 text-h3 font-semibold">Iniciar sesión</h1>
        <p className="mt-1 text-body-sm text-text-secondary">
          Accede a tu biblioteca y a tus playlists.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={submit} noValidate>
          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium text-text-secondary">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="tu@email.com"
              className="h-11 w-full rounded-md border border-border-strong bg-surface-elevated px-3 text-body text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-body-sm font-medium text-text-secondary">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Mínimo 6 caracteres"
              className="h-11 w-full rounded-md border border-border-strong bg-surface-elevated px-3 text-body text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none"
            />
          </label>

          {error ? (
            <p role="alert" className="text-body-sm text-error">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-button text-on-primary transition-colors duration-150 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name={loading ? "hourglass_top" : "login"} size={18} />
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div className="mt-6 border-t border-border pt-4">
          <button
            type="button"
            onClick={onOpenServers}
            className="flex w-full items-center gap-3 rounded-lg border border-border bg-surface-elevated px-3 py-3 text-left transition-colors duration-150 hover:bg-surface-hover"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-hover text-primary">
              <Icon name="dns" size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body-sm font-medium text-text-primary">
                {activeServer ? serverDisplayName(activeServer.address) : "Añadir servidor"}
              </span>
              <span className="block truncate text-caption text-text-secondary">
                {activeServer
                  ? "Toca para cambiar de servidor"
                  : "Configura la IP o el dominio de tu servidor"}
              </span>
            </span>
            <Icon name="chevron_right" size={20} className="text-text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Traduce los errores del cliente HTTP a mensajes para el formulario. */
function messageFor(cause: unknown): string {
  if (!(cause instanceof ApiError)) {
    return "No se pudo iniciar sesión. Inténtalo de nuevo.";
  }

  switch (cause.kind) {
    case "notFound":
    case "unauthorized":
      return "Email o contraseña incorrectos";
    case "forbidden":
      return "Tu cuenta no tiene permisos para iniciar sesión";
    case "unavailable":
      return "El servidor aún no tiene un administrador registrado";
    case "network":
      return "No se pudo conectar con el servidor. Revisa la dirección y tu red.";
    case "validation":
      return cause.message;
    case "parsing":
      return "Respuesta inesperada del servidor";
    case "server":
      return "Error del servidor. Inténtalo más tarde.";
  }
}
