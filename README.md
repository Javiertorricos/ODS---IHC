# 📚 Biblioteca para Estudiantes

**Interacción Humano-Computador (ISW-231) · Semestre 2-2026**
Equipo: Javier, Josué y Jussel

Aplicación web donde los estudiantes de la universidad comparten y descargan material de estudio (resúmenes, exámenes, prácticas, presentaciones) organizado como en la vida real: **carrera → semestre → materia → docente**.

## ¿Qué se puede hacer?

| Función | Quién |
|---|---|
| Explorar el material por carrera, semestre, materia y docente | Todos |
| **Buscar** por texto (tema, materia, docente o autor), carrera y tipo; ordenar por fecha o título | Todos |
| Descargar archivos | Todos |
| Registrarse e ingresar con correo `@ucb.edu.bo` (verificación simulada) | Todos |
| **Subir** material (PDF, Word, Excel, PowerPoint o RAR, máx. 50 MB) | Usuarios registrados |
| **Editar** y **eliminar** su propio material (eliminar pide confirmación) | El autor |
| **Mis materiales**: todo lo que subió el usuario en un solo lugar | Usuarios registrados |

La interfaz siempre informa lo que pasa: "Cargando biblioteca...", "Guardando cambios...", avisos de éxito ("Material subido", "Cambios guardados", "Material eliminado"), errores con botón **Reintentar**, estados vacíos con la acción siguiente y validación campo por campo.

## Tecnologías

| Parte | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend | API REST con JSON Server (`db.json`) |
| Publicación | Netlify (frontend) + Render (API) |

## Estructura

```text
Biblioteca-para-Estudiantes/
├── README.md               este archivo
├── biblioteca/             el proyecto
│   ├── backend/            API REST: server.js + db.json
│   ├── frontend/           aplicación React
│   │   └── src/
│   │       ├── main.tsx        monta la app en #root
│   │       ├── App.tsx         estado principal y navegación entre pantallas
│   │       ├── components/     piezas reutilizables (MaterialCard, FormularioMaterial, FiltroTipos...)
│   │       ├── pantallas/      una pantalla por sección (carreras, Buscar, Mis materiales, subir, editar...)
│   │       ├── hooks/          estado + operaciones (useMateriales, useSesion)
│   │       ├── services/       acceso a la API con fetch (materialService, usuarioService)
│   │       ├── data/           carreras, pensum y tipos
│   │       └── utils/          validaciones, búsqueda y formato
│   ├── docs/               documentación (estructura, colores, UI/UX, accesibilidad, componentes)
│   ├── iniciar.bat         arranque en Windows
│   └── iniciar.sh          arranque en Linux / macOS
├── presentacion-3d/        diapositivas web del proyecto
├── netlify.toml            publicación del frontend
└── render.yaml             publicación de la API
```

## Ejecutar en local

Requisito: **Node.js 18 o superior** (<https://nodejs.org>). La primera vez se necesita internet para instalar dependencias.

**Windows:** abre la carpeta `biblioteca` y haz doble clic en `iniciar.bat`.
**Linux / macOS:** en una terminal, dentro de `biblioteca`, ejecuta `./iniciar.sh`.

El script instala lo necesario (solo la primera vez) y abre dos procesos:

- API → <http://localhost:3001>
- Web → <http://localhost:5173> (se abre sola en el navegador)

Para detenerlo, cierra las ventanas negras (Windows) o pulsa `Ctrl+C` (Linux).

**A mano, en dos terminales:**

```bash
cd biblioteca/backend  && npm install && npm start      # API
cd biblioteca/frontend && npm install && npm run dev    # Web
```

La base de datos empieza vacía (`biblioteca/backend/db.json`): regístrate y sube el primer material.

## API REST

| Verbo | Ruta | Acción (CRUD) |
|---|---|---|
| GET | `/materiales` | Listar (Read) |
| POST | `/materiales` y `/archivos` | Subir (Create) |
| PUT | `/materiales/:id` | Editar (Update) — solo el autor |
| DELETE | `/materiales/:id` | Eliminar (Delete) — solo el autor; borra también su archivo |
| GET | `/archivos/:id` | Descargar un archivo |
| GET / POST | `/usuarios?correo=` · `/usuarios` | Buscar / registrar usuario (correo único) |

Flujo: los componentes avisan con funciones por props (`onEditar`, `onEliminar`) → `App.tsx` → hook `useMateriales` → `services/materialService.ts` → `fetch` a la API → JSON Server guarda en `db.json`. Al recargar, `useEffect` vuelve a pedir los datos con `GET`.

## Publicar en internet

Netlify no puede usar `http://localhost:3001`, así que la API se publica aparte:

1. Subir este proyecto a GitHub.
2. **Render** → *New → Blueprint* (lee `render.yaml`) → copiar la URL de la API.
3. **Netlify** → *Import from Git* (lee `netlify.toml`) → variable de entorno `VITE_API_URL` = URL de Render → *Deploy*.

En el plan gratuito de Render la API se duerme sin uso (la primera carga tarda) y `db.json` vuelve a vaciarse al reiniciarse.

## Diseño, usabilidad y accesibilidad

- **Colores:** paleta corta con un color de acción (verde azulado), rojo solo para errores y acciones destructivas y un color por carrera; todos los textos superan el contraste 4.5:1 → `biblioteca/docs/02-ESTUDIO-DE-COLORES.md`
- **UI/UX:** heurísticas de Nielsen aplicadas pantalla por pantalla → `biblioteca/docs/03-UI-UX-APLICADO.md`
- **Accesibilidad:** etiquetas en todos los campos, foco visible, "Saltar al contenido", errores con texto y `role="alert"`, navegación con teclado. Auditoría: axe-core 0 violaciones, Lighthouse 100 en accesibilidad → `biblioteca/docs/04-ACCESIBILIDAD-Y-NETLIFY.md`
- **Componentes y código** → `biblioteca/docs/05-COMPONENTES-Y-CODIGO.md`, `biblioteca/docs/SOLID-componentes.md`
- **Estructura y flujos de datos** → `biblioteca/docs/01-ESTRUCTURA-DEL-PROYECTO.md`

## Limitaciones conocidas

- El inicio de sesión es una **simulación**: no hay contraseña ni correo real; el código de verificación se muestra en pantalla.
- La regla "solo el autor edita o elimina" la aplica la API con el correo de la sesión; sin autenticación real podría falsificarse.
- Los archivos se guardan dentro de `db.json` (en base64): sirve para la clase, no para muchos usuarios.
