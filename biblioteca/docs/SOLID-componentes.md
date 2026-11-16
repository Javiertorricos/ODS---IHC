# Actividad SOLID (S – Responsabilidad Única): componentes de la Biblioteca para Estudiantes

| Componente | Responsabilidad | ¿Reutilizable? | Datos que recibe (props) | Dónde se usa |
|---|---|---|---|---|
| `Header` | Logo, sesión (Ingresar / Salir), botón "Subir material" y navegación Explorar · Buscar · Mis materiales | Sí | usuario, pantalla, onInicio, onExplorar, onBuscar, onMisMateriales, onSubir, onIngresar, onSalir | Todas menos el lobby |
| `Footer` | Pie de página | Sí | — | Todas menos el lobby |
| `Breadcrumb` | Camino recorrido y retroceso | Sí | migas (texto, onClick) | Todas menos el lobby |
| `Titulo` | Título `h1` de la pantalla y subtítulo | Sí | titulo, texto | Todas las pantallas |
| `TarjetaOpcion` | Tarjeta clicable para elegir una opción | Sí, la más reutilizada | titulo, subtitulo, etiqueta, franja, onClick | Carreras, semestres, materias, docentes |
| `MaterialCard` | Mostrar un archivo; Descargar, y Editar/Eliminar (con confirmación) si es del usuario | Sí | material, esAutor, ocupado, mostrarUbicacion, onEditar, onEliminar | Lista del docente, Buscar, Mis materiales |
| `ListaResultados` | Cuadrícula de `MaterialCard` | Sí | materiales, correoUsuario, ocupado, onEditar, onEliminar | Lista del docente, Buscar, Mis materiales |
| `FiltroTipos` | Filtrar por tipo de material mostrando cuántos hay | Sí | conteo, valor, onCambio | Lista del docente, Buscar |
| `EstadoVacio` | Avisar que no hay datos y ofrecer la acción siguiente | Sí | titulo, texto, accion | Listas vacías y búsquedas sin resultados |
| `MensajeError` | Error de una operación remota con "Reintentar" | Sí | mensaje, onReintentar | App |
| `Aviso` | Mensaje de éxito temporal | Sí | mensaje, onCerrar | App |
| `CampoCorreo` | Correo con el dominio @ucb.edu.bo fijo | Sí | id, valor, onCambio, error | Registro e ingreso |
| `PasoPregunta` | Marco de cada pregunta del asistente de subida | Sí | numero, pregunta, contenido | Subir material |
| `FormularioMaterial` | Capturar y validar datos del material; crea o edita | Sí | destino, inicial, onGuardar, onCancelar | Subir material, Editar material |

Capas que no son componentes visuales:
- `services/api.ts`: única función que usa `fetch` (URL, JSON, `response.ok`, errores).
- `services/materialService.ts`: GET / POST / PUT / DELETE de materiales y archivos.
- `services/usuarioService.ts` y `services/sesion.ts`: usuarios en la API y sesión simulada en el navegador.
- `hooks/useMateriales.ts`: lista de materiales y estados cargando / guardando / error.
- `hooks/useSesion.ts`: usuario actual.
- `utils/`: reglas de archivos, validación de correo, búsqueda y filtros, formato de texto.
- `backend/server.js` + `db.json`: API REST con JSON Server.

## Por qué cumple la responsabilidad única
- `App` decide qué pantalla mostrar y conecta pantallas con hooks; no hace `fetch`.
- Cada pantalla de `pantallas/` muestra un solo paso o sección.
- Los componentes no conocen la API: avisan con funciones por props (`onEditar`, `onEliminar`).
- El acceso a datos está solo en `services/`; las reglas y búsquedas, en `utils/`.
