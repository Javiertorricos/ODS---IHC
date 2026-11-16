export type Miga = { texto: string; onClick?: () => void }

// Muestra el camino recorrido y permite volver a cualquier paso
function Breadcrumb({ migas }: { migas: Miga[] }) {
  return (
    <nav aria-label="Ruta" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {migas.map((miga, i) => {
          const ultima = i === migas.length - 1
          return (
            <li key={`${miga.texto}-${i}`} className="flex items-center gap-2">
              {ultima || !miga.onClick ? (
                <span aria-current={ultima ? 'page' : undefined} className="font-semibold text-ink">{miga.texto}</span>
              ) : (
                <button type="button" onClick={miga.onClick} className="rounded text-brand underline-offset-2 hover:underline">
                  {miga.texto}
                </button>
              )}
              {!ultima && <span className="text-muted" aria-hidden="true">›</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
