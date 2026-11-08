import { useState } from "react";
import type { FormEvent } from "react";
import { Icon } from "../../components/Icon";
import { serverDisplayName, useServers } from "../../stores/servers";

type ServersScreenProps = {
  /** Primer arranque: no se permite volver hasta tener un servidor. */
  firstRun?: boolean;
  onBack?: () => void;
  onContinue?: () => void;
};

/**
 * Configuración de servidores (IP/dominio). Se usa desde el login y desde el
 * primer arranque, replicando el flujo de la app Android.
 */
export function ServersScreen({ firstRun = false, onBack, onContinue }: ServersScreenProps) {
  const { servers, activeServer, addServer, removeServer, setActiveServer } = useServers();
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = addServer(address);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setAddress("");
    setError(null);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background text-text-primary">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-8">
        <header className="flex items-center gap-3">
          {!firstRun ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Volver"
              className="grid size-10 place-items-center rounded-full bg-surface-elevated text-text-primary transition-colors duration-150 hover:bg-surface-hover"
            >
              <Icon name="arrow_back" size={22} />
            </button>
          ) : null}
          <h1 className="text-h2 font-semibold">Servidores</h1>
        </header>

        <p className="mt-4 text-body-sm text-text-secondary">
          Conecta Antara con tu servidor. Puedes guardar varias direcciones IP o dominios y elegir
          cuál usar.
        </p>

        {firstRun ? (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-warning bg-surface-elevated p-3">
            <Icon name="info" size={20} className="mt-0.5 text-warning" />
            <p className="text-body-sm text-text-primary">
              Necesitas al menos un servidor para continuar.
            </p>
          </div>
        ) : null}

        <form className="mt-5 flex flex-col gap-3" onSubmit={submit} noValidate>
          <div className="relative">
            <Icon
              name="dns"
              size={20}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
                setError(null);
              }}
              aria-label="Dirección del servidor"
              placeholder="192.168.1.10:8080 o https://mi-servidor.com"
              className="h-11 w-full rounded-md border border-border-strong bg-surface-elevated pl-10 pr-3 text-body text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none"
            />
          </div>

          {error ? (
            <p role="alert" className="text-body-sm text-error">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-button text-on-primary transition-colors duration-150 hover:bg-primary-hover"
          >
            <Icon name="add" size={18} />
            Añadir servidor
          </button>
        </form>

        <h2 className="mt-7 text-overline font-semibold uppercase tracking-[0.08em] text-text-secondary">
          Guardados
        </h2>

        {servers.length === 0 ? (
          <div className="mt-8 flex flex-col items-center text-center">
            <Icon name="dns" size={40} className="text-text-disabled" />
            <p className="mt-3 text-h3 font-semibold text-text-primary">Aún no hay servidores</p>
            <p className="mt-1 max-w-sm text-body-sm text-text-secondary">
              Añade la dirección IP o el dominio de tu servidor para empezar.
            </p>
          </div>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {servers.map((server) => {
              const isActive = server.id === activeServer?.id;

              return (
                <li key={server.id}>
                  <div
                    className={`flex items-center gap-3 rounded-lg border bg-surface-elevated p-3 ${
                      isActive ? "border-primary" : "border-border"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveServer(server.id)}
                      aria-pressed={isActive}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-hover text-primary">
                        <Icon name="dns" size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-body font-medium text-text-primary">
                          {serverDisplayName(server.address)}
                        </span>
                        <span className="block text-caption text-text-secondary">
                          {isActive ? "Activo" : "Toca para usar este servidor"}
                        </span>
                      </span>
                    </button>

                    <div className="flex items-center gap-1">
                      {isActive ? (
                        <Icon name="check_circle" size={20} className="text-accent" />
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeServer(server.id)}
                        aria-label="Eliminar servidor"
                        className="grid size-9 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-error"
                      >
                        <Icon name="delete" size={20} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {servers.length > 0 && onContinue ? (
          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={onContinue}
              className="flex h-11 w-full items-center justify-center rounded-md bg-primary text-button text-on-primary transition-colors duration-150 hover:bg-primary-hover"
            >
              Continuar
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
