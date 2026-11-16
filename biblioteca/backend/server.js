// Backend de la Biblioteca para Estudiantes.
// Es JSON Server (API REST sobre db.json) con unas reglas extra muy pequeñas:
//   - el cuerpo de las peticiones puede pesar hasta MAX_MB (los archivos viajan en base64)
//   - un material solo lo puede editar o eliminar quien lo subió (cabecera x-usuario)
//   - no se pueden registrar dos usuarios con el mismo correo
//   - no se puede pedir la colección completa de archivos (solo uno por id)
const path = require('path')
const express = require('express')
const jsonServer = require('json-server')

const PUERTO = process.env.PORT || 3001
const MAX_MB = Number(process.env.MAX_MB) || 50
const RUTA_DB = process.env.DB_PATH || path.join(__dirname, 'db.json')

const servidor = jsonServer.create()
const router = jsonServer.router(RUTA_DB)
const middlewares = jsonServer.defaults({ bodyParser: false })

servidor.use(middlewares)
// Un archivo en base64 pesa ~4/3 de su tamaño real: se deja margen
servidor.use(express.json({ limit: `${Math.ceil(MAX_MB * 1.5)}mb` }))

servidor.get('/salud', (_req, res) => res.json({ ok: true }))

// GET /archivos (todos) pesaría cientos de MB: solo se permite GET /archivos/:id
servidor.get('/archivos', (_req, res) => {
  res.status(403).json({ mensaje: 'Pide un archivo por su id: /archivos/:id' })
})

// POST /usuarios: el correo no se puede repetir
servidor.post('/usuarios', (req, res, siguiente) => {
  const correo = String(req.body?.correo ?? '').toLowerCase()
  const existe = router.db.get('usuarios').find({ correo }).value()
  if (existe) return res.status(409).json({ mensaje: 'Este correo ya está registrado.' })
  req.body.correo = correo
  siguiente()
})

// PUT/PATCH/DELETE de un material (y de su archivo): solo su autor
function soloAutor(req, res, siguiente) {
  if (!['PUT', 'PATCH', 'DELETE'].includes(req.method)) return siguiente()
  const material = router.db.get('materiales').find({ id: req.params.id }).value()
  if (!material) return req.baseUrl.startsWith('/materiales') ? res.status(404).json({ mensaje: 'El material no existe.' }) : siguiente()
  const quien = String(req.get('x-usuario') ?? '').toLowerCase()
  if (material.autorCorreo && material.autorCorreo !== quien) {
    return res.status(403).json({ mensaje: 'Solo quien subió el material puede modificarlo.' })
  }
  // Al eliminar un material se elimina también su archivo
  if (req.method === 'DELETE' && req.baseUrl.startsWith('/materiales')) {
    router.db.get('archivos').remove({ id: req.params.id }).write()
  }
  siguiente()
}
servidor.use('/materiales/:id', soloAutor)
servidor.use('/archivos/:id', soloAutor)

servidor.use(router)

servidor.use((error, _req, res, _siguiente) => {
  const demasiado = error.type === 'entity.too.large'
  res.status(demasiado ? 413 : 500).json({ mensaje: demasiado ? `El archivo supera el máximo de ${MAX_MB} MB.` : 'Error del servidor.' })
})

servidor.listen(PUERTO, '0.0.0.0', () => {
  console.log(`API de la biblioteca en http://localhost:${PUERTO}  (base de datos: ${RUTA_DB})`)
})
