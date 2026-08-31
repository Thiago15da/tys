import { useCallback, useEffect, useRef, useState } from "react";

/** Longitud del sufijo de `buffer` que es prefijo de `target`. */
function matchProgress(buffer, target) {
  for (let len = Math.min(buffer.length, target.length); len > 0; len -= 1) {
    if (target.startsWith(buffer.slice(-len))) return len;
  }
  return 0;
}

/**
 * Konami custom por teclado: escucha globalmente y dispara `onUnlock` cuando
 * el visitante teclea la secuencia exacta (case-insensitive, sin necesidad de
 * foco en ningún input).
 *
 * Devuelve `progress` (0..sequence.length) para poder dibujar una pista
 * visual mínima mientras alguien está tecleando — el guiño dentro del guiño.
 */
export function useSecretCode(sequence, onUnlock, { enabled = true } = {}) {
  const [progress, setProgress] = useState(0);
  const bufferRef = useRef("");
  const callbackRef = useRef(onUnlock);
  callbackRef.current = onUnlock;

  useEffect(() => {
    if (!enabled) return;
    const target = String(sequence || "").toUpperCase();
    if (!target) return;

    const reset = () => {
      bufferRef.current = "";
      setProgress(0);
    };

    const handleKey = (event) => {
      const el = event.target;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      // Sólo caracteres imprimibles; ignoramos Shift, flechas, etc.
      if (!event.key || event.key.length !== 1) return;

      bufferRef.current = (bufferRef.current + event.key.toUpperCase()).slice(-target.length);

      if (bufferRef.current === target) {
        reset();
        callbackRef.current?.();
        return;
      }
      setProgress(matchProgress(bufferRef.current, target));
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sequence, enabled]);

  return progress;
}

/**
 * Fallback táctil: el 90% de las visitas son desde un celular y ahí no hay
 * teclado. Mantener presionado un elemento durante `duration` ms dispara lo
 * mismo que la secuencia. Devuelve props listos para hacer spread en el DOM.
 */
export function useLongPress(onTrigger, { duration = 1600 } = {}) {
  const timerRef = useRef(null);
  const startedRef = useRef(0);
  const [holding, setHolding] = useState(false);
  const callbackRef = useRef(onTrigger);
  callbackRef.current = onTrigger;

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
    setHolding(false);
  }, []);

  const start = useCallback(
    (event) => {
      // Sólo botón principal / dedo
      if (event.button != null && event.button !== 0) return;
      startedRef.current = Date.now();
      setHolding(true);
      timerRef.current = setTimeout(() => {
        setHolding(false);
        callbackRef.current?.();
      }, duration);
    },
    [duration],
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return {
    holding,
    duration,
    handlers: {
      onPointerDown: start,
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,
      onContextMenu: (e) => e.preventDefault(),
    },
  };
}
