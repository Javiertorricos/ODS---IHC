import type { Usuario } from '../data/tipos'
import { peticion } from './api'

// GET /usuarios?correo=...  (JSON Server filtra por cualquier campo)
export async function buscarUsuario(correo: string): Promise<Usuario | undefined> {
  const lista = await peticion<Usuario[]>(`/usuarios?correo=${encodeURIComponent(correo)}`)
  return lista[0]
}

// POST /usuarios (la API rechaza correos repetidos con 409)
export function crearUsuario(nombre: string, correo: string): Promise<Usuario> {
  return peticion<Usuario>('/usuarios', {
    metodo: 'POST',
    cuerpo: { nombre, correo, fecha: new Date().toISOString() },
  })
}
