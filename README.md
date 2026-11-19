# Sabor & Brasa — Sitio web de demostración para restaurante

Página web de un restaurante **ficticio** a la parrilla, creada como proyecto de portafolio y como ejemplo para futuros clientes.

🔗 **Sitio:** https://jhairceli9-crypto.github.io/sabor-y-brasa/

> **Aviso:** el restaurante, su historia, precios y horarios son **de ejemplo**. No hay reseñas, premios, teléfonos, direcciones ni correos inventados: esos datos quedan marcados como «Por configurar». El sitio se identifica como demostración en la barra superior, en la etiqueta **DEMO** del encabezado (siempre visible) y en el pie de página.

## Funciones

| Sección | Qué hace |
|---|---|
| Encabezado | Fijo al hacer scroll; marca la sección que estás viendo. En pantallas ≤ 1024 px se convierte en menú lateral accesible (foco dentro del menú, cierre con `Esc`). |
| Menú digital | 13 platos generados desde `menu-data.js`, con foto, descripción y precio en USD (de ejemplo). |
| Categorías | Filtros Todos / Entradas / Principales / Bebidas / Postres con contador automático; el resultado se anuncia a lectores de pantalla. |
| Galería | 6 fotos; se abren en un visor accesible con teclado (`←` `→`, `Inicio`, `Fin`, `Esc`). |
| Horarios | Tabla de ejemplo; resalta el día de hoy e indica si estaría abierto, con la **hora de Ecuador**. |
| Ubicación | Espacio preparado para pegar el mapa real de Google Maps. |
| Contacto | Formulario con validación que arma un mensaje de WhatsApp. **No envía ni guarda nada.** |

## Tecnologías

HTML5, CSS3 y JavaScript puro, sin frameworks, sin dependencias y sin servidor (funciona en GitHub Pages). Fuentes *Cormorant Garamond* e *Inter* (Google Fonts). Fotos de Unsplash.

## Estructura

```
├── index.html     → estructura y textos de las secciones
├── styles.css     → diseño: colores, tipografía, animaciones y responsive
├── menu-data.js   → ★ los platos, precios, categorías y fotos (lo que más vas a editar)
├── script.js      → interacciones: menú, filtros, galería, horarios, WhatsApp y validación
├── README.md      → este archivo
└── .nojekyll      → indica a GitHub Pages que publique los archivos tal cual
```

## Editar el menú (`menu-data.js`)

Cada plato es un bloque como este:

```js
{
  nombre: "Lomo a la brasa",
  categoria: "principales",      // entradas | principales | bebidas | postres
  precio: 18.9,                  // número, sin el signo $ (se muestra como $18.90)
  descripcion: "300 g de lomo al carbón…",
  foto: "1588168333986-5078d3ae3976",  // código de Unsplash (lo que va después de "photo-")
  alt: "Corte de carne sellado sobre hojas verdes",  // descripción de la foto
},
```

- **Cambiar un precio:** edita el número de `precio`.
- **Agregar un plato:** copia un bloque `{ … },` y cambia sus datos. Las tarjetas, los filtros y los contadores se actualizan solos.
- **Quitar un plato:** borra su bloque completo.
- **Errores de escritura:** si un plato tiene una categoría que no existe, un precio con `$` o le falta la foto, no se muestra y aparece un aviso en la consola del navegador (`F12` → Consola).

## Activar WhatsApp

En `script.js`, al inicio:

```js
const CONFIG = {
  whatsappNumber: "",   // ← número REAL con código de país (8 a 15 dígitos)
  restaurantName: "Sabor & Brasa",
  timeZone: "America/Guayaquil",
  maxDaysAhead: 60,
};
```

| `whatsappNumber` | Qué pasa |
|---|---|
| Vacío `""` (actual) | **Modo demostración:** el formulario muestra el mensaje en pantalla y no existe ningún enlace a WhatsApp. |
| Número válido | El formulario y el botón flotante abren `wa.me` con el mensaje listo. La persona debe tocar «Enviar» en WhatsApp; nada queda reservado hasta que el restaurante responda. |
| Número inválido | Se queda en modo demostración y avisa en la consola. |

Se admite escribir el número con `+`, espacios o guiones: el script los limpia.

## Validación del formulario

- **Nombre:** obligatorio, de 2 a 60 caracteres, solo letras.
- **Motivo:** obligatorio.
- **Disponibilidad de mesa:** fecha entre hoy y 60 días, que no caiga en lunes (cerrado), y de 1 a 20 personas.
- **Mensaje:** opcional, máximo 300 caracteres, con contador.

Al enviar con errores aparece un **resumen** que se anuncia a los lectores de pantalla y enlaza a cada campo; cada campo muestra además su error debajo (`aria-invalid` y `aria-describedby`).

## Privacidad

- Solo se piden los datos necesarios: nombre de pila, motivo y, si hace falta, fecha y personas. **No** se pide teléfono, correo ni apellidos.
- No se usan cookies, `localStorage` ni envíos a servidores: el mensaje se arma en el navegador.
- Las fotos (Unsplash) y las fuentes (Google Fonts) se cargan desde sus servidores, como en cualquier web que las use.

## Cómo probarla

```bash
python -m http.server 8000
# abre http://localhost:8000
```

### Pruebas manuales recomendadas
1. **Celular:** en Chrome, `F12` → `Ctrl + Shift + M`, y elige iPhone o Android.
2. **Filtros:** toca cada categoría y comprueba que el número de platos coincide con el contador.
3. **Teclado:** usa solo `Tab`, `Enter` y `Esc`. Abre el menú móvil, abre una foto de la galería, cámbiala con las flechas y ciérrala; el foco debe volver a la foto.
4. **Formulario:** envíalo vacío (debe salir el resumen de errores), prueba un nombre con números, un lunes y 25 personas.
5. **Lector de pantalla (opcional):** en Windows, `Ctrl + Win + Enter` activa Narrador; recorre el menú y el formulario.
6. **WhatsApp real:** cuando tengas el número real, ponlo en `CONFIG`, abre la página en tu celular y verifica que se abra WhatsApp con el mensaje.

## Otras personalizaciones

- **Colores:** al inicio de `styles.css`, en `:root`: `--coal` (#171717), `--cream` (#F5EFE6) y `--gold` (#C9A46A). Cada uno tiene anotado su contraste.
- **Horarios:** en `index.html`, cada fila tiene `data-open` y `data-close` (formato 24 h); déjalos vacíos para los días cerrados.
- **Mapa real:** en Google Maps, **Compartir → Insertar un mapa → Copiar HTML**, y pégalo en lugar de `<div class="map-placeholder">`, con `title="Mapa de ubicación"` y `loading="lazy"`.

## Publicar en GitHub Pages

1. Sube los cambios (`git push`) a la rama `main`.
2. En GitHub: **Settings → Pages → Branch: main / (root)**.
3. Cada vez que cambies `styles.css`, `script.js` o `menu-data.js`, sube la versión en `index.html` (`?v=3` → `?v=4`) para que los visitantes no vean la copia antigua guardada.

## Calidad comprobada (revisión final)

Probado en Chrome de escritorio, simulando anchos de pantalla y servido en la subruta `/sabor-y-brasa/` como en GitHub Pages:

- 360, 390, 768, 1024 y 1440 px: sin desplazamiento horizontal ni textos cortados.
- Controles táctiles de al menos 44 × 44 px.
- Recorrido completo con la tecla Tab en orden lógico; todos los controles muestran un contorno de foco con contraste de 9:1 a 16:1.
- Contraste de 229 textos ≥ 6,9:1. El texto sobre la foto de portada se midió píxel a píxel: ≥ 4,78:1 en el peor punto.
- Respeta «reducir movimiento»: sin desplazamiento suave, sin animaciones y con el contenido visible de inmediato.
- 21 imágenes con texto alternativo propio, tamaño reservado (`width`/`height`) y versiones por tamaño de pantalla (`srcset`); todas menos la portada cargan a medida que se hace scroll.
- Sin errores en la consola.

## Limitaciones conocidas

- **Restaurante ficticio:** no hay dirección, teléfono, correo, redes ni mapa reales. Esos datos están marcados como «Por configurar».
- **WhatsApp:** está en modo demostración hasta que se configure un número real. Aun configurado, solo **prepara** el mensaje: no envía nada automáticamente ni confirma reservas.
- **Sin servidor:** no hay base de datos, reservas en línea, pagos ni panel de administración.
- **El menú necesita JavaScript:** si está desactivado, se muestra un aviso en lugar de los platos.
- **Fotos de Unsplash:** se cargan desde su servidor; si un autor retira una foto, habría que reemplazarla. Para un cliente real conviene usar fotos propias en una carpeta `img/`.
- **Fuentes y fotos externas:** Google Fonts y Unsplash reciben la dirección IP del visitante al cargar sus archivos, como en cualquier web que los use.
- **No probado todavía:** celulares y tablets físicos, Safari en iPhone, lectores de pantalla (NVDA, VoiceOver) ni Lighthouse. Ver «Pruebas manuales recomendadas».

## Créditos

Fotografías de [Unsplash](https://unsplash.com/license) (licencia gratuita, permite uso comercial). La lista completa de autores está en el pie de página del sitio.
