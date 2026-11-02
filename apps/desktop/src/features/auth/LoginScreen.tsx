import { useState } from "react";
import type { FormEvent } from "react";
import { Icon } from "../../components/Icon";
import { useSession } from "../../stores/session";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

/**
 * Inicio de sesión mock (igual que Android, ADR-014): email válido y contraseña
 * de 6+ caracteres. Al existir backend se sustituye por `services/api/auth`.
 */
export function LoginScreen() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Introduce un email válido");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
      return;
    }

    setError(null);
    signIn(email.trim());
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
            className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-button text-on-primary transition-colors duration-150 hover:bg-primary-hover"
          >
            <Icon name="login" size={18} />
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
