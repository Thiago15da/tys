import { motion } from "framer-motion";
import { useAudioControls, useAudioState } from "../lib/AudioEngine";

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
 * El botón de play engancha con el reproductor flotante: se lee la letra y se
 * escucha la canción sin salir de acá.
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

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 translate-x-px" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a.6.6 0 0 0 .92.5l10.5-6.86a.6.6 0 0 0 0-1L8.92 4.64a.6.6 0 0 0-.92.5Z" />
    </svg>
  );
}

function WaveIcon() {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
      {[0.7, 0.95, 0.62].map((d, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-current"
          animate={{ height: [4, 11, 5] }}
          transition={{ duration: d, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{ height: 4 }}
        />
      ))}
    </span>
  );
}

export default function SongSection({ content }) {
  const { play } = useAudioControls();
  const { playing } = useAudioState();

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

        {/* Escucharla */}
        <motion.button
          type="button"
          onClick={play}
          disabled={playing}
          className="mt-11 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-4 pr-5 text-[0.62rem] font-light uppercase tracking-[0.28em] text-mist transition-colors duration-500 hover:border-gold/30 hover:text-bone disabled:cursor-default"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.5 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="text-gold">{playing ? <WaveIcon /> : <PlayIcon />}</span>
          {playing ? content.playing : content.play}
        </motion.button>

        <span className="mt-4 font-serif text-[0.82rem] italic text-ash">{content.track}</span>

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
