/*
  ============================================================
  LOADER (pantalla de arranque estilo terminal)
  ============================================================
  Flujo:
    1. Loader.start()   -> anima franjas, escribe texto, avanza la barra.
    2. (la página carga los posts)
    3. Loader.finish()  -> barra al 100%, "CONECTADO", fade y se elimina.

  Se muestra una sola vez por sesión (sessionStorage). Clic o cualquier
  tecla lo salta. Está envuelto en una IIFE: (() => { ... })() crea un
  ámbito privado y solo expone lo que devolvemos en `return`.
*/
const Loader = (() => {
  const el = document.getElementById('loader');
  const STORAGE_KEY = 'mac-log-booted';
  const MIN_TIME = 2600; // ms mínimos en pantalla para que alcance a verse la animación

  // ¿Hay loader en esta página y no se ha visto en esta sesión?
  let active = !!el && !document.documentElement.classList.contains('booted');
  let progressTimer = null;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /* Genera las franjas horizontales del panel azul (como las del logo de la imagen). */
  function buildStripes() {
    const box = document.getElementById('loader-stripes');
    const rows = 9;
    let html = '';
    for (let i = 0; i < rows; i++) {
      // Cada fila tiene 2-4 segmentos de distintos largos y colores.
      const segments = 2 + Math.floor(Math.random() * 3);
      let row = '';
      for (let s = 0; s < segments; s++) {
        const width = 8 + Math.floor(Math.random() * 22); // en %
        const color = Math.random() > 0.35 ? 'bg-crt-sky' : 'bg-cream';
        row += `<span class="h-full ${color}" style="width:${width}%"></span>`;
      }
      // animation-delay negativo = cada fila arranca en un punto distinto de la animación.
      html += `<div class="stripe flex justify-end gap-2 h-1" style="animation-delay:${-i * 0.35}s">${row}</div>`;
    }
    box.innerHTML = html;
  }

  /* Efecto máquina de escribir: agrega las líneas letra por letra. */
  async function typeLines(lines) {
    const target = document.getElementById('loader-lines');
    for (const line of lines) {
      const p = document.createElement('p');
      target.appendChild(p);
      for (const char of line) {
        if (!active) return; // si lo saltaron, dejamos de escribir
        p.textContent += char;
        await wait(28);
      }
      await wait(180);
    }
  }

  function setProgress(percent) {
    document.getElementById('loader-bar').style.width = `${percent}%`;
  }

  function start() {
    if (!active) return;

    // Mientras está el loader, el body no debe hacer scroll por detrás.
    document.body.classList.add('overflow-hidden');

    buildStripes();
    typeLines([
      'BLOG HOTLINE:',
      'CARGANDO ÚLTIMAS ENTRADAS',
      '1-800-MAC-LOG',
    ]);

    // Barra "falsa": avanza sola hasta ~90% y espera a que finish() la complete.
    let progress = 0;
    progressTimer = setInterval(() => {
      progress = Math.min(90, progress + Math.random() * 9);
      setProgress(progress);
    }, 180);

    // Saltar con clic o tecla.
    el.addEventListener('click', finish, { once: true });
    window.addEventListener('keydown', finish, { once: true });
  }

  /* Promesa que espera el tiempo mínimo (o nada si no hay loader). */
  function minTime() {
    return active ? wait(MIN_TIME) : Promise.resolve();
  }

  async function finish() {
    if (!active) return;
    active = false;

    clearInterval(progressTimer);
    setProgress(100);
    document.getElementById('loader-status').textContent = 'CONECTADO';
    await wait(350);

    // `opacity-0` + la clase `transition-opacity duration-500` que ya tiene
    // el loader en el HTML = fade out de medio segundo.
    el.classList.add('opacity-0');
    await wait(500);

    el.remove();
    document.body.classList.remove('overflow-hidden');

    // sessionStorage puede fallar (modo privado, cookies bloqueadas): try/catch.
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* no pasa nada */ }
  }

  return { start, finish, minTime };
})();
