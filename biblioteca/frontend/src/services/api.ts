// Capa de acceso a la API REST (JSON Server). Todo el fetch pasa por aquí:
// los componentes y los hooks nunca llaman a fetch directamente.

// En local es http://localhost:3001. En Netlify se define VITE_API_URL con la dirección
// pública de la API (localhost no sirve para otros usuarios).
export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001').replace(/\/$/, '')

export class ErrorApi extends Error {
  estado?: number
  constructor(mensaje: string, estado?: number) {
    super(mensaje)
    this.estado = estado
  }
}

type Opciones = {
  metodo?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  cuerpo?: unknown
  usuario?: string // correo de quien hace el cambio (la API lo compara con el autor)
}

export async function peticion<T>(ruta: string, { metodo = 'GET', cuerpo, usuario }: Opciones = {}): Promise<T> {
  const cabeceras: Record<string, string> = {}
  if (cuerpo !== undefined) cabeceras['Content-Type'] = 'application/json'
  if (usuario) cabeceras['x-usuario'] = usuario

  let respuesta: Response
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    })
  } catch {
    throw new ErrorApi('No se pudo conectar con el servidor. Revisa tu conexión o que la API esté encendida.')
  }

  if (!respuesta.ok) {
    let mensaje = `El servidor respondió con un error (${respuesta.status}).`
    try {
      const datos = await respuesta.json()
      if (datos?.mensaje) mensaje = datos.mensaje
    } catch { /* la respuesta no era JSON */ }
    throw new ErrorApi(mensaje, respuesta.status)
  }
  return respuesta.json() as Promise<T>
}

export function mensajeDe(error: unknown, porDefecto = 'Ocurrió un error inesperado.') {
  return error instanceof Error && error.message ? error.message : porDefecto
}
