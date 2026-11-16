import { useState, type ChangeEvent, type FormEvent } from 'react'
import { CARRERAS } from '../data/carreras'
import type { Material, TipoMaterial } from '../data/tipos'
import { estiloCampo } from '../components/campos'
import EstadoVacio from '../components/EstadoVacio'
import FiltroTipos from '../components/FiltroTipos'
import ListaResultados from '../components/ListaResultados'
import Titulo from '../components/Titulo'
import { buscarMateriales, contarPorTipo, FILTROS_VACIOS, hayFiltros, type FiltrosBusqueda } from '../utils/consultas'
import { plural } from '../utils/texto'

interface Props {
  materiales: Material[]
  correoUsuario?: string
  ocupado: boolean
  onSubir: () => void
  onEditar: (material: Material) => void
  onEliminar: (material: Material) => Promise<void>
}

// Busqueda en toda la biblioteca. Formulario controlado: cada filtro vive en el estado "filtros"
// y la lista se recalcula con filter() en cada cambio (no hace falta pulsar un boton).
function Buscar({ materiales, correoUsuario, ocupado, onSubir, onEditar, onEliminar }: Props) {
  const [filtros, setFiltros] = useState<FiltrosBusqueda>(FILTROS_VACIOS)
  const resultados = buscarMateriales(materiales, filtros)
  // Los conteos por tipo respetan texto y carrera, pero no el propio tipo
  const conteo = contarPorTipo(buscarMateriales(materiales, { ...filtros, tipo: '' }))

  // Mismo patron que el formulario: name indica que filtro cambia
  function manejarCambio(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFiltros({ ...filtros, [name]: value })
  }

  return (
    <>
      <Titulo titulo="Buscar material" texto="Escribe un tema, una materia, un docente o quién lo subió." />

      <form onSubmit={(e: FormEvent) => e.preventDefault()} role="search" className="mb-6 grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_16rem_12rem]">
          <label className="block" htmlFor="busqueda">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Buscar</span>
            <input
              id="busqueda"
              name="texto"
              type="search"
              value={filtros.texto}
              onChange={manejarCambio}
              placeholder="Ej. derivadas, parcial, Mendoza"
              className={estiloCampo}
              autoComplete="off"
            />
          </label>
          <label className="block" htmlFor="filtro-carrera">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Carrera</span>
            <select id="filtro-carrera" name="carreraId" value={filtros.carreraId} onChange={manejarCambio} className={estiloCampo}>
              <option value="">Todas las carreras</option>
              {CARRERAS.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </label>
          <label className="block" htmlFor="filtro-orden">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Ordenar por</span>
            <select id="filtro-orden" name="orden" value={filtros.orden} onChange={manejarCambio} className={estiloCampo}>
              <option value="recientes">Más recientes</option>
              <option value="titulo">Título (A–Z)</option>
            </select>
          </label>
        </div>
        {Object.keys(conteo).length > 0 && (
          <FiltroTipos conteo={conteo} valor={filtros.tipo} onCambio={(t: TipoMaterial | '') => setFiltros({ ...filtros, tipo: t })} />
        )}
      </form>

      {materiales.length === 0 ? (
        <EstadoVacio titulo="La biblioteca todavía está vacía" texto="Cuando alguien suba material podrás buscarlo aquí." accion={{ texto: 'Subir material', onClick: onSubir }} />
      ) : resultados.length === 0 ? (
        <EstadoVacio
          titulo="No se encontró material"
          texto="Ningún material coincide con la búsqueda. Revisa lo que escribiste o quita algunos filtros."
          accion={{ texto: 'Limpiar filtros', onClick: () => setFiltros(FILTROS_VACIOS) }}
        />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-700" aria-live="polite">
              {plural(resultados.length, 'resultado', 'resultados')}{hayFiltros(filtros) ? ` de ${materiales.length}` : ''}
            </p>
            {hayFiltros(filtros) && (
              <button type="button" onClick={() => setFiltros(FILTROS_VACIOS)} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand/10">
                Limpiar filtros
              </button>
            )}
          </div>
          <ListaResultados materiales={resultados} correoUsuario={correoUsuario} ocupado={ocupado} mostrarUbicacion onEditar={onEditar} onEliminar={onEliminar} />
        </>
      )}
    </>
  )
}

export default Buscar
