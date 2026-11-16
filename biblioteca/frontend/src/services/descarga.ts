import type { Material } from '../data/tipos'
import { obtenerArchivo } from './materialService'

export async function descargarMaterial(material: Material): Promise<void> {
  const blob = await obtenerArchivo(material.id)
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = material.archivoNombre
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
