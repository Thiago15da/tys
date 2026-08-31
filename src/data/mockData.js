/**
 * ============================================================================
 *  mockData.js  —  ÚNICO ARCHIVO QUE TENÉS QUE TOCAR
 * ============================================================================
 *  Toda la copy, las fechas y los assets viven acá. Ningún componente tiene
 *  texto hardcodeado: reemplazá los valores de este archivo y la experiencia
 *  entera se actualiza sola.
 *
 *  Los textos actuales son PLACEHOLDERS de estructura. Respetá las claves.
 * ============================================================================
 */

/* --------------------------------------------------------------------------
 * 1. FECHA BASE DE LA CÁPSULA
 * El contador en vivo mide el tiempo transcurrido desde este instante.
 * Formato ISO local (sin "Z") para que respete la zona horaria del visitante.
 * ----------------------------------------------------------------------- */
export const START_DATE = "2026-05-19T00:00:00";

/* --------------------------------------------------------------------------
 * 2. HERO
 * `title` es un array: cada string es una línea que se revela por separado.
 * Poné una palabra sola en su propia línea si querés que respire más.
 * ----------------------------------------------------------------------- */
export const heroContent = {
  eyebrow: "Cápsula del tiempo · 001",
  title: ["Todo lo que", "pasó desde", "aquel día"],
  subtitle:
    "Un archivo vivo. Cada tarjeta guarda un momento exacto, y el reloj del final no se detiene nunca.",
  scrollHint: "Deslizá",
};

/* --------------------------------------------------------------------------
 * 3. REPRODUCTOR
 * Dejá tu archivo en `public/audio/` y apuntá `src` ahí.
 * Si el archivo no existe, el player entra en modo simulado: la UI, el
 * ecualizador y la barra de progreso funcionan igual (útil para maquetar).
 * ----------------------------------------------------------------------- */
export const audioTrack = {
  title: "Es verdad",
  artist: "Daniel, me estás matando",
  src: "/audio/es-verdad.mp3",
  /** Duración en segundos. Sólo se usa como fallback del modo simulado. */
  fallbackDuration: 214,
  /** Volumen inicial 0–1. El Konami lo baja a `duckedVolume`. */
  volume: 0.55,
  duckedVolume: 0.12,
};

/* --------------------------------------------------------------------------
 * 4. LÍNEA DE TIEMPO
 * Cada objeto es una tarjeta.
 *   id      → único y estable (key de React)
 *   stamp   → la marca chica de arriba (fecha, hora, lo que quieras)
 *   kicker  → etiqueta corta opcional; null para ocultarla
 *   title   → titular en serif
 *   body    → párrafo(s). Array = varios párrafos.
 *   accent  → "gold" | "rose" | "violet" | "teal"
 *   side    → "left" | "right" (sólo afecta desktop; en mobile es una columna)
 *   media   → { src, alt } o null. Sin media la tarjeta es 100% tipográfica.
 *   pull    → true convierte la tarjeta en una cita grande, sin caja. Usalo
 *             cada 3–4 tarjetas para romper el ritmo.
 * ----------------------------------------------------------------------- */
export const storyChapters = [
  {
    id: "cap-01",
    stamp: "19 · 05 · 2026",
    kicker: "El principio",
    title: "Placeholder del primer capítulo",
    body: [
      "Este párrafo existe sólo para medir el ritmo tipográfico de la tarjeta. Escribí acá el primer momento de la historia, el que arranca todo.",
    ],
    accent: "gold",
    side: "left",
    media: null,
    pull: false,
  },
  {
    id: "cap-02",
    stamp: "02 · 06 · 2026",
    kicker: "Sin aviso",
    title: "Segundo momento",
    body: [
      "Texto de relleno para verificar cómo respira un bloque de dos párrafos dentro del vidrio.",
      "El segundo párrafo hereda el mismo interlineado y separación. Probá largos distintos antes de escribir el definitivo.",
    ],
    accent: "rose",
    side: "right",
    media: null,
    pull: false,
  },
  {
    id: "cap-03",
    stamp: "—",
    kicker: null,
    title: "Acá va una frase que quieras que pegue fuerte.",
    body: [],
    accent: "gold",
    side: "left",
    media: null,
    pull: true,
  },
  {
    id: "cap-04",
    stamp: "17 · 07 · 2026",
    kicker: "El viaje",
    title: "Un capítulo con imagen",
    body: [
      "Cuando `media` tiene un src, la tarjeta abre con la foto arriba y el texto debajo. La imagen hace un parallax suave al scrollear.",
    ],
    accent: "violet",
    side: "right",
    media: {
      src: "https://images.unsplash.com/photo-1502790671504-542ad42d5189?q=80&w=1200&auto=format&fit=crop",
      alt: "Placeholder — reemplazar por una foto propia en /public",
    },
    pull: false,
  },
  {
    id: "cap-05",
    stamp: "09 · 08 · 2026",
    kicker: "Lo que no dijimos",
    title: "Cuarto momento",
    body: [
      "Otra tarjeta para chequear que el ritmo alternado izquierda/derecha no se sienta mecánico en pantallas grandes.",
    ],
    accent: "teal",
    side: "left",
    media: null,
    pull: false,
  },
  {
    id: "cap-06",
    stamp: "Hoy",
    kicker: "Y ahora",
    title: "El último capítulo antes del reloj",
    body: [
      "Cerrá con algo que empuje hacia abajo, porque justo después arranca el contador y conviene que la transición se sienta intencional.",
    ],
    accent: "gold",
    side: "right",
    media: null,
    pull: false,
  },
];

/* --------------------------------------------------------------------------
 * 5. CONTADOR EN VIVO
 * ----------------------------------------------------------------------- */
export const counterContent = {
  eyebrow: "Desde entonces",
  title: "El tiempo exacto",
  caption: "Y sigue contando, ahora mismo, mientras leés esto.",
  /** Etiquetas de las unidades, en orden. */
  labels: {
    years: "Años",
    months: "Meses",
    days: "Días",
    hours: "Horas",
    minutes: "Min",
    seconds: "Seg",
  },
};

/* --------------------------------------------------------------------------
 * 6. FOOTER
 * ----------------------------------------------------------------------- */
export const footerContent = {
  signature: "Hecho a mano",
  hint: "Hay algo escondido acá adentro.",
};

/* --------------------------------------------------------------------------
 * 7. EASTER EGG — Konami custom
 * `sequence` es la palabra que hay que teclear (case-insensitive).
 * En mobile no hay teclado: el gesto alternativo es mantener presionado
 * 1,6s el punto decorativo del footer.
 * ----------------------------------------------------------------------- */
export const secretContent = {
  sequence: "BANQUITO",
  eyebrow: "Easter egg",
  title: "Mensaje Secreto Desbloqueado",
  body: [
    "Este es el placeholder del mensaje secreto. Reemplazá este texto por lo que quieras que aparezca sólo para quien encuentre la palabra.",
  ],
  signature: "—",
  dismiss: "Guardar el secreto",
};
