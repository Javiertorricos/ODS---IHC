import { useState } from 'react'
import type { Material, TipoMaterial } from '../data/tipos'
import EstadoVacio from '../components/EstadoVacio'
import FiltroTipos from '../components/FiltroTipos'
import ListaResultados from '../components/ListaResultados'
import Titulo from '../components/Titulo'
import { contarPorTipo } from '../utils/consultas'
import { plural } from '../utils/texto'

interface Props {
  docente: string
  materia: string
  material: Material[]
  correoUsuario?: string // para saber cuales materiales son del usuario
  ocupado: boolean
  onSubir: () => void
  onEditar: (material: Material) => void
  onEliminar: (material: Material) => Promise<void>
}

function ListaMaterial({ docente, materia, material, correoUsuario, ocupado, onSubir, onEditar, onEliminar }: Props) {
  const [tipo, setTipo] = useState<TipoMaterial | ''>('')
  const visibles = tipo ? material.filter((m) => m.tipo === tipo) : material

  return (
    <>
      <Titulo titulo={docente} texto={`${materia} · ${plural(material.length, 'archivo', 'archivos')}`} />
      {material.length === 0 ? (
        <EstadoVacio
          titulo="Este docente aún no tiene material"
          texto="Sé el primero en compartir un archivo."
          accion={{ texto: 'Subir material', onClick: onSubir }}
        />
      ) : (
        <div className="grid gap-5">
          {material.length > 1 && <FiltroTipos conteo={contarPorTipo(material)} valor={tipo} onCambio={setTipo} />}
          {visibles.length === 0 ? (
            <EstadoVacio
              titulo={`No hay material de tipo "${tipo}"`}
              texto="Prueba con otro tipo o quita el filtro."
              accion={{ texto: 'Quitar filtro', onClick: () => setTipo('') }}
            />
          ) : (
            <ListaResultados materiales={visibles} correoUsuario={correoUsuario} ocupado={ocupado} onEditar={onEditar} onEliminar={onEliminar} />
          )}
        </div>
      )}
    </>
  )
}

export default ListaMaterial
