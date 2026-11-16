import type { Carrera } from '../data/carreras'
import type { Material } from '../data/tipos'
import EstadoVacio from '../components/EstadoVacio'
import TarjetaOpcion from '../components/TarjetaOpcion'
import Titulo from '../components/Titulo'
import { docentesDeMateria } from '../utils/consultas'
import { plural } from '../utils/texto'

interface Props {
  carrera: Carrera
  semestre: number
  materia: string
  materiales: Material[]
  onElegir: (docente: string) => void
  onSubir: () => void
}

function ListaDocentes({ carrera, semestre, materia, materiales, onElegir, onSubir }: Props) {
  const docentes = docentesDeMateria(materiales, carrera.id, semestre, materia)

  return (
    <>
      <Titulo titulo={materia} texto="Elige el docente para ver el material que subieron los estudiantes." />
      {docentes.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no hay material en esta materia"
          texto="Aún no se registró ningún docente. Sube el primer archivo y el docente aparecerá aquí."
          accion={{ texto: 'Subir material', onClick: onSubir }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docentes.map((d) => (
            <TarjetaOpcion
              key={d.nombre}
              titulo={d.nombre}
              etiqueta={plural(d.cantidad, 'material', 'materiales')}
              franja={carrera.fondo}
              onClick={() => onElegir(d.nombre)}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default ListaDocentes
