import { DOMINIO } from '../utils/correo'

interface Props {
  id: string
  valor: string
  onCambio: (valor: string) => void
  error?: string
}

// Campo de correo con el dominio de la universidad fijo al final
function CampoCorreo({ id, valor, onCambio, error }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">Correo universitario</label>
      <div className={`flex overflow-hidden rounded-xl border bg-white transition focus-within:ring-4 ${error ? 'border-rose-400 focus-within:ring-rose-200' : 'border-slate-500 focus-within:border-brand focus-within:ring-brand/15'}`}>
        <input
          id={id}
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
          placeholder="juan.perez"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-slate-500"
        />
        <span className="flex items-center border-l border-slate-200 bg-slate-50 px-3 text-sm text-muted">@{DOMINIO}</span>
      </div>
      {error && <p role="alert" className="mt-1 text-sm text-rose-700">{error}</p>}
    </div>
  )
}

export default CampoCorreo
