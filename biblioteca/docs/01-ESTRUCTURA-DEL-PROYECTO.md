# 1. Estructura del proyecto

El proyecto está separado en dos aplicaciones independientes que se comunican por HTTP:

```text
biblioteca/
├── backend/            API REST (JSON Server + db.json)
│   ├── server.js       arranca JSON Server y agrega 4 reglas pequeñas
│   ├── db.json         "base de datos": usuarios, materiales, archivos
│   └── package.json
├── frontend/           Aplicación React + TypeScript + Vite + Tailwind
│   ├── index.html      HTML base (tiene <div id="root">)
│   └── src/
│       ├── main.tsx            punto de entrada: monta <App /> en #root
│       ├── App.tsx             componente principal: estado general y navegación
│       ├── components/         piezas reutilizables de interfaz
│       ├── pantallas/          una pantalla por paso del recorrido
│       ├── hooks/              estado + operaciones (useMateriales, useSesion)
│       ├── services/           acceso a la API (fetch) — la única capa que conoce HTTP
│       ├── data/               datos de referencia (carreras, pensum) y tipos
│       └── utils/              funciones puras (filtros, formato, validaciones)
├── docs/               esta documentación
└── iniciar.bat / iniciar.sh   arrancan API + web en local
```

`netlify.toml` y `render.yaml` están en la carpeta principal de la entrega (junto al README).

## Responsabilidad de cada capa

| Capa | Carpeta / archivo | Qué hace | Qué NO hace |
|---|---|---|---|
| Entrada | `main.tsx` | Monta React en el elemento `root` | No tiene lógica |
| Coordinador | `App.tsx` | Guarda el estado principal (materiales, sesión, pantalla actual) y conecta pantallas con hooks | No hace `fetch` |
| Pantallas | `pantallas/*.tsx` | Componen una vista completa (lista de carreras, subir, editar...) | No guardan datos remotos |
| Componentes | `components/*.tsx` | Piezas reutilizables que reciben props y avisan con funciones (`onEditar`, `onEliminar`) | No conocen la API |
| Hooks | `hooks/*.ts` | Estado `cargando` / `guardando` / `error` y operaciones CRUD | No conocen la URL ni los detalles de `fetch` |
| Servicios | `services/*.ts` | `fetch` a la API, manejo de `response.ok`, JSON, cabeceras | No conocen React |
| Datos | `data/*.ts` | Carreras, pensum y tipos TypeScript | — |
| Utilidades | `utils/*.ts` | Filtros con `filter`, formato de fechas/tamaños, validaciones | — |

## Estructuras usadas (y dónde verlas)

- **Componentes reutilizables con props:** `TarjetaOpcion` se usa 4 veces (carreras, semestres, materias, docentes) con datos distintos.
- **Estado (`useState`):** `useMateriales.ts` (`materiales`, `cargando`, `guardando`, `error`), `useSesion.ts` (`usuario`), formularios (`titulo`, `descripcion`...).
- **Efectos (`useEffect`):** `useMateriales.ts` carga la lista al iniciar (`GET /materiales`) y de nuevo al pulsar **Reintentar**; `useSesion.ts` restaura la sesión.
- **Listas (`map`) con `key`:** `ListaMaterial.tsx` pinta una `MaterialCard` por material con `key={m.id}` (id estable, no el índice).
- **Filtros (`filter`):** `utils/consultas.ts` (materiales de una materia/docente, `buscarMateriales`, `materialesDeAutor`) y `useMateriales.eliminar` (quita el id borrado de la lista).
- **Búsqueda sin importar mayúsculas ni tildes:** `buscarMateriales` usa `normalizar()` (`toLocaleLowerCase` + quitar tildes) en `pantallas/Buscar.tsx`.
- **Renderizado condicional:** `App.tsx` (cargando / error / pantalla), `MaterialCard.tsx` (botones Editar y Eliminar solo para el autor; confirmación), `EstadoVacio`.
- **Formulario controlado:** `FormularioMaterial.tsx` (cada campo con `value` + `onChange`; `onSubmit` con `preventDefault`).
- **Modo creación / edición del mismo formulario:** `FormularioMaterial` recibe `inicial` solo al editar.
- **Funciones por props:** `onEditar`, `onEliminar`, `onGuardar`, `onCancelar`: el hijo avisa, el padre decide.
- **Servicio de datos:** `services/materialService.ts` (equivale al `taskService` de clase).

## API REST (backend)

| Operación CRUD | Verbo | Ruta | Quién la llama |
|---|---|---|---|
| Read | GET | `/materiales` | `materialService.obtenerMateriales` |
| Create | POST | `/archivos` + `/materiales` | `materialService.crearMaterial` |
| Update | PUT | `/materiales/:id` (+ `/archivos/:id`) | `materialService.actualizarMaterial` |
| Delete | DELETE | `/materiales/:id` | `materialService.eliminarMaterial` |
| Read / Create usuarios | GET / POST | `/usuarios?correo=` · `/usuarios` | `usuarioService` |

`/materiales` es la colección; `/materiales/5` es el recurso con id 5.

Reglas extra de `backend/server.js`: (1) el cuerpo puede pesar hasta 50 MB porque los archivos viajan en base64; (2) solo el autor edita o elimina su material (cabecera `x-usuario`); (3) no se repite un correo; (4) no se puede pedir la colección completa de archivos.

## Flujos de datos

**Cargar:** `App` inicia → `useEffect` en `useMateriales` → `materialService.obtenerMateriales` → `peticion` hace `GET /materiales` → JSON → `setMateriales` → React pinta las `MaterialCard`.

**Crear:** `FormularioMaterial` valida → `onGuardar` → `App.guardar` → `useMateriales.agregar` → `materialService.crearMaterial` (`POST /archivos`, `POST /materiales`) → la API guarda en `db.json` → se agrega a `materiales` → se muestra la lista.

**Actualizar:** `MaterialCard` (Editar) → `App.abrirEdicion` → pantalla `EditarMaterial` con el formulario cargado → submit → `useMateriales.editar` → `PUT /materiales/:id` → `materiales.map` reemplaza el registro.

**Eliminar:** `MaterialCard` (Eliminar) → confirmación → `App.eliminarMaterial` → `useMateriales.eliminar` → `DELETE /materiales/:id` → solo si la API respondió bien, `filter` quita el id de la lista.

**Después de recargar:** `useEffect` vuelve a hacer `GET /materiales` y la API lee `db.json`, por eso los datos persisten.
