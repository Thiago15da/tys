import { useState } from "react";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { formatTime, useAudioControls, useAudioState } from "../lib/AudioEngine";
import { useMagnetic } from "../hooks/useMagnetic";

const RING_RADIUS = 20;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/* --------------------------------------------------------------- iconos */
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[13px] w-[13px] translate-x-[1px]" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a.6.6 0 0 0 .92.5l10.5-6.86a.6.6 0 0 0 0-1L8.92 4.64a.6.6 0 0 0-.92.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" fill="currentColor" aria-hidden="true">
      <rect x="7" y="5" width="3.4" height="14" rx="1.2" />
      <rect x="13.6" y="5" width="3.4" height="14" rx="1.2" />
    </svg>
  );
}

/* ---------------------------------------------------------- ecualizador */
/**
 * Cinco barras con duraciones primas entre sí: nunca se sincronizan, así que
 * el patrón no se siente en loop. En pausa colapsan a una línea plana.
 */
const BARS = [
  { h: [6, 15, 8], d: 0.72 },
  { h: [13, 5, 16], d: 0.94 },
  { h: [8, 18, 7], d: 0.63 },
  { h: [16, 7, 13], d: 0.86 },
  { h: [7, 12, 6], d: 1.05 },
];

function Equalizer({ playing, muted }) {
  return (
    <div className="flex h-[18px] items-end gap-[3px]" aria-hidden="true">
      {BARS.map((bar, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-gold-soft"
          animate={
            playing
              ? { height: bar.h, opacity: muted ? 0.35 : 0.9 }
              : { height: 2, opacity: 0.28 }
          }
          transition={
            playing
              ? { duration: bar.d, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
              : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
          style={{ height: 2 }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- player */
export default function AudioPlayer() {
  const { playing, time, duration, simulated, ducked, track } = useAudioState();
  const { toggle, seek, progress } = useAudioControls();
  const [expanded, setExpanded] = useState(false);
  const [touched, setTouched] = useState(false);
  const magnet = useMagnetic({ strength: 0.28 });

  const dashOffset = useTransform(progress, (v) => RING_LENGTH * (1 - v));

  const handleToggle = () => {
    setTouched(true);
    toggle();
  };

  const handleScrub = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    seek((event.clientX - rect.left) / rect.width);
  };

  return (
    <motion.div
      className="fixed right-4 z-[60] sm:right-6"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
      initial={{ opacity: 0, y: 28, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 340, damping: 30, mass: 0.8 }}
        className="glass-dense flex items-center gap-3 overflow-hidden rounded-full p-[7px] pr-3.5"
      >
        {/* Botón principal + anillo de progreso */}
        <motion.button
          ref={magnet.ref}
          type="button"
          onClick={handleToggle}
          onPointerMove={magnet.handlers.onPointerMove}
          onPointerLeave={magnet.handlers.onPointerLeave}
          style={magnet.style}
          whileTap={{ scale: 0.9 }}
          className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-bone"
          aria-label={playing ? "Pausar la música" : "Reproducir la música"}
        >
          <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="22" cy="22" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <motion.circle
              cx="22"
              cy="22"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>

          {/* Latido invitando al primer play */}
          <AnimatePresence>
            {!touched && !playing && (
              <motion.span
                className="absolute inset-0 rounded-full border border-gold/40"
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.55 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          <motion.span style={magnet.innerStyle} className="relative">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={playing ? "pause" : "play"}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                className="block"
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        </motion.button>

        {/* Zona expandible */}
        <AnimatePresence mode="popLayout" initial={false}>
          {expanded ? (
            <motion.div
              key="expanded"
              layout
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-w-0 flex-col gap-1.5 pr-1"
            >
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="font-serif text-[0.85rem] leading-none text-bone">{track.title}</span>
                <span className="text-[0.6rem] font-light tracking-wide text-ash">{track.artist}</span>
              </div>

              {/* Scrubber */}
              <div
                role="slider"
                tabIndex={0}
                aria-label="Posición de la canción"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(time)}
                onClick={handleScrub}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") seek((time + 5) / duration);
                  if (e.key === "ArrowLeft") seek((time - 5) / duration);
                }}
                className="group relative h-3 w-[140px] cursor-pointer sm:w-[168px]"
              >
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/12" />
                <motion.span
                  className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-gold"
                  style={{ scaleX: progress }}
                />
              </div>

              <div className="flex items-center gap-2 text-[0.58rem] tabular-nums text-ash">
                <span>{formatTime(time)}</span>
                <span className="opacity-40">/</span>
                <span>{formatTime(duration)}</span>
                {simulated && (
                  <span className="ml-1 rounded-full border border-white/10 px-1.5 py-px text-[0.5rem] uppercase tracking-[0.2em]">
                    demo
                  </span>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              className="flex items-center gap-2.5 whitespace-nowrap"
            >
              <Equalizer playing={playing} muted={ducked} />
              <span className="hidden font-serif text-[0.8rem] text-mist sm:inline">{track.title}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chevron: abre / cierra */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Contraer el reproductor" : "Expandir el reproductor"}
          aria-expanded={expanded}
          className="shrink-0 text-ash transition-colors duration-300 hover:text-bone"
        >
          <motion.svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <path d="M15 6 9 12l6 6" />
          </motion.svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
