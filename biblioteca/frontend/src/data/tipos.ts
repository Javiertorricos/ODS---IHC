export type CarreraId = 'mecatronica' | 'software' | 'ia'

export const TIPOS_MATERIAL = ['Resumen', 'Examen', 'Práctica', 'Libro', 'Presentación', 'Otro'] as const
export type TipoMaterial = (typeof TIPOS_MATERIAL)[number]

export type Material = {
  id: string
  carreraId: CarreraId
  semestre: number
  materia: string
  docente: string
  titulo: string
  tipo: TipoMaterial
  descripcion: string
  archivoNombre: string
  archivoTamano: number // bytes
  archivoExt: string
  fecha: string // ISO
  autorNombre?: string // quien lo subio (no existe en materiales antiguos)
  autorCorreo?: string
}

// Lo que escribe el estudiante; el resto lo completa el hook al guardar
export type DatosMaterial = Omit<Material, 'id' | 'fecha' | 'archivoNombre' | 'archivoTamano' | 'archivoExt'>

export type Usuario = {
  id?: number // lo asigna la API
  nombre: string
  correo: string // siempre @ucb.edu.bo (simulado)
  fecha: string // ISO de registro
}

export type Pantalla = 'acceso' | 'editar' | 'buscar' | 'mios' | 'lobby' | 'carreras' | 'semestres' | 'materias' | 'docentes' | 'material' | 'subir'

export type Contexto = {
  carreraId?: CarreraId
  semestre?: number
  materia?: string
  docente?: string
}

export type Ruta = Contexto & {
  pantalla: Pantalla
  desde?: Ruta // desde donde se abrio "Subir material" o "Ingresar"
  despuesDe?: 'subir' // si el acceso se pidio para subir material
  materialId?: string // material que se esta editando
}
