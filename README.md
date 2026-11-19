# Sabor & Brasa — Sitio web de demostración para restaurante

Página web de un restaurante **ficticio** a la parrilla, creada como proyecto de portafolio y como ejemplo para futuros clientes.

> **Aviso:** el restaurante, su historia, precios y horarios son **de ejemplo**. No hay reseñas, premios, teléfonos, direcciones ni correos inventados: esos datos quedan marcados como «Por configurar». El sitio se identifica como demostración en la barra superior, en la etiqueta **DEMO** del encabezado (siempre visible) y en el pie de página.

## Funciones

| Sección | Qué hace |
|---|---|
| Encabezado | Fijo al hacer scroll. En pantallas ≤ 1024 px se convierte en menú lateral accesible (foco dentro del menú, cierre con `Esc`). |
| Inicio | Foto principal optimizada, título y botones «Ver el menú» y «Reservar una mesa». |
| Nosotros | Historia ficticia, marcada como demostración. |
| Menú | 13 platos con foto, descripción y precio (USD de ejemplo). |
| Categorías | Filtro: Todos, Entradas, Principales, Bebidas y Postres, con contador automático. |
| Galería | 6 fotos; al tocarlas se abren en grande (flechas ← → y `Esc`). |
| Horarios | Tabla de ejemplo; resalta el día de hoy e indica si estaría abierto, usando la **hora de Ecuador** (no la del visitante). |
| Ubicación | Espacio preparado para pegar el mapa real de Google Maps. |
| Contacto | Formulario que valida los datos y arma un mensaje de WhatsApp. |

**Validaciones del formulario:** nombre obligatorio; en reservas, la fecha no puede ser pasada ni caer en día cerrado, y se aceptan de 1 a 20 personas.

## Tecnologías

HTML5, CSS3 y JavaScript puro, sin frameworks ni dependencias. Fuentes *Cormorant Garamond* e *Inter* (Google Fonts). Fotos de Unsplash.

## Estructura

```
├── index.html   → contenido: secciones, platos, fotos y textos
├── styles.css   → diseño: colores, tipografía, animaciones y responsive
├── script.js    → interacciones: menú, filtro, galería, horarios y WhatsApp
├── README.md    → este archivo
└── .nojekyll    → indica a GitHub Pages que publique los archivos tal cual
```

## Cómo probarla

**Opción rápida:** haz doble clic en `index.html`.

**Opción recomendada (servidor local):**
```bash
python -m http.server 8000
# abre http://localhost:8000
```

**En formato celular:** en Chrome presiona `F12` y luego `Ctrl + Shift + M`, y elige un dispositivo (por ejemplo, iPhone 12 Pro).

## Personalización

### Activar WhatsApp
En `script.js`, al inicio:
```js
const CONFIG = {
  whatsappNumber: "",   // ← número real: solo dígitos, con código de país, sin + ni espacios
  restaurantName: "Sabor & Brasa",
  timeZone: "America/Guayaquil", // zona horaria del restaurante
};
```
Mientras esté vacío, la página funciona en **modo demostración**: muestra el mensaje en pantalla en vez de abrir WhatsApp.

### Cambiar un precio o un plato
En `index.html`, busca el plato (por ejemplo «Lomo a la brasa») y edita:
- `<h3 class="dish__name">` → nombre
- `<p class="dish__price">` → precio
- `<p class="dish__desc">` → descripción
- `data-dish="..."` del botón y el texto oculto `<span class="sr-only"> sobre …</span>` → el mismo nombre del plato (así cada botón tiene un nombre único para lectores de pantalla)

### Agregar un plato
Copia un bloque `<article class="dish">…</article>` completo y cambia `data-category` (`entradas`, `principales`, `bebidas` o `postres`). El contador del filtro se actualiza solo.

### Cambiar una fotografía
Cada foto usa una dirección de Unsplash como:
```
https://images.unsplash.com/photo-XXXXXXXX?auto=format&fit=crop&w=600&h=450&q=60
```
- Reemplaza `photo-XXXXXXXX` por el identificador de la nueva foto, en `src` **y** en `srcset`.
- Actualiza el texto `alt` (describe la foto) y agrega el crédito en el pie de página.
- Para usar fotos propias: guárdalas en una carpeta `img/` (formato `.webp`, máximo unos 200 KB) y usa `src="img/mi-foto.webp"`.

### Colores
Al inicio de `styles.css`, en `:root`: `--coal` (#171717, negro carbón), `--cream` (#F5EFE6, crema) y `--gold` (#C9A46A, dorado). Junto a cada color está anotado su contraste.

### Horarios
En `index.html`, cada fila tiene `data-open` y `data-close` en formato 24 h. Deja ambos vacíos (`""`) para los días cerrados. Cambia también el texto visible de la fila.

### Mapa real
En Google Maps: **Compartir → Insertar un mapa → Copiar HTML**, y pégalo en lugar de `<div class="map-placeholder">`, agregando `title="Mapa de ubicación"` y `loading="lazy"`.

## Publicar en GitHub Pages

1. Crear el repositorio y subir los archivos (`git push`).
2. En GitHub: **Settings → Pages → Branch: main / (root)**.
3. Cada vez que cambies `styles.css` o `script.js`, sube la versión en `index.html` (`?v=2` → `?v=3`) para que los visitantes no vean la copia antigua guardada.

## Créditos

Fotografías de [Unsplash](https://unsplash.com/license) (licencia gratuita, permite uso comercial). La lista completa de autores está en el pie de página del sitio.
