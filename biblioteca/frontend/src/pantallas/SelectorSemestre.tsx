import type { Carrera } from '../data/carreras'
import { semestresDe } from '../data/pensum'
import type { Material } from '../data/tipos'
import Titulo from '../components/Titulo'
import TarjetaOpcion from '../components/TarjetaOpcion'
import { contarSemestre } from '../utils/consultas'
import { plural } from '../utils/texto'

interface Props {
  carrera: Carrera
  materiales: Material[]
  onElegir: (semestre: number) => void
}

function SelectorSemestre({ carrera, materiales, onElegir }: Props) {
  return (
    <>
      <Titulo titulo="Elige el semestre" texto={`${carrera.nombre} tiene ${semestresDe(carrera.id).length} semestres.`} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {semestresDe(carrera.id).map((s) => (
          <TarjetaOpcion
            key={s}
            titulo={`Semestre ${s}`}
            etiqueta={plural(contarSemestre(materiales, carrera.id, s), 'material', 'materiales')}
            franja={carrera.fondo}
            onClick={() => onElegir(s)}
          />
        ))}
      </div>
    </>
  )
}

export default SelectorSemestre
