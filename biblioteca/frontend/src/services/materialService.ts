import type { Material } from '../data/tipos'
import { peticion } from './api'

// Un archivo viaja a la API como texto (data URL en base64) dentro de un JSON.
type RegistroArchivo = { id: string; nombre: string; datos: string }

function leerComoDataUrl(archivo: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onload = () => resolve(String(lector.result))
    lector.onerror = () => reject(new Error('No se pudo leer el archivo.'))
    lector.readAsDataURL(archivo)
  })
}

// READ: GET /materiales (los archivos NO vienen aquí: están en /archivos)
export function obtenerMateriales(): Promise<Material[]> {
  return peticion<Material[]>('/materiales?_sort=fecha&_order=desc')
}

// CREATE: POST /archivos y POST /materiales. Si falla el segundo, se deshace el primero.
export async function crearMaterial(material: Material, archivo: File): Promise<Material> {
  const datos = await leerComoDataUrl(archivo)
  await peticion('/archivos', { metodo: 'POST', cuerpo: { id: material.id, nombre: archivo.name, datos } })
  try {
    return await peticion<Material>('/materiales', { metodo: 'POST', cuerpo: material })
  } catch (error) {
    await peticion(`/archivos/${material.id}`, { metodo: 'DELETE' }).catch(() => undefined)
    throw error
  }
}

// UPDATE: PUT /materiales/:id (y PUT /archivos/:id si se reemplazó el archivo)
export async function actualizarMaterial(material: Material, usuario: string, archivo?: File): Promise<Material> {
  if (archivo) {
    const datos = await leerComoDataUrl(archivo)
    await peticion(`/archivos/${material.id}`, { metodo: 'PUT', usuario, cuerpo: { id: material.id, nombre: archivo.name, datos } })
  }
  return peticion<Material>(`/materiales/${material.id}`, { metodo: 'PUT', usuario, cuerpo: material })
}

// DELETE: DELETE /materiales/:id (la API elimina también su archivo)
export async function eliminarMaterial(id: string, usuario: string): Promise<void> {
  await peticion(`/materiales/${id}`, { metodo: 'DELETE', usuario })
}

// GET /archivos/:id -> Blob para descargar
export async function obtenerArchivo(id: string): Promise<Blob> {
  const registro = await peticion<RegistroArchivo>(`/archivos/${id}`)
  return (await fetch(registro.datos)).blob()
}
