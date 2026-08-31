import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SecretMemory from "./SecretMemory";

/** Chispas que suben al abrir: 14 partículas con trayectorias irregulares. */
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: (i / 13) * 100,
  delay: 0.1 + (i % 5) * 0.09,
  size: 2 + (i % 3),
  travel: 90 + (i % 4) * 46,
  drift: ((i % 5) - 2) * 16,
}));

export default function SecretModal({ content, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  /* Cerrar con Escape + bloqueo de scroll de fondo + foco en el botón */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.dataset.locked = "true";
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 420);

    return () => {
      document.removeEventListener("keydown", onKey);
      delete document.body.dataset.locked;
      clearTimeout(focusTimer);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center px-5 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="secret-title"
    >
      {/* Telón */}
      <motion.button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink-900/75 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
      />

      {/* Chispas */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 overflow-hidden" aria-hidden="true">
        {SPARKS.map((spark) => (
          <motion.span
            key={spark.id}
            className="absolute bottom-6 rounded-full bg-cocoa"
            style={{ left: `${spark.x}%`, width: spark.size, height: spark.size }}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{ opacity: [0, 0.85, 0], y: -spark.travel, x: spark.drift }}
            transition={{ duration: 2.6, delay: spark.delay, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>

      {/* Panel */}
      <motion.div
        ref={panelRef}
        id="secret-title"
        className="glass-dense relative w-full max-w-md overflow-hidden rounded-[28px] px-7 py-11 sm:px-10"
        initial={{ opacity: 0, y: 46, scale: 0.9, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, y: 26, scale: 0.94, filter: "blur(10px)" }}
        transition={{ type: "spring", stiffness: 130, damping: 18, mass: 0.9 }}
      >
        {/* Resplandor cálido detrás del contenido */}
        <span
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-[70px]"
          style={{ background: "radial-gradient(circle, rgba(201,138,91,0.42), transparent 70%)" }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute inset-x-12 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,138,91,0.75), transparent)" }}
          aria-hidden="true"
        />

        <div className="relative">
          <SecretMemory content={content} />

          <motion.button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="mt-9 w-full rounded-full border border-white/10 bg-white/[0.04] py-3 text-[0.66rem] font-light uppercase tracking-[0.34em] text-mist transition-colors duration-400 hover:border-cocoa/40 hover:text-bone"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.975 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.82, duration: 0.7 }}
          >
            {content.dismiss}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
