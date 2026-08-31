import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Fondo dinámico en tres capas, todo detrás del contenido (z -10):
 *
 *   1. Aurora  → tres manchas gigantes desenfocadas que se desplazan lento.
 *   2. Polvo   → partículas microscópicas en canvas, deriva vertical suave.
 *   3. Grano   → textura de film sobre todo, para matar el banding de los
 *                degradés y darle cuerpo de "película" a la pantalla.
 *
 * `mode` alterna la paleta: "default" (violeta/rosa/oro) vs "secret"
 * (cacao/ámbar), que es lo que dispara el Konami.
 */

const PALETTES = {
  default: [
    "color-mix(in oklab, var(--color-violet) 55%, transparent)",
    "color-mix(in oklab, var(--color-rose) 45%, transparent)",
    "color-mix(in oklab, var(--color-gold) 32%, transparent)",
  ],
  secret: [
    "color-mix(in oklab, var(--color-cocoa) 60%, transparent)",
    "color-mix(in oklab, var(--color-cocoa-deep) 65%, transparent)",
    "color-mix(in oklab, var(--color-gold) 48%, transparent)",
  ],
};

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

function DustCanvas({ secret }) {
  const canvasRef = useRef(null);
  const secretRef = useRef(secret);
  secretRef.current = secret;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Densidad proporcional al área. El techo es bajo a propósito: cada
      // partícula es un arco que se redibuja 60 veces por segundo, y arriba
      // de ~35 no se nota ninguna diferencia salvo en la batería.
      const count = Math.min(Math.round((width * height) / 42000), 34);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.15 + 0.35,
        vy: -(Math.random() * 0.16 + 0.03),
        vx: (Math.random() - 0.5) * 0.06,
        base: Math.random() * 0.35 + 0.12,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.25,
      }));
    };

    const draw = (now) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      const t = now / 1000;
      const tint = secretRef.current ? "232, 190, 140" : "236, 232, 224";

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) {
          p.y = height + 4;
          p.x = Math.random() * width;
        }
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;

        const twinkle = p.base * (0.65 + 0.35 * Math.sin(t * p.speed + p.phase));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${tint}, ${twinkle})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();

    if (reduced) {
      // Una sola pasada estática: el polvo existe, pero no se mueve.
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(236, 232, 224, ${p.base})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      frame = requestAnimationFrame(draw);
    }

    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

export default function AuroraBackground({ mode = "default" }) {
  const palette = PALETTES[mode] ?? PALETTES.default;
  const secret = mode === "secret";

  const { scrollYProgress } = useScroll();
  const warmth = useTransform(scrollYProgress, [0, 0.45, 1], [0, 0.35, 1]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base */}
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: secret ? "#0b0705" : "#08080b" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Aurora */}
      <motion.div
        className="absolute -top-[28%] left-[-18%] h-[78vh] w-[78vh] rounded-full blur-[90px] animate-aurora-a"
        animate={{ background: `radial-gradient(circle at 50% 50%, ${palette[0]}, transparent 66%)`, opacity: secret ? 0.75 : 0.55 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute top-[24%] right-[-24%] h-[70vh] w-[70vh] rounded-full blur-[95px] animate-aurora-b"
        animate={{ background: `radial-gradient(circle at 50% 50%, ${palette[1]}, transparent 66%)`, opacity: secret ? 0.7 : 0.45 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute bottom-[-24%] left-[16%] h-[62vh] w-[62vh] rounded-full blur-[90px] animate-aurora-c"
        animate={{ background: `radial-gradient(circle at 50% 50%, ${palette[2]}, transparent 68%)`, opacity: secret ? 0.62 : 0.38 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Polvo */}
      <DustCanvas secret={secret} />

      {/* Amanecer.
          La historia arranca fría (violeta, la espera, el lunes que no vino) y
          termina caliente. En vez de cambiar la paleta de golpe, dejamos que
          una luz dorada suba desde abajo a medida que se scrollea: cuando
          llega a los relojes, la pantalla ya está tibia. Nadie lo nota; todo
          el mundo lo siente. Y ella se llama Sol. */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: warmth,
          background:
            "radial-gradient(ellipse 130% 70% at 50% 118%, rgba(212,182,120,0.30), rgba(231,168,172,0.12) 45%, transparent 72%)",
        }}
      />

      {/* Viñeta: hunde los bordes y centra la mirada */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 40%, transparent 30%, rgba(5,5,7,0.55) 75%, rgba(5,5,7,0.9) 100%)",
        }}
      />

      {/* Grano de película */}
      <div
        /* Sin mix-blend-mode: mezclar obliga a recomponer la pantalla entera
           en cada cuadro. Con la opacidad justa se ve prácticamente igual. */
        className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat" }}
      />
    </div>
  );
}
