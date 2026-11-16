import type { Carrera } from '../data/carreras'
import { materiasDe } from '../data/pensum'
import type { Material } from '../data/tipos'
import Titulo from '../components/Titulo'
import TarjetaOpcion from '../components/TarjetaOpcion'
import { materialDeMateria } from '../utils/consultas'
import { plural } from '../utils/texto'

interface Props {
  carrera: Carrera
  semestre: number
  materiales: Material[]
  onElegir: (materia: string) => void
}

function ListaMaterias({ carrera, semestre, materiales, onElegir }: Props) {
  return (
    <>
      <Titulo titulo={`Materias del semestre ${semestre}`} texto="Elige una materia para ver sus docentes." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materiasDe(carrera.id, semestre).map((materia) => (
          <TarjetaOpcion
            key={materia}
            titulo={materia}
            etiqueta={plural(materialDeMateria(materiales, carrera.id, semestre, materia).length, 'material', 'materiales')}
            franja={carrera.fondo}
            onClick={() => onElegir(materia)}
          />
        ))}
      </div>
    </>
  )
}

export default ListaMaterias
