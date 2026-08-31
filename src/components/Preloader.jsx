import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * La entrada.
 *
 * El número NO es decorativo: la curva sube rápido hasta ~70, se frena en la
 * zona media (que es donde el ojo cree que "está pasando algo") y sólo llega a
 * 100 cuando las fuentes y los assets terminaron de verdad.
 *
 * Al llegar a 100 la pantalla NO se va sola: espera un toque.
 *
 * Eso no es un adorno. Ningún navegador deja que una página arranque sonando
 * por su cuenta —bloquean el audio hasta que quien la abre hace algo— y en un
 * celular es todavía más estricto. Ese toque es el permiso, y sin él la música
 * no sonaría jamás. Convertir el bloqueo en un gesto deliberado además queda
 * mejor: en vez de que la música te caiga encima, entrás vos.
 */
export default function Preloader({ content, onEnter, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [armed, setArmed] = useState(false);
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
        setTimeout(() => setArmed(true), 420);
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const rounded = Math.round(progress);

  /* El toque tiene que disparar el audio en el mismo instante en que ocurre:
     si esto se demora hasta el próximo render, el navegador ya no lo cuenta
     como gesto del usuario y bloquea el sonido. */
  const handleEnter = () => {
    if (!armed || exiting) return;
    onEnter?.();
    setExiting(true);
  };

  return (
    <motion.div
      role={armed ? "button" : undefined}
      tabIndex={armed ? 0 : undefined}
      aria-label={armed ? content.enter : undefined}
      onPointerDown={handleEnter}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleEnter();
      }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-900 ${armed ? "cursor-pointer" : ""}`}
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
          {content.eyebrow}
        </motion.span>

        <AnimatePresence mode="wait">
          {armed ? (
            /* Listo: la invitación a entrar */
            <motion.div
              key="entrar"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="font-serif text-[clamp(1.6rem,7vw,2.3rem)] leading-none text-gradient"
                animate={{ opacity: [0.72, 1, 0.72] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                {content.enter}
              </motion.span>

              {/* Aro que late hacia afuera, como el agua cuando cae algo */}
              <span className="relative mt-9 grid h-14 w-14 place-items-center">
                {[0, 1].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute inset-0 rounded-full border border-gold/35"
                    animate={{ opacity: [0.55, 0], scale: [0.7, 1.6] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: i * 1.3 }}
                  />
                ))}
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              </span>

              <span className="mt-8 flex items-center gap-2 text-[0.55rem] font-light uppercase tracking-[0.34em] text-ash">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
                  <path d="M4 9v6h4l5 4V5L8 9H4Zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4Zm-2.5-8.3v2.1a7 7 0 0 1 0 12.4v2.1a9 9 0 0 0 0-16.6Z" />
                </svg>
                {content.hint}
              </span>
            </motion.div>
          ) : (
            /* Cargando */
            <motion.div key="cargando" className="flex flex-col items-center" exit={{ opacity: 0 }}>
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
                <motion.div
                  className="absolute top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full bg-gold-soft blur-[1px]"
                  style={{ left: `calc(${progress}% - 1.5px)` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
