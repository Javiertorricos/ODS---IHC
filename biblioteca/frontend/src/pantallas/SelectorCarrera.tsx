import { CARRERAS } from '../data/carreras'
import type { CarreraId, Material } from '../data/tipos'
import Titulo from '../components/Titulo'
import TarjetaOpcion from '../components/TarjetaOpcion'
import { contarCarrera } from '../utils/consultas'
import { plural } from '../utils/texto'

interface Props {
  materiales: Material[]
  onElegir: (id: CarreraId) => void
}

function SelectorCarrera({ materiales, onElegir }: Props) {
  return (
    <>
      <Titulo titulo="¿Qué carrera estudias?" texto="Elige tu carrera para ver sus semestres y materias." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CARRERAS.map((c) => (
          <TarjetaOpcion
            key={c.id}
            titulo={c.nombre}
            subtitulo={c.descripcion}
            etiqueta={plural(contarCarrera(materiales, c.id), 'material', 'materiales')}
            franja={c.fondo}
            onClick={() => onElegir(c.id)}
          />
        ))}
      </div>
    </>
  )
}

export default SelectorCarrera
