interface Props {
  mensaje: string | null
  onCerrar: () => void
}

// Mensaje de exito ("Material subido", "Cambios guardados"...). La region role="status" existe siempre
// para que los lectores de pantalla anuncien el texto cuando aparece.
function Aviso({ mensaje, onCerrar }: Props) {
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      {mensaje && (
        <div className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl bg-ink py-3 pl-4 pr-2 text-sm font-medium text-white shadow-lg">
          <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 10.5l4 4 8-9" />
          </svg>
          <span>{mensaje}</span>
          <button type="button" onClick={onCerrar} className="rounded-lg px-2.5 py-1 text-white/80 hover:bg-white/10 hover:text-white" aria-label="Cerrar aviso">
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default Aviso
