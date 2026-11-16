import { carreraPorId } from '../data/carreras'
import type { DatosMaterial, Material } from '../data/tipos'
import FormularioMaterial from '../components/FormularioMaterial'
import Titulo from '../components/Titulo'

interface Props {
  material: Material
  onCancelar: () => void
  onGuardar: (datos: DatosMaterial, archivo: File | null) => Promise<void>
}

// Mismo formulario que "Subir material", pero con los datos del material ya cargados (modo edicion)
function EditarMaterial({ material, onCancelar, onGuardar }: Props) {
  return (
    <>
      <Titulo
        titulo="Editar material"
        texto={`${carreraPorId(material.carreraId).nombre} · Semestre ${material.semestre} · ${material.materia} · ${material.docente}`}
      />
      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
        <FormularioMaterial
          destino={{ carreraId: material.carreraId, semestre: material.semestre, materia: material.materia, docente: material.docente }}
          inicial={material}
          onGuardar={onGuardar}
          onCancelar={onCancelar}
        />
      </section>
    </>
  )
}

export default EditarMaterial
