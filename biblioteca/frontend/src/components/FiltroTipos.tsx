import { TIPOS_MATERIAL, type TipoMaterial } from '../data/tipos'

interface Props {
  conteo: Partial<Record<TipoMaterial, number>>
  valor: TipoMaterial | ''
  onCambio: (tipo: TipoMaterial | '') => void
}

// Botones de filtro por tipo de material. Solo muestra los tipos que existen en la lista.
// aria-pressed indica cual esta activo (no solo el color).
function FiltroTipos({ conteo, valor, onCambio }: Props) {
  const total = Object.values(conteo).reduce((a, b) => a + (b ?? 0), 0)
  const tipos = TIPOS_MATERIAL.filter((t) => conteo[t])
  const boton = (activo: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${activo ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-brand hover:text-brand'}`

  return (
    <div role="group" aria-label="Filtrar por tipo de material" className="flex flex-wrap gap-2">
      <button type="button" aria-pressed={valor === ''} onClick={() => onCambio('')} className={boton(valor === '')}>
        Todos <span className="font-normal">({total})</span>
      </button>
      {tipos.map((t) => (
        <button key={t} type="button" aria-pressed={valor === t} onClick={() => onCambio(valor === t ? '' : t)} className={boton(valor === t)}>
          {t} <span className="font-normal">({conteo[t]})</span>
        </button>
      ))}
    </div>
  )
}

export default FiltroTipos
