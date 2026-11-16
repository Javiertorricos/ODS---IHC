import { useEffect, useState } from 'react'
import type { DatosMaterial, Material, Usuario } from '../data/tipos'
import { mensajeDe } from '../services/api'
import { actualizarMaterial, crearMaterial, eliminarMaterial, obtenerMateriales } from '../services/materialService'
import { extension } from '../utils/archivos'

// Estado de la lista de materiales + las operaciones del CRUD.
// Los tres estados de las operaciones remotas: cargando, guardando y error.
export function useMateriales() {
  const [materiales, setMateriales] = useState<Material[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const [intento, setIntento] = useState(0) // "Reintentar" lo incrementa y el efecto vuelve a cargar

  // READ: se ejecuta despues del primer render y cada vez que se pulsa "Reintentar".
  // try hace la peticion, catch guarda el mensaje de error y finally termina "cargando" SIEMPRE.
  useEffect(() => {
    async function cargarMateriales() {
      try {
        const lista = await obtenerMateriales()
        setMateriales(lista)
        setError('')
      } catch (e) {
        setError(mensajeDe(e, 'No se pudo cargar la biblioteca.'))
      } finally {
        setCargando(false)
      }
    }
    cargarMateriales()
  }, [intento])

  // Boton "Reintentar" despues de un error de carga
  function reintentar() {
    setCargando(true)
    setError('')
    setIntento((n) => n + 1)
  }

  // Envuelve una operación de escritura con el estado "guardando"
  async function guardar<T>(operacion: () => Promise<T>): Promise<T> {
    setGuardando(true)
    try {
      return await operacion()
    } finally {
      setGuardando(false)
    }
  }

  const agregar = (datos: DatosMaterial, archivo: File, autor: Usuario) =>
    guardar(async () => {
      const material: Material = {
        ...datos,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        fecha: new Date().toISOString(),
        archivoNombre: archivo.name,
        archivoTamano: archivo.size,
        archivoExt: extension(archivo.name),
        autorNombre: autor.nombre,
        autorCorreo: autor.correo,
      }
      const creado = await crearMaterial(material, archivo)
      setMateriales((previos) => [creado, ...previos])
      return creado
    })

  const editar = (original: Material, datos: DatosMaterial, usuario: Usuario, archivo?: File) =>
    guardar(async () => {
      const actualizado: Material = {
        ...original,
        ...datos,
        ...(archivo && { archivoNombre: archivo.name, archivoTamano: archivo.size, archivoExt: extension(archivo.name) }),
      }
      const guardado = await actualizarMaterial(actualizado, usuario.correo, archivo)
      setMateriales((previos) => previos.map((m) => (m.id === guardado.id ? guardado : m)))
      return guardado
    })

  const eliminar = (material: Material, usuario: Usuario) =>
    guardar(async () => {
      await eliminarMaterial(material.id, usuario.correo)
      // Solo si la API confirmó el DELETE se quita de la lista en pantalla
      setMateriales((previos) => previos.filter((m) => m.id !== material.id))
    })

  return { materiales, cargando, guardando, error, reintentar, agregar, editar, eliminar }
}
