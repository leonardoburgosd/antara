/**
 * Credenciales recordadas: solo el email.
 *
 * `docs/security.md` prohíbe guardar contraseñas en el cliente, así que el
 * formulario se rellena con el usuario y la contraseña se escribe cada vez.
 */
const REMEMBERED_EMAIL_KEY = "antara:remembered-email";

export function readRememberedEmail(): string {
  try {
    return window.localStorage.getItem(REMEMBERED_EMAIL_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

/** `null` (o vacío) olvida el email guardado. */
export function writeRememberedEmail(email: string | null): void {
  try {
    if (email && email.trim()) {
      window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
    } else {
      window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  } catch {
    // Sin almacenamiento disponible el formulario simplemente no recuerda nada.
  }
}
