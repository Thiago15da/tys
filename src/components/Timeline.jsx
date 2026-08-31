import { forwardRef, useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import StoryCard, { ACCENTS } from "./StoryCard";

/**
 * El nodo sobre el riel. Se enciende cuando su tarjeta entra en cuadro:
 * es la señal de "vas por acá" sin necesidad de un indicador explícito.
 */
function Node({ accent, active }) {
  const hex = (ACCENTS[accent] ?? ACCENTS.gold).hex;

  return (
    <div className="absolute left-[11px] top-8 -translate-x-1/2 lg:left-1/2" aria-hidden="true">
      <motion.span
        className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ opacity: active ? 0.55 : 0, scale: active ? 1 : 0.5 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: `radial-gradient(circle, ${hex}55, transparent 68%)` }}
      />
      <motion.span
        className="relative block h-[7px] w-[7px] rounded-full border"
        animate={{
          backgroundColor: active ? hex : "#14141b",
          borderColor: active ? hex : "rgba(255,255,255,0.18)",
          scale: active ? 1 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
    </div>
  );
}

function TimelineItem({ chapter, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const onLeft = chapter.side === "left";

  return (
    <li ref={ref} className="relative lg:grid lg:grid-cols-2 lg:gap-x-16">
      <Node accent={chapter.accent} active={inView} />

      <div
        className={[
          "pl-9 sm:pl-11 lg:pl-0",
          chapter.pull
            ? "lg:col-span-2 lg:mx-auto lg:max-w-xl lg:text-center"
            : onLeft
              ? "lg:col-start-1 lg:pr-2"
              : "lg:col-start-2 lg:pl-2",
        ].join(" ")}
      >
        <StoryCard chapter={chapter} index={index} />
      </div>
    </li>
  );
}

/**
 * Línea de tiempo vertical.
 *
 * El riel no está dibujado de entrada: se traza a medida que bajás, atado al
 * progreso de scroll de la sección y suavizado con un spring para que la punta
 * no tiemble en scroll con inercia (iOS).
 */
const Timeline = forwardRef(function Timeline({ chapters }, ref) {
  const listRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 78%", "end 62%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <section ref={ref} className="relative mx-auto w-full max-w-5xl px-5 py-8 sm:px-8">
      <div ref={listRef} className="relative">
        {/* Riel */}
        <div
          className="absolute inset-y-0 left-[11px] w-px lg:left-1/2 lg:-translate-x-1/2"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.09] to-transparent" />
          <motion.div
            className="absolute inset-0 origin-top"
            style={{
              scaleY,
              background:
                "linear-gradient(180deg, var(--color-gold) 0%, var(--color-rose) 45%, var(--color-violet) 78%, transparent 100%)",
              opacity: 0.7,
            }}
          />
        </div>

        <ol className="relative space-y-20 sm:space-y-24 lg:space-y-32">
          {chapters.map((chapter, index) => (
            <TimelineItem key={chapter.id} chapter={chapter} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
});

export default Timeline;
