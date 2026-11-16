export const TAMANO_MAXIMO = 50 * 1024 * 1024 // 50 MB por archivo

export const EXTENSIONES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rar']
export const ACCEPT = EXTENSIONES.map((e) => `.${e}`).join(',')

export function extension(nombre: string) {
  const punto = nombre.lastIndexOf('.')
  return punto === -1 ? '' : nombre.slice(punto + 1).toLowerCase()
}

export function formatearTamano(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Devuelve el mensaje de error, o '' si el archivo es valido
export function validarArchivo(archivo: File | null): string {
  if (!archivo) return 'Selecciona un archivo.'
  if (!EXTENSIONES.includes(extension(archivo.name))) {
    return 'Formato no permitido. Usa PDF, Word, Excel, PowerPoint o RAR.'
  }
  if (archivo.size === 0) return 'El archivo está vacío.'
  if (archivo.size > TAMANO_MAXIMO) {
    return `El archivo pesa ${formatearTamano(archivo.size)} y el máximo es 50 MB.`
  }
  return ''
}

// Etiqueta y color de cada tipo de archivo
export const ETIQUETAS_EXT: Record<string, { nombre: string; clase: string }> = {
  pdf: { nombre: 'PDF', clase: 'bg-red-100 text-red-700' },
  doc: { nombre: 'Word', clase: 'bg-blue-100 text-blue-700' },
  docx: { nombre: 'Word', clase: 'bg-blue-100 text-blue-700' },
  xls: { nombre: 'Excel', clase: 'bg-green-100 text-green-700' },
  xlsx: { nombre: 'Excel', clase: 'bg-green-100 text-green-700' },
  ppt: { nombre: 'PowerPoint', clase: 'bg-orange-100 text-orange-700' },
  pptx: { nombre: 'PowerPoint', clase: 'bg-orange-100 text-orange-700' },
  rar: { nombre: 'RAR', clase: 'bg-slate-200 text-slate-700' },
}
