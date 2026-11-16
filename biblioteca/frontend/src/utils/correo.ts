export const DOMINIO = 'ucb.edu.bo'

export type ResultadoCorreo = { ok: true; correo: string } | { ok: false; error: string }

// Acepta solo el usuario ("juan.perez") o el correo completo ("juan.perez@ucb.edu.bo").
// Cualquier otro dominio se rechaza. Es una simulacion: no se envia ni verifica nada real.
export function resolverCorreo(entrada: string): ResultadoCorreo {
  const texto = entrada.trim().toLowerCase()
  if (!texto) return { ok: false, error: 'Escribe tu correo universitario.' }

  let usuario = texto
  if (texto.includes('@')) {
    const [parteUsuario, dominio, ...sobra] = texto.split('@')
    if (sobra.length > 0 || dominio !== DOMINIO) return { ok: false, error: `Solo se aceptan correos @${DOMINIO}.` }
    usuario = parteUsuario
  }

  if (!/^[a-z0-9._-]{3,40}$/.test(usuario)) {
    return { ok: false, error: 'El usuario debe tener de 3 a 40 caracteres: letras, números, punto, guion o guion bajo.' }
  }
  return { ok: true, correo: `${usuario}@${DOMINIO}` }
}
