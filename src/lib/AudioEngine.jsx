import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import { asset } from "./asset";

/**
 * ============================================================================
 *  MOTOR DE AUDIO
 * ============================================================================
 *  Dos contextos a propósito:
 *
 *   · AudioControlsContext → objeto ESTABLE (nunca cambia de identidad).
 *     Lo consume App / el easter egg para bajar el volumen sin re-renderizar.
 *
 *   · AudioStateContext → estado volátil (playing, tiempo, etc.).
 *     Lo consume sólo el reproductor, así el resto de la página no re-renderiza
 *     mientras suena la música.
 *
 *  El progreso de la barra viaja por un MotionValue: se anima a 60fps sin
 *  provocar un solo render de React.
 *
 *  MODO SIMULADO: si el mp3 no existe todavía (o el navegador no puede
 *  decodificarlo), el motor sigue corriendo con un reloj virtual. La UI, el
 *  ecualizador y la barra funcionan igual — se puede maquetar sin el archivo.
 * ============================================================================
 */

const AudioControlsContext = createContext(null);
const AudioStateContext = createContext(null);

const RAMP_MS = 700; // duración del fundido de volumen (ducking)

export function AudioProvider({ track, children }) {
  const [playing, setPlaying] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [ready, setReady] = useState(false);
  const [ducked, setDucked] = useState(false);
  const [duration, setDuration] = useState(track.fallbackDuration ?? 210);
  const [displayTime, setDisplayTime] = useState(0);

  /** 0..1 — alimenta el anillo de progreso sin re-render. */
  const progress = useMotionValue(0);

  const audioRef = useRef(null);
  const timeRef = useRef(0); // reloj maestro (real o virtual)
  const rampRef = useRef(0);

  /* ---------------------------------------------------------------- setup */
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.loop = true;
    audio.volume = track.volume ?? 0.6;
    audio.crossOrigin = "anonymous";
    audio.src = asset(track.src);
    audioRef.current = audio;

    const onMeta = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
      setReady(true);
      setSimulated(false);
    };
    const onError = () => {
      // Sin archivo (o formato no soportado): seguimos en modo simulado.
      setSimulated(true);
      setReady(true);
    };

    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      cancelAnimationFrame(rampRef.current);
    };
  }, [track.src, track.volume]);

  /* --------------------------------------------------------- play / pause */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!playing) {
      audio.pause();
      return;
    }
    if (simulated) return; // el reloj virtual lo maneja el rAF de abajo

    const attempt = audio.play();
    if (attempt?.catch) {
      attempt.catch(() => setSimulated(true));
    }
  }, [playing, simulated]);

  /* ------------------------------------------------------------- el reloj */
  useEffect(() => {
    if (!playing) return;

    let frame;
    let last = performance.now();
    let lastPush = 0;

    const loop = (now) => {
      const delta = (now - last) / 1000;
      last = now;

      if (simulated) {
        timeRef.current = (timeRef.current + delta) % duration;
      } else {
        timeRef.current = audioRef.current?.currentTime ?? timeRef.current;
      }

      progress.set(duration ? Math.min(timeRef.current / duration, 1) : 0);

      // El texto del tiempo sólo necesita 4 refrescos por segundo.
      if (now - lastPush > 250) {
        lastPush = now;
        setDisplayTime(timeRef.current);
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [playing, simulated, duration, progress]);

  /* ------------------------------------------------- fundido de volumen  */
  const rampVolume = useCallback((to) => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(rampRef.current);
    const from = audio.volume;
    const started = performance.now();

    const step = (now) => {
      const t = Math.min((now - started) / RAMP_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      audio.volume = from + (to - from) * eased;
      if (t < 1) rampRef.current = requestAnimationFrame(step);
    };
    rampRef.current = requestAnimationFrame(step);
  }, []);

  /* ------------------------------------------------------------ controles */
  const controls = useMemo(
    () => ({
      toggle: () => setPlaying((p) => !p),
      play: () => setPlaying(true),
      pause: () => setPlaying(false),

      /** Salta a una posición 0..1 de la pista. */
      seek: (ratio) => {
        const clamped = Math.max(0, Math.min(1, ratio));
        const seconds = clamped * duration;
        timeRef.current = seconds;
        progress.set(clamped);
        setDisplayTime(seconds);
        if (audioRef.current && !simulated) audioRef.current.currentTime = seconds;
      },

      /** Baja el volumen (easter egg desbloqueado). */
      duck: () => {
        setDucked(true);
        rampVolume(track.duckedVolume ?? 0.12);
      },

      /** Vuelve al volumen normal. */
      restore: () => {
        setDucked(false);
        rampVolume(track.volume ?? 0.6);
      },

      progress,
    }),
    // `duration`/`simulated` se leen vía closure, pero el objeto sólo se
    // recrea cuando esos valores realmente cambian (y no en cada tick).
    [duration, simulated, progress, rampVolume, track.duckedVolume, track.volume],
  );

  const state = useMemo(
    () => ({ playing, simulated, ready, ducked, duration, time: displayTime, track }),
    [playing, simulated, ready, ducked, duration, displayTime, track],
  );

  return (
    <AudioControlsContext.Provider value={controls}>
      <AudioStateContext.Provider value={state}>{children}</AudioStateContext.Provider>
    </AudioControlsContext.Provider>
  );
}

export function useAudioControls() {
  const ctx = useContext(AudioControlsContext);
  if (!ctx) throw new Error("useAudioControls debe usarse dentro de <AudioProvider>");
  return ctx;
}

export function useAudioState() {
  const ctx = useContext(AudioStateContext);
  if (!ctx) throw new Error("useAudioState debe usarse dentro de <AudioProvider>");
  return ctx;
}

/** 132 → "2:12" */
export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
