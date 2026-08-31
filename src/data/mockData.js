/**
 * ============================================================================
 *  SOL & THIAGO — la historia
 * ============================================================================
 *  Todo el texto de la página vive acá. Ningún componente tiene copy adentro:
 *  cambiás algo en este archivo y la experiencia entera se actualiza.
 *
 *  Los textos son un BORRADOR. Leelos en voz alta y cambiá todo lo que no
 *  suene a vos — es tu carta, tiene que sonar a tu voz. Los detalles reales
 *  (el banquito, el perfil sin cara, el papelito doblado) son los que pegan;
 *  no hace falta adornarlos.
 *
 *  ⚠️ Lo que falta está marcado así: [entre corchetes].
 * ============================================================================
 */

/* --------------------------------------------------------------------------
 * 1. LAS DOS FECHAS
 * ----------------------------------------------------------------------- */

/** El primer beso: martes 19 de mayo de 2026, a la salida del trabajo.
 *  ⚠️ Está en medianoche porque no sé la hora. Como el reloj muestra horas y
 *  minutos, poné la hora real de la salida — ej: "2026-05-19T17:30:00". */
export const START_DATE = "2026-05-19T00:00:00";

/** El día que Sol dice que sí.
 *  ⚠️⚠️ CAMBIAR SÍ O SÍ por el día y la hora exactos en que le vas a dar la
 *  carta. Mientras la fecha esté en el futuro, ese contador muestra el mensaje
 *  de "todavía no arrancó" en vez de números — así que si te equivocás por
 *  arriba, no se rompe nada, pero tampoco cuenta. */
export const NOVIOS_DATE = "2026-09-06T20:00:00";

/* --------------------------------------------------------------------------
 * 2. LA PORTADA
 * ----------------------------------------------------------------------- */
export const heroContent = {
  eyebrow: "Para Sol",
  title: ["Seis días", "de mayo"],
  subtitle:
    "Del 13 al 19 de mayo de 2026. Todo lo que pasó entre esos dos días es la razón por la que hoy tenés esto en la mano.",
  scrollHint: "Deslizá",
};

/* --------------------------------------------------------------------------
 * 3. LA MÚSICA
 * ⚠️ Falta el archivo: guardalo como public/audio/es-verdad.mp3
 * Hasta entonces el reproductor se ve igual pero no suena.
 * ----------------------------------------------------------------------- */
export const audioTrack = {
  title: "Es verdad",
  artist: "Daniel, me estás matando",
  src: "audio/es-verdad.mp3",
  fallbackDuration: 214,
  volume: 0.55,
  duckedVolume: 0.12,
};

/* --------------------------------------------------------------------------
 * 4. LOS CAPÍTULOS
 *
 * Ocho piezas: seis tarjetas y dos frases sueltas que cortan el ritmo.
 * El arco es subida → caída → remontada: si sacás el lunes que desapareció,
 * la historia se vuelve linda pero deja de doler, y sin eso el final no pega.
 *
 * Campos especiales:
 *   pull: true  → frase grande sin caja
 *   note: "…"   → dibuja un papelito doblado arriba del texto
 *   media       → { src, alt } para una foto (guardala en public/fotos/)
 * ----------------------------------------------------------------------- */
export const storyChapters = [
  {
    id: "cap-01-cambio",
    stamp: "Miércoles 13 de mayo",
    kicker: "El cambio de turno",
    title: "Pedí cambio de turno y me tocó capacitarte",
    body: [
      "Yo entraba a la tarde, vos entrabas a la mañana. Pedí el cambio por una razón cualquiera, de esas que uno se olvida a la semana.",
      "Ese día me tocó capacitarte porque recién entrabas. Empezamos a charlar y fluyó solo. Todavía no sabía que ese trámite iba a terminar siendo la mejor decisión del año.",
    ],
    accent: "gold",
    side: "left",
    media: null,
    pull: false,
  },
  {
    id: "cap-02-banquito",
    stamp: "Ese mismo mediodía",
    kicker: "El banquito",
    title: "Almorzamos en un banquito de la calle",
    body: [
      "Llegó la hora del almuerzo y te invité. No había mucho más que un banquito ahí afuera, y ahí nos sentamos a comer.",
      "Después volvimos a la capacitación y no pasó nada. Pero me fui a mi casa sabiendo que algo había pasado.",
    ],
    accent: "rose",
    side: "right",
    /* ⚠️ Cuando saques la foto del banquito, guardala en public/fotos/ y
       cambiá esta línea por:
         media: { src: "fotos/banquito.jpg", alt: "El banquito" },
       Va a ser el golpe más fuerte de la página. */
    media: null,
    pull: false,
  },
  {
    id: "cap-03-frase",
    stamp: "—",
    kicker: null,
    title: "Ese día no pasó nada. Y al mismo tiempo pasó todo.",
    body: [],
    accent: "gold",
    side: "left",
    media: null,
    pull: true,
  },
  {
    id: "cap-04-renuncia",
    stamp: "Lunes 18 de mayo",
    kicker: "Te fuiste",
    title: "Me dijeron que no venías más",
    body: [
      "El 14 y el 15 fueron feriado, y atrás venía el fin de semana. Cuatro días esperando que llegara el lunes para verte otra vez.",
      "Llegué el lunes y no estabas. Me dijeron que habías renunciado, que no ibas a volver.",
      "Te busqué en Instagram. Te busqué en la peluquería donde me habías dicho que trabajabas. Encontré un perfil que podía ser el tuyo, pero no se te veía la cara y no podía estar seguro. Me quedé con la idea de que había perdido la única oportunidad de pedirte el número.",
    ],
    accent: "violet",
    side: "right",
    media: null,
    pull: false,
  },
  {
    id: "cap-05-volviste",
    stamp: "Martes 19 de mayo",
    kicker: "Volviste",
    title: "Y al otro día estabas ahí",
    body: [
      "No habías renunciado. Estabas ahí, como si nada, y yo tuve que disimular la cara que puse.",
      "Ya sabía qué hacer: pedí cambio de turno otra vez, porque eso significaba que me tocaba capacitarte de nuevo. Esa segunda vez se rozaron las manos más veces de las necesarias, y nos miramos más veces de las necesarias. Los dos sabíamos.",
    ],
    accent: "teal",
    side: "left",
    media: null,
    pull: false,
  },
  {
    id: "cap-06-papelito",
    stamp: "Ese día, a la salida",
    kicker: "El papelito",
    title: "No me lo dijiste. Me lo escribiste.",
    /* ⚠️ Poné acá, más o menos, lo que decía el papel. No lo invento yo:
       si las palabras no son las de ella, se nota al toque. */
    note: "[lo que decía el papelito]",
    body: [
      "Me pasaste un papel doblado. Ahí adentro estaba, más o menos, que yo te gustaba.",
      "Y yo, que hacía seis días que no pensaba en otra cosa, me quedé sin saber qué hacer. Me puse nervioso como un nene.",
    ],
    accent: "rose",
    side: "right",
    media: null,
    pull: false,
  },
  {
    id: "cap-07-frase",
    stamp: "—",
    kicker: null,
    title: "Nunca me puse tan nervioso por algo que quería tanto.",
    body: [],
    accent: "rose",
    side: "left",
    media: null,
    pull: true,
  },
  {
    id: "cap-08-beso",
    stamp: "Unos minutos después",
    kicker: "Por fin",
    title: "La hice larguísima, y al final te besé",
    body: [
      "Di vueltas, me trabé, estiré el momento como si tuviera todo el tiempo del mundo. Vos esperaste.",
      "Al final te besé. El reloj que sigue acá abajo arranca justo ahí, y desde entonces no paró ni un segundo.",
    ],
    accent: "gold",
    side: "right",
    media: null,
    pull: false,
  },
];

/* --------------------------------------------------------------------------
 * 5. LAS FOTOS — lo que vino después
 *
 * Las fotos ya están procesadas en public/fotos/: enderezadas, achicadas para
 * que carguen rápido y SIN metadatos (las del celular traen las coordenadas
 * GPS de dónde fueron sacadas, y esta página es pública).
 *
 * Sin leyendas a propósito: son momentos muy distintos entre sí y ponerles
 * texto obligaría a explicarlas. Se entienden solas.
 *
 * `w` y `h` son las medidas reales del archivo. Sirven para que el navegador
 * reserve el espacio exacto antes de bajar la imagen: sin eso, la página da
 * saltos mientras carga. Si agregás fotos, poné sus medidas.
 * ----------------------------------------------------------------------- */
export const photoWallContent = {
  eyebrow: "Y después de eso",
  title: "Todo lo demás",
  subtitle:
    "La historia de arriba son seis días. Esto es lo que vino después, y es la parte que más me gusta.",
  closing: "Y recién estamos arrancando.",
};

export const photos = [
  { src: "fotos/01-beso.jpg", alt: "Sol y Thiago", w: 825, h: 1100 },
  { src: "fotos/02-noche.jpg", alt: "Sol y Thiago", w: 825, h: 1100 },
  { src: "fotos/03-tarde.jpg", alt: "Sol y Thiago", w: 825, h: 1100 },
  { src: "fotos/04-parque.jpg", alt: "Sol y Thiago", w: 825, h: 1100 },
  { src: "fotos/05-flores.jpg", alt: "Sol y Thiago", w: 825, h: 1100 },
  { src: "fotos/06-lucecitas.jpg", alt: "Sol y Thiago", w: 619, h: 1100 },
  { src: "fotos/07-el-lugar.jpg", alt: "El lugar", w: 825, h: 1100 },
  { src: "fotos/08-el-auto.jpg", alt: "Las flores en el auto", w: 825, h: 1100 },
  { src: "fotos/09-paraguay.jpg", alt: "Sol y Thiago", w: 825, h: 1100 },
  { src: "fotos/10-en-casa.jpg", alt: "Sol y Thiago", w: 619, h: 1100 },
];

/* --------------------------------------------------------------------------
 * 6. LA CANCIÓN
 *
 * El corazón de la página. La letra habla de un "río de casualidades" y la
 * historia de arriba ES una cadena de casualidades: el cambio de turno, la
 * renuncia que no fue, el segundo cambio de turno. Por eso la canción no es
 * decoración de fondo: es la explicación.
 *
 * `punchline` cierra con el título de la canción convertido en conclusión.
 * ----------------------------------------------------------------------- */
export const songContent = {
  eyebrow: "La canción",
  intro: "Hay una canción que dice esto mejor de lo que puedo decirlo yo.",
  lines: [
    "Sé que eres tú",
    "en esta y mil realidades,",
    "eres el cauce de luz,",
    "río de casualidades.",
    "No quisiera explicarte,",
    "solo sé que al mirarte",
    "simplemente eres tú.",
  ],
  track: "Es verdad · Daniel, me estás matando",
  play: "Escucharla",
  playing: "Sonando",
  reflection: [
    "«Río de casualidades». Eso fue exactamente lo que nos pasó: pedí cambio de turno dos veces, te fuiste un lunes y volviste un martes, y nada de eso estaba planeado.",
    "En estos meses me hiciste crecer más de lo que crecí en años, y me hiciste sentir querido de una forma que no conocía. Nunca quise a nadie así.",
    "No sé explicarte por qué. Y tampoco me hace falta.",
  ],
  punchline: "Solo sé que es verdad.",
};

/* --------------------------------------------------------------------------
 * 7. RELOJ UNO — desde el primer beso
 * ----------------------------------------------------------------------- */
export const counterContent = {
  variant: "full",
  eyebrow: "Desde ese beso",
  title: "El reloj que no paró",
  caption: "Sigue contando ahora mismo, mientras leés esto.",
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
 * 8. RELOJ DOS — desde que son novios
 * Arranca en cero el día que ella diga que sí. `pending` es lo que muestra
 * mientras esa fecha todavía no llegó.
 * ----------------------------------------------------------------------- */
export const noviosCounterContent = {
  variant: "days",
  eyebrow: "Y desde hoy",
  title: "Días de novios",
  caption: "No hay número más chico que el de hoy. De acá en adelante, sube.",
  pending: "Este arranca cuando digas que sí.",
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
 * 9. EL CAPÍTULO BLOQUEADO
 * El título se ve borroneado a propósito: se adivina, no se lee.
 * Al tocarlo tiembla y aparece `denied`.
 * ----------------------------------------------------------------------- */
export const lockedContent = {
  eyebrow: "Capítulo tres",
  redacted: "La boda",
  title: "Todavía no se puede abrir",
  body: "Este capítulo ya está escrito. Falta la fecha, nada más.",
  denied: "Todavía no, Sol. Pero va a llegar.",
  stamp: "— · — · ——",
};

/* --------------------------------------------------------------------------
 * 10. EL CIERRE
 * ----------------------------------------------------------------------- */
export const footerContent = {
  signature: "Thiago",
  hint: "Hay algo escondido acá.",
};

/* --------------------------------------------------------------------------
 * 11. EL SECRETO
 * Se abre tecleando BANQUITO, o manteniendo apretado 1,6s el puntito dorado
 * del final (la única forma en un celular, donde no hay teclado).
 * ----------------------------------------------------------------------- */
export const secretContent = {
  sequence: "BANQUITO",
  eyebrow: "Te acordaste",
  title: "El banquito",
  body: [
    "Si llegaste hasta acá es porque te acordaste dónde almorzamos el primer día.",
    "Ese banquito en la calle fue el mejor lugar en el que comí en mi vida. Y el chocolate que tenés en la mano es justo el que te gusta. Nada de lo que estás sosteniendo ahora mismo es casualidad.",
  ],
  signature: "Thiago",
  dismiss: "Cerrar",
};
