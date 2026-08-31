import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Pre-loader cinemático.
 *
 * El número NO es decorativo: la curva sube rápido hasta ~70, se frena en la
 * zona media (que es donde el ojo cree que "está pasando algo") y sólo llega a
 * 100 cuando las fuentes y los assets terminaron de verdad. Después se
 * desvanece con un fundido + desenfoque que revela el Hero por debajo.
 */
export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const readyRef = useRef(false);

  /* Señal real de "ya cargó": fuentes tipográficas + window.load */
  useEffect(() => {
    let cancelled = false;
    const markReady = () => {
      if (!cancelled) readyRef.current = true;
    };

    const fonts = document.fonts?.ready ?? Promise.resolve();
    const windowLoad =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));

    Promise.all([fonts, windowLoad]).then(markReady);
    // Red de seguridad: nunca dejamos a nadie atrapado en la pantalla de carga.
    const failsafe = setTimeout(markReady, 4200);

    return () => {
      cancelled = true;
      clearTimeout(failsafe);
    };
  }, []);

  /* La curva */
  useEffect(() => {
    let frame;
    let value = 0;
    let last = performance.now();

    const loop = (now) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;

      const ceiling = readyRef.current ? 100 : 92;
      // Velocidad decreciente: rápido al principio, casi quieto cerca del techo.
      const speed = 26 + (ceiling - value) * 1.15;
      value = Math.min(value + speed * delta, ceiling);
      setProgress(value);

      if (value >= 99.9) {
        setProgress(100);
        setTimeout(() => setExiting(true), 380);
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const rounded = Math.round(progress);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-900"
      initial={{ opacity: 1 }}
      animate={exiting ? { opacity: 0, filter: "blur(14px)", scale: 1.04 } : { opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 1.05, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={() => exiting && onComplete?.()}
    >
      {/* Halo tenue detrás del número */}
      <div
        className="pointer-events-none absolute h-[46vh] w-[46vh] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--color-gold) 22%, transparent), transparent 70%)" }}
      />

      <motion.div
        className="relative flex flex-col items-center"
        animate={exiting ? { y: -18, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          className="mb-7 text-[0.62rem] font-light uppercase tracking-[0.45em] text-ash"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Cápsula del tiempo
        </motion.span>

        <span className="font-serif text-6xl leading-none tabular-nums text-gradient sm:text-7xl">
          {String(rounded).padStart(2, "0")}
          <span className="ml-1 align-super text-lg text-ash">%</span>
        </span>

        {/* La línea que se llena */}
        <div className="relative mt-9 h-px w-[54vw] max-w-[260px] overflow-hidden bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/40 via-gold to-gold-soft"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
          {/* Punto de luz que va montado en la punta de la línea */}
          <motion.div
            className="absolute top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full bg-gold-soft blur-[1px]"
            style={{ left: `calc(${progress}% - 1.5px)` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
