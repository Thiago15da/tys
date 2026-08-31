import { motion } from "framer-motion";

/**
 * <SecretMemory/> — PLACEHOLDER.
 * Todo el texto sale de `secretContent` en mockData.js. Reemplazá ahí.
 * Este componente sólo define la puesta en escena.
 */

/** Barra de chocolate dibujada a mano (nada de librerías de íconos). */
function ChocolateIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" role="img" aria-label="Chocolate">
      <defs>
        <linearGradient id="choco-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c98a5b" />
          <stop offset="55%" stopColor="#9a5f36" />
          <stop offset="100%" stopColor="#6b3d22" />
        </linearGradient>
        <linearGradient id="choco-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g transform="rotate(-9 24 24)">
        <rect x="12" y="7" width="24" height="34" rx="3" fill="url(#choco-body)" />
        {/* Ranuras: 2 columnas × 4 filas */}
        <g stroke="#4a2915" strokeOpacity="0.55" strokeWidth="1.1" strokeLinecap="round">
          <path d="M12.8 15.5h22.4M12.8 24h22.4M12.8 32.5h22.4M24 7.8v32.4" />
        </g>
        {/* Relieve de cada cuadradito */}
        <g stroke="#ffffff" strokeOpacity="0.16" strokeWidth="0.9" strokeLinecap="round">
          <path d="M14.4 14h8M25.6 14h8M14.4 22.5h8M25.6 22.5h8M14.4 31h8M25.6 31h8" />
        </g>
        <rect x="12" y="7" width="24" height="34" rx="3" fill="url(#choco-shine)" />
        <rect
          x="12"
          y="7"
          width="24"
          height="34"
          rx="3"
          fill="none"
          stroke="#3a2011"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

export default function SecretMemory({ content }) {
  const paragraphs = Array.isArray(content.body) ? content.body : [content.body].filter(Boolean);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Ícono con halo y flotación permanente */}
      <motion.div
        className="relative mb-7 h-16 w-16"
        initial={{ scale: 0.3, rotate: -25, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 190, damping: 12, delay: 0.12 }}
      >
        <span
          className="absolute -inset-5 rounded-full blur-2xl animate-breathe"
          style={{ background: "radial-gradient(circle, rgba(201,138,91,0.55), transparent 68%)" }}
          aria-hidden="true"
        />
        <motion.div
          className="relative h-full w-full drop-shadow-[0_10px_22px_rgba(0,0,0,0.55)]"
          animate={{ y: [0, -5, 0], rotate: [0, 2.5, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChocolateIcon />
        </motion.div>
      </motion.div>

      <motion.span
        className="text-[0.55rem] font-light uppercase tracking-[0.42em] text-cocoa"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.7 }}
      >
        {content.eyebrow}
      </motion.span>

      <motion.h3
        className="mt-4 text-balance font-serif text-[clamp(1.5rem,7vw,2.15rem)] font-normal leading-[1.18] text-bone"
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.36, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {content.title}
      </motion.h3>

      <motion.div
        className="mt-5 max-w-sm space-y-3"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {paragraphs.map((text, i) => (
          <p key={i} className="text-[0.9rem] font-light leading-[1.75] text-mist">
            {text}
          </p>
        ))}
      </motion.div>

      {content.signature && (
        <motion.span
          className="mt-7 font-serif text-lg italic text-cocoa/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.9 }}
        >
          {content.signature}
        </motion.span>
      )}
    </div>
  );
}
