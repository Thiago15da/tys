import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Una línea del título. El texto vive dentro de una máscara con overflow
 * oculto y entra desde abajo con rotación mínima: es el gesto que hace que
 * un titular se sienta "de película" y no "de landing".
 *
 * OJO con el degradé: `background-clip: text` NO pinta el texto de un
 * descendiente que tenga su propio transform — el navegador lo compone en otra
 * capa y las letras salen transparentes. Por eso el degradé va acá, en el mismo
 * span que se anima, y no en un padre.
 *
 * Para que igual se lea como UN solo degradé y no como uno por renglón, cada
 * línea muestra su rebanada de un gradiente que mide `total` veces su alto.
 */
function RevealLine({ children, delay = 0, index = 0, total = 1 }) {
  const slice =
    total > 1
      ? {
          backgroundSize: `100% ${total * 100}%`,
          backgroundPosition: `0% ${(index / (total - 1)) * 100}%`,
        }
      : undefined;

  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block pb-[0.14em] text-gradient will-change-transform"
        style={slice}
        initial={{ y: "110%", rotate: 2.5, opacity: 0 }}
        animate={{ y: "0%", rotate: 0, opacity: 1 }}
        transition={{
          duration: 1.25,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero({ content, onScrollHint }) {
  const sectionRef = useRef(null);

  // Parallax de salida: el hero se hunde y se desenfoca mientras te vas.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(6px)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  const lines = Array.isArray(content.title) ? content.title : [content.title];
  const BASE_DELAY = 0.25;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pt-24 pb-28"
    >
      <motion.div
        style={{ y, opacity, filter: blur, scale }}
        className="flex w-full max-w-3xl flex-col items-center text-center"
      >
        {/* Eyebrow */}
        <motion.div
          className="mb-10 flex items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="text-[0.6rem] font-light uppercase tracking-[0.4em] text-mist">
            {content.eyebrow}
          </span>
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-gold/50" />
        </motion.div>

        {/* Título: la copia base + una copia encima que sólo lleva el barrido */}
        <h1 className="relative font-serif text-[clamp(2.6rem,12vw,5.5rem)] font-normal leading-[1.04] tracking-[-0.02em]">
          <span className="block">
            {lines.map((line, i) => (
              <RevealLine
                key={line + i}
                delay={BASE_DELAY + i * 0.13}
                index={i}
                total={lines.length}
              >
                {line}
              </RevealLine>
            ))}
          </span>

          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-sheen text-sheen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: BASE_DELAY + lines.length * 0.13 + 0.5, duration: 1.2 }}
          >
            {lines.map((line, i) => (
              <span key={line + i} className="block pb-[0.14em]">
                {line}
              </span>
            ))}
          </motion.span>
        </h1>

        {/* Subtítulo */}
        <motion.p
          className="mt-9 max-w-md text-balance text-[0.94rem] font-light leading-relaxed text-mist sm:text-base"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: BASE_DELAY + lines.length * 0.13 + 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {content.subtitle}
        </motion.p>
      </motion.div>

      {/* Indicador de scroll flotante */}
      <motion.button
        type="button"
        onClick={onScrollHint}
        aria-label="Bajar a la historia"
        className="group absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1.1 }}
        style={{ opacity }}
      >
        <motion.span
          className="text-[0.58rem] font-light uppercase tracking-[0.42em] text-ash transition-colors duration-500 group-hover:text-mist"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {content.scrollHint}
        </motion.span>

        {/* Riel con una gota de luz que cae en loop */}
        <span className="relative block h-12 w-px overflow-hidden bg-gradient-to-b from-white/5 via-white/15 to-white/5">
          <motion.span
            className="absolute left-1/2 h-4 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold to-transparent"
            animate={{ y: ["-100%", "300%"] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: [0.65, 0, 0.35, 1], repeatDelay: 0.5 }}
          />
        </span>
      </motion.button>
    </section>
  );
}
