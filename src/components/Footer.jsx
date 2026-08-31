import { AnimatePresence, motion } from "framer-motion";

/**
 * Footer y — sobre todo — la puerta trasera táctil.
 *
 * El Konami por teclado no sirve en un celular, y esta página se va a ver
 * casi siempre en un celular. Así que el punto decorativo del final es también
 * el disparador: mantenerlo presionado ~1,6s abre el mismo secreto. Mientras
 * lo sostenés, un anillo se completa alrededor. No hay ninguna etiqueta que lo
 * anuncie: se descubre apoyando el dedo, que es exactamente la gracia.
 *
 * Una vez descubierto, el punto queda "abierto": un toque simple lo vuelve a
 * abrir, sin obligar a repetir la ceremonia cada vez.
 */
export default function Footer({
  content,
  codeProgress = 0,
  codeLength = 0,
  longPress,
  unlocked = false,
  onQuickOpen,
}) {
  const { holding, duration, handlers } = longPress;

  return (
    <footer className="relative px-6 pb-40 pt-8 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <span className="h-px w-16 bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* El punto: decorativo a la vista, puerta secreta al tacto */}
        <button
          type="button"
          {...handlers}
          onClick={unlocked ? onQuickOpen : undefined}
          aria-label={content.hint}
          className="relative my-8 grid h-12 w-12 place-items-center rounded-full"
        >
          {/* Anillo de carga de la pulsación */}
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <motion.circle
              cx="24"
              cy="24"
              r="15"
              fill="none"
              stroke="var(--color-cocoa)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 15}
              initial={{ strokeDashoffset: 2 * Math.PI * 15, opacity: 0 }}
              animate={
                holding
                  ? { strokeDashoffset: 0, opacity: 0.9 }
                  : { strokeDashoffset: 2 * Math.PI * 15, opacity: 0 }
              }
              transition={{
                strokeDashoffset: { duration: holding ? duration / 1000 : 0.3, ease: "linear" },
                opacity: { duration: 0.2 },
              }}
            />
          </svg>

          <motion.span
            className="block h-1.5 w-1.5 rounded-full bg-gold"
            animate={
              holding
                ? { scale: 1.9, backgroundColor: "#c98a5b" }
                : { scale: 1, backgroundColor: unlocked ? "#c98a5b" : "#d4b678" }
            }
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          />
          <motion.span
            className="absolute h-1.5 w-1.5 rounded-full bg-gold blur-[5px]"
            animate={{ opacity: [0.25, 0.65, 0.25], scale: [1, 2.4, 1] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
        </button>

        <span className="font-serif text-sm italic text-ash">{content.signature}</span>

        {/* Pista del código: sólo existe mientras alguien está tecleando */}
        <AnimatePresence>
          {codeProgress > 0 && (
            <motion.div
              className="mt-6 flex items-center gap-1.5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              aria-hidden="true"
            >
              {Array.from({ length: codeLength }).map((_, i) => (
                <motion.span
                  key={i}
                  className="h-[3px] w-[3px] rounded-full"
                  animate={{
                    backgroundColor: i < codeProgress ? "#c98a5b" : "rgba(255,255,255,0.14)",
                    scale: i < codeProgress ? 1.35 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
}
