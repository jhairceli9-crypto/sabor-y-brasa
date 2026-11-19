/* =========================================================
   SABOR & BRASA — Interacciones
   ========================================================= */

/* ---------------------------------------------------------
   CONFIGURACIÓN (lo único que necesitas editar)
   whatsappNumber: número del restaurante en formato internacional,
   SOLO dígitos, sin "+", espacios ni guiones.
   Ejemplo de formato para Ecuador: código 593 + número sin el 0 inicial.
   Mientras esté vacío (""), el sitio funciona en MODO DEMOSTRACIÓN:
   muestra el mensaje en pantalla y no abre WhatsApp.
   --------------------------------------------------------- */
const CONFIG = {
  whatsappNumber: "",
  restaurantName: "Sabor & Brasa",
};

document.addEventListener("DOMContentLoaded", () => {
  const waReady = /^\d{8,15}$/.test(CONFIG.whatsappNumber);

  /* ===================== 1. Menú móvil accesible ===================== */
  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const navLinks = nav.querySelectorAll("a");
  const mobileQuery = window.matchMedia("(max-width: 1024px)"); // igual que en styles.css

  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  document.body.appendChild(backdrop);

  const isMenuOpen = () => nav.classList.contains("is-open");
  // "inert" bloquea el menú cerrado en móviles: no recibe foco con Tab ni lo leen los lectores de pantalla
  const syncInert = () => { nav.inert = mobileQuery.matches && !isMenuOpen(); };
  syncInert();

  const setMenu = (open, returnFocus = false) => {
    nav.classList.toggle("is-open", open);
    syncInert();
    backdrop.classList.toggle("is-visible", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (open) navLinks[0].focus();      // el foco entra al menú
    else if (returnFocus) toggle.focus();                 // y vuelve al botón al cerrar
  };

  toggle.addEventListener("click", () => setMenu(!isMenuOpen()));
  backdrop.addEventListener("click", () => setMenu(false));
  navLinks.forEach((a) => a.addEventListener("click", () => setMenu(false)));
  mobileQuery.addEventListener("change", (e) => { if (!e.matches) setMenu(false); else syncInert(); });

  document.addEventListener("keydown", (e) => {
    if (!isMenuOpen()) return;
    if (e.key === "Escape") setMenu(false, true);
    if (e.key === "Tab") { // mantiene el foco dentro del menú abierto
      const items = [toggle, ...navLinks];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ===================== 2. Encabezado al hacer scroll ===================== */
  let ticking = false;
  const onScroll = () => { header.classList.toggle("is-scrolled", window.scrollY > 40); ticking = false; };
  onScroll();
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ===================== 3. Enlace activo según la sección visible ===================== */
  const menuLinks = document.querySelectorAll(".nav__link");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      menuLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "true"); else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

  /* ===================== 4. Aparición suave al hacer scroll ===================== */
  const revealItems = document.querySelectorAll(".reveal");
  revealItems.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 3) * 80}ms`;
  });
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealItems.forEach((el) => revealObserver.observe(el));

  /* ===================== 5. Filtro del menú por categoría ===================== */
  const dishes = document.querySelectorAll(".dish");
  const filterButtons = document.querySelectorAll(".filter");
  const filterStatus = document.getElementById("filterStatus");

  // Cuenta automáticamente cuántos platos hay en cada categoría
  const countBy = (cat) => [...dishes].filter((d) => cat === "todos" || d.dataset.category === cat).length;
  document.querySelectorAll("[data-count-for]").forEach((el) => { el.textContent = countBy(el.dataset.countFor); });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter;
      filterButtons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      dishes.forEach((d) => {
        const show = cat === "todos" || d.dataset.category === cat;
        d.hidden = !show;
        if (show) d.classList.add("is-visible");
      });
      const n = countBy(cat);
      filterStatus.textContent = `Mostrando ${n} ${n === 1 ? "plato" : "platos"}.`;
    });
  });

  /* ===================== 6. Horarios: resalta hoy y calcula si está abierto ===================== */
  const rows = document.querySelectorAll(".hours__table tr[data-day]");
  const status = document.getElementById("hoursStatus");
  const toMinutes = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const now = new Date();
  const todayRow = [...rows].find((r) => Number(r.dataset.day) === now.getDay());
  if (todayRow) {
    todayRow.classList.add("is-today");
    const { open, close } = todayRow.dataset;
    const mins = now.getHours() * 60 + now.getMinutes();
    const isOpen = open && mins >= toMinutes(open) && mins < toMinutes(close);
    status.classList.add(isOpen ? "is-open" : "is-closed");
    status.textContent = isOpen
      ? `Según el horario de ejemplo, ahora estaría abierto (hasta las ${close}).`
      : "Según el horario de ejemplo, ahora estaría cerrado.";
  }
  const isClosedDay = (weekday) => {
    const row = [...rows].find((r) => Number(r.dataset.day) === weekday);
    return row ? !row.dataset.open : false;
  };

  /* ===================== 7. Galería con visor (lightbox) ===================== */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCaption = document.getElementById("lightboxCaption");
  const galleryBtns = [...document.querySelectorAll(".gallery__btn")];
  let current = 0, lastTrigger = null;

  const showPhoto = (i) => {
    current = (i + galleryBtns.length) % galleryBtns.length; // da la vuelta al llegar al final
    const btn = galleryBtns[current];
    const thumb = btn.querySelector("img");
    lbImg.src = btn.dataset.full;
    lbImg.alt = thumb.alt;
    lbCaption.textContent = `${thumb.alt} (${current + 1} de ${galleryBtns.length})`;
  };

  galleryBtns.forEach((btn, i) => {
    btn.setAttribute("aria-label", `Ampliar foto: ${btn.querySelector("img").alt}`);
    btn.addEventListener("click", () => {
      lastTrigger = btn;
      showPhoto(i);
      lightbox.showModal(); // <dialog> nativo: atrapa el foco y se cierra con Esc
    });
  });
  document.getElementById("lightboxClose").addEventListener("click", () => lightbox.close());
  document.getElementById("lightboxPrev").addEventListener("click", () => showPhoto(current - 1));
  document.getElementById("lightboxNext").addEventListener("click", () => showPhoto(current + 1));
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showPhoto(current - 1);
    if (e.key === "ArrowRight") showPhoto(current + 1);
  });
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); }); // clic fuera de la foto
  lightbox.addEventListener("close", () => { if (lastTrigger) lastTrigger.focus(); });

  /* ===================== 8. Formulario de consulta por WhatsApp ===================== */
  const form = document.getElementById("waForm");
  const tipo = document.getElementById("tipo");
  const reservaFields = document.getElementById("reservaFields");
  const fecha = document.getElementById("fecha");
  const personas = document.getElementById("personas");
  const mensaje = document.getElementById("mensaje");
  const counter = document.getElementById("mensaje-count");
  const result = document.getElementById("waResult");

  // Estado del canal WhatsApp en la sección de contacto
  const waState = document.getElementById("waState");
  if (waReady) { waState.textContent = "Disponible"; waState.classList.add("is-ready"); }

  // Fecha mínima = hoy (en la zona horaria del visitante)
  const pad = (n) => String(n).padStart(2, "0");
  const todayISO = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  fecha.min = todayISO;

  // Los campos de reserva solo aparecen (y solo son obligatorios) al elegir "Reservar una mesa"
  const syncReserva = () => {
    const isReserva = tipo.value === "reserva";
    reservaFields.hidden = !isReserva;
    fecha.required = isReserva;
    personas.required = isReserva;
  };
  tipo.addEventListener("change", syncReserva);
  syncReserva();

  mensaje.addEventListener("input", () => { counter.textContent = `${mensaje.value.length} / ${mensaje.maxLength}`; });

  const setError = (input, msg) => {
    const field = input.closest(".form__field");
    field.classList.toggle("has-error", Boolean(msg));
    field.querySelector(".form__error").textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  };

  // Reglas de validación de cada campo
  const validators = {
    nombre: (v) => (v.trim().length < 2 ? "Escribe tu nombre (mínimo 2 letras)." : ""),
    tipo: (v) => (!v ? "Elige qué necesitas." : ""),
    fecha: (v) => {
      if (!v) return "Elige la fecha de tu reserva.";
      if (v < todayISO) return "La fecha no puede ser anterior a hoy.";
      const [y, m, d] = v.split("-").map(Number);
      if (isClosedDay(new Date(y, m - 1, d).getDay())) return "Ese día el restaurante está cerrado (horario de ejemplo).";
      return "";
    },
    personas: (v) => {
      const n = Number(v);
      return !v || !Number.isInteger(n) || n < 1 || n > 20 ? "Indica entre 1 y 20 personas." : "";
    },
  };
  const validateField = (input) => setError(input, validators[input.name](input.value));
  const activeFields = () => [form.nombre, tipo, ...(tipo.value === "reserva" ? [fecha, personas] : [])];

  // Corrige el error en cuanto la persona arregla el campo
  [form.nombre, tipo, fecha, personas].forEach((input) => {
    const evt = input.tagName === "SELECT" || input.type === "date" ? "change" : "input";
    input.addEventListener(evt, () => { if (input.getAttribute("aria-invalid") === "true") validateField(input); });
  });

  const tipoLabel = () => tipo.options[tipo.selectedIndex].text;
  const formatDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-EC", { weekday: "long", day: "numeric", month: "long" });
  };

  // Arma el texto del mensaje de WhatsApp
  const buildMessage = () => {
    const lines = [`Hola ${CONFIG.restaurantName}, soy ${form.nombre.value.trim()}.`, `Motivo: ${tipoLabel()}`];
    if (tipo.value === "reserva") {
      lines.push(`Fecha: ${formatDate(fecha.value)}`, `Personas: ${personas.value}`);
    }
    if (mensaje.value.trim()) lines.push(`Mensaje: ${mensaje.value.trim()}`);
    return lines.join("\n");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = activeFields().map(validateField).every(Boolean);
    if (!ok) {
      result.hidden = true;
      form.querySelector("[aria-invalid='true']").focus();
      return;
    }

    const text = buildMessage();
    result.replaceChildren(); // se construye con textContent: lo que escribe el usuario nunca se interpreta como HTML

    if (waReady) {
      // MODO REAL: abre WhatsApp con el mensaje listo
      const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener");
      const title = document.createElement("strong");
      title.textContent = "Abriendo WhatsApp…";
      const p = document.createElement("p");
      p.textContent = "Si no se abrió, revisa que tu navegador permita ventanas emergentes.";
      result.append(title, p);
    } else {
      // MODO DEMOSTRACIÓN: muestra el mensaje que se enviaría
      const title = document.createElement("strong");
      title.textContent = "Modo demostración: este es el mensaje que se enviaría";
      const pre = document.createElement("pre");
      pre.textContent = text;
      const p = document.createElement("p");
      p.append("Para activarlo, escribe el número real del restaurante en ");
      const code = document.createElement("code");
      code.textContent = "CONFIG.whatsappNumber";
      p.append(code, " dentro de script.js.");
      result.append(title, pre, p);
    }
    result.hidden = false;
    result.focus();
  });

  /* ===================== 9. "Consultar este plato" ===================== */
  document.querySelectorAll(".dish__ask").forEach((btn) => {
    btn.addEventListener("click", () => {
      tipo.value = "menu";
      syncReserva();
      setError(tipo, "");
      mensaje.value = `Quisiera información sobre: ${btn.dataset.dish}.`;
      mensaje.dispatchEvent(new Event("input"));
      document.getElementById("contacto").scrollIntoView();
      form.nombre.focus({ preventScroll: true });
    });
  });

  /* ===================== 10. Año actual en el pie de página ===================== */
  document.getElementById("year").textContent = now.getFullYear();
});
