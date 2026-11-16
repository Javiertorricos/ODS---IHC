interface Props {
  mensaje: string
  onReintentar?: () => void
}

// Error de una operacion remota: dice que paso (con texto, no solo color) y permite reintentar
function MensajeError({ mensaje, onReintentar }: Props) {
  return (
    <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
      <span>{mensaje}</span>
      {onReintentar && (
        <button type="button" onClick={onReintentar} className="rounded-lg bg-rose-700 px-4 py-1.5 font-semibold text-white transition hover:bg-rose-800">
          Reintentar
        </button>
      )}
    </div>
  )
}

export default MensajeError
