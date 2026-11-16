import { useState } from 'react'
import { carreraPorId } from '../data/carreras'
import type { Material } from '../data/tipos'
import { mensajeDe } from '../services/api'
import { descargarMaterial } from '../services/descarga'
import { ETIQUETAS_EXT, formatearTamano } from '../utils/archivos'
import { formatearFecha } from '../utils/texto'

interface Props {
  material: Material
  esAutor?: boolean // quien subio el material puede editarlo y eliminarlo
  ocupado?: boolean // hay una operacion de guardado en curso
  mostrarUbicacion?: boolean // en busqueda y "Mis materiales": dice de que carrera, materia y docente es
  onEditar?: (material: Material) => void
  onEliminar?: (material: Material) => Promise<void>
}

function MaterialCard({ material, esAutor = false, ocupado = false, mostrarUbicacion = false, onEditar, onEliminar }: Props) {
  const [error, setError] = useState('')
  const [confirmando, setConfirmando] = useState(false) // pide confirmacion antes de eliminar
  const etiqueta = ETIQUETAS_EXT[material.archivoExt] ?? { nombre: material.archivoExt.toUpperCase(), clase: 'bg-slate-200 text-slate-700' }

  async function descargar() {
    setError('')
    try {
      await descargarMaterial(material)
    } catch (e) {
      setError(mensajeDe(e, 'No se pudo descargar el archivo.'))
    }
  }

  async function eliminar() {
    setError('')
    try {
      await onEliminar?.(material)
    } catch (e) {
      setConfirmando(false)
      setError(mensajeDe(e, 'No se pudo eliminar el material.'))
    }
  }

  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="min-w-0 break-words font-display text-lg font-bold leading-snug text-ink">{material.titulo}</h2>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${etiqueta.clase}`}>{etiqueta.nombre}</span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">{material.tipo}</p>
      {mostrarUbicacion && (
        <p className="mt-1 text-sm text-slate-700">
          {carreraPorId(material.carreraId).nombre} · Semestre {material.semestre} · {material.materia} · {material.docente}
        </p>
      )}
      <p className="mt-2 text-sm text-slate-600">{material.descripcion}</p>
      {material.autorNombre && <p className="mt-3 text-xs text-muted">Subido por <span className="font-semibold text-slate-700">{material.autorNombre}</span></p>}
      <p className="mt-2 break-all text-xs text-muted">
        {material.archivoNombre} · {formatearTamano(material.archivoTamano)} · {formatearFecha(material.fecha)}
      </p>

      {!confirmando && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={descargar}
            className="rounded-xl border border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            Descargar
          </button>
          {esAutor && (
            <>
              <button type="button" onClick={() => onEditar?.(material)} disabled={ocupado} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60">
                Editar
              </button>
              <button type="button" onClick={() => setConfirmando(true)} disabled={ocupado} className="rounded-xl px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60">
                Eliminar
              </button>
            </>
          )}
        </div>
      )}

      {confirmando && (
        <div role="alertdialog" aria-label={`Confirmar eliminación de ${material.titulo}`} className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-3">
          <p className="text-sm font-semibold text-rose-900">¿Eliminar este material? Esta acción no se puede deshacer.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={eliminar} disabled={ocupado} className="rounded-lg bg-rose-700 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-wait disabled:opacity-60">
              {ocupado ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
            <button type="button" onClick={() => setConfirmando(false)} disabled={ocupado} className="rounded-lg px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-white">
              Cancelar
            </button>
          </div>
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-sm font-medium text-rose-700">{error}</p>}
    </article>
  )
}

export default MaterialCard
