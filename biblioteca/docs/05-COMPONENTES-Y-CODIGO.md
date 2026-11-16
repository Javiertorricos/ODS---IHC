# 5. Componentes utilizables y explicación del código

## Componentes reutilizables (`frontend/src/components`)

| Componente | Props principales | Para qué sirve | Se reutiliza en |
|---|---|---|---|
| `Header` | `usuario`, `onInicio`, `onSubir`, `onIngresar`, `onSalir` | Barra superior con marca, sesión y botón Subir | `App` (todas las pantallas menos el lobby) |
| `Footer` | — | Pie de página | `App` |
| `Breadcrumb` | `migas: {texto, onClick?}[]` | Camino recorrido y retroceso | `App` |
| `Titulo` | `titulo`, `texto?` | `h1` de cada pantalla con subtítulo | todas las pantallas |
| `TarjetaOpcion` | `titulo`, `subtitulo?`, `etiqueta?`, `franja?`, `onClick` | Tarjeta clicable de una opción | carreras, semestres, materias, docentes |
| `MaterialCard` | `material`, `esAutor`, `ocupado`, `onEditar`, `onEliminar` | Tarjeta de un archivo; Descargar, y Editar/Eliminar si es del usuario | `ListaMaterial` |
| `EstadoVacio` | `titulo`, `texto`, `accion?` | Empty State con acción siguiente | listas sin datos |
| `MensajeError` | `mensaje`, `onReintentar?` | Error de una operación remota con botón Reintentar | `App` |
| `PasoPregunta` | `numero`, `pregunta`, `children` | Marco de cada pregunta del asistente de subida | `SubirMaterial` |
| `CampoCorreo` | `id`, `valor`, `onCambio`, `error?` | Campo de correo con sufijo `@ucb.edu.bo` | `Acceso` |
| `FormularioMaterial` | `destino`, `inicial?`, `onGuardar`, `onCancelar?` | Formulario controlado; **crea** o **edita** según reciba `inicial` | `SubirMaterial`, `EditarMaterial` |
| `FiltroTipos` | `conteo`, `valor`, `onCambio` | Botones de filtro por tipo con su cantidad (`aria-pressed`) | `ListaMaterial`, `Buscar` |
| `ListaResultados` | `materiales`, `correoUsuario`, `ocupado`, `mostrarUbicacion?`, `onEditar`, `onEliminar` | Cuadrícula de `MaterialCard` | `ListaMaterial`, `Buscar`, `MisMateriales` |
| `Aviso` | `mensaje`, `onCerrar` | Mensaje de éxito temporal (`role="status"`) | `App` |
| `campos.ts` | `estiloCampo`, `estiloCampoError` | Clases compartidas de los inputs | todos los formularios |

**Pantallas nuevas:** `Buscar.tsx` (formulario controlado con un objeto `filtros` y `setFiltros({ ...filtros, [campo]: valor })`) y `MisMateriales.tsx` (filtra por `autorCorreo`).

**Idea clave:** un componente es reutilizable cuando recibe lo que necesita por **props** y avisa lo que ocurre con **funciones por props**. Ejemplo: `MaterialCard` no elimina nada; llama a `onEliminar(material)` y quien decide es `App`.

## Hooks (`frontend/src/hooks`)

- `useMateriales()` → `{ materiales, cargando, guardando, error, reintentar, agregar, editar, eliminar }`. Usa `useEffect` para el `GET` inicial; `try/catch/finally` con `finally` para que `cargando` y `guardando` vuelvan a `false` siempre.
- `useSesion()` → `{ usuario, restaurando, buscar, registrar, ingresar, salir }`.

## Servicios (`frontend/src/services`)

- `api.ts`: `peticion()` envuelve `fetch`: arma la URL desde `VITE_API_URL`, envía JSON (`JSON.stringify` + `Content-Type: application/json`), revisa `response.ok`, convierte con `response.json()` y lanza un `ErrorApi` con mensaje legible (también si no hay conexión).
- `materialService.ts`: `obtenerMateriales` (GET), `crearMaterial` (POST), `actualizarMaterial` (PUT), `eliminarMaterial` (DELETE), `obtenerArchivo` (GET de un archivo).
- `usuarioService.ts`: `buscarUsuario` (GET con filtro) y `crearUsuario` (POST).
- `sesion.ts`: guarda solo el correo de la sesión en `localStorage`.

## Código clave para explicar

**Estado y efecto (carga inicial con Reintentar)** — `useMateriales.ts`
```ts
const [materiales, setMateriales] = useState<Material[]>([])
useEffect(() => {
  async function cargarMateriales() {
    try {
      const lista = await obtenerMateriales()   // GET /materiales
      setMateriales(lista)
      setError('')
    } catch (e) {
      setError(mensajeDe(e, 'No se pudo cargar la biblioteca.'))
    } finally {
      setCargando(false)                         // termina SIEMPRE, con éxito o con error
    }
  }
  cargarMateriales()
}, [intento])   // al inicio intento = 0; "Reintentar" lo sube y el efecto vuelve a ejecutarse
```

**Renderizado condicional** — `App.tsx`
```tsx
if (cargando) return <p role="status">Cargando biblioteca...</p>
if (error && materiales.length === 0) return <MensajeError mensaje={error} onReintentar={reintentar} />
```

**Lista con `map` y `key` estable** — `ListaMaterial.tsx`
```tsx
{material.map((m) => <MaterialCard key={m.id} material={m} ... />)}
```

**Eliminar solo si la API confirma** — `useMateriales.ts`
```ts
await eliminarMaterial(material.id, usuario.correo)            // DELETE
setMateriales((previos) => previos.filter((m) => m.id !== material.id))
```

**Actualizar reemplazando un registro** — `useMateriales.ts`
```ts
setMateriales((previos) => previos.map((m) => (m.id === guardado.id ? guardado : m)))
```

**Búsqueda con `filter` y texto normalizado** — `utils/consultas.ts`
```ts
const palabras = normalizar(f.texto).split(/\s+/).filter(Boolean)
return m.filter((x) => {
  if (f.carreraId && x.carreraId !== f.carreraId) return false
  if (f.tipo && x.tipo !== f.tipo) return false
  const donde = normalizar([x.titulo, x.descripcion, x.materia, x.docente].join(' '))
  return palabras.every((p) => donde.includes(p))
})
```

**Un manejador para varios campos** — `Buscar.tsx`
```ts
function cambiar(campo, valor) {
  setFiltros({ ...filtros, [campo]: valor })   // copia el objeto y cambia solo ese campo
}
```

**Formulario controlado con un objeto `form`** — `FormularioMaterial.tsx`
```ts
const FORM_INICIAL = { titulo: '', tipo: 'Resumen', descripcion: '' }
const [form, setForm] = useState(inicial ? { titulo: inicial.titulo, tipo: inicial.tipo, descripcion: inicial.descripcion } : FORM_INICIAL)

function manejarCambio(e) {
  const { name, value } = e.target          // name = qué campo cambió
  setForm({ ...form, [name]: value })       // copia form y reemplaza solo esa propiedad
}
// <input id="titulo" name="titulo" value={form.titulo} onChange={manejarCambio} />
```
`onSubmit` llama a `e.preventDefault()`, valida y, si se creó con éxito, vuelve a `FORM_INICIAL` (`setForm(FORM_INICIAL)`). En modo edición el estado arranca con los datos del material y al guardar se hace `PUT` con el mismo `id`.

**Cómo se carga el formulario al editar (diferencia con clase):** en clase se usa `editingTask` + un `useEffect` que copia la tarea al formulario. Aquí "Editar" abre la pantalla `EditarMaterial`, que **monta** el formulario con `inicial`; como se monta de nuevo en cada edición, el estado ya nace con los datos y no hace falta el `useEffect`.

**Por qué hay una capa de servicios:** si `fetch` estuviera dentro de `MaterialCard` o de `App`, esos componentes mezclarían presentación, estado y acceso a datos (varias responsabilidades). Con `services/` cada archivo hace una sola cosa; para cambiar la API solo se toca `services/`.

## Nota sobre diferencias con lo visto en clase

El proyecto usa **TypeScript** (`.tsx`/`.ts`) en lugar de JavaScript (`.jsx`/`.js`), y los nombres están en español (`materialService` ≈ `taskService`, `useMateriales` ≈ carga de `taskList`, `MaterialCard` ≈ `TaskCard`, `FormularioMaterial` ≈ `ActivityForm`). Los conceptos son los mismos.
