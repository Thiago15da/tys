import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { useTimeElapsed } from "../hooks/useTimeElapsed";
import Odometer from "./Odometer";

/**
 * Contador en vivo de la cápsula.
 *
 * El cálculo es calendario-exacto (ver useTimeElapsed): "3 meses" son tres
 * meses de verdad, no 90 días promediados. Los segundos laten con cada tick
 * para que se note, incluso de reojo, que esto está corriendo ahora mismo.
 */

function Unit({ value, label, minDigits, delay, pulse }) {
  const reduced = useReducedMotion();
  const scale = useMotionValue(1);

  // El latido se dispara imperativamente sobre un MotionValue.
  //
  // La tentación es poner `key={value}` para reiniciar la animación en cada
  // tick — y es justo lo que NO hay que hacer: React desmontaría y volvería a
  // montar el <Odometer/>, que perdería su estado y aparecería de golpe en el
  // número nuevo en vez de rodar hasta él.
  useEffect(() => {
    if (!pulse || reduced) return;
    const controls = animate(scale, [1, 1.04, 1], { duration: 0.55, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value, pulse, reduced, scale]);

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ type: "spring", stiffness: 70, damping: 16, delay }}
    >
      <motion.span
        className="block font-serif text-[clamp(2rem,9vw,3.1rem)] font-normal"
        style={pulse ? { scale } : undefined}
      >
        <Odometer value={value} minDigits={minDigits} digitClassName="text-gradient" />
      </motion.span>

      <span className="mt-2.5 text-[0.55rem] font-light uppercase tracking-[0.3em] text-ash">
        {label}
      </span>
    </motion.div>
  );
}

export default function TimeCapsuleCounter({ startDate, content }) {
  const elapsed = useTimeElapsed(startDate);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  const units = [
    { key: "years", value: elapsed.years, label: content.labels.years, minDigits: 1 },
    { key: "months", value: elapsed.months, label: content.labels.months, minDigits: 1 },
    { key: "days", value: elapsed.days, label: content.labels.days, minDigits: 2 },
    { key: "hours", value: elapsed.hours, label: content.labels.hours, minDigits: 2 },
    { key: "minutes", value: elapsed.minutes, label: content.labels.minutes, minDigits: 2 },
    { key: "seconds", value: elapsed.seconds, label: content.labels.seconds, minDigits: 2, pulse: true },
  ];

  return (
    <section ref={ref} className="relative px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto w-full max-w-3xl">
        {/* Encabezado */}
        <motion.div
          className="mb-12 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="flex items-center gap-2 text-[0.58rem] font-light uppercase tracking-[0.4em] text-mist">
            <motion.span
              className="h-1 w-1 rounded-full bg-gold"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {content.eyebrow}
          </span>

          <h2 className="mt-5 font-serif text-[clamp(2rem,8vw,3rem)] font-normal leading-tight text-gradient">
            {content.title}
          </h2>
        </motion.div>

        {/* El reloj */}
        <motion.div
          className="glass relative rounded-[26px] px-4 py-9 sm:px-8 sm:py-11"
          initial={{ opacity: 0, y: 34, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ type: "spring", stiffness: 58, damping: 16 }}
        >
          {/* Filo de luz superior */}
          <span
            className="pointer-events-none absolute inset-x-10 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,182,120,0.5), transparent)" }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-3 gap-y-8 sm:grid-cols-6 sm:gap-y-0">
            {units.map((unit, i) => (
              <Unit
                key={unit.key}
                value={unit.value}
                label={unit.label}
                minDigits={unit.minDigits}
                pulse={unit.pulse}
                delay={inView ? i * 0.07 : 0}
              />
            ))}
          </div>
        </motion.div>

        <motion.p
          className="mt-8 text-center text-[0.82rem] font-light italic text-ash"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          {content.caption}
        </motion.p>
      </div>
    </section>
  );
}
