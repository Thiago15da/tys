/**
 * ============================================================================
 *  LA HISTORIA
 * ============================================================================
 *  Todo el texto de la página vive acá. Ningún componente tiene copy adentro:
 *  cambiás algo en este archivo y la experiencia entera se actualiza.
 *
 *  Los textos son un BORRADOR con tus recuerdos. Leelos en voz alta y
 *  cambiá lo que no suene a vos — es tu carta, tiene que sonar a tu voz y no
 *  a la de nadie más. Los detalles reales (el banquito, la peluquería, el
 *  perfil sin cara) son los que pegan; no hace falta adornarlos.
 *
 *  Lo que falta está marcado así: [entre corchetes].
 * ============================================================================
 */

/* --------------------------------------------------------------------------
 * 1. LA FECHA
 * El contador mide el tiempo desde el primer beso: martes 19 de mayo de 2026,
 * a la salida del trabajo.
 *
 * ⚠️ Está en medianoche (00:00) porque no me dijiste la hora. Como el reloj
 * muestra horas, minutos y segundos, conviene poner la hora real aproximada
 * de la salida — por ejemplo "2026-05-19T17:30:00" si salieron 17:30.
 * ----------------------------------------------------------------------- */
export const START_DATE = "2026-05-19T00:00:00";

/* --------------------------------------------------------------------------
 * 2. LA PORTADA
 * ----------------------------------------------------------------------- */
export const heroContent = {
  eyebrow: "13 → 19 de mayo de 2026",
  title: ["Seis días", "de mayo"],
  subtitle:
    "Del 13 al 19. Todo lo que pasó entre esos dos días es la razón por la que hoy tenés esto en la mano.",
  scrollHint: "Deslizá",
};

/* --------------------------------------------------------------------------
 * 3. LA MÚSICA
 * ⚠️ Falta el archivo. Conseguí "Es verdad" en mp3 y guardalo como
 *    public/audio/es-verdad.mp3
 * Hasta que lo pongas, el reproductor funciona en modo simulado (se ve todo
 * igual, pero no suena).
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
 * Seis tarjetas: el encuentro, el banquito, el silencio, la desaparición,
 * la vuelta y el beso. Ese es el arco — subida, caída y remontada.
 *
 * Si querés sumar fotos: guardalas en public/fotos/ y poné
 *   media: { src: "fotos/banquito.jpg", alt: "El banquito" }
 * Una foto del banquito en el capítulo 2 sería demoledora.
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
      "No habías renunciado. Estabas ahí, como si nada.",
      "Yo ya sabía qué hacer: pedí cambio de turno otra vez, porque eso significaba que me tocaba capacitarte de nuevo. Esa segunda vez se rozaron las manos más veces de las necesarias, y nos miramos más veces de las necesarias. Los dos sabíamos.",
    ],
    accent: "teal",
    side: "left",
    media: null,
    pull: false,
  },
  {
    id: "cap-06-beso",
    stamp: "Ese día, a la salida",
    kicker: "Vamos juntos",
    title: "Traje el auto y te dije dos palabras",
    body: [
      "«Vamos juntos.» Te iba a llevar a la peluquería, nada más que eso.",
      "No llegamos ni a arrancar. Te lanzaste vos, y nos besamos. El reloj que sigue acá abajo arranca justo ahí.",
    ],
    accent: "gold",
    side: "right",
    media: null,
    pull: false,
  },
];

/* --------------------------------------------------------------------------
 * 5. EL RELOJ
 * ----------------------------------------------------------------------- */
export const counterContent = {
  eyebrow: "Desde ese beso",
  title: "El reloj que arrancaste vos",
  caption: "Y sigue contando, ahora mismo, mientras leés esto.",
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
 * 6. EL CIERRE
 * ----------------------------------------------------------------------- */
export const footerContent = {
  signature: "— [tu nombre acá]",
  hint: "Hay algo escondido acá.",
};

/* --------------------------------------------------------------------------
 * 7. EL SECRETO
 * Se abre tecleando BANQUITO, o manteniendo apretado 1,6s el puntito dorado
 * del final (que es la única forma en un celular, donde no hay teclado).
 *
 * ⚠️ Ojo con esto: si no le dejás una pista en la carta, es MUY difícil que
 * lo encuentre sola. Ver la nota que te dejé en el chat.
 * ----------------------------------------------------------------------- */
export const secretContent = {
  sequence: "BANQUITO",
  eyebrow: "Te acordaste",
  title: "El banquito",
  body: [
    "Si llegaste hasta acá es porque te acordaste dónde almorzamos el primer día.",
    "Ese banquito en la calle fue el mejor lugar en el que comí en mi vida. Y el chocolate que tenés en la mano es justo el que te gusta. Nada de lo que estás sosteniendo ahora mismo es casualidad.",
  ],
  signature: "— [tu nombre acá]",
  dismiss: "Cerrar",
};
