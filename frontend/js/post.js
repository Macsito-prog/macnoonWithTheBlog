/*
  ============================================================
  ENTRADA COMPLETA  (post.html?id=...)
  ============================================================
*/

// Lee el parámetro ?id= de la URL. Ej: post.html?id=hola-mundo -> "hola-mundo"
function getIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

function renderPost(post) {
  const container = document.getElementById('post');

  if (!post) {
    document.title = 'No encontrado · MAC.LOG';
    container.innerHTML = `
      <h1 class="font-pixel text-5xl text-crt-red glow">ERROR 404</h1>
      <p class="mt-2 text-phosphor">ENTRADA NO ENCONTRADA. LA LÍNEA ESTÁ OCUPADA O NO EXISTE.</p>`;
    return;
  }

  document.title = `${post.title} · MAC.LOG`;

  // Cada párrafo del arreglo `body` se vuelve un <p>.
  const paragraphs = post.body.map((text) => `<p>${escapeHtml(text)}</p>`).join('');

  /*
    space-y-5        -> separa los párrafos entre sí sin ponerle margen a cada uno.
    leading-relaxed  -> interlineado amplio: se lee mejor en textos largos.
  */
  container.innerHTML = `
    <time datetime="${post.date}" class="block font-pixel text-xl text-phosphor-dim">
      ${shortDate(post.date)} · ${formatDate(post.date)}
    </time>
    <h1 class="mt-1 font-pixel text-5xl sm:text-6xl leading-none text-cream">${escapeHtml(post.title)}</h1>
    <p class="mt-3 text-lg text-phosphor">${escapeHtml(post.subtitle)}</p>
    <div class="h-1 bg-crt-red mt-4 mb-8"></div>
    <div class="space-y-5 leading-relaxed text-cream/90">${paragraphs}</div>`;
}

(async function initPost() {
  renderNav();
  const id = getIdFromUrl();

  try {
    // Pedimos la entrada y la lista (para el archivo) al mismo tiempo.
    const [post, posts] = await Promise.all([getPost(id), getPosts()]);
    renderPost(post);
    renderArchive(posts, id);
  } catch (error) {
    console.error(error);
    renderPost(null);
  }
})();
