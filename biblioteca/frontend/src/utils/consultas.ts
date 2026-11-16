import type { CarreraId, Material, TipoMaterial } from '../data/tipos'
import { normalizar } from './texto'

export type DocenteResumen = { nombre: string; cantidad: number }

export const contarCarrera = (m: Material[], carreraId: CarreraId) =>
  m.filter((x) => x.carreraId === carreraId).length

export const contarSemestre = (m: Material[], carreraId: CarreraId, semestre: number) =>
  m.filter((x) => x.carreraId === carreraId && x.semestre === semestre).length

export const materialDeMateria = (m: Material[], carreraId: CarreraId, semestre: number, materia: string) =>
  m.filter((x) => x.carreraId === carreraId && x.semestre === semestre && x.materia === materia)

export const materialDeDocente = (
  m: Material[],
  carreraId: CarreraId,
  semestre: number,
  materia: string,
  docente: string,
) =>
  materialDeMateria(m, carreraId, semestre, materia).filter(
    (x) => normalizar(x.docente) === normalizar(docente),
  )

// Docentes que ya tienen material en esa materia (los docentes nacen al subir material)
export function docentesDeMateria(
  m: Material[],
  carreraId: CarreraId,
  semestre: number,
  materia: string,
): DocenteResumen[] {
  const mapa = new Map<string, DocenteResumen>()
  for (const x of materialDeMateria(m, carreraId, semestre, materia)) {
    const clave = normalizar(x.docente)
    const actual = mapa.get(clave)
    if (actual) actual.cantidad += 1
    else mapa.set(clave, { nombre: x.docente, cantidad: 1 })
  }
  return [...mapa.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}

// Busqueda: el texto se normaliza (minusculas y sin tildes) para que "calculo" encuentre "Cálculo"
export type FiltrosBusqueda = { texto: string; carreraId: CarreraId | ''; tipo: TipoMaterial | ''; orden: 'recientes' | 'titulo' }

export const FILTROS_VACIOS: FiltrosBusqueda = { texto: '', carreraId: '', tipo: '', orden: 'recientes' }

export function hayFiltros(f: FiltrosBusqueda) {
  return f.texto.trim() !== '' || f.carreraId !== '' || f.tipo !== ''
}

export function buscarMateriales(m: Material[], f: FiltrosBusqueda): Material[] {
  const palabras = normalizar(f.texto).split(/\s+/).filter(Boolean)
  const resultado = m.filter((x) => {
    if (f.carreraId && x.carreraId !== f.carreraId) return false
    if (f.tipo && x.tipo !== f.tipo) return false
    const donde = normalizar([x.titulo, x.descripcion, x.materia, x.docente, x.autorNombre ?? ''].join(' '))
    return palabras.every((p) => donde.includes(p)) // todas las palabras deben aparecer
  })
  return f.orden === 'titulo'
    ? [...resultado].sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'))
    : [...resultado].sort((a, b) => b.fecha.localeCompare(a.fecha))
}

export const materialesDeAutor = (m: Material[], correo: string) => m.filter((x) => x.autorCorreo === correo)

// Cuantos materiales hay de cada tipo (para los filtros)
export function contarPorTipo(m: Material[]): Partial<Record<TipoMaterial, number>> {
  const cuenta: Partial<Record<TipoMaterial, number>> = {}
  for (const x of m) cuenta[x.tipo] = (cuenta[x.tipo] ?? 0) + 1
  return cuenta
}
