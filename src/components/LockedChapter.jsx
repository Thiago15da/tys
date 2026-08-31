import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";

/**
 * El capítulo que todavía no se puede abrir.
 *
 * La gracia está en el título borroneado: se adivina la forma de las palabras
 * pero no se leen. Un candado sobre texto ilegible pica muchísimo más la
 * curiosidad que un cartel que diga "próximamente".
 *
 * Al tocarlo tiembla, el desenfoque afloja un instante —lo justo para que casi
 * se lea— y vuelve a cerrarse. No se abre nunca: ese es el punto.
 */

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" aria-hidden="true">
      <path
        d="M7 10V7.5a5 5 0 0 1 10 0V10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <rect
        x="4.5"
        y="10"
        width="15"
        height="10.5"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="12" cy="15.2" r="1.5" fill="currentColor" />
      <path d="M12 16.4v1.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export default function LockedChapter({ content }) {
  const [denied, setDenied] = useState(false);
  const controls = useAnimationControls();
  const blurControls = useAnimationControls();
  const timerRef = useRef(null);

  const handleTry = () => {
    // Temblor corto y seco: la puerta no cede.
    controls.start({
      x: [0, -7, 6, -4, 3, 0],
      transition: { duration: 0.42, ease: "easeInOut" },
    });

    // El desenfoque afloja un instante. Casi.
    blurControls.start({
      filter: ["blur(7px)", "blur(2.5px)", "blur(7px)"],
      transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
    });

    setDenied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDenied(false), 3600);
  };

  return (
    <section className="relative px-5 pb-16 pt-4 sm:px-8">
      <motion.div
        className="mx-auto w-full max-w-xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ type: "spring", stiffness: 60, damping: 16 }}
      >
        <motion.button
          type="button"
          onClick={handleTry}
          animate={controls}
          whileTap={{ scale: 0.985 }}
          aria-label={`${content.redacted} — ${content.title}`}
          className="glass group relative block w-full overflow-hidden rounded-[26px] px-6 py-11 text-center"
        >
          {/* Rejilla tenue: se siente cerrado, como una puerta */}
          <span
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, transparent 0 9px, rgba(255,255,255,0.018) 9px 10px)",
            }}
            aria-hidden="true"
          />

          <span className="relative text-[0.55rem] font-light uppercase tracking-[0.42em] text-ash">
            {content.eyebrow}
          </span>

          {/* El título tapado */}
          <motion.span
            animate={blurControls}
            style={{ filter: "blur(7px)" }}
            className="redacted relative mt-6 block font-serif text-[clamp(2.2rem,10vw,3.4rem)] leading-none text-bone/70"
          >
            {content.redacted}
          </motion.span>

          {/* Candado */}
          <span className="relative mx-auto mt-7 block h-9 w-9 text-gold/70 transition-colors duration-500 group-hover:text-gold">
            <LockIcon />
          </span>

          <span className="relative mt-6 block font-serif text-lg italic text-mist">
            {content.title}
          </span>

          <span className="relative mt-3 block text-[0.82rem] font-light leading-relaxed text-ash">
            {content.body}
          </span>

          <span className="relative mt-7 block text-[0.6rem] uppercase tracking-[0.4em] text-ash/60">
            {content.stamp}
          </span>

          {/* La respuesta al intento */}
          <AnimatePresence>
            {denied && (
              <motion.span
                className="relative mt-6 block font-serif text-[0.95rem] italic text-gold-soft"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {content.denied}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </section>
  );
}
