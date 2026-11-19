/* =========================================================
   SABOR & BRASA — DATOS DEL MENÚ
   Este es el ÚNICO archivo que necesitas para cambiar platos, precios y fotos.
   La página construye las tarjetas y los filtros automáticamente a partir de aquí.

   CÓMO EDITAR
   - Cambiar un precio:   modifica el número de "precio" (sin el signo $). Ej.: precio: 7.5
   - Agregar un plato:    copia un bloque { ... }, pégalo dentro de la lista y cambia sus datos.
   - Quitar un plato:     borra su bloque { ... } completo (incluida la coma del final).
   - Cambiar una foto:    pon en "foto" el código de una foto de Unsplash (lo que va después de "photo-")
                          y actualiza "alt" (una descripción breve de lo que se ve en la foto).
   - Categorías válidas:  "entradas", "principales", "bebidas" o "postres".

   Los precios se muestran en dólares (USD) y son EJEMPLOS: el restaurante es ficticio.
   ========================================================= */

/* Categorías del filtro, en el orden en que aparecen.
   "id" es el valor que usan los platos; "nombre" es el texto del botón;
   "singular" es la etiqueta que se ve sobre cada plato. */
const MENU_CATEGORIES = [
  { id: "entradas",    nombre: "Entradas",    singular: "Entrada" },
  { id: "principales", nombre: "Principales", singular: "Plato principal" },
  { id: "bebidas",     nombre: "Bebidas",     singular: "Bebida" },
  { id: "postres",     nombre: "Postres",     singular: "Postre" },
];

const MENU_ITEMS = [
  /* ---------- ENTRADAS ---------- */
  {
    nombre: "Empanadas de la casa",
    categoria: "entradas",
    precio: 6.5,
    descripcion: "Tres empanadas horneadas de carne cortada a cuchillo, con salsa criolla.",
    foto: "1769254870299-338bfd99aabd",
    alt: "Empanadas doradas sobre un plato blanco",
  },
  {
    nombre: "Bruschetta de tomate",
    categoria: "entradas",
    precio: 7,
    descripcion: "Pan tostado a la brasa con tomate, albahaca, ajo y aceite de oliva.",
    foto: "1761315412730-a6f67208b78d",
    alt: "Bruschettas con tomate fresco y hierbas",
  },
  {
    nombre: "Tartar de atún y mango",
    categoria: "entradas",
    precio: 9.5,
    descripcion: "Atún fresco, mango, pepino y limón sobre tostada crocante.",
    foto: "1769830644804-0ede2ee32a62",
    alt: "Tartar de atún con mango, pepino y limón sobre una tostada",
  },

  /* ---------- PLATOS PRINCIPALES ---------- */
  {
    nombre: "Lomo a la brasa",
    categoria: "principales",
    precio: 18.9,
    descripcion: "300 g de lomo al carbón, al punto que prefieras, con ensalada fresca.",
    foto: "1588168333986-5078d3ae3976",
    alt: "Corte de carne sellado, rosado por dentro, sobre hojas verdes",
  },
  {
    nombre: "Costillas BBQ",
    categoria: "principales",
    precio: 16.5,
    descripcion: "Costillas de cerdo glaseadas con salsa barbacoa casera y encurtidos.",
    foto: "1761712826171-609bcf1d02af",
    alt: "Costillas a la barbacoa con encurtidos y salsa",
  },
  {
    nombre: "Pollo a la brasa",
    categoria: "principales",
    precio: 13.9,
    descripcion: "Medio pollo marinado en hierbas, con vegetales asados y pan casero.",
    foto: "1777891258069-454e66f8bedc",
    alt: "Pollo a la parrilla con vegetales y pan plano",
  },
  {
    nombre: "Parrillada para compartir",
    categoria: "principales",
    precio: 32,
    descripcion: "Tabla para dos con lomo, chorizo, pollo y costillas, más dos acompañantes.",
    foto: "1529193591184-b1d58069ecdd",
    alt: "Tabla con variedad de carnes a la parrilla",
  },

  /* ---------- BEBIDAS ---------- */
  {
    nombre: "Limonada de la casa",
    categoria: "bebidas",
    precio: 3.5,
    descripcion: "Limón recién exprimido, hierbabuena y un toque de miel.",
    foto: "1623084921164-4a8c5c37a912",
    alt: "Vaso de limonada con rodajas de limón",
  },
  {
    nombre: "Copa de vino tinto",
    categoria: "bebidas",
    precio: 6,
    descripcion: "Selección de la casa, ideal para acompañar carnes rojas.",
    foto: "1553361371-9b22f78e8b1d",
    alt: "Vino tinto sirviéndose en una copa",
  },
  {
    nombre: "Capuchino",
    categoria: "bebidas",
    precio: 2.8,
    descripcion: "Café de altura con leche texturizada, perfecto para el postre.",
    foto: "1762402519375-a29d7971a761",
    alt: "Capuchino con arte latte visto de cerca",
  },

  /* ---------- POSTRES ---------- */
  {
    nombre: "Torta de chocolate",
    categoria: "postres",
    precio: 5.5,
    descripcion: "Bizcocho húmedo de cacao con crema batida y cereza.",
    foto: "1768260732302-12822bd6427b",
    alt: "Porción de torta de chocolate con crema y cereza",
  },
  {
    nombre: "Cheesecake de arándanos",
    categoria: "postres",
    precio: 5,
    descripcion: "Cremoso, horneado lentamente y cubierto con arándanos frescos.",
    foto: "1695088957420-c3b97d1f1138",
    alt: "Porción de cheesecake con arándanos",
  },
  {
    nombre: "Flan de caramelo",
    categoria: "postres",
    precio: 4.5,
    descripcion: "Receta casera con caramelo oscuro.",
    foto: "1792860462957-11334eabf81c",
    alt: "Flan pequeño con salsa de caramelo en un plato blanco",
  },
];
