import { useCallback, useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Magnetic hover: el elemento persigue al cursor con física de resorte y
 * vuelve solo al centro. Se apaga en dispositivos táctiles (ahí no hay hover
 * y el efecto sólo agregaría lag al tap).
 *
 * Uso:
 *   const magnet = useMagnetic();
 *   <motion.button ref={magnet.ref} style={magnet.style} {...magnet.handlers} />
 */
export function useMagnetic({ strength = 0.32, springs = { stiffness: 260, damping: 18, mass: 0.5 } } = {}) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, springs);
  const y = useSpring(rawY, springs);

  // El contenido interno se mueve un poco menos: da sensación de profundidad.
  const innerX = useTransform(x, (v) => v * 0.4);
  const innerY = useTransform(y, (v) => v * 0.4);

  const isFinePointer = () =>
    typeof window !== "undefined" && window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

  const onPointerMove = useCallback(
    (event) => {
      if (!isFinePointer() || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      rawX.set((event.clientX - (rect.left + rect.width / 2)) * strength);
      rawY.set((event.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [rawX, rawY, strength],
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return {
    ref,
    style: { x, y },
    innerStyle: { x: innerX, y: innerY },
    handlers: { onPointerMove, onPointerLeave },
  };
}
