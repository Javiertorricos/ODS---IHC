import { useState } from 'react'
import { CARRERAS, carreraPorId } from '../data/carreras'
import { materiasDe, semestresDe } from '../data/pensum'
import type { CarreraId, Contexto, DatosMaterial, Material } from '../data/tipos'
import FormularioMaterial from '../components/FormularioMaterial'
import PasoPregunta from '../components/PasoPregunta'
import { estiloCampo, estiloCampoError } from '../components/campos'
import Titulo from '../components/Titulo'
import { docentesDeMateria } from '../utils/consultas'
import { normalizar } from '../utils/texto'

interface Props {
  materiales: Material[]
  inicial: Contexto
  onCancelar: () => void
  onGuardar: (datos: DatosMaterial, archivo: File) => Promise<void>
}

const NUEVO = '__nuevo__'
const SOLO_LETRAS = /^[\p{L}.\s'-]+$/u

type Paso = 'carrera' | 'semestre' | 'materia' | 'docente' | 'formulario'

function SubirMaterial({ materiales, inicial, onCancelar, onGuardar }: Props) {
  const [carreraId, setCarreraId] = useState<CarreraId | ''>(inicial.carreraId ?? '')
  const [semestre, setSemestre] = useState(inicial.semestre ?? 0)
  const [materia, setMateria] = useState(inicial.materia ?? '')
  const [docente, setDocente] = useState(inicial.docente ?? '')
  const [escribiendoDocente, setEscribiendoDocente] = useState(false)
  const [nombreNuevo, setNombreNuevo] = useState('')
  const [errorNombre, setErrorNombre] = useState('')

  const paso: Paso = !carreraId ? 'carrera' : !semestre ? 'semestre' : !materia ? 'materia' : !docente ? 'docente' : 'formulario'
  const docentes = carreraId && semestre && materia ? docentesDeMateria(materiales, carreraId, semestre, materia) : []
  // Si la materia aun no tiene docentes, se pregunta el nombre directamente
  const pidiendoNombre = escribiendoDocente || docentes.length === 0

  // Volver a una pregunta: borra esa respuesta y las siguientes
  function cambiar(desde: Paso) {
    if (desde === 'carrera') setCarreraId('')
    if (desde === 'carrera' || desde === 'semestre') setSemestre(0)
    if (desde !== 'docente') setMateria('')
    setDocente('')
    setEscribiendoDocente(false)
    setNombreNuevo('')
    setErrorNombre('')
  }

  function confirmarNombre() {
    const nombre = nombreNuevo.trim().replace(/\s+/g, ' ')
    if (nombre.length < 3) return setErrorNombre('Escribe el nombre del docente (mínimo 3 letras).')
    if (!SOLO_LETRAS.test(nombre)) return setErrorNombre('El nombre solo puede tener letras y espacios.')
    // Si el docente ya existe (aunque cambie mayusculas o tildes) se reutiliza su nombre
    const existente = docentes.find((d) => normalizar(d.nombre) === normalizar(nombre))
    setDocente(existente ? existente.nombre : nombre)
    setErrorNombre('')
  }

  const respuestas: { paso: Paso; etiqueta: string; valor: string }[] = []
  if (carreraId) respuestas.push({ paso: 'carrera', etiqueta: 'Carrera', valor: carreraPorId(carreraId).nombre })
  if (semestre) respuestas.push({ paso: 'semestre', etiqueta: 'Semestre', valor: String(semestre) })
  if (materia) respuestas.push({ paso: 'materia', etiqueta: 'Materia', valor: materia })
  if (docente) respuestas.push({ paso: 'docente', etiqueta: 'Docente', valor: docente })

  return (
    <>
      <Titulo titulo="Subir material" texto="Responde unas preguntas rápidas para saber dónde guardar tu archivo." />

      {respuestas.length > 0 && (
        <ul className="mb-5 flex flex-wrap gap-2">
          {respuestas.map((r) => (
            <li key={r.paso} className="flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-4 pr-2 text-sm">
              <span className="text-muted">{r.etiqueta}:</span>
              <span className="font-semibold text-ink">{r.valor}</span>
              <button type="button" onClick={() => cambiar(r.paso)} className="rounded-full px-2 py-0.5 text-xs font-semibold text-brand hover:bg-brand/10">
                Cambiar
              </button>
            </li>
          ))}
        </ul>
      )}

      {paso === 'carrera' && (
        <PasoPregunta numero={1} pregunta="¿A qué carrera pertenece?">
          <select id="p-carrera" value="" onChange={(e) => setCarreraId(e.target.value as CarreraId)} className={estiloCampo}>
            <option value="" disabled>Elige una carrera</option>
            {CARRERAS.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </PasoPregunta>
      )}

      {paso === 'semestre' && (
        <PasoPregunta numero={2} pregunta="¿De qué semestre?">
          <select id="p-semestre" value="" onChange={(e) => setSemestre(Number(e.target.value))} className={estiloCampo}>
            <option value="" disabled>Elige un semestre</option>
            {carreraId && semestresDe(carreraId).map((s) => <option key={s} value={s}>Semestre {s}</option>)}
          </select>
        </PasoPregunta>
      )}

      {paso === 'materia' && carreraId && (
        <PasoPregunta numero={3} pregunta="¿De qué materia?">
          <select id="p-materia" value="" onChange={(e) => setMateria(e.target.value)} className={estiloCampo}>
            <option value="" disabled>Elige una materia</option>
            {materiasDe(carreraId, semestre).map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </PasoPregunta>
      )}

      {paso === 'docente' && (
        <PasoPregunta numero={4} pregunta="¿Con qué docente?">
          {docentes.length > 0 && !escribiendoDocente && (
            <select
              id="p-docente"
              value=""
              onChange={(e) => (e.target.value === NUEVO ? setEscribiendoDocente(true) : setDocente(e.target.value))}
              className={estiloCampo}
            >
              <option value="" disabled>Elige un docente</option>
              {docentes.map((d) => <option key={d.nombre} value={d.nombre}>{d.nombre}</option>)}
              <option value={NUEVO}>Mi docente no está en la lista</option>
            </select>
          )}

          {pidiendoNombre && (
            <div>
              <label className="block" htmlFor="p-docente-nuevo">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  {docentes.length === 0 ? 'Esta materia aún no tiene docentes. ¿Cómo se llama el tuyo?' : 'Nombre del docente'}
                </span>
                <input
                  id="p-docente-nuevo"
                  value={nombreNuevo}
                  onChange={(e) => { setNombreNuevo(e.target.value); setErrorNombre('') }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), confirmarNombre())}
                  placeholder="Ej. Carlos Mendoza"
                  className={errorNombre ? estiloCampoError : estiloCampo}
                />
              </label>
              {errorNombre && <p role="alert" className="mt-1 text-sm text-rose-700">{errorNombre}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={confirmarNombre} className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark">
                  Continuar
                </button>
                {docentes.length > 0 && (
                  <button type="button" onClick={() => { setEscribiendoDocente(false); setErrorNombre('') }} className="rounded-xl px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/10">
                    Volver a la lista
                  </button>
                )}
              </div>
            </div>
          )}
        </PasoPregunta>
      )}

      {paso === 'formulario' && carreraId && (
        <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 font-display text-xl font-bold text-ink">Datos del material</h2>
          <FormularioMaterial destino={{ carreraId, semestre, materia, docente }} onGuardar={(datos, archivo) => (archivo ? onGuardar(datos, archivo) : Promise.resolve())} />
        </section>
      )}

      <button type="button" onClick={onCancelar} className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-muted hover:bg-slate-200">
        Cancelar
      </button>
    </>
  )
}

export default SubirMaterial
