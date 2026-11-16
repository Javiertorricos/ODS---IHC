import type { Material } from '../data/tipos'
import MaterialCard from './MaterialCard'

interface Props {
  materiales: Material[]
  correoUsuario?: string
  ocupado: boolean
  mostrarUbicacion?: boolean
  onEditar: (material: Material) => void
  onEliminar: (material: Material) => Promise<void>
}

// Cuadricula de MaterialCard: la usan la lista del docente, la busqueda y "Mis materiales"
function ListaResultados({ materiales, correoUsuario, ocupado, mostrarUbicacion = false, onEditar, onEliminar }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {materiales.map((m) => (
        <MaterialCard
          key={m.id}
          material={m}
          esAutor={Boolean(correoUsuario) && m.autorCorreo === correoUsuario}
          ocupado={ocupado}
          mostrarUbicacion={mostrarUbicacion}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />
      ))}
    </div>
  )
}

export default ListaResultados
