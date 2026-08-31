import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Barra de lectura de 1px, arriba de todo.
 *
 * Detalle escondido: el color no es fijo. Arranca en oro, vira a rosa en la
 * mitad de la historia y termina en verde-agua justo cuando llegás al final.
 * Nadie lo nota conscientemente; todo el mundo lo siente.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.0008,
  });

  const background = useTransform(
    scrollYProgress,
    [0, 0.45, 0.85, 1],
    ["#d4b678", "#e7a8ac", "#8f7fd8", "#6fb7ac"],
  );

  // El glow sólo aparece en el tramo final: premio por llegar.
  const glow = useTransform(scrollYProgress, [0, 0.86, 1], [0, 0, 0.9]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px" aria-hidden="true">
      <motion.div
        className="h-full w-full origin-left"
        style={{ scaleX, background }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-[6px] origin-left blur-[5px]"
        style={{ scaleX, background, opacity: glow }}
      />
    </div>
  );
}
