import type { ReactNode } from 'react'

interface PasoPreguntaProps {
  numero: number
  pregunta: string
  children: ReactNode
}

// Marco comun de cada pregunta del asistente de subida
function PasoPregunta({ numero, pregunta, children }: PasoPreguntaProps) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">Pregunta {numero} de 4</p>
      <h2 className="mt-1 font-display text-xl font-bold text-ink">{pregunta}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default PasoPregunta
