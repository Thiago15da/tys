import { motion } from "framer-motion";

/**
 * La canción.
 *
 * Es el corazón de la página, y por eso es la única sección sin vidrio, sin
 * caja y sin bordes: la letra flota sola sobre el fondo. Todo lo demás compite
 * por atención; acá no compite nada.
 *
 * El detalle que la sostiene: la letra habla de un "río de casualidades" y la
 * historia de arriba ES una cadena de casualidades. Por eso el riel de luz que
 * atraviesa la sección de arriba abajo, con una gota cayendo en loop — el mismo
 * gesto del indicador del hero, cerrando el círculo.
 *
 * No lleva botón de reproducir: la canción ya viene sonando desde que se entró
 * a la página. Acá sólo se la nombra.
 */

/** Riel por donde cae la luz. */
function LightRail({ flip = false }) {
  return (
    <span
      className="relative mx-auto block h-16 w-px overflow-hidden bg-gradient-to-b from-white/5 via-white/12 to-white/5"
      aria-hidden="true"
    >
      <motion.span
        className="absolute left-1/2 h-8 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold to-transparent"
        animate={{ y: flip ? ["300%", "-100%"] : ["-100%", "300%"] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1], repeatDelay: 0.4 }}
      />
    </span>
  );
}

export default function SongSection({ content }) {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <motion.span
          className="text-[0.58rem] font-light uppercase tracking-[0.42em] text-mist"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {content.eyebrow}
        </motion.span>

        <motion.p
          className="mt-6 max-w-xs text-balance text-[0.9rem] font-light leading-relaxed text-mist"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {content.intro}
        </motion.p>

        <div className="mt-10">
          <LightRail />
        </div>

        {/* La letra. Cada verso entra por separado, con el ritmo de quien la
            canta y no de quien la lee de corrido.

            El `whileInView` va acá, en el bloque, y NO en cada verso. Cada
            verso arranca corrido un 108% hacia abajo, o sea fuera de su
            máscara con overflow oculto; y el IntersectionObserver recorta el
            elemento contra sus ancestros antes de decidir. Observado desde el
            verso, la intersección es cero para siempre: no aparece porque no
            está visible, y no está visible porque no aparece. El bloque, en
            cambio, no está corrido y se ve entrar sin problema. */}
        <motion.blockquote
          className="mt-10"
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, margin: "-12%" }}
          variants={{ visible: { transition: { staggerChildren: 0.16 } } }}
        >
          {content.lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block pb-[0.12em] font-serif text-[clamp(1.25rem,5.4vw,1.75rem)] font-normal italic leading-[1.45] text-bone/90"
                variants={{
                  oculto: { y: "108%", opacity: 0 },
                  visible: {
                    y: "0%",
                    opacity: 1,
                    transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.blockquote>

        {/* Ya viene sonando desde que entró: acá sólo se nombra. */}
        <motion.span
          className="mt-10 font-serif text-[0.86rem] italic text-ash"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {content.track}
        </motion.span>

        <div className="mt-12">
          <LightRail />
        </div>

        {/* Lo que significa */}
        <div className="mt-12 space-y-5">
          {content.reflection.map((text, i) => (
            <motion.p
              key={i}
              className="max-w-md text-balance text-[0.94rem] font-light leading-[1.8] text-mist"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {text}
            </motion.p>
          ))}
        </div>

        {/* El remate: el título de la canción es la conclusión */}
        <motion.p
          className="mt-11 text-balance font-serif text-[clamp(1.5rem,6.5vw,2.2rem)] font-normal leading-tight text-gradient"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {content.punchline}
        </motion.p>
      </div>
    </section>
  );
}
