/*
  ============================================================
  DATOS (SIMULADOS)
  ============================================================
  Por ahora las entradas viven aquí, en un arreglo. Cuando exista la API,
  solo hay que cambiar el interior de getPosts() y getPost() por un fetch;
  el resto del sitio no se entera porque ya trabaja con Promesas (async).

  Forma de cada entrada (la API debería devolver algo parecido):
    id        -> identificador único, se usa en la URL: post.html?id=...
    title     -> título
    subtitle  -> bajada (frase corta bajo el título)
    summary   -> resumen que se muestra en la portada
    date      -> fecha ISO "AAAA-MM-DD"
    body      -> arreglo de párrafos (texto plano) para la página completa
*/
const POSTS = [
  {
    id: 'hola-mundo',
    title: 'Hola, mundo',
    subtitle: 'Toda terminal empieza con un primer comando.',
    summary: 'Abro este blog para escribir sobre lo que voy aprendiendo: código, música y cosas que encuentro por ahí. Sin algoritmos, sin likes, solo texto.',
    date: '2025-11-03',
    body: [
      'Este es el primer post. La idea del blog es simple: un lugar propio, sin feed infinito, donde pueda dejar notas largas.',
      'El diseño está inspirado en las pantallas de los teléfonos públicos y terminales de los 80: verde fósforo, azul eléctrico y líneas de escaneo.',
      'Bienvenido. Ponte cómodo.',
    ],
  },
  {
    id: 'por-que-html-plano',
    title: 'Por qué HTML plano',
    subtitle: 'Menos herramientas, más entender qué pasa.',
    summary: 'Antes de saltar a un framework quise armar el front con HTML, Tailwind por CDN y JavaScript sin dependencias. Te cuento por qué.',
    date: '2025-12-14',
    body: [
      'Los frameworks resuelven problemas reales, pero también esconden mucho de lo que pasa por debajo.',
      'Con HTML plano cada archivo es exactamente lo que el navegador recibe. Si algo falla, abres el archivo y lo ves.',
      'Tailwind por CDN permite iterar rápido sin instalar nada: escribes la clase, guardas y recargas.',
    ],
  },
  {
    id: 'clave-de-sol',
    title: 'La clave de sol en ASCII',
    subtitle: 'Dibujar con caracteres es más difícil de lo que parece.',
    summary: 'El logo del sitio es una clave de sol hecha con guiones, barras y asteriscos. Notas sobre fuentes monoespaciadas y alineación.',
    date: '2026-02-08',
    body: [
      'El arte ASCII depende de que todos los caracteres midan lo mismo de ancho: por eso siempre se usa una fuente monoespaciada.',
      'La propiedad white-space: pre mantiene los espacios y saltos de línea tal como los escribiste.',
      'En móvil el dibujo no cabe, así que el contenedor hace scroll horizontal en vez de romperlo.',
    ],
  },
  {
    id: 'scanlines-con-css',
    title: 'Scanlines con una línea de CSS',
    subtitle: 'repeating-linear-gradient hace toda la magia.',
    summary: 'Cómo simular las líneas de un monitor CRT con un pseudo-elemento y un degradado repetido, sin imágenes ni canvas.',
    date: '2026-06-21',
    body: [
      'Un monitor CRT dibuja la imagen línea por línea, y entre línea y línea queda un pequeño espacio oscuro.',
      'Podemos imitarlo poniendo encima de todo un ::after con un repeating-linear-gradient: 1px oscuro, 2px transparente, y repetir.',
      'Con pointer-events: none la capa no bloquea los clics.',
    ],
  },
  {
    id: 'sticky-vs-fixed',
    title: 'Sticky vs fixed',
    subtitle: 'Dos formas de que algo "se quede quieto".',
    summary: 'La barra de navegación de este blog no usa position: fixed sino sticky. La diferencia importa más de lo que parece en layouts con grid.',
    date: '2026-10-05',
    body: [
      'position: fixed saca al elemento del flujo: deja de ocupar espacio y hay que compensar con márgenes.',
      'position: sticky lo deja en el flujo normal hasta que llega al borde indicado (top: 0) y ahí se pega.',
      'En un grid de tres columnas, sticky es ideal: la columna conserva su ancho y el contenido central scrollea libremente.',
    ],
  },
  {
    id: 'proximamente-api',
    title: 'Próximamente: la API',
    subtitle: 'Las entradas dejarán de vivir en un arreglo.',
    summary: 'El siguiente paso es servir los posts desde una API. El front ya está preparado: solo cambia una función.',
    date: '2026-10-20',
    body: [
      'Todas las páginas piden los posts a través de getPosts(), que devuelve una Promesa.',
      'Hoy esa Promesa se resuelve con datos de prueba y un retraso falso; mañana será un fetch real.',
      'Mientras tanto, el loader del inicio se queda en pantalla hasta que los datos llegan.',
    ],
  },
];

// Pequeña ayuda para simular la latencia de red.
function fakeDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Devuelve todas las entradas, de la más nueva a la más antigua.
 * FUTURO: reemplazar por
 *   const res = await fetch('/api/posts');
 *   return res.json();
 */
async function getPosts() {
  await fakeDelay(600);
  // Comparar strings ISO "AAAA-MM-DD" funciona como comparar fechas.
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Devuelve una entrada por id, o null si no existe.
 * FUTURO: fetch(`/api/posts/${id}`) y devolver null si responde 404.
 */
async function getPost(id) {
  await fakeDelay(300);
  return POSTS.find((post) => post.id === id) || null;
}
