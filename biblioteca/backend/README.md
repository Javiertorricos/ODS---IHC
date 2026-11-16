# Backend — API de la Biblioteca

JSON Server 0.17 sobre `db.json` + `server.js` (reglas extra: archivos grandes, solo el autor edita o elimina, correos únicos).

```bash
npm install
npm start          # http://localhost:3001
```

Variables: `PORT` (3001), `MAX_MB` (50), `DB_PATH` (`./db.json`). Comprobación: `GET /salud`.

| Verbo | Ruta | Acción |
|---|---|---|
| GET | `/materiales` | Listar |
| POST | `/materiales` | Crear |
| PUT | `/materiales/:id` | Actualizar (solo autor, cabecera `x-usuario`) |
| DELETE | `/materiales/:id` | Eliminar (solo autor) |
| GET / POST / PUT / DELETE | `/archivos/:id` · `/archivos` (POST) | Archivo en base64 |
| GET / POST | `/usuarios` | Buscar (`?correo=`) / registrar |
