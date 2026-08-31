import { useEffect, useState } from "react";

/**
 * Diferencia calendario-exacta entre dos fechas.
 * No divide por 86.400.000: pide prestado unidad por unidad, así "1 mes"
 * significa un mes real (28/29/30/31 días) y no un promedio.
 */
function calendarDiff(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let minutes = to.getMinutes() - from.getMinutes();
  let seconds = to.getSeconds() - from.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    // Días del mes anterior al de `to` (día 0 del mes actual = último del previo)
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}

const ZERO = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

/**
 * Reloj en vivo desde una fecha base.
 *
 * El tick es un setTimeout auto-corregido alineado al borde del segundo:
 * no acumula deriva como setInterval y no quema batería como un rAF a 60fps.
 * Además se re-sincroniza al volver de segundo plano (iOS congela timers).
 *
 * @param {string|Date} startDate  Fecha base (ISO local o Date)
 * @returns {{years,months,days,hours,minutes,seconds, totalSeconds, future:boolean}}
 */
export function useTimeElapsed(startDate) {
  const [elapsed, setElapsed] = useState(() => {
    const start = new Date(startDate);
    const now = new Date();
    return now < start ? { ...ZERO, totalSeconds: 0, future: true } : { ...calendarDiff(start, now), totalSeconds: Math.floor((now - start) / 1000), future: false };
  });

  useEffect(() => {
    const start = new Date(startDate);
    if (Number.isNaN(start.getTime())) return;

    let timer;

    const compute = () => {
      const now = new Date();
      if (now < start) {
        setElapsed({ ...ZERO, totalSeconds: 0, future: true });
        return;
      }
      setElapsed({
        ...calendarDiff(start, now),
        totalSeconds: Math.floor((now - start) / 1000),
        future: false,
      });
    };

    const tick = () => {
      compute();
      // +8ms de colchón para caer del lado correcto del borde del segundo
      timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 8);
    };

    tick();

    const resync = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timer);
        tick();
      }
    };
    document.addEventListener("visibilitychange", resync);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", resync);
    };
  }, [startDate]);

  return elapsed;
}
