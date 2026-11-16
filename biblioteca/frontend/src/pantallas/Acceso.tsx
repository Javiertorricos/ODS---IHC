import { useState, type FormEvent } from 'react'
import type { Usuario } from '../data/tipos'
import { mensajeDe } from '../services/api'
import CampoCorreo from '../components/CampoCorreo'
import { estiloCampo, estiloCampoError } from '../components/campos'
import Titulo from '../components/Titulo'
import { resolverCorreo } from '../utils/correo'

interface Props {
  motivo?: string // por que se pide el acceso
  buscar: (correo: string) => Promise<Usuario | undefined>
  registrar: (nombre: string, correo: string) => Promise<Usuario>
  ingresar: (usuario: Usuario) => void
  onListo: () => void
  onCancelar: () => void
}

type Modo = 'ingresar' | 'registrar'

const SOLO_LETRAS = /^[\p{L}.\s'-]+$/u

function Acceso({ motivo, buscar, registrar, ingresar, onListo, onCancelar }: Props) {
  const [modo, setModo] = useState<Modo>('ingresar')
  const [nombre, setNombre] = useState('')
  const [correoTexto, setCorreoTexto] = useState('')
  const [codigo, setCodigo] = useState('') // codigo simulado generado al registrar
  const [codigoEscrito, setCodigoEscrito] = useState('')
  const [errores, setErrores] = useState<{ nombre?: string; correo?: string; codigo?: string; general?: string }>({})
  const [trabajando, setTrabajando] = useState(false) // consultando a la API

  function cambiarModo(nuevo: Modo) {
    setModo(nuevo)
    setErrores({})
    setCodigo('')
    setCodigoEscrito('')
  }

  async function enviarIngreso(e: FormEvent) {
    e.preventDefault()
    const r = resolverCorreo(correoTexto)
    if (!r.ok) return setErrores({ correo: r.error })
    setTrabajando(true)
    try {
      const existente = await buscar(r.correo)
      if (!existente) return setErrores({ correo: 'Este correo no está registrado. Regístrate primero.' })
      ingresar(existente)
      onListo()
    } catch (error) {
      setErrores({ general: mensajeDe(error) })
    } finally {
      setTrabajando(false)
    }
  }

  async function enviarRegistro(e: FormEvent) {
    e.preventDefault()
    const nuevos: typeof errores = {}
    const nombreLimpio = nombre.trim().replace(/\s+/g, ' ')
    if (nombreLimpio.length < 3 || !SOLO_LETRAS.test(nombreLimpio)) nuevos.nombre = 'Escribe tu nombre completo (solo letras).'
    const r = resolverCorreo(correoTexto)
    if (!r.ok) nuevos.correo = r.error
    else {
      setTrabajando(true)
      try {
        if (await buscar(r.correo)) nuevos.correo = 'Este correo ya está registrado. Usa "Ingresar".'
      } catch (error) {
        nuevos.general = mensajeDe(error)
      } finally {
        setTrabajando(false)
      }
    }
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return
    // Simulacion del envio del codigo de verificacion
    setCodigo(String(Math.floor(100000 + Math.random() * 900000)))
  }

  async function confirmarCodigo(e: FormEvent) {
    e.preventDefault()
    if (codigoEscrito.trim() !== codigo) return setErrores({ codigo: 'El código no coincide.' })
    const r = resolverCorreo(correoTexto)
    if (!r.ok) return
    setTrabajando(true)
    try {
      await registrar(nombre.trim().replace(/\s+/g, ' '), r.correo)
      onListo()
    } catch (error) {
      setErrores({ general: mensajeDe(error) })
    } finally {
      setTrabajando(false)
    }
  }

  const errorGeneral = errores.general && (
    <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-800">{errores.general}</p>
  )

  const verificando = modo === 'registrar' && codigo !== ''

  return (
    <div className="mx-auto max-w-lg">
      <Titulo titulo={modo === 'ingresar' ? 'Ingresar' : 'Registrarme'} texto={motivo ?? 'Con tu cuenta puedes subir material a la biblioteca.'} />

      <p className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Modo simulado.</strong> No se envía ningún correo ni se pide una contraseña real. Solo se aceptan direcciones @ucb.edu.bo.
      </p>

      <div className="mb-5 flex gap-1 rounded-xl bg-slate-200 p-1" role="tablist">
        {(['ingresar', 'registrar'] as Modo[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={modo === m}
            onClick={() => cambiarModo(m)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${modo === m ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
          >
            {m === 'ingresar' ? 'Ingresar' : 'Registrarme'}
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
        {modo === 'ingresar' && (
          <form onSubmit={enviarIngreso} noValidate className="grid grid-cols-1 gap-4">
            <CampoCorreo id="correo-ingreso" valor={correoTexto} onCambio={(v) => { setCorreoTexto(v); setErrores({}) }} error={errores.correo} />
            {errorGeneral}
            <button type="submit" disabled={trabajando} className="justify-self-start rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60">{trabajando ? 'Comprobando...' : 'Ingresar'}</button>
          </form>
        )}

        {modo === 'registrar' && !verificando && (
          <form onSubmit={enviarRegistro} noValidate className="grid grid-cols-1 gap-4">
            <label className="block" htmlFor="nombre-registro">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Nombre completo</span>
              <input id="nombre-registro" name="nombre" value={nombre} onChange={(e) => { setNombre(e.target.value); setErrores({}) }} placeholder="Ej. Juan Pérez" className={errores.nombre ? estiloCampoError : estiloCampo} aria-invalid={Boolean(errores.nombre)} />
              {errores.nombre && <span role="alert" className="mt-1 block text-sm text-rose-700">{errores.nombre}</span>}
            </label>
            <CampoCorreo id="correo-registro" valor={correoTexto} onCambio={(v) => { setCorreoTexto(v); setErrores({}) }} error={errores.correo} />
            {errorGeneral}
            <button type="submit" disabled={trabajando} className="justify-self-start rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60">{trabajando ? 'Comprobando...' : 'Enviar código'}</button>
          </form>
        )}

        {verificando && (
          <form onSubmit={confirmarCodigo} noValidate className="grid grid-cols-1 gap-4">
            <p className="text-sm text-slate-600">
              En una versión real, el código llegaría a tu correo. Aquí lo mostramos para que puedas continuar:
            </p>
            <p className="rounded-xl bg-brand/10 px-4 py-3 text-center font-display text-2xl font-extrabold tracking-[0.3em] text-brand" aria-label="Código simulado">{codigo}</p>
            <label className="block" htmlFor="codigo">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Escribe el código</span>
              <input id="codigo" name="codigo" value={codigoEscrito} onChange={(e) => { setCodigoEscrito(e.target.value); setErrores({}) }} inputMode="numeric" maxLength={6} className={errores.codigo ? estiloCampoError : estiloCampo} aria-invalid={Boolean(errores.codigo)} />
              {errores.codigo && <span role="alert" className="mt-1 block text-sm text-rose-700">{errores.codigo}</span>}
            </label>
            {errorGeneral}
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={trabajando} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60">{trabajando ? 'Registrando...' : 'Confirmar y registrarme'}</button>
              <button type="button" onClick={() => { setCodigo(''); setCodigoEscrito(''); setErrores({}) }} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-brand hover:bg-brand/10">Volver</button>
            </div>
          </form>
        )}
      </section>

      <button type="button" onClick={onCancelar} className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-muted hover:bg-slate-200">Cancelar</button>
    </div>
  )
}

export default Acceso
