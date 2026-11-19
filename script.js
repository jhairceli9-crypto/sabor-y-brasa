/* =========================================================
   SABOR & BRASA — Interacciones
   Funciona 100 % en el navegador (sin servidor), ideal para GitHub Pages.
   No guarda datos personales: no usa cookies, localStorage ni envíos a servidores.

   Índice
   0. Configuración y utilidades       5. Galería con visor accesible
   1. Menú digital (desde menu-data.js) 6. Horarios
   2. Menú móvil accesible              7. WhatsApp (configurable)
   3. Encabezado y enlace activo        8. Formulario: validación y mensaje
   4. Animaciones de aparición          9. Botones "Consultar" y año del pie
   ========================================================= */

/* ===================== 0. CONFIGURACIÓN ===================== */
/* whatsappNumber: número REAL del restaurante en formato internacional.
   Puedes escribirlo con +, espacios o guiones: el script los limpia.
   Formato esperado: código de país + número (entre 8 y 15 dígitos en total).
   Mientras esté vacío o sea inválido, el sitio funciona en MODO DEMOSTRACIÓN:
   muestra el mensaje en pantalla y NO crea ningún enlace a WhatsApp. */
const CONFIG = {
  whatsappNumber: "",
  restaurantName: "Sabor & Brasa",
  timeZone: "America/Guayaquil", // zona horaria del restaurante (horario, "hoy" y fechas)
  maxDaysAhead: 60,              // con cuántos días de anticipación se puede consultar una mesa
};

/**
 * Limpia y valida el número de WhatsApp de CONFIG.
 * @returns {string|null} solo dígitos si es válido; null si falta o es inválido.
 */
let warnedInvalidNumber = false; // para avisar una sola vez en la consola
const getWhatsAppNumber = () => {
  const digits = String(CONFIG.whatsappNumber || "").replace(/[\s+\-().]/g, "");
  if (!digits) return null;                         // vacío: modo demostración
  if (!/^\d{8,15}$/.test(digits)) {
    if (!warnedInvalidNumber) console.warn("[Sabor & Brasa] CONFIG.whatsappNumber no es válido; se usa el modo demostración.");
    warnedInvalidNumber = true;
    return null;
  }
  return digits;
};

/**
 * Crea el enlace oficial de WhatsApp (wa.me) con un texto ya escrito.
 * Devuelve null si no hay número válido: así nunca se abre un enlace inválido.
 */
const buildWhatsAppUrl = (text) => {
  const number = getWhatsAppNumber();
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : null;
};

/**
 * Fecha y hora actuales EN LA ZONA DEL RESTAURANTE (no la del visitante).
 * Así alguien que abre la web desde otro país ve el estado correcto.
 */
const restaurantNow = () => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: CONFIG.timeZone, hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short",
    }).formatToParts(new Date()).map((p) => [p.type, p.value])
  );
  const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    iso: `${parts.year}-${parts.month}-${parts.day}`, // ej. 2026-11-18
    year: Number(parts.year),
    weekday: days[parts.weekday],                       // 0 = domingo … 6 = sábado
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
};

/* Utilidades de fechas "de calendario" (AAAA-MM-DD), sin depender de la zona del visitante */
const isoToUTC = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const addDaysISO = (iso, days) => { const d = isoToUTC(iso); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); };
const weekdayOfISO = (iso) => isoToUTC(iso).getUTCDay();
const formatDateES = (iso) =>
  isoToUTC(iso).toLocaleDateString("es-EC", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" });

/* Formato de precio en dólares: 6.5 → "$6.50" */
const formatUSD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format;

/* Dirección optimizada de una foto de Unsplash en el ancho pedido (proporción 4:3) */
const photoUrl = (id, width) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${Math.round(width * 0.75)}&q=60`;

/* Atajo para crear elementos con clase y texto (el texto nunca se interpreta como HTML) */
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

document.addEventListener("DOMContentLoaded", () => {
  const now = restaurantNow();

  /* ===================== 1. MENÚ DIGITAL ===================== */
  const menuGrid = document.getElementById("menuGrid");
  const filtersBox = document.getElementById("menuFilters");
  const filterStatus = document.getElementById("filterStatus");

  /**
   * Revisa los datos de menu-data.js y avisa en la consola (F12) si algo está mal escrito.
   * Los platos con errores no se muestran, para no romper la página.
   */
  const validateMenuData = () => {
    if (typeof MENU_ITEMS === "undefined" || typeof MENU_CATEGORIES === "undefined") {
      console.error("[Sabor & Brasa] No se encontró menu-data.js. Revisa que esté en la carpeta y enlazado en index.html.");
      return [];
    }
    const validCats = new Set(MENU_CATEGORIES.map((c) => c.id));
    return MENU_ITEMS.filter((item, i) => {
      const problems = [];
      if (!item.nombre) problems.push("falta el nombre");
      if (!validCats.has(item.categoria)) problems.push(`categoría "${item.categoria}" no existe`);
      if (typeof item.precio !== "number" || !(item.precio >= 0)) problems.push("el precio debe ser un número, sin $");
      if (!item.foto) problems.push("falta la foto");
      if (!item.alt) problems.push("falta el texto alternativo (alt)");
      if (problems.length) console.warn(`[Sabor & Brasa] Plato #${i + 1} (${item.nombre || "sin nombre"}): ${problems.join(", ")}.`);
      return problems.length === 0;
    });
  };
  const menuItems = validateMenuData();
  const catLabel = Object.fromEntries((typeof MENU_CATEGORIES !== "undefined" ? MENU_CATEGORIES : []).map((c) => [c.id, c.singular]));

  /** Crea la tarjeta de un plato a partir de sus datos. */
  const createDishCard = (item) => {
    const card = el("article", "dish reveal");
    card.dataset.category = item.categoria;

    const img = el("img", "dish__img");
    img.src = photoUrl(item.foto, 600);
    img.srcset = [400, 600, 800].map((w) => `${photoUrl(item.foto, w)} ${w}w`).join(", ");
    img.sizes = "(max-width: 600px) 92vw, (max-width: 1024px) 46vw, 370px";
    img.width = 800; img.height = 600; // reserva el espacio: la página no "salta" al cargar
    img.alt = item.alt;
    img.loading = "lazy"; img.decoding = "async";

    const body = el("div", "dish__body");
    const head = el("div", "dish__head");
    const price = el("p", "dish__price");
    price.append(el("span", "sr-only", "Precio de ejemplo: "), formatUSD(item.precio));
    head.append(el("h3", "dish__name", item.nombre), price);

    // Botón visible "Consultar"; el lector de pantalla escucha "Consultar sobre <plato>"
    const ask = el("button", "dish__ask", "Consultar");
    ask.type = "button";
    ask.dataset.dish = item.nombre;
    ask.append(el("span", "sr-only", ` sobre ${item.nombre}`));

    body.append(el("span", "dish__cat", catLabel[item.categoria]), head, el("p", "dish__desc", item.descripcion || ""), ask);
    card.append(img, body);
    return card;
  };

  /** Crea los botones de filtro (con su contador) a partir de MENU_CATEGORIES. */
  const renderFilters = () => {
    const count = (cat) => menuItems.filter((it) => cat === "todos" || it.categoria === cat).length;
    const cats = [{ id: "todos", nombre: "Todos" }, ...(typeof MENU_CATEGORIES !== "undefined" ? MENU_CATEGORIES : [])];
    cats.forEach((cat) => {
      const btn = el("button", "filter", cat.nombre + " ");
      btn.type = "button";
      btn.dataset.filter = cat.id;
      btn.setAttribute("aria-pressed", String(cat.id === "todos"));
      btn.classList.toggle("is-active", cat.id === "todos");
      btn.append(el("span", "filter__count", String(count(cat.id))));
      filtersBox.append(btn);
    });
  };

  /**
   * Muestra solo los platos de una categoría ("todos" = todos).
   * Anuncia el resultado a los lectores de pantalla y muestra un aviso si no hay platos.
   */
  const applyFilter = (cat) => {
    filtersBox.querySelectorAll(".filter").forEach((b) => {
      const active = b.dataset.filter === cat;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    let visible = 0;
    menuGrid.querySelectorAll(".dish").forEach((card) => {
      const show = cat === "todos" || card.dataset.category === cat;
      card.hidden = !show;
      if (show) { card.classList.add("is-visible"); visible++; }
    });
    menuGrid.querySelector(".menu-empty")?.remove();
    if (!visible) menuGrid.append(el("p", "menu-empty", "Por ahora no hay platos en esta categoría."));
    filterStatus.textContent = `Mostrando ${visible} ${visible === 1 ? "plato" : "platos"}.`;
  };

  renderFilters();
  menuGrid.append(...menuItems.map(createDishCard));
  filtersBox.addEventListener("click", (e) => { // un solo "escuchador" para todos los botones
    const btn = e.target.closest(".filter");
    if (btn) applyFilter(btn.dataset.filter);
  });

  /* ===================== 2. MENÚ MÓVIL ACCESIBLE ===================== */
  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const navItems = nav.querySelectorAll("a");
  const mobileQuery = window.matchMedia("(max-width: 1024px)"); // igual que en styles.css

  const backdrop = el("div", "nav-backdrop");
  document.body.append(backdrop);

  const isMenuOpen = () => nav.classList.contains("is-open");
  /* "inert" bloquea el menú cerrado en móviles: no recibe foco con Tab ni lo leen los lectores de pantalla */
  const syncInert = () => { nav.inert = mobileQuery.matches && !isMenuOpen(); };
  syncInert();

  /** Abre o cierra el menú; al abrir lleva el foco al primer enlace, al cerrar con teclado lo devuelve al botón. */
  const setMenu = (open, returnFocus = false) => {
    // El panel empieza justo debajo del encabezado, para que el botón ✕ no tape el primer enlace
    if (open) nav.style.setProperty("--nav-top", `${Math.round(header.getBoundingClientRect().bottom)}px`);
    nav.classList.toggle("is-open", open);
    syncInert();
    backdrop.classList.toggle("is-visible", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (open) navItems[0].focus();
    else if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => setMenu(!isMenuOpen()));
  backdrop.addEventListener("click", () => setMenu(false));
  navItems.forEach((a) => a.addEventListener("click", () => setMenu(false)));
  mobileQuery.addEventListener("change", (e) => { if (!e.matches) setMenu(false); else syncInert(); });

  document.addEventListener("keydown", (e) => {
    if (!isMenuOpen()) return;
    if (e.key === "Escape") setMenu(false, true);
    if (e.key === "Tab") { // mantiene el foco dentro del menú abierto
      const items = [toggle, ...navItems];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ===================== 3. ENCABEZADO Y ENLACE ACTIVO ===================== */
  const navLinks = [...document.querySelectorAll(".nav__link")];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  /**
   * Marca en el menú la sección que se está viendo.
   * Usa la posición de cada sección; al llegar al final de la página marca la última (Contacto).
   */
  const updateActiveLink = () => {
    const line = header.offsetHeight + window.innerHeight * 0.3; // "línea de lectura" bajo el encabezado
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    let current = null;
    sections.forEach((s) => { if (s.getBoundingClientRect().top <= line) current = s; });
    if (atBottom) current = sections[sections.length - 1];
    navLinks.forEach((a) => {
      const active = current && a.getAttribute("href") === `#${current.id}`;
      a.classList.toggle("is-active", Boolean(active));
      if (active) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  };

  let ticking = false;
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
    updateActiveLink();
    ticking = false;
  };
  onScroll();
  window.addEventListener("scroll", () => { // como máximo un cálculo por fotograma
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ===================== 4. ANIMACIONES DE APARICIÓN ===================== */
  const revealItems = document.querySelectorAll(".reveal");
  revealItems.forEach((item) => { // pequeño escalonado entre elementos hermanos
    const siblings = [...item.parentElement.children].filter((c) => c.classList.contains("reveal"));
    item.style.transitionDelay = `${Math.min(siblings.indexOf(item), 3) * 80}ms`;
  });
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));

  /* ===================== 5. GALERÍA CON VISOR ACCESIBLE ===================== */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCaption = document.getElementById("lightboxCaption");
  const lbClose = document.getElementById("lightboxClose");
  const galleryBtns = [...document.querySelectorAll(".gallery__btn")];
  let current = 0, lastTrigger = null;

  /** Muestra la foto número i en el visor (da la vuelta al pasar de la última a la primera). */
  const showPhoto = (i) => {
    current = (i + galleryBtns.length) % galleryBtns.length;
    const btn = galleryBtns[current];
    const thumb = btn.querySelector("img");
    lbImg.src = btn.dataset.full;
    lbImg.alt = thumb.alt;
    lbCaption.textContent = `${thumb.alt} (${current + 1} de ${galleryBtns.length})`; // aria-live lo anuncia
  };

  galleryBtns.forEach((btn, i) => {
    btn.setAttribute("aria-label", `Ampliar foto ${i + 1} de ${galleryBtns.length}: ${btn.querySelector("img").alt}`);
    btn.setAttribute("aria-haspopup", "dialog");
    btn.addEventListener("click", () => { // Enter y Espacio también disparan "click" en un botón
      lastTrigger = btn;
      showPhoto(i);
      lightbox.showModal(); // <dialog> nativo: atrapa el foco y se cierra con Esc
      lbClose.focus();
    });
  });
  lbClose.addEventListener("click", () => lightbox.close());
  document.getElementById("lightboxPrev").addEventListener("click", () => showPhoto(current - 1));
  document.getElementById("lightboxNext").addEventListener("click", () => showPhoto(current + 1));

  // Atajos de teclado dentro del visor
  lightbox.addEventListener("keydown", (e) => {
    const keys = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: galleryBtns.length - 1 };
    if (e.key in keys) { e.preventDefault(); showPhoto(keys[e.key]); }
  });
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); }); // clic fuera de la foto
  lightbox.addEventListener("close", () => { lastTrigger?.focus(); }); // el foco vuelve a la miniatura

  /* ===================== 6. HORARIOS ===================== */
  const rows = [...document.querySelectorAll(".hours__table tr[data-day]")];
  const hoursStatus = document.getElementById("hoursStatus");
  const toMinutes = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

  /** ¿El restaurante cierra ese día de la semana? (0 = domingo … 6 = sábado), según la tabla. */
  const isClosedDay = (weekday) => {
    const row = rows.find((r) => Number(r.dataset.day) === weekday);
    return row ? !row.dataset.open : false;
  };

  /** Resalta el día de hoy y calcula si, con el horario de ejemplo, el local estaría abierto. */
  const renderHoursStatus = () => {
    const todayRow = rows.find((r) => Number(r.dataset.day) === now.weekday);
    if (!todayRow) return;
    todayRow.classList.add("is-today");
    const { open, close } = todayRow.dataset;
    const isOpen = Boolean(open) && now.minutes >= toMinutes(open) && now.minutes < toMinutes(close);
    hoursStatus.classList.add(isOpen ? "is-open" : "is-closed");
    hoursStatus.textContent = isOpen
      ? `Ejemplo: con este horario, el local estaría abierto ahora (hasta las ${close}).`
      : "Ejemplo: con este horario, el local estaría cerrado ahora.";
  };
  renderHoursStatus();

  /* ===================== 7. WHATSAPP (CONFIGURABLE) ===================== */
  const waNumber = getWhatsAppNumber();
  const waState = document.getElementById("waState");
  const waFloat = document.getElementById("waFloat");

  if (waNumber) {
    // Número válido: el botón flotante abre WhatsApp con un saludo
    waState.textContent = "Disponible";
    waState.classList.add("is-ready");
    waFloat.href = buildWhatsAppUrl(`Hola ${CONFIG.restaurantName}, quisiera hacer una consulta.`);
    waFloat.target = "_blank";
    waFloat.rel = "noopener";
    waFloat.setAttribute("aria-label", "Escribir por WhatsApp (se abre en una pestaña nueva)");
  }
  // Sin número: el botón flotante sigue llevando al formulario (#contacto) y no existe ningún enlace wa.me.

  /* ===================== 8. FORMULARIO: VALIDACIÓN Y MENSAJE ===================== */
  const form = document.getElementById("waForm");
  const nombre = document.getElementById("nombre");
  const tipo = document.getElementById("tipo");
  const reservaFields = document.getElementById("reservaFields");
  const fecha = document.getElementById("fecha");
  const personas = document.getElementById("personas");
  const mensaje = document.getElementById("mensaje");
  const counter = document.getElementById("mensaje-count");
  const result = document.getElementById("waResult");
  const summary = document.getElementById("formSummary");

  /** Actualiza el rango permitido del calendario: desde hoy hasta CONFIG.maxDaysAhead días. */
  const refreshDateRange = () => {
    const today = restaurantNow().iso;
    fecha.min = today;
    fecha.max = addDaysISO(today, CONFIG.maxDaysAhead);
  };
  refreshDateRange();
  fecha.addEventListener("focus", refreshDateRange); // por si la página quedó abierta después de medianoche

  /** Los campos de fecha y personas solo aparecen (y solo son obligatorios) al consultar una mesa. */
  const syncReserva = () => {
    const isReserva = tipo.value === "reserva";
    reservaFields.hidden = !isReserva;
    fecha.required = isReserva;
    personas.required = isReserva;
  };
  tipo.addEventListener("change", syncReserva);
  syncReserva();

  const updateCounter = () => { counter.textContent = `${mensaje.value.length} / ${mensaje.maxLength}`; };
  mensaje.addEventListener("input", updateCounter);

  /* Reglas de validación: cada una devuelve "" si está bien, o el mensaje de error en lenguaje claro. */
  const validators = {
    nombre: (v) => {
      const t = v.trim();
      if (!t) return "Escribe tu nombre.";
      if (t.length < 2) return "El nombre debe tener al menos 2 letras.";
      if (!/^[\p{L}][\p{L}\s'’.-]*$/u.test(t)) return "Usa solo letras en el nombre (sin números ni símbolos).";
      return "";
    },
    tipo: (v) => (v ? "" : "Elige qué necesitas."),
    fecha: (v) => {
      if (!v) return "Elige una fecha.";
      if (v < fecha.min) return "La fecha no puede ser anterior a hoy.";
      if (v > fecha.max) return `Elige una fecha dentro de los próximos ${CONFIG.maxDaysAhead} días.`;
      if (isClosedDay(weekdayOfISO(v))) return "Ese día el restaurante estaría cerrado (horario de ejemplo). Elige otro día.";
      return "";
    },
    personas: (v) => {
      const n = Number(v);
      if (!v) return "Indica para cuántas personas.";
      if (!Number.isInteger(n) || n < 1 || n > 20) return "Indica un número entero entre 1 y 20.";
      return "";
    },
  };
  const fieldLabels = { nombre: "Tu nombre", tipo: "¿Qué necesitas?", fecha: "Fecha", personas: "Personas" };

  /** Muestra u oculta el error de un campo (texto rojo, borde y aria-invalid para lectores de pantalla). */
  const setError = (input, msg) => {
    const field = input.closest(".form__field");
    field.classList.toggle("has-error", Boolean(msg));
    field.querySelector(".form__error").textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return msg;
  };
  const validateField = (input) => setError(input, validators[input.name](input.value));

  /** Campos que hay que revisar ahora (fecha y personas solo si se consulta una mesa). */
  const activeFields = () => [nombre, tipo, ...(tipo.value === "reserva" ? [fecha, personas] : [])];

  /**
   * Muestra el resumen de errores arriba del formulario, con un enlace a cada campo.
   * Tiene role="alert": los lectores de pantalla lo leen en cuanto aparece.
   */
  const showSummary = (errors) => {
    summary.replaceChildren();
    if (!errors.length) { summary.hidden = true; return; }
    summary.append(el("strong", "", errors.length === 1 ? "Revisa 1 campo:" : `Revisa ${errors.length} campos:`));
    const list = el("ul");
    errors.forEach(({ input, msg }) => {
      const link = el("a", "", `${fieldLabels[input.name]}: ${msg}`);
      link.href = `#${input.id}`;
      link.addEventListener("click", (e) => { e.preventDefault(); input.focus(); });
      const li = el("li"); li.append(link); list.append(li);
    });
    summary.append(list);
    summary.hidden = false;
  };

  // Valida al salir del campo (si ya se escribió algo) y corrige el error mientras se escribe
  [nombre, tipo, fecha, personas].forEach((input) => {
    input.addEventListener("blur", () => { if (input.value) validateField(input); });
    const evt = input.tagName === "SELECT" || input.type === "date" ? "change" : "input";
    input.addEventListener(evt, () => { if (input.getAttribute("aria-invalid") === "true") validateField(input); });
  });

  /** Arma el texto del mensaje con lo que la persona escribió (solo los datos necesarios). */
  const buildMessage = () => {
    const lines = [`Hola ${CONFIG.restaurantName}, soy ${nombre.value.trim()}.`, `Motivo: ${tipo.options[tipo.selectedIndex].text}`];
    if (tipo.value === "reserva") lines.push(`Fecha: ${formatDateES(fecha.value)}`, `Personas: ${personas.value}`);
    if (mensaje.value.trim()) lines.push(`Mensaje: ${mensaje.value.trim()}`);
    return lines.join("\n");
  };

  /** Muestra el resultado del formulario (sin HTML: todo con textContent). */
  const showResult = (title, ...content) => {
    result.replaceChildren(el("strong", "", title), ...content);
    result.hidden = false;
    result.focus();
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // nunca se envía a un servidor: no existe ninguno
    refreshDateRange();

    const errors = activeFields()
      .map((input) => ({ input, msg: validateField(input) }))
      .filter((x) => x.msg);
    showSummary(errors);
    if (errors.length) {
      result.hidden = true;
      summary.focus(); // el resumen se lee primero; desde ahí se salta a cada campo
      return;
    }

    const text = buildMessage();
    const url = buildWhatsAppUrl(text);

    if (url) {
      // MODO REAL: abre WhatsApp con el texto listo. NO se envía nada hasta que la persona toque "Enviar".
      window.open(url, "_blank", "noopener");
      showResult(
        "Se abrió WhatsApp con tu mensaje",
        el("p", "", "Todavía no está enviado: revísalo y toca «Enviar» en WhatsApp. Tu consulta queda confirmada solo cuando el restaurante te responda."),
        el("p", "", "Si no se abrió, permite las ventanas emergentes en tu navegador.")
      );
    } else {
      // MODO DEMOSTRACIÓN: no hay número válido → no se crea ningún enlace, solo se muestra el texto
      const note = el("p", "", "No se envió ni se reservó nada. Para activarlo, el dueño del sitio debe escribir el número real en ");
      note.append(el("code", "", "CONFIG.whatsappNumber"), " (archivo script.js).");
      showResult("Modo demostración: este es el mensaje que se prepararía", el("pre", "", text), note);
    }
  });

  /* ===================== 9. BOTONES "CONSULTAR" Y AÑO DEL PIE ===================== */
  /** Al tocar "Consultar" en un plato: elige "Preguntar por un plato", escribe el nombre y lleva al formulario. */
  menuGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".dish__ask");
    if (!btn) return;
    tipo.value = "menu";
    syncReserva();
    setError(tipo, "");
    mensaje.value = `Quisiera información sobre: ${btn.dataset.dish}.`;
    updateCounter();
    document.getElementById("contacto").scrollIntoView();
    nombre.focus({ preventScroll: true });
  });

  document.getElementById("year").textContent = now.year;
});
