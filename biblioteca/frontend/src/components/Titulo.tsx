function Titulo({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 tabIndex={-1} className="focus-visible:outline-none font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{titulo}</h1>
      {texto && <p className="mt-2 max-w-2xl text-base text-muted">{texto}</p>}
    </div>
  )
}

export default Titulo
