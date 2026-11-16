// Libros decorativos del estante: [alto en rem, ancho en rem, color]
const LOMOS: [number, number, string][] = [
  [13, 2.2, 'bg-mecatronica'], [17, 1.6, 'bg-slate-500'], [15, 2.6, 'bg-software'], [19, 1.8, 'bg-amber-400'],
  [14, 2.4, 'bg-ia'], [18, 2, 'bg-teal-500'], [12, 1.7, 'bg-mecatronica'], [16, 2.5, 'bg-slate-400'],
  [20, 1.9, 'bg-ia'], [14.5, 2.3, 'bg-software'], [17.5, 1.7, 'bg-amber-400'], [13.5, 2.4, 'bg-teal-500'],
]

interface Props {
  resumen?: { materiales: number; docentes: number } // se muestra cuando la biblioteca ya cargo
  onEntrar: () => void
  onBuscar: () => void
}

function Lobby({ resumen, onEntrar, onBuscar }: Props) {
  return (
    <main className="min-h-screen bg-ink text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">Biblioteca para Estudiantes</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Bienvenido a la biblioteca
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Encuentra los resúmenes, exámenes y presentaciones que comparten otros estudiantes de tu carrera, o sube los
            tuyos para ayudar a quienes vienen después.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onEntrar}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-bold text-ink transition hover:bg-teal-100"
            >
              Entrar a la biblioteca <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={onBuscar}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Buscar material
            </button>
          </div>
          {resumen && resumen.materiales > 0 && (
            <p className="mt-6 text-sm font-semibold text-teal-300">
              {resumen.materiales} {resumen.materiales === 1 ? 'material compartido' : 'materiales compartidos'} · {resumen.docentes} {resumen.docentes === 1 ? 'docente' : 'docentes'}
            </p>
          )}
          <p className="mt-6 text-sm text-slate-400">Ingeniería Mecatrónica · Ingeniería de Software · Ingeniería en Inteligencia Artificial</p>
        </div>

        <div className="flex h-80 items-end justify-center gap-1.5 border-b-8 border-white/20 px-2 sm:gap-2" aria-hidden="true">
          {LOMOS.map(([alto, ancho, color], i) => (
            <div
              key={i}
              className={`${color} flex shrink-0 justify-center rounded-t-md pt-3`}
              style={{ height: `${Math.min(alto, 20) * 0.9}rem`, width: `${ancho * 0.8}rem`, maxWidth: '9%' }}
            >
              <span className="h-10 w-0.5 rounded bg-white/50" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Lobby
