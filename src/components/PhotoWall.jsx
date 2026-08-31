import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { asset } from "../lib/asset";

/**
 * La pared de fotos: lo que vino después del beso.
 *
 * La historia de arriba termina el 19 de mayo. Esto es la prueba de todo lo
 * que pasó desde entonces, y por eso va justo antes del reloj: primero lo que
 * pasó, después las pruebas, después el tiempo corriendo.
 *
 * Estética de polaroid a propósito. La página ya tiene dos objetos físicos —el
 * banquito y el papelito— y las fotos tenían que sentirse igual de tocables:
 * papel color hueso, borde inferior grueso, cada una torcida un poco distinto,
 * como si estuvieran tiradas sobre una mesa. Una grilla prolija de fotos
 * cuadradas hubiera parecido un perfil de Instagram.
 */

/** Cada foto cae con su propia inclinación y desfase. Nada alineado.
 *  Son siete variantes y no cinco para que el patrón no se note al repetirse
 *  sobre diez fotos. */
const LAYOUT = [
  { rotate: -3.4, shift: "-6%", tape: true },
  { rotate: 2.8, shift: "7%", tape: false },
  { rotate: -1.9, shift: "-4%", tape: true },
  { rotate: 3.4, shift: "5%", tape: false },
  { rotate: -2.6, shift: "-7%", tape: true },
  { rotate: 1.7, shift: "3%", tape: false },
  { rotate: -4.1, shift: "-3%", tape: true },
];

function Polaroid({ photo, index }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const layout = LAYOUT[index % LAYOUT.length];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Cada una deriva a distinta velocidad: da profundidad al montón.
  const drift = 20 + (index % 3) * 14;
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  return (
    <motion.li
      ref={ref}
      className="relative flex justify-center"
      style={reduced ? undefined : { y, marginInlineStart: layout.shift }}
    >
      <motion.figure
        className="paper relative w-[76vw] max-w-[272px] rounded-[3px] p-3 pb-14"
        initial={
          reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 46, rotate: layout.rotate * 3, scale: 0.9 }
        }
        whileInView={{ opacity: 1, y: 0, rotate: layout.rotate, scale: 1 }}
        viewport={{ once: true, margin: "-14%" }}
        transition={{ type: "spring", stiffness: 74, damping: 14, mass: 1 }}
      >
        {/* Cinta: sujeta la foto contra el fondo */}
        {layout.tape && (
          <span
            className="pointer-events-none absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2"
            style={{
              background:
                "linear-gradient(180deg, rgba(245,238,222,0.42), rgba(226,214,190,0.30))",
              boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
            }}
            aria-hidden="true"
          />
        )}

        <div className="relative overflow-hidden bg-[#d9d0bd]">
          <img
            src={asset(photo.src)}
            alt={photo.alt}
            width={photo.w}
            height={photo.h}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover"
          />
          {/* Brillo del papel fotográfico */}
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(118deg, rgba(255,255,255,0.16) 0%, transparent 34%, transparent 68%, rgba(255,255,255,0.07) 100%)",
            }}
            aria-hidden="true"
          />
        </div>

        {photo.caption && (
          <figcaption className="absolute inset-x-3 bottom-3.5 text-center font-script text-xl leading-none text-[#4a4132]">
            {photo.caption}
          </figcaption>
        )}
      </motion.figure>
    </motion.li>
  );
}

export default function PhotoWall({ content, photos }) {
  return (
    <section className="relative px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto w-full max-w-2xl">
        <motion.div
          className="mb-14 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[0.58rem] font-light uppercase tracking-[0.4em] text-mist">
            {content.eyebrow}
          </span>
          <h2 className="mt-5 text-balance font-serif text-[clamp(1.9rem,8vw,2.8rem)] font-normal leading-tight text-gradient">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="mt-5 max-w-sm text-balance text-[0.9rem] font-light leading-relaxed text-mist">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        <ol className="flex flex-col items-center gap-14 sm:gap-16">
          {photos.map((photo, i) => (
            <Polaroid key={photo.src} photo={photo} index={i} />
          ))}
        </ol>

        {content.closing && (
          <motion.p
            className="mt-16 text-balance text-center font-serif text-[clamp(1.1rem,4.6vw,1.5rem)] italic leading-snug text-bone/85"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.closing}
          </motion.p>
        )}
      </div>
    </section>
  );
}
