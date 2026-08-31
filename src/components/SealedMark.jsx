import { useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

/**
 * La marca cerrada.
 *
 * Antes esto era una tarjeta entera con título, candado y frases. Era
 * demasiado: dar por hecho una boda el mismo día en que le estás pidiendo ser
 * tu novia pesa mucho, y ocupaba media pantalla diciéndolo.
 *
 * Ahora es un candado chiquito y mudo al lado de la firma. No dice nada. No
 * anuncia nada. Al tocarlo tiembla, se insinúa una palabra imposible de leer
 * —desenfocada de más, un suspiro de opacidad— y se cierra sola.
 *
 * Quien no lo toque nunca se entera de que estaba. Quien lo toque no va a
 * saber qué decía. Las dos cosas están bien: es una promesa para más adelante,
 * no un anuncio para hoy.
 */
export default function SealedMark({ word }) {
  const [visible, setVisible] = useState(false);
  const controls = useAnimationControls();
  const timer = useRef(null);

  const tocar = () => {
    controls.start({
      x: [0, -4, 3, -2, 0],
      transition: { duration: 0.38, ease: "easeInOut" },
    });
    setVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 1500);
  };

  return (
    <span className="relative mt-7 block">
      <motion.button
        type="button"
        onClick={tocar}
        animate={controls}
        aria-hidden="true"
        tabIndex={-1}
        className="mx-auto block text-ash/35 transition-colors duration-500 hover:text-ash/70"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
          <path d="M8 10V7.6a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="5.5" y="10" width="13" height="9" rx="2.2" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </motion.button>

      {/* La palabra: aparece un instante y no se deja leer. */}
      <motion.span
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-serif text-lg text-bone"
        style={{ filter: "blur(9px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 0.22 : 0 }}
        transition={{ duration: visible ? 0.5 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        {word}
      </motion.span>
    </span>
  );
}
