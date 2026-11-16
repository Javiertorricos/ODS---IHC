import type { CarreraId } from './tipos'

export type Carrera = {
  id: CarreraId
  nombre: string
  descripcion: string
  fondo: string // clases Tailwind (escritas completas para que Tailwind las detecte)
  texto: string
}

export const CARRERAS: Carrera[] = [
  { id: 'mecatronica', nombre: 'Ingeniería Mecatrónica', descripcion: 'Mecánica, electrónica y control trabajando juntos.', fondo: 'bg-mecatronica', texto: 'text-mecatronica' },
  { id: 'software', nombre: 'Ingeniería de Software', descripcion: 'Diseño, desarrollo y calidad de sistemas.', fondo: 'bg-software', texto: 'text-software' },
  { id: 'ia', nombre: 'Ingeniería en Inteligencia Artificial', descripcion: 'Datos, aprendizaje automático y sistemas inteligentes.', fondo: 'bg-ia', texto: 'text-ia' },
]

export function carreraPorId(id: CarreraId): Carrera {
  return CARRERAS.find((c) => c.id === id) ?? CARRERAS[0]
}
