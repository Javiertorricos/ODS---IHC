interface EstadoVacioProps {
  titulo: string
  texto: string
  accion?: { texto: string; onClick: () => void }
}

function EstadoVacio({ titulo, texto, accion }: EstadoVacioProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
      <p className="font-display text-xl font-bold text-ink">{titulo}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{texto}</p>
      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="mt-6 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          {accion.texto}
        </button>
      )}
    </div>
  )
}

export default EstadoVacio
