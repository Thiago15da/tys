import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Paleta por capítulo. Las clases están escritas COMPLETAS a propósito:
 * Tailwind escanea el código fuente y no puede resolver nombres construidos
 * en runtime (`text-${accent}` no existiría en el CSS final).
 */
export const ACCENTS = {
  gold: { hex: "#d4b678", chip: "text-gold", border: "hover:border-gold/25" },
  rose: { hex: "#e7a8ac", chip: "text-rose", border: "hover:border-rose/25" },
  violet: { hex: "#8f7fd8", chip: "text-violet", border: "hover:border-violet/25" },
  teal: { hex: "#6fb7ac", chip: "text-teal", border: "hover:border-teal/25" },
};

/**
 * Tarjeta de la línea de tiempo.
 *
 * Dos animaciones apiladas, y es importante que estén en capas distintas:
 *
 *   · Capa externa (scroll)  → parallax + opacidad ligadas a la posición de la
 *     tarjeta en el viewport. Vive todo el tiempo, reacciona a cada píxel.
 *   · Capa interna (entrada) → fade-up + rotación + spring, una sola vez.
 *
 * Si las mezclás en el mismo nodo, el transform del scroll pisa al de entrada
 * y el rebote se pierde.
 */
export default function StoryCard({ chapter, index }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Asimetría: la dirección del giro y la fuerza del parallax dependen del
  // lado y del índice, así ninguna tarjeta entra igual que su vecina.
  const fromLeft = chapter.side === "left";
  const tilt = fromLeft ? -3.2 : 3.2;
  const drift = 26 + (index % 3) * 9;

  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.82, 1], [0.35, 1, 1, 0.35]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [0.965, 1, 1, 0.975]);

  const accent = ACCENTS[chapter.accent] ?? ACCENTS.gold;
  const paragraphs = Array.isArray(chapter.body) ? chapter.body : [chapter.body].filter(Boolean);

  // Con "reduce" activado la tarjeta sólo aparece: sin desplazamiento,
  // sin giro y sin desenfoque.
  const enter = { opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" };
  const rest = reduced
    ? { opacity: 0, y: 0, rotate: 0, filter: "blur(0px)" }
    : { opacity: 0, y: 64, rotate: tilt, filter: "blur(8px)" };

  return (
    <motion.div ref={ref} style={reduced ? undefined : { y, opacity, scale }}>
      <motion.article
        initial={rest}
        animate={inView ? enter : rest}
        transition={{
          type: "spring",
          stiffness: 62,
          damping: 15,
          mass: 1.1,
          opacity: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
          filter: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        }}
        className={
          chapter.pull
            ? "relative py-4"
            : `glass group relative rounded-[22px] p-6 transition-colors duration-500 sm:p-8 ${accent.border}`
        }
      >
        {chapter.pull ? (
          /* ---------------- Variante cita: rompe el ritmo de las cajas ---- */
          <>
            <span
              className="mb-4 block font-serif text-4xl leading-none"
              style={{ color: accent.hex, opacity: 0.35 }}
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="text-balance font-serif text-[clamp(1.4rem,5.6vw,2.1rem)] font-normal italic leading-[1.28] text-bone/90">
              {chapter.title}
            </p>
            {chapter.stamp && chapter.stamp !== "—" && (
              <span className="mt-5 block text-[0.58rem] uppercase tracking-[0.35em] text-ash">
                {chapter.stamp}
              </span>
            )}
          </>
        ) : (
          /* ---------------- Variante tarjeta ------------------------------ */
          <>
            {/* Brillo que sigue al borde superior — sólo se nota al pasar cerca */}
            <span
              className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              style={{ background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)` }}
              aria-hidden="true"
            />

            {chapter.media?.src && <CardMedia media={chapter.media} progress={scrollYProgress} />}

            <header className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <time className="text-[0.58rem] font-light uppercase tracking-[0.32em] text-ash">
                {chapter.stamp}
              </time>
              {chapter.kicker && (
                <>
                  <span className="h-px w-4 bg-white/15" aria-hidden="true" />
                  <span className={`text-[0.58rem] font-medium uppercase tracking-[0.28em] ${accent.chip}`}>
                    {chapter.kicker}
                  </span>
                </>
              )}
            </header>

            <h3 className="mt-3.5 text-balance font-serif text-[clamp(1.35rem,5.2vw,1.85rem)] font-normal leading-[1.22] text-bone">
              {chapter.title}
            </h3>

            {paragraphs.length > 0 && (
              <div className="mt-4 space-y-3.5">
                {paragraphs.map((text, i) => (
                  <p key={i} className="text-[0.92rem] font-light leading-[1.75] text-mist">
                    {text}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </motion.article>
    </motion.div>
  );
}

/** Imagen con parallax interno: se mueve más lento que la tarjeta. */
function CardMedia({ media, progress }) {
  const reduced = useReducedMotion();
  const imageY = useTransform(progress, [0, 1], ["-8%", "8%"]);

  return (
    <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-700">
      <motion.img
        src={media.src}
        alt={media.alt ?? ""}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-[116%] w-full object-cover"
        style={reduced ? undefined : { y: imageY }}
      />
      {/* Vela oscura abajo: el texto siguiente nunca compite con la foto */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-800/70 via-transparent to-transparent" />
    </div>
  );
}
