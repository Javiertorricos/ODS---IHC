# 2. Estudio de colores

La paleta se define una sola vez en `frontend/src/index.css` (bloque `@theme`) y Tailwind genera las clases (`text-ink`, `bg-brand`, ...). Así un cambio de color se hace en un solo lugar (principio de consistencia).

## Paleta y rol de cada color

| Token | Hex | Rol | Dónde se usa |
|---|---|---|---|
| `ink` | `#12202f` | Texto principal y fondo oscuro del lobby | Títulos, texto de tarjetas, `Lobby` |
| `paper` | `#f3f5f8` | Fondo general de la aplicación | `App.tsx` |
| `white` | `#ffffff` | Superficies (tarjetas, header, formularios) | Tarjetas, `Header`, campos |
| `line` | `#dbe1e8` | Bordes decorativos | Tarjetas, header |
| `muted` | `#5a6879` | Texto secundario | Subtítulos, fechas, ayudas |
| `brand` | `#0b6e75` | Color de marca / acción principal (verde azulado) | Botón "Subir material", enlaces, foco |
| `brand-dark` | `#095a60` | Estado hover de la acción principal | `hover:bg-brand-dark` |
| `mecatronica` | `#c0521a` | Identifica la carrera Mecatrónica (naranja) | Franja de `TarjetaOpcion` |
| `software` | `#2358c4` | Identifica Ingeniería de Software (azul) | Franja de `TarjetaOpcion` |
| `ia` | `#7a3fc2` | Identifica Inteligencia Artificial (violeta) | Franja de `TarjetaOpcion` |
| rose 700–800 / rose 50 | Tailwind | Errores y acción destructiva (Eliminar) | `MensajeError`, validaciones |
| amber 50 / 900 | Tailwind | Aviso ("Modo simulado") | `Acceso` |

## Decisiones de color

- **Una acción principal, un color:** todo lo que el usuario puede hacer (subir, guardar, ingresar) usa `brand`; lo destructivo usa rojo; lo secundario es texto o contorno. El usuario aprende rápido qué es cada cosa.
- **Neutros fríos + un acento:** fondo gris azulado claro, texto casi negro azulado y un solo acento verde azulado. Se ve sobrio y no compite con el contenido.
- **Color de carrera como apoyo, no como único dato:** cada carrera tiene su color en la franja lateral, pero siempre va acompañada del nombre escrito.
- **Estados con texto y color:** los errores llevan mensaje escrito (y `role="alert"`), los tipos de archivo muestran "PDF", "Word", "Excel"... además de su color.
- **Fondo oscuro solo en el lobby:** crea una pantalla de bienvenida con identidad; el resto es claro para leer material largo.

## Contraste calculado (WCAG 2.1)

Se calculó la razón de contraste con la fórmula de luminancia relativa de WCAG. Mínimos: **4.5:1** para texto normal y **3:1** para componentes de interfaz (bordes de campos, iconos).

| Combinación | Razón | Cumple AA |
|---|---|---|
| `ink` sobre `paper` | 15.10 | Sí (AAA) |
| `ink` sobre blanco | 16.49 | Sí (AAA) |
| `muted` sobre `paper` | 5.21 | Sí |
| `muted` sobre blanco | 5.69 | Sí |
| Texto blanco sobre `brand` (botón principal) | 6.00 | Sí |
| Texto blanco sobre `brand-dark` (hover) | 7.95 | Sí (AAA) |
| `brand` sobre blanco (enlaces, "Descargar") | 6.00 | Sí |
| `brand` sobre `paper` | 5.49 | Sí |
| slate-600 sobre blanco | 7.58 | Sí (AAA) |
| slate-700 sobre blanco | 10.35 | Sí (AAA) |
| rose-700 sobre blanco (errores) | 6.29 | Sí |
| rose-800 sobre rose-50 (cuadro de error) | 7.30 | Sí (AAA) |
| Texto blanco sobre rose-700 (botón Eliminar) | 6.29 | Sí |
| amber-900 sobre amber-50 (aviso) | 8.75 | Sí (AAA) |
| `mecatronica` sobre blanco | 4.71 | Sí |
| `software` sobre blanco | 6.43 | Sí |
| `ia` sobre blanco | 6.33 | Sí |
| Etiquetas de archivo: rojo/azul/verde/naranja 700 sobre su fondo 100 | 5.30 / 5.49 / 4.57 / 4.52 | Sí |
| slate-300 y slate-400 sobre `ink` (texto del lobby) | 11.11 / 6.43 | Sí |
| Borde de campo (slate-500) sobre blanco | 4.76 | Sí (≥ 3:1) |
| Borde de campo con error (rose-600) sobre blanco | 4.70 | Sí (≥ 3:1) |
| `line` sobre blanco (borde de tarjetas) | 1.32 | Decorativo: no transmite información |

> Corrección hecha en esta versión: el borde del campo con error era rose-400 (2.69:1, no alcanzaba 3:1) y pasó a rose-600 (4.70:1).

## Cómo explicarlo en la defensa

1. Se eligió **una paleta corta con roles claros** (marca, texto, superficie, error).
2. Los colores se centralizan en `index.css`, no se repiten valores sueltos.
3. Ninguna información depende solo del color: texto + color (+ `role="alert"` en errores).
4. Todos los pares de texto superan 4.5:1; se verificó con cálculo y con auditoría automática (ver `04-ACCESIBILIDAD-Y-NETLIFY.md`).
