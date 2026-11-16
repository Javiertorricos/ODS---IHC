import type { Material, Usuario } from '../data/tipos'
import EstadoVacio from '../components/EstadoVacio'
import ListaResultados from '../components/ListaResultados'
import Titulo from '../components/Titulo'
import { materialesDeAutor } from '../utils/consultas'
import { formatearTamano } from '../utils/archivos'
import { plural } from '../utils/texto'

interface Props {
  usuario: Usuario
  materiales: Material[]
  ocupado: boolean
  onSubir: () => void
  onEditar: (material: Material) => void
  onEliminar: (material: Material) => Promise<void>
}

// Todo lo que subio el usuario en un solo lugar, con Editar y Eliminar a mano
function MisMateriales({ usuario, materiales, ocupado, onSubir, onEditar, onEliminar }: Props) {
  const mios = materialesDeAutor(materiales, usuario.correo)
  const peso = mios.reduce((total, m) => total + m.archivoTamano, 0)

  return (
    <>
      <Titulo
        titulo="Mis materiales"
        texto={mios.length > 0 ? `${plural(mios.length, 'archivo subido', 'archivos subidos')} · ${formatearTamano(peso)} en total` : `Sesión iniciada como ${usuario.correo}`}
      />
      {mios.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no subiste material"
          texto="Lo que subas aparecerá aquí para que puedas editarlo o eliminarlo."
          accion={{ texto: 'Subir mi primer material', onClick: onSubir }}
        />
      ) : (
        <ListaResultados materiales={mios} correoUsuario={usuario.correo} ocupado={ocupado} mostrarUbicacion onEditar={onEditar} onEliminar={onEliminar} />
      )}
    </>
  )
}

export default MisMateriales
