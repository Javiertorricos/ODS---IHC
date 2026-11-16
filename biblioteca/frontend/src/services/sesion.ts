// La sesión (quién está dentro) es lo único que sigue en el navegador: solo guarda el correo.
// Los usuarios y los materiales viven en la API. Sesión SIMULADA: no hay contraseña real.
const CLAVE_SESION = 'biblioteca-sesion'

export function leerSesion(): string | null {
  try { return window.localStorage.getItem(CLAVE_SESION) } catch { return null }
}
export function guardarSesion(correo: string) {
  try { window.localStorage.setItem(CLAVE_SESION, correo) } catch { /* sin almacenamiento: queda solo en memoria */ }
}
export function borrarSesion() {
  try { window.localStorage.removeItem(CLAVE_SESION) } catch { /* nada */ }
}
