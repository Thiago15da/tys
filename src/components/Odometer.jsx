import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

/**
 * ============================================================================
 *  ODÓMETRO
 * ============================================================================
 *  La cinta tiene ONCE celdas: 0,1,2…9 y un 0 duplicado al final.
 *
 *  ¿Por qué el 0 de más? Porque un odómetro real nunca gira para atrás. Al
 *  pasar de 9 a 0, si animáramos al índice 0 la rueda retrocedería nueve
 *  posiciones y se vería como un rebobinado. Con la celda extra rodamos hacia
 *  adelante hasta ese 0 duplicado y recién ahí saltamos —sin animación, en el
 *  mismo frame y visualmente idéntico— al 0 real.
 * ============================================================================
 */

const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const STEP = 100 / CELLS.length; // una celda = 1/11 del alto de la cinta
const SPRING = { type: "spring", stiffness: 205, damping: 24, mass: 0.62 };

/** Un poco más de 1em: las serifas de los dígitos necesitan aire o se cortan. */
const CELL_HEIGHT = "1.14em";

function Digit({ value, digitClassName }) {
  const reduced = useReducedMotion();

  // Animamos el ÍNDICE de celda (un número puro, que es lo que la física de
  // resorte sabe interpolar) y recién después lo traducimos a porcentaje.
  // Ojo: pasarle un número crudo a `y` significaría PÍXELES, no porcentaje.
  const cell = useMotionValue(value);
  const y = useTransform(cell, (index) => `${-index * STEP}%`);
  const previous = useRef(value);

  useEffect(() => {
    if (value === previous.current) return;
    const wrapped = value < previous.current;
    previous.current = value;

    if (reduced) {
      cell.set(value);
      return;
    }

    let cancelled = false;
    let controls;

    if (wrapped) {
      controls = animate(cell, 10, SPRING);
      controls.then(() => {
        if (cancelled) return;
        cell.set(0); // salto invisible: la celda 10 y la 0 muestran lo mismo
        if (value !== 0) animate(cell, value, SPRING);
      });
    } else {
      controls = animate(cell, value, SPRING);
    }

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [value, cell, reduced]);

  return (
    <span
      className="relative inline-block overflow-hidden align-baseline"
      style={{ height: CELL_HEIGHT, width: "0.62em" }}
      aria-hidden="true"
    >
      <motion.span className="absolute inset-x-0 top-0 block" style={{ y }}>
        {CELLS.map((digit, i) => (
          <span
            key={i}
            className={`block text-center tabular-nums ${digitClassName}`}
            style={{ height: CELL_HEIGHT, lineHeight: CELL_HEIGHT }}
          >
            {digit}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Número completo. `minDigits` mantiene el ancho estable (02, 09, 10…) para
 * que las columnas no salten cada vez que se suma una cifra.
 *
 * `digitClassName` se aplica a CADA celda de la cinta, no al contenedor: la
 * cinta se mueve con un transform y `background-clip: text` no atraviesa esa
 * capa, así que un degradé puesto arriba dejaría los números invisibles.
 */
export default function Odometer({ value, minDigits = 2, className = "", digitClassName = "" }) {
  const digits = String(Math.max(0, Math.floor(value))).padStart(minDigits, "0").split("");

  return (
    <span className={`inline-flex leading-none ${className}`}>
      {/* Las cintas son decorativas (aria-hidden); el lector de pantalla lee
          este número y nada más. */}
      <span className="sr-only">{value}</span>
      {digits.map((digit, i) => (
        <Digit key={`${digits.length}-${i}`} value={Number(digit)} digitClassName={digitClassName} />
      ))}
    </span>
  );
}
