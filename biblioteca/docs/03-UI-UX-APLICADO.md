# 3. UI/UX: dónde se aplicó cada principio

## Heurísticas de Nielsen en la Biblioteca

| Principio | Cómo se aplica | Dónde |
|---|---|---|
| **Visibilidad del estado del sistema** | "Cargando biblioteca...", "Guardando cambios...", "Eliminando...", "Comprobando..."; aviso de éxito "Material subido / Cambios guardados / Material eliminado"; pestaña activa marcada en la navegación; número de resultados | `App.tsx`, `Aviso.tsx`, `Header.tsx`, `MaterialCard.tsx`, `FormularioMaterial.tsx`, `Acceso.tsx` |
| **Correspondencia con el mundo real** | Recorrido igual que en la universidad: Carrera → Semestre → Materia → Docente → Material; lenguaje cotidiano | `pantallas/`, `data/pensum.ts` |
| **Control y libertad del usuario** | Botón **Cancelar** al editar o subir; migas de pan para volver a cualquier paso; botón "atrás" del navegador funciona; **Cambiar** en cada respuesta del asistente; **Limpiar filtros** y **Quitar filtro**; el aviso se puede cerrar | `Breadcrumb.tsx`, `App.tsx` (historial), `SubirMaterial.tsx`, `FormularioMaterial.tsx`, `Buscar.tsx` |
| **Consistencia y estándares** | Mismo botón principal, mismas tarjetas (`TarjetaOpcion`), mismos campos (`campos.ts`), misma paleta | `components/`, `index.css` |
| **Prevención de errores** | Confirmación antes de eliminar ("Esta acción no se puede deshacer"); solo se aceptan correos `@ucb.edu.bo`; formatos y tamaño de archivo validados antes de subir; contador de caracteres de la descripción mientras se escribe; solo el autor ve Editar/Eliminar | `MaterialCard.tsx`, `utils/correo.ts`, `utils/archivos.ts` |
| **Reconocer antes que recordar** | Listas desplegables en lugar de escribir; el asistente muestra lo ya elegido como etiquetas; docentes existentes en lista | `SubirMaterial.tsx` |
| **Flexibilidad y eficiencia** | Dos caminos para encontrar material: explorar paso a paso (novatos) o **Buscar** con filtros y orden (usuarios con experiencia); "Subir material" en todas las pantallas; **Mis materiales** reúne lo propio | `Header.tsx`, `Buscar.tsx`, `MisMateriales.tsx` |
| **Diseño estético y minimalista** | Una acción principal por pantalla, mucho espacio, solo la información necesaria en cada tarjeta | `index.css`, `MaterialCard.tsx` |
| **Ayudar a reconocer y recuperarse de errores** | Mensaje escrito junto a cada campo; error de red con botón **Reintentar**; el formulario conserva lo escrito si falla | `MensajeError.tsx`, `FormularioMaterial.tsx` |
| **Ayuda y documentación** | Textos de ayuda bajo los campos ("PDF, Word, Excel, PowerPoint o RAR"), aviso de modo simulado | `FormularioMaterial.tsx`, `Acceso.tsx` |

## Patrones de interfaz

- **Empty State:** `EstadoVacio.tsx` ("Este docente aún no tiene material" + *Subir material*; "No se encontró material" + *Limpiar filtros*; "Todavía no subiste material" + *Subir mi primer material*). Explica qué pasó y ofrece el siguiente paso.
- **Búsqueda en vivo con filtros:** la lista cambia mientras se escribe; los filtros por tipo muestran cuántos hay de cada uno (`FiltroTipos.tsx`).
- **Aviso de éxito (toast):** aparece abajo 5 segundos tras subir, editar, eliminar o salir (`Aviso.tsx`).
- **Navegación por secciones:** Explorar · Buscar · Mis materiales, con la sección actual subrayada y `aria-current`.
- **Estados de una operación remota:** `cargando` (leer), `guardando` (crear/editar/eliminar) y `error` (con *Reintentar*), todos en `useMateriales.ts`.
- **Confirmación en línea:** en vez de un `confirm()` del navegador, la tarjeta cambia a un cuadro "¿Eliminar este material?" con **Sí, eliminar / Cancelar** (`role="alertdialog"`).
- **Divulgación progresiva:** el asistente de subida hace una pregunta a la vez (`PasoPregunta.tsx`) y solo muestra el formulario cuando ya se sabe dónde guardar.
- **Migas de pan (breadcrumb):** `Breadcrumb.tsx` muestra dónde está el usuario y permite retroceder.
- **Diseño responsive:** cuadrícula de 1, 2 o 3 columnas según el ancho (`md:grid-cols-2 xl:grid-cols-3`); el nombre de la app se oculta en pantallas muy pequeñas.

## Recorrido del usuario

1. **Lobby** → *Entrar a la biblioteca*.
2. **Carrera → Semestre → Materia → Docente** → lista de material, con *Descargar*.
3. **Subir material** (requiere cuenta `@ucb.edu.bo` simulada): preguntas rápidas → formulario → el material aparece en su docente.
4. **Buscar:** texto + carrera + tipo + orden, desde el lobby o la barra de navegación.
5. **Mis materiales:** todo lo que subió el usuario, con **Editar** y **Eliminar** (también en sus tarjetas en cualquier lista).
