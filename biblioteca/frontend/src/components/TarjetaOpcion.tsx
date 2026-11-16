interface TarjetaOpcionProps {
  titulo: string
  subtitulo?: string
  etiqueta?: string
  franja?: string // clase Tailwind de color para la franja izquierda
  onClick: () => void
}

// Tarjeta clicable que se reutiliza en carreras, semestres, materias y docentes
function TarjetaOpcion({ titulo, subtitulo, etiqueta, franja = 'bg-brand', onClick }: TarjetaOpcionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full min-w-0 overflow-hidden rounded-2xl border border-line bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
    >
      <span className={`w-2 shrink-0 ${franja}`} aria-hidden="true" />
      <span className="flex min-w-0 flex-1 flex-col gap-1 p-5">
        <span className="break-words font-display text-lg font-bold leading-snug text-ink">{titulo}</span>
        {subtitulo && <span className="text-sm text-muted">{subtitulo}</span>}
        {etiqueta && <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand">{etiqueta}</span>}
      </span>
      <span className="flex items-center pr-4 text-xl text-muted transition group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden="true">›</span>
    </button>
  )
}

export default TarjetaOpcion
