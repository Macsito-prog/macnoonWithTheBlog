/*
  ============================================================
  PORTADA: lista de entradas
  ============================================================
*/

/**
 * Una tarjeta = un <article> envuelto completo en un <a>.
 * Por eso cualquier clic dentro de la tarjeta lleva a la entrada.
 *
 * Clases clave:
 *   group                    -> marca el <a> como "grupo"...
 *   group-hover:text-crt-bg  -> ...y los hijos cambian de color cuando el MOUSE está sobre el grupo.
 *   hover:bg-phosphor        -> al pasar el mouse, fondo verde: colores invertidos, muy terminal.
 *   focus-visible:outline-*  -> borde visible al navegar con teclado (Tab).
 */
function postCard(post) {
  return `
    <article>
      <a href="post.html?id=${encodeURIComponent(post.id)}"
         class="group block border-2 border-phosphor/30 bg-crt-panel p-5 sm:p-6
                transition-colors hover:bg-phosphor hover:border-phosphor
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crt-sky">

        <time datetime="${post.date}" class="block font-pixel text-lg text-phosphor-dim group-hover:text-crt-bg/70">
          ${shortDate(post.date)} · ${formatDate(post.date)}
        </time>

        <h2 class="mt-1 font-pixel text-3xl sm:text-4xl leading-none text-cream group-hover:text-crt-bg">
          ${escapeHtml(post.title)}
        </h2>

        <p class="mt-2 text-phosphor group-hover:text-crt-bg">
          ${escapeHtml(post.subtitle)}
        </p>

        <p class="mt-3 text-sm leading-relaxed text-cream/70 group-hover:text-crt-bg/80">
          ${escapeHtml(post.summary)}
        </p>

        <span class="mt-4 inline-block font-pixel text-xl text-phosphor group-hover:text-crt-bg">
          LEER MÁS ▸
        </span>
      </a>
    </article>`;
}

function renderPosts(posts) {
  const list = document.getElementById('post-list');
  list.innerHTML = posts.length
    ? posts.map(postCard).join('')
    : '<p class="text-phosphor-dim">No hay entradas todavía.</p>';
}

// Punto de entrada. async/await: "espera" las promesas sin anidar .then().
(async function initHome() {
  renderNav();
  Loader.start();

  try {
    // Promise.all espera AMBAS cosas: los posts y el tiempo mínimo del loader.
    const [posts] = await Promise.all([getPosts(), Loader.minTime()]);
    renderPosts(posts);
    renderArchive(posts);
  } catch (error) {
    // Cuando sea una API real, aquí caerán los errores de red.
    console.error(error);
    document.getElementById('post-list').innerHTML =
      '<p class="font-pixel text-2xl text-crt-red">ERROR: NO SE PUDIERON CARGAR LAS ENTRADAS.</p>';
  } finally {
    // finally corre siempre: con o sin error, el loader se va.
    Loader.finish();
  }
})();
