/*
  ============================================================
  LAYOUT COMPARTIDO: navegación + archivo + utilidades
  ============================================================
  La nav y el archivo son iguales en todas las páginas. En vez de copiar
  y pegar el mismo HTML en cada .html, lo generamos desde aquí con JS y lo
  "inyectamos" en un contenedor vacío (<header id="site-nav">, <aside id="archive">).
  Así, si quieres agregar un link, lo cambias en UN solo lugar.
*/

/* ---------- Utilidades ---------- */

// Evita que un texto con < > & se interprete como HTML.
// Importante cuando los datos vengan de una API: nunca metas texto
// externo en innerHTML sin escaparlo.
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// "2026-10-20" -> objeto Date en hora LOCAL.
// (new Date('2026-10-20') lo interpreta en UTC y en Chile mostraría el día 19)
function parseDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// "2026-10-20" -> "20 de octubre de 2026"
function formatDate(iso) {
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'long' }).format(parseDate(iso));
}

// "2026-10-20" -> "2026.10.20" (formato corto estilo terminal)
function shortDate(iso) {
  return iso.replaceAll('-', '.');
}

/* ---------- Navegación ---------- */

const NAV_LINKS = [
  { page: 'home', label: 'home', href: 'index.html' },
  { page: 'about', label: 'me', href: 'about.html' },
  { page: 'x', label: 'X', href: 'https://x.com//whoismacnoon', external: true },
];

/**
 * Pinta la navegación dentro de <header id="site-nav">.
 * La página actual se lee de <body data-page="...">.
 */
function renderNav() {
  const container = document.getElementById('site-nav');
  if (!container) return;

  const current = document.body.dataset.page;

  const links = NAV_LINKS.map((link) => {
    const isCurrent = link.page === current;
    // Clases condicionales: el link activo va "invertido" (fondo verde, texto oscuro).
    const classes = isCurrent
      ? 'bg-phosphor text-crt-bg'
      : 'text-phosphor hover:bg-phosphor hover:text-crt-bg';
    const extra = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const aria = isCurrent ? ' aria-current="page"' : '';
    return `
      <li>
        <a href="${link.href}"${extra}${aria}
           class="block px-2 transition-colors ${classes}">
          ${isCurrent ? '▸ ' : ''}${link.label}${link.external ? ' ↗' : ''}
        </a>
      </li>`;
  }).join('');

  /*
    Clases clave (mobile-first: sin prefijo = móvil, `lg:` = pantallas ≥1024px):
      flex items-center justify-between  -> en móvil: logo a la izquierda, links a la derecha, en fila.
      lg:flex-col lg:items-stretch       -> en desktop: todo apilado en columna.
      lg:h-full                          -> ocupa todo el alto del header (que mide h-screen).
      lg:mt-auto                         -> empuja el reloj al fondo de la columna.
  */
  container.innerHTML = `
    <div class="flex items-center justify-between gap-4 px-4 py-3
                lg:flex-col lg:items-stretch lg:justify-start lg:h-full lg:px-6 lg:py-8">

      <a href="index.html" class="block shrink-0" aria-label="Ir al inicio">
        <span class="block bg-crt-blue text-cream font-pixel text-3xl leading-none px-3 py-1 border-2 border-cream/70">
          MAC.LOG
        </span>
        <span class="hidden lg:block mt-2 h-1 bg-crt-red"></span>
      </a>

      <nav aria-label="Principal">
        <ul class="flex gap-2 font-pixel text-2xl lg:flex-col lg:gap-1 lg:mt-8">
          ${links}
        </ul>
      </nav>

      <div class="hidden lg:block lg:mt-auto font-pixel text-lg text-phosphor-dim leading-tight">
        <p><span class="text-phosphor">●</span> ONLINE</p>
        <p id="nav-clock">--:--:--</p>
        <p class="text-crt-red">2026年チリ製</p>
      </div>
    </div>`;

  startClock();
}

// Reloj en vivo en la nav (detalle retro).
function startClock() {
  const clock = document.getElementById('nav-clock');
  if (!clock) return;
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString('es-CL', { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- Archivo (columna derecha) ---------- */

/**
 * Agrupa las entradas así:  { 2026: { 9: [post, post], 5: [post] }, 2025: {...} }
 * (los meses van de 0 a 11, como en Date)
 */
function groupByYearMonth(posts) {
  const groups = {};
  for (const post of posts) {
    const date = parseDate(post.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    groups[year] ??= {};
    groups[year][month] ??= [];
    groups[year][month].push(post);
  }
  return groups;
}

const monthName = (month) =>
  new Intl.DateTimeFormat('es-CL', { month: 'long' }).format(new Date(2000, month, 1));

/**
 * Pinta el "Archivo del blog" (estilo Blogger clásico) dentro de <aside id="archive">.
 * currentId: id de la entrada que se está leyendo (para resaltarla), opcional.
 */
function renderArchive(posts, currentId = null) {
  const container = document.getElementById('archive');
  if (!container) return;

  const groups = groupByYearMonth(posts);
  // Object.keys devuelve strings; los ordenamos de mayor a menor.
  const years = Object.keys(groups).sort((a, b) => b - a);

  // ¿Qué año/mes abrir por defecto? El de la entrada actual, o el más reciente.
  const current = posts.find((p) => p.id === currentId) || posts[0];
  const openDate = current ? parseDate(current.date) : null;

  /*
    Usamos <details>/<summary>: un acordeón nativo de HTML, sin JS.
    Tailwind trae la variante `open:` y `group-open:` para estilizarlo:
      group/year                 -> marca este <details> como "grupo" con nombre "year".
      group-open/year:rotate-90  -> cuando ESE details está abierto, rota la flecha.
    Los nombres (/year, /month) evitan que un details anidado afecte al de afuera.
  */
  const yearsHtml = years.map((year) => {
    const months = Object.keys(groups[year]).sort((a, b) => b - a);
    const yearCount = months.reduce((n, m) => n + groups[year][m].length, 0);
    const yearOpen = openDate && openDate.getFullYear() === Number(year);

    const monthsHtml = months.map((month) => {
      const list = groups[year][month];
      const monthOpen = yearOpen && openDate.getMonth() === Number(month);

      const items = list.map((post) => {
        const isCurrent = post.id === currentId;
        return `
          <li>
            <a href="post.html?id=${encodeURIComponent(post.id)}"
               class="block truncate px-1 ${isCurrent ? 'bg-phosphor text-crt-bg' : 'text-cream/80 hover:text-phosphor'}"
               title="${escapeHtml(post.title)}">
              ${escapeHtml(post.title)}
            </a>
          </li>`;
      }).join('');

      return `
        <details class="group/month" ${monthOpen ? 'open' : ''}>
          <summary class="flex items-center gap-1 cursor-pointer list-none text-phosphor hover:text-cream">
            <span class="inline-block transition-transform group-open/month:rotate-90">▸</span>
            ${monthName(Number(month))} <span class="text-phosphor-dim">(${list.length})</span>
          </summary>
          <ul class="ml-4 mt-1 mb-2 space-y-1 border-l border-phosphor/30 pl-2">${items}</ul>
        </details>`;
    }).join('');

    return `
      <details class="group/year" ${yearOpen ? 'open' : ''}>
        <summary class="flex items-center gap-1 cursor-pointer list-none font-pixel text-xl text-cream hover:text-phosphor">
          <span class="inline-block transition-transform group-open/year:rotate-90">▸</span>
          ${year} <span class="text-phosphor-dim">(${yearCount})</span>
        </summary>
        <div class="ml-4 mt-1 space-y-1">${monthsHtml}</div>
      </details>`;
  }).join('');

  container.innerHTML = `
    <details id="archive-box" class="group/archive border-2 border-phosphor/40 bg-crt-panel">
      <summary class="flex items-center justify-between cursor-pointer list-none px-3 py-2 font-pixel text-2xl text-cream border-b-2 border-transparent group-open/archive:border-phosphor/40">
        ARCHIVO
        <span class="text-phosphor transition-transform group-open/archive:rotate-90">▸</span>
      </summary>
      <div class="px-3 py-3 space-y-2 text-sm">
        ${yearsHtml || '<p class="text-phosphor-dim">Sin entradas todavía.</p>'}
      </div>
    </details>`;

  // En desktop el archivo siempre parte abierto; en móvil parte plegado
  // para no empujar el contenido. matchMedia es el "media query" de JS.
  const box = document.getElementById('archive-box');
  const desktop = window.matchMedia('(min-width: 1024px)');
  box.open = desktop.matches;
  desktop.addEventListener('change', (e) => { box.open = e.matches; });
}
