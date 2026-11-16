import { useEffect, useRef, useState } from 'react'
import Aviso from './components/Aviso'
import Breadcrumb, { type Miga } from './components/Breadcrumb'
import MensajeError from './components/MensajeError'
import Footer from './components/Footer'
import Header from './components/Header'
import { carreraPorId } from './data/carreras'
import type { CarreraId, Material, Ruta } from './data/tipos'
import { useMateriales } from './hooks/useMateriales'
import { useSesion } from './hooks/useSesion'
import Acceso from './pantallas/Acceso'
import Buscar from './pantallas/Buscar'
import MisMateriales from './pantallas/MisMateriales'
import ListaDocentes from './pantallas/ListaDocentes'
import ListaMaterial from './pantallas/ListaMaterial'
import EditarMaterial from './pantallas/EditarMaterial'
import ListaMaterias from './pantallas/ListaMaterias'
import Lobby from './pantallas/Lobby'
import SelectorCarrera from './pantallas/SelectorCarrera'
import SelectorSemestre from './pantallas/SelectorSemestre'
import SubirMaterial from './pantallas/SubirMaterial'
import { materialDeDocente } from './utils/consultas'

const LOBBY: Ruta = { pantalla: 'lobby' }

function App() {
  const { materiales, cargando, guardando, error, reintentar, agregar, editar, eliminar } = useMateriales()
  const { usuario, restaurando, buscar, registrar, ingresar, salir } = useSesion()
  const [ruta, setRuta] = useState<Ruta>(LOBBY)
  const [aviso, setAviso] = useState<{ texto: string; n: number } | null>(null) // mensaje de exito
  const primeraPantalla = useRef(true)

  const avisar = (texto: string) => setAviso((previo) => ({ texto, n: (previo?.n ?? 0) + 1 }))

  // El aviso de exito desaparece solo a los 5 segundos
  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(null), 5000)
    return () => clearTimeout(t)
  }, [aviso])

  // Al cambiar de pantalla: el foco va al titulo (h1) para que el lector de pantalla y el teclado empiecen ahi
  useEffect(() => {
    if (primeraPantalla.current) { primeraPantalla.current = false; return }
    document.querySelector<HTMLElement>('#contenido h1')?.focus({ preventScroll: true })
  }, [ruta])

  // Cada pantalla se guarda en el historial: el boton "atras" del navegador funciona
  function ir(nueva: Ruta) {
    try { window.history.pushState(nueva, '') } catch { /* el historial puede no estar disponible */ }
    setRuta(nueva)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const alVolver = (e: PopStateEvent) => setRuta((e.state as Ruta | null) ?? LOBBY)
    window.addEventListener('popstate', alVolver)
    return () => window.removeEventListener('popstate', alVolver)
  }, [])

  // Titulo de la pestaña del navegador segun la pantalla
  const nombres: Partial<Record<Ruta['pantalla'], string>> = {
    carreras: 'Carreras', buscar: 'Buscar material', mios: 'Mis materiales', subir: 'Subir material',
    editar: 'Editar material', acceso: 'Ingresar',
  }
  const tituloPestana = ruta.docente ?? ruta.materia ?? nombres[ruta.pantalla]
  useEffect(() => {
    document.title = tituloPestana ? `${tituloPestana} · Biblioteca para Estudiantes` : 'Biblioteca para Estudiantes'
  }, [tituloPestana])

  if (ruta.pantalla === 'lobby') {
    return (
      <Lobby
        resumen={cargando || error ? undefined : { materiales: materiales.length, docentes: new Set(materiales.map((m) => `${m.materia}|${m.docente}`)).size }}
        onEntrar={() => ir({ pantalla: 'carreras' })}
        onBuscar={() => ir({ pantalla: 'buscar' })}
      />
    )
  }

  const { carreraId, semestre, materia, docente } = ruta
  const carrera = carreraId ? carreraPorId(carreraId) : undefined

  // Abrir "Subir material" desde cualquier pantalla, recordando donde estaba
  // Solo los usuarios registrados pueden subir: si no hay sesion, se pide ingresar primero
  const abrirSubida = () =>
    ir(usuario
      ? { pantalla: 'subir', carreraId, semestre, materia, docente, desde: ruta }
      : { pantalla: 'acceso', carreraId, semestre, materia, docente, desde: ruta, despuesDe: 'subir' })
  const abrirAcceso = () => ir({ pantalla: 'acceso', carreraId, semestre, materia, docente, desde: ruta })
  const cerrarSesion = () => {
    salir()
    if (['subir', 'mios', 'editar'].includes(ruta.pantalla)) ir({ pantalla: 'carreras' })
    avisar('Sesión cerrada')
  }
  // Tras ingresar o registrarse: seguir a "Subir material" si era lo que se queria, o volver
  const accesoListo = () =>
    ir(ruta.despuesDe === 'subir'
      ? { pantalla: 'subir', carreraId, semestre, materia, docente, desde: ruta.desde }
      : ruta.desde ?? { pantalla: 'carreras' })
  const cerrarSubida = () => ir(ruta.desde ?? { pantalla: 'carreras' })
  const abrirMisMateriales = () =>
    ir(usuario ? { pantalla: 'mios' } : { pantalla: 'acceso', desde: { pantalla: 'mios' } })

  const migas: Miga[] = [
    { texto: 'Inicio', onClick: () => ir(LOBBY) },
    { texto: 'Carreras', onClick: () => ir({ pantalla: 'carreras' }) },
  ]
  if (carrera && ruta.pantalla !== 'subir' && ruta.pantalla !== 'editar') {
    migas.push({ texto: carrera.nombre, onClick: () => ir({ pantalla: 'semestres', carreraId }) })
    if (semestre) migas.push({ texto: `Semestre ${semestre}`, onClick: () => ir({ pantalla: 'materias', carreraId, semestre }) })
    if (materia) migas.push({ texto: materia, onClick: () => ir({ pantalla: 'docentes', carreraId, semestre, materia }) })
    if (docente) migas.push({ texto: docente })
  }
  if (ruta.pantalla === 'buscar') migas.splice(1, 1, { texto: 'Buscar' })
  if (ruta.pantalla === 'mios') migas.splice(1, 1, { texto: 'Mis materiales' })
  if (ruta.pantalla === 'subir') migas.push({ texto: 'Subir material' })
  if (ruta.pantalla === 'acceso') migas.push({ texto: 'Acceso' })
  if (ruta.pantalla === 'editar') migas.push({ texto: 'Editar material' })

  async function guardar(datos: Parameters<typeof agregar>[0], archivo: File) {
    if (!usuario) throw new Error('Debes ingresar para subir material.')
    const nuevo = await agregar(datos, archivo, usuario)
    ir({ pantalla: 'material', carreraId: nuevo.carreraId, semestre: nuevo.semestre, materia: nuevo.materia, docente: nuevo.docente })
    avisar(`Material subido: "${nuevo.titulo}"`)
  }

  // UPDATE: abre el formulario con el material elegido y, al guardar o cancelar, vuelve a donde estaba
  const abrirEdicion = (m: Material) =>
    ir({ pantalla: 'editar', materialId: m.id, carreraId: m.carreraId, semestre: m.semestre, materia: m.materia, docente: m.docente, desde: ruta })
  const salirDeEdicion = (m: Material) =>
    ir(ruta.desde ?? { pantalla: 'material', carreraId: m.carreraId, semestre: m.semestre, materia: m.materia, docente: m.docente })
  async function guardarEdicion(original: Material, datos: Parameters<typeof agregar>[0], archivo: File | null) {
    if (!usuario) throw new Error('Debes ingresar para editar.')
    const nuevo = await editar(original, datos, usuario, archivo ?? undefined)
    salirDeEdicion(nuevo)
    avisar('Cambios guardados')
  }
  // DELETE: la tarjeta pide confirmacion y aqui se llama al hook (que llama al servicio)
  async function eliminarMaterial(m: Material) {
    if (!usuario) throw new Error('Debes ingresar para eliminar.')
    await eliminar(m, usuario)
    avisar(`Material eliminado: "${m.titulo}"`)
  }

  function contenido() {
    if (cargando || restaurando) return <p role="status" className="text-muted">Cargando biblioteca...</p>
    // Sin datos y con error: no hay nada que mostrar, solo se ofrece reintentar
    if (error && materiales.length === 0) return <MensajeError mensaje={error} onReintentar={reintentar} />

    switch (ruta.pantalla) {
      case 'carreras':
        return <SelectorCarrera materiales={materiales} onElegir={(id: CarreraId) => ir({ pantalla: 'semestres', carreraId: id })} />
      case 'semestres':
        return carrera && (
          <SelectorSemestre carrera={carrera} materiales={materiales} onElegir={(s) => ir({ pantalla: 'materias', carreraId, semestre: s })} />
        )
      case 'materias':
        return carrera && semestre && (
          <ListaMaterias carrera={carrera} semestre={semestre} materiales={materiales} onElegir={(m) => ir({ pantalla: 'docentes', carreraId, semestre, materia: m })} />
        )
      case 'docentes':
        return carrera && semestre && materia && (
          <ListaDocentes
            carrera={carrera} semestre={semestre} materia={materia} materiales={materiales}
            onElegir={(d) => ir({ pantalla: 'material', carreraId, semestre, materia, docente: d })}
            onSubir={abrirSubida}
          />
        )
      case 'material':
        return carreraId && semestre && materia && docente && (
          <ListaMaterial
            docente={docente} materia={materia}
            material={materialDeDocente(materiales, carreraId, semestre, materia, docente)}
            correoUsuario={usuario?.correo} ocupado={guardando}
            onSubir={abrirSubida} onEditar={abrirEdicion} onEliminar={eliminarMaterial}
          />
        )
      case 'acceso':
        return (
          <Acceso
            motivo={ruta.despuesDe === 'subir' ? 'Para subir material necesitas una cuenta con tu correo universitario.' : undefined}
            buscar={buscar} registrar={registrar} ingresar={ingresar}
            onListo={accesoListo} onCancelar={() => ir(ruta.desde ?? { pantalla: 'carreras' })}
          />
        )
      case 'subir':
        if (!usuario) {
          return (
            <Acceso
              motivo="Para subir material necesitas una cuenta con tu correo universitario."
              buscar={buscar} registrar={registrar} ingresar={ingresar}
              onListo={() => undefined} onCancelar={() => ir({ pantalla: 'carreras' })}
            />
          )
        }
        return <SubirMaterial materiales={materiales} inicial={{ carreraId, semestre, materia, docente }} onCancelar={cerrarSubida} onGuardar={guardar} />
      case 'editar': {
        const original = materiales.find((m) => m.id === ruta.materialId)
        if (!usuario || !original || original.autorCorreo !== usuario.correo) {
          return <MensajeError mensaje="No puedes editar este material: solo lo puede editar quien lo subió." />
        }
        return <EditarMaterial material={original} onCancelar={() => salirDeEdicion(original)} onGuardar={(datos, archivo) => guardarEdicion(original, datos, archivo)} />
      }
      case 'buscar':
        return <Buscar materiales={materiales} correoUsuario={usuario?.correo} ocupado={guardando} onSubir={abrirSubida} onEditar={abrirEdicion} onEliminar={eliminarMaterial} />
      case 'mios':
        if (!usuario) {
          return (
            <Acceso
              motivo="Ingresa para ver los materiales que subiste."
              buscar={buscar} registrar={registrar} ingresar={ingresar}
              onListo={() => undefined} onCancelar={() => ir({ pantalla: 'carreras' })}
            />
          )
        }
        return <MisMateriales usuario={usuario} materiales={materiales} ocupado={guardando} onSubir={abrirSubida} onEditar={abrirEdicion} onEliminar={eliminarMaterial} />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <a href="#contenido" className="sr-only z-30 rounded-lg bg-ink px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Saltar al contenido
      </a>
      <Header
        usuario={usuario} pantalla={ruta.pantalla}
        onInicio={() => ir(LOBBY)} onExplorar={() => ir({ pantalla: 'carreras' })} onBuscar={() => ir({ pantalla: 'buscar' })} onMisMateriales={abrirMisMateriales}
        onSubir={ruta.pantalla === 'subir' || ruta.pantalla === 'acceso' ? undefined : abrirSubida} onIngresar={abrirAcceso} onSalir={cerrarSesion}
      />
      <main id="contenido" tabIndex={-1} className="flex-1 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Breadcrumb migas={migas} />
          {guardando && <p role="status" aria-live="polite" className="mb-4 rounded-xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand-dark">Guardando cambios...</p>}
          {contenido()}
        </div>
      </main>
      <Footer />
      <Aviso mensaje={aviso?.texto ?? null} onCerrar={() => setAviso(null)} />
    </div>
  )
}

export default App
