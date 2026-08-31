import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { AudioProvider, useAudioControls } from "./lib/AudioEngine";
import { useLongPress, useSecretCode } from "./hooks/useSecretCode";

import AuroraBackground from "./components/AuroraBackground";
import Preloader from "./components/Preloader";
import ScrollProgress from "./components/ScrollProgress";
import Hero from "./components/Hero";
import Timeline from "./components/Timeline";
import TimeCapsuleCounter from "./components/TimeCapsuleCounter";
import AudioPlayer from "./components/AudioPlayer";
import SecretModal from "./components/SecretModal";
import PhotoWall from "./components/PhotoWall";
import SongSection from "./components/SongSection";
import LockedChapter from "./components/LockedChapter";
import Footer from "./components/Footer";

import {
  NOVIOS_DATE,
  START_DATE,
  audioTrack,
  counterContent,
  footerContent,
  heroContent,
  introContent,
  lockedContent,
  noviosCounterContent,
  photoWallContent,
  photos,
  songContent,
  secretContent,
  storyChapters,
} from "./data/mockData";

/**
 * ============================================================================
 *  EXPERIENCIA
 * ============================================================================
 *  Vive dentro de <AudioProvider> porque el easter egg necesita bajarle el
 *  volumen a la música, y para eso tiene que poder llamar a los controles.
 * ============================================================================
 */
function Experience() {
  const [loading, setLoading] = useState(true);
  const [secretOpen, setSecretOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const timelineRef = useRef(null);
  const { duck, restore, unlock } = useAudioControls();

  /* --------------------------------------------------- bloqueo de scroll */
  useEffect(() => {
    if (loading) document.body.dataset.locked = "true";
    else delete document.body.dataset.locked;
  }, [loading]);

  /* ------------------------------------------------------- el easter egg */
  const openSecret = useCallback(() => {
    setUnlocked(true);
    setSecretOpen(true);
    duck(); // la música se corre a un segundo plano
  }, [duck]);

  const closeSecret = useCallback(() => {
    setSecretOpen(false);
    restore();
  }, [restore]);

  // 1) Teclado: la secuencia exacta, en cualquier momento.
  //    Se desactiva mientras carga y mientras el modal ya está abierto.
  const codeProgress = useSecretCode(secretContent.sequence, openSecret, {
    enabled: !loading && !secretOpen,
  });

  // 2) Táctil: mantener presionado el punto del footer (ver Footer.jsx).
  const longPress = useLongPress(openSecret, { duration: 1600 });

  const scrollToStory = useCallback(() => {
    timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <AuroraBackground mode={secretOpen ? "secret" : "default"} />
      <ScrollProgress />

      <AnimatePresence>
        {loading && (
          <Preloader
            key="preloader"
            content={introContent}
            onEnter={unlock}
            onComplete={() => setLoading(false)}
          />
        )}
      </AnimatePresence>

      {/* El contenido entra recién cuando el preloader terminó: así el
          text-reveal del Hero se ve completo y no arranca detrás del telón. */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={loading}
      >
        {!loading && (
          <>
            <Hero content={heroContent} onScrollHint={scrollToStory} />
            <Timeline ref={timelineRef} chapters={storyChapters} />

            {/* Historia → pruebas → sentido → tiempo → futuro.
                La canción va justo acá: después de las fotos ya está todo
                mostrado, y antes de los relojes hace falta decir por qué
                importa. Es el pico emocional de la página. */}
            <PhotoWall content={photoWallContent} photos={photos} />
            <SongSection content={songContent} />
            <TimeCapsuleCounter startDate={START_DATE} content={counterContent} />
            <TimeCapsuleCounter startDate={NOVIOS_DATE} content={noviosCounterContent} />
            <LockedChapter content={lockedContent} />

            <Footer
              content={footerContent}
              codeProgress={codeProgress}
              codeLength={secretContent.sequence.length}
              longPress={longPress}
              unlocked={unlocked}
              onQuickOpen={openSecret}
            />
          </>
        )}
      </motion.main>

      {!loading && <AudioPlayer />}

      <AnimatePresence>
        {secretOpen && <SecretModal key="secret" content={secretContent} onClose={closeSecret} />}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AudioProvider track={audioTrack}>
      <Experience />
    </AudioProvider>
  );
}
