/*
  ============================================================
  CONFIGURACIÓN DE TAILWIND (versión CDN)
  ============================================================
  Con el CDN no hay archivo tailwind.config.js ni proceso de build:
  Tailwind lee este objeto global `tailwind.config` directamente en el
  navegador. Este archivo debe cargarse JUSTO DESPUÉS del <script> del CDN.

  ¿Para qué sirve? Para "extender" el tema con nuestros propios nombres.
  Así en el HTML escribimos `text-phosphor` en vez de `text-[#4ef07a]`.
  Todo lo que definas en `colors` funciona con cualquier utilidad de color:
    text-phosphor, bg-phosphor, border-phosphor, ...
  y también con opacidad usando la barra:  border-phosphor/30  (= 30%).
*/
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'crt-bg': '#0b0f0d',      // fondo casi negro (pantalla apagada)
        'crt-panel': '#111816',   // un tono más claro para cajas
        'phosphor': '#4ef07a',    // verde fósforo de terminal
        'phosphor-dim': '#2a8f48',// verde apagado para textos secundarios
        'crt-blue': '#1f4fd6',    // azul del panel principal (como el logo de la imagen)
        'crt-sky': '#6fb3ea',     // celeste de las franjas
        'crt-red': '#e0332b',     // línea roja de los encabezados
        'cream': '#e9e6cf',       // blanco "papel" para el texto principal
      },
      fontFamily: {
        // `font-pixel` -> títulos con look de píxel (Google Fonts: VT323)
        pixel: ['VT323', 'monospace'],
        // `font-mono` -> reemplazamos la mono por defecto por IBM Plex Mono,
        // que se lee mucho mejor en párrafos largos.
        mono: ['"IBM Plex Mono"', 'Consolas', 'monospace'],
      },
    },
  },
};
