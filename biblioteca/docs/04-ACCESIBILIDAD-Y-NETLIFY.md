# 4. Accesibilidad y publicación (Netlify + Render)

## Accesibilidad implementada

| Práctica | Dónde |
|---|---|
| `lang="es"` en el documento | `frontend/index.html` |
| Cada campo con su `<label>` | `FormularioMaterial.tsx`, `Acceso.tsx`, `CampoCorreo.tsx` |
| Errores con texto y `role="alert"` (no solo color) + `aria-invalid` en el campo | formularios |
| Foco visible en todos los elementos (`:focus-visible`, 3 px) | `index.css` |
| Estados de carga anunciados con `role="status"` / `aria-live="polite"` | `App.tsx` |
| Diálogo de confirmación con `role="alertdialog"` y nombre accesible | `MaterialCard.tsx` |
| Navegación de migas con `aria-label="Ruta"` y `aria-current="page"` | `Breadcrumb.tsx` |
| Pestañas Ingresar / Registrarme con `role="tablist"`, `role="tab"` y `aria-selected` | `Acceso.tsx` |
| Iconos y adornos con `aria-hidden="true"` | `Header.tsx`, `TarjetaOpcion.tsx` |
| Jerarquía de títulos (h1 de pantalla → h2 de cada tarjeta) | `Titulo.tsx`, `MaterialCard.tsx` |
| Contraste ≥ 4.5:1 (texto) y ≥ 3:1 (bordes de campos) | ver `02-ESTUDIO-DE-COLORES.md` |
| Todo se maneja con teclado (botones y campos nativos) | todo el proyecto |
| `prefers-reduced-motion` respetado | `index.css` |
| Enlace **Saltar al contenido** (primer elemento con Tab) | `App.tsx` |
| Al cambiar de pantalla el foco va al título `h1` (teclado y lector empiezan ahí) | `App.tsx`, `Titulo.tsx` |
| Título de la pestaña según la pantalla ("Buscar material · Biblioteca...") | `App.tsx` |
| Formulario de búsqueda con `role="search"` y etiquetas visibles | `Buscar.tsx` |
| Filtros como botones con `aria-pressed` (el estado no depende solo del color) | `FiltroTipos.tsx` |
| Aviso de éxito en una región `role="status"` que siempre existe | `Aviso.tsx` |
| Ayuda de la descripción unida al campo con `aria-describedby` | `FormularioMaterial.tsx` |

## Resultados de las auditorías (hechas en local sobre la versión compilada)

- **axe-core** (reglas WCAG 2.0/2.1 A y AA + buenas prácticas) en 11 estados de pantalla: lobby, carreras, semestres, materias, docentes, material con Editar/Eliminar, confirmación de eliminar, editar, subir (vacío y con errores) y acceso/registro → **0 violaciones**. (En la primera pasada salió 1 aviso de orden de títulos y se corrigió.) Después de agregar Buscar y Mis materiales se repitió en esas pantallas (escritorio y móvil): 0 violaciones, tras corregir el nombre accesible del botón de inicio.
- **Lighthouse** (lobby): Accesibilidad **100**; Prácticas recomendadas 96; SEO 82 → se agregaron `meta description` y `robots.txt` después de la medición. El error de consola de la medición era la descarga de tipografías de Google, bloqueada en el entorno de prueba.

> Estas son pruebas automáticas: detectan una parte de los problemas. Falta la revisión manual con teclado y lector de pantalla.

## Cómo evaluar la accesibilidad en Netlify

1. Publica el frontend (ver abajo) y abre la URL `https://tu-sitio.netlify.app`.
2. **Chrome → F12 → pestaña Lighthouse** → marca *Accessibility* (y *Best practices*, *SEO*) → *Analyze page load*. Anota el puntaje.
3. Instala la extensión **axe DevTools** (o **WAVE**) y analiza las pantallas principales: lista de material, formulario de subida, formulario de acceso.
4. Prueba solo con teclado: `Tab` recorre todo en orden lógico, el foco siempre se ve, `Enter`/`Espacio` activan botones.
5. Prueba el zoom al 200 % y el ancho de móvil (F12 → modo dispositivo).
6. Tabla para la presentación: *Problema encontrado → Dónde → Cómo se corrigió*.

## Publicar

Netlify no puede usar `http://localhost:3001` (localhost es la computadora de cada visitante). Por eso la API se publica aparte.

**Paso 1 — API en Render**
1. Sube el repositorio a GitHub.
2. Render → *New → Blueprint* (lee `render.yaml`) o *New → Web Service* con *Root Directory* `biblioteca/backend`, *Build* `npm install`, *Start* `npm start`.
3. Cuando termine, copia la URL (por ejemplo `https://biblioteca-api.onrender.com`). Comprueba `…/salud`.

**Paso 2 — Frontend en Netlify**
1. Netlify → *Add new site → Import from Git* → elige el repositorio (lee `netlify.toml`: base `biblioteca/frontend`, comando `npm run build`, publicar `dist`).
2. *Site configuration → Environment variables* → `VITE_API_URL` = la URL de Render (sin `/` al final).
3. *Deploy*. Si cambias la variable, hay que volver a desplegar.

**Limitaciones del plan gratuito de Render (decirlas en la defensa):** el servicio se duerme tras unos minutos sin uso (la primera carga puede tardar ~30–60 s: por eso existe el estado "Cargando" y el botón *Reintentar*) y su disco es temporal, así que `db.json` vuelve a su estado inicial cuando el servicio se reinicia o se vuelve a desplegar. Para datos permanentes habría que usar una base de datos externa.

## Seguridad: lo que es simulado

El acceso (`@ucb.edu.bo`, código en pantalla) es una simulación de clase: no hay contraseña ni correo real. La regla "solo el autor edita o elimina" la aplica el servidor comparando la cabecera `x-usuario`, pero como no hay autenticación real, cualquiera que conozca el correo podría falsificarla. Con autenticación real (JWT/sesiones) se resolvería.
