import { useState, type ChangeEvent, type FormEvent } from 'react'
import { TIPOS_MATERIAL, type DatosMaterial, type Material, type TipoMaterial } from '../data/tipos'
import { mensajeDe } from '../services/api'
import { ACCEPT, formatearTamano, validarArchivo } from '../utils/archivos'
import { estiloCampo, estiloCampoError } from './campos'

interface Props {
  // Datos ya conocidos por las preguntas anteriores
  destino: Pick<DatosMaterial, 'carreraId' | 'semestre' | 'materia' | 'docente'>
  // Si se pasa "inicial", el formulario funciona en modo edicion (con los datos del material cargados)
  inicial?: Material
  onGuardar: (datos: DatosMaterial, archivo: File | null) => Promise<void>
  onCancelar?: () => void
}

type Errores = { titulo?: string; descripcion?: string; archivo?: string; general?: string }

// Todos los campos de texto del formulario viven en UN objeto de estado
type Formulario = { titulo: string; tipo: TipoMaterial; descripcion: string }
const FORM_INICIAL: Formulario = { titulo: '', tipo: 'Resumen', descripcion: '' }

function FormularioMaterial({ destino, inicial, onGuardar, onCancelar }: Props) {
  const editando = Boolean(inicial)
  // Modo creacion: campos vacios. Modo edicion: se cargan los datos del material (conserva su id al guardar)
  const [form, setForm] = useState<Formulario>(
    inicial ? { titulo: inicial.titulo, tipo: inicial.tipo, descripcion: inicial.descripcion } : FORM_INICIAL,
  )
  const [archivo, setArchivo] = useState<File | null>(null)
  const [campoArchivo, setCampoArchivo] = useState(0) // cambia la key del input file para vaciarlo
  const [errores, setErrores] = useState<Errores>({})
  const [guardando, setGuardando] = useState(false)
  const { titulo, tipo, descripcion } = form
  const letras = descripcion.replace(/\s/g, '').length // la descripcion pide mas de 10 sin contar espacios

  // Manejador generico: "name" dice que propiedad del objeto form se actualiza
  function manejarCambio(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function enviar(e: FormEvent) {
    e.preventDefault()
    const nuevos: Errores = {}

    if (titulo.trim().length < 3) nuevos.titulo = 'El título debe tener al menos 3 caracteres.'
    // Mas de 10 caracteres sin contar espacios
    if (descripcion.replace(/\s/g, '').length <= 10) {
      nuevos.descripcion = 'La descripción debe tener más de 10 caracteres (sin contar espacios).'
    }
    // Al crear el archivo es obligatorio; al editar solo se valida si se eligio uno nuevo
    const errorArchivo = editando && !archivo ? '' : validarArchivo(archivo)
    if (errorArchivo) nuevos.archivo = errorArchivo

    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    setGuardando(true)
    try {
      await onGuardar({ ...destino, titulo: titulo.trim(), tipo, descripcion: descripcion.trim() }, archivo)
      // Creacion exitosa: el formulario vuelve a su estado inicial (listo para otro material)
      if (!editando) {
        setForm(FORM_INICIAL)
        setArchivo(null)
        setCampoArchivo((n) => n + 1)
      }
    } catch (error) {
      setErrores({ general: mensajeDe(error, 'No se pudo guardar. Inténtalo de nuevo.') })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className="block sm:col-span-2" htmlFor="titulo">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Título del material</span>
        <input
          id="titulo"
          name="titulo"
          value={titulo}
          onChange={manejarCambio}
          placeholder="Ej. Resumen del primer parcial"
          maxLength={120}
          className={errores.titulo ? estiloCampoError : estiloCampo}
          aria-invalid={Boolean(errores.titulo)}
        />
        {errores.titulo && <span role="alert" className="mt-1 block text-sm text-rose-700">{errores.titulo}</span>}
      </label>

      <label className="block" htmlFor="tipo">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Tipo de material</span>
        <select id="tipo" name="tipo" value={tipo} onChange={manejarCambio} className={estiloCampo}>
          {TIPOS_MATERIAL.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className="block" htmlFor="archivo">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">{editando ? 'Reemplazar archivo (opcional, máx. 50 MB)' : 'Archivo (máx. 50 MB)'}</span>
        <input
          key={campoArchivo}
          id="archivo"
          name="archivo"
          type="file"
          accept={ACCEPT}
          onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
          className={`${errores.archivo ? estiloCampoError : estiloCampo} file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand`}
          aria-invalid={Boolean(errores.archivo)}
        />
        <span className="mt-1 block text-xs text-muted">PDF, Word, Excel, PowerPoint o RAR.</span>
        {editando && !archivo && inicial && (
          <span className="mt-1 block text-xs text-slate-600">Archivo actual: {inicial.archivoNombre} · {formatearTamano(inicial.archivoTamano)}</span>
        )}
        {archivo && !errores.archivo && (
          <span className="mt-1 block text-xs text-slate-600">{archivo.name} · {formatearTamano(archivo.size)}</span>
        )}
        {errores.archivo && <span role="alert" className="mt-1 block text-sm text-rose-700">{errores.archivo}</span>}
      </label>

      <label className="block sm:col-span-2" htmlFor="descripcion">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Descripción</span>
        <textarea
          id="descripcion"
          name="descripcion"
          value={descripcion}
          onChange={manejarCambio}
          rows={3}
          placeholder="Cuenta de qué trata el material y para qué sirve..."
          aria-describedby="descripcion-ayuda"
          className={errores.descripcion ? estiloCampoError : estiloCampo}
          aria-invalid={Boolean(errores.descripcion)}
        />
        <span id="descripcion-ayuda" className={`mt-1 block text-xs ${letras > 10 ? 'text-teal-800' : 'text-muted'}`}>
          {letras} {letras === 1 ? 'carácter' : 'caracteres'} sin contar espacios · mínimo 11{letras > 10 ? ' ✓' : ''}
        </span>
        {errores.descripcion && <span role="alert" className="mt-1 block text-sm text-rose-700">{errores.descripcion}</span>}
      </label>

      {errores.general && (
        <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700 sm:col-span-2">{errores.general}</p>
      )}

      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={guardando}
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
        >
          {guardando ? 'Guardando cambios...' : editando ? 'Guardar cambios' : 'Subir material'}
        </button>
        {editando && onCancelar && (
          <button type="button" onClick={onCancelar} disabled={guardando} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted hover:bg-slate-200">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default FormularioMaterial
