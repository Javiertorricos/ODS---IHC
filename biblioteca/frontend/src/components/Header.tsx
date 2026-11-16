import type { Pantalla, Usuario } from '../data/tipos'

type Seccion = 'explorar' | 'buscar' | 'mios'

interface HeaderProps {
  usuario?: Usuario
  pantalla: Pantalla
  onInicio: () => void
  onExplorar: () => void
  onBuscar: () => void
  onMisMateriales: () => void
  onSubir?: () => void // si no se pasa, el boton no se muestra
  onIngresar: () => void
  onSalir: () => void
}

// En que seccion de la navegacion esta cada pantalla (para marcarla como actual)
function seccionDe(pantalla: Pantalla): Seccion | undefined {
  if (pantalla === 'buscar') return 'buscar'
  if (pantalla === 'mios') return 'mios'
  if (['carreras', 'semestres', 'materias', 'docentes', 'material'].includes(pantalla)) return 'explorar'
  return undefined
}

function Header({ usuario, pantalla, onInicio, onExplorar, onBuscar, onMisMateriales, onSubir, onIngresar, onSalir }: HeaderProps) {
  const actual = seccionDe(pantalla)
  const enlaces: { id: Seccion; texto: string; onClick: () => void }[] = [
    { id: 'explorar', texto: 'Explorar', onClick: onExplorar },
    { id: 'buscar', texto: 'Buscar', onClick: onBuscar },
    ...(usuario ? [{ id: 'mios' as const, texto: 'Mis materiales', onClick: onMisMateriales }] : []),
  ]

  return (
    <header className="border-b border-line bg-white px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 pt-3">
        <button type="button" onClick={onInicio} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left" title="Ir al inicio">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink font-display text-lg font-extrabold text-white" aria-hidden="true">
            B
          </span>
          <span className="sr-only min-w-0 truncate font-display text-lg font-bold tracking-tight text-ink min-[480px]:not-sr-only">
            Biblioteca para Estudiantes
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {usuario ? (
            <>
              <span className="hidden max-w-48 truncate text-sm text-muted md:inline" title={usuario.correo}>{usuario.nombre}</span>
              <button type="button" onClick={onSalir} className="rounded-xl px-3 py-2 text-sm font-semibold text-muted transition hover:bg-slate-100 hover:text-ink">Salir</button>
            </>
          ) : (
            <button type="button" onClick={onIngresar} className="rounded-xl px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10">Ingresar</button>
          )}
          {onSubir && (
            <button
              type="button"
              onClick={onSubir}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M10 4v12M4 10h12" />
              </svg>
              <span className="hidden min-[400px]:inline">Subir material</span>
              <span className="min-[400px]:hidden">Subir</span>
            </button>
          )}
        </div>
      </div>

      <nav aria-label="Secciones" className="mx-auto mt-2 w-full max-w-6xl">
        <ul className="-mx-3 -mb-px flex gap-1 overflow-x-auto">
          {enlaces.map((e) => {
            const activo = actual === e.id
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={e.onClick}
                  aria-current={activo ? 'page' : undefined}
                  className={`whitespace-nowrap border-b-[3px] px-3 py-2.5 text-sm font-semibold transition ${activo ? 'border-brand text-ink' : 'border-transparent text-muted hover:text-ink'}`}
                >
                  {e.texto}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

export default Header
