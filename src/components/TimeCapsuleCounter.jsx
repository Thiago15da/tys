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

  /* La fecha todavía no llegó: en vez de seis ceros, una promesa. */
  if (elapsed.future) {
    return (
      <section ref={ref} className="relative px-5 py-24 sm:px-8 sm:py-28">
        <motion.div
          className="glass mx-auto flex w-full max-w-xl flex-col items-center rounded-[26px] px-6 py-12 text-center"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ type: "spring", stiffness: 58, damping: 16 }}
        >
          <span className="text-[0.58rem] font-light uppercase tracking-[0.4em] text-mist">
            {content.eyebrow}
          </span>
          <h2 className="mt-5 font-serif text-[clamp(1.8rem,7vw,2.6rem)] font-normal leading-tight text-gradient">
            {content.title}
          </h2>
          <motion.p
            className="mt-6 max-w-xs text-balance font-serif text-lg italic leading-relaxed text-gold-soft/80"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {content.pending}
          </motion.p>
        </motion.div>
      </section>
    );
  }

  /* Variante compacta: los días mandan, el resto acompaña en chico. */
  if (content.variant === "days") {
    return (
      <section ref={ref} className="relative px-5 py-20 sm:px-8 sm:py-24">
        <motion.div
          className="glass relative mx-auto flex w-full max-w-xl flex-col items-center overflow-hidden rounded-[26px] px-6 py-11 text-center"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ type: "spring", stiffness: 58, damping: 16 }}
        >
          {/* Amanecer: el resplandor cálido que sube por detrás (para Sol) */}
          <span
            className="pointer-events-none absolute -bottom-24 left-1/2 h-52 w-72 -translate-x-1/2 rounded-full blur-[64px]"
            style={{ background: "radial-gradient(circle, rgba(212,182,120,0.4), transparent 70%)" }}
            aria-hidden="true"
          />

          <span className="relative text-[0.58rem] font-light uppercase tracking-[0.4em] text-mist">
            {content.eyebrow}
          </span>

          <span className="relative mt-7 font-serif text-[clamp(4rem,22vw,7rem)] leading-none">
            <Odometer value={elapsed.days} minDigits={1} digitClassName="text-gradient" />
          </span>

          <span className="relative mt-3 text-[0.6rem] font-light uppercase tracking-[0.42em] text-gold/80">
            {content.title}
          </span>

          {/* El detalle fino: las horas siguen corriendo aunque el día no cambie */}
          <div className="relative mt-7 flex items-center gap-2.5 text-[0.66rem] tabular-nums text-ash">
            <Odometer value={elapsed.hours} minDigits={2} />
            <span className="opacity-40">:</span>
            <Odometer value={elapsed.minutes} minDigits={2} />
            <span className="opacity-40">:</span>
            <Odometer value={elapsed.seconds} minDigits={2} />
          </div>

          <p className="relative mt-7 max-w-xs text-balance text-[0.82rem] font-light italic leading-relaxed text-mist">
            {content.caption}
          </p>
        </motion.div>
      </section>
    );
  }

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
