import { useEffect, useState } from 'react'
import type { Usuario } from '../data/tipos'
import { borrarSesion, guardarSesion, leerSesion } from '../services/sesion'
import { buscarUsuario, crearUsuario } from '../services/usuarioService'

export function useSesion() {
  const [usuario, setUsuario] = useState<Usuario | undefined>()
  // Si hay una sesión guardada, se consulta a la API quién es antes de mostrar la pantalla
  const [restaurando, setRestaurando] = useState(() => leerSesion() !== null)

  useEffect(() => {
    const correo = leerSesion()
    if (!correo) return
    buscarUsuario(correo)
      .then(setUsuario)
      .catch(() => undefined) // sin API no hay sesión: se pedirá ingresar de nuevo
      .finally(() => setRestaurando(false))
  }, [])

  const buscar = (correo: string) => buscarUsuario(correo)

  async function registrar(nombre: string, correo: string): Promise<Usuario> {
    const nuevo = await crearUsuario(nombre, correo)
    guardarSesion(correo)
    setUsuario(nuevo)
    return nuevo
  }

  function ingresar(existente: Usuario) {
    guardarSesion(existente.correo)
    setUsuario(existente)
  }

  function salir() {
    borrarSesion()
    setUsuario(undefined)
  }

  return { usuario, restaurando, buscar, registrar, ingresar, salir }
}
