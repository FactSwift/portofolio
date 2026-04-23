"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Instagram } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { HeroTypingAnimation, LIGHT_LINE_COLORS, DARK_LINE_COLORS } from '@/app/components/ui/HeroTypingAnimation';
import { useLowPerformanceMode } from '@/app/hooks/useLowPerformanceMode';

const BUILD_KEYWORDS = ['AI models', 'Web-apps', 'IoT-apps'];
const GLITCH_CHARS = ['0', '1'] as const;
const GLITCH_FRAME_INTERVAL_MS = 70;
const GLITCH_HOLD_MS = 1200;

const GlitchKeyword = ({ isActive }: { isActive: boolean }) => {
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [displayKeyword, setDisplayKeyword] = useState(BUILD_KEYWORDS[0]);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };

    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const target = BUILD_KEYWORDS[keywordIndex];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isActive || !isDocumentVisible || prefersReducedMotion) {
      setDisplayKeyword(target);
      return;
    }

    let frame = 0;
    let rafId: number | null = null;
    let lastTick = 0;
    let holdTimeout: ReturnType<typeof setTimeout> | null = null;
    let isStopped = false;

    const updateScrambleFrame = () => {
      frame += 1;
      const revealCount = Math.max(0, frame - 2);

      let nextValue = '';

      for (let index = 0; index < target.length; index += 1) {
        const char = target[index];

        if (char === ' ' || char === '-' || index < revealCount) {
          nextValue += char;
        } else {
          nextValue += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
      }

      setDisplayKeyword((prev) => (prev === nextValue ? prev : nextValue));

      if (revealCount >= target.length) {
        setDisplayKeyword(target);
        holdTimeout = setTimeout(() => {
          setKeywordIndex((prev) => (prev + 1) % BUILD_KEYWORDS.length);
        }, GLITCH_HOLD_MS);
        return true;
      }

      return false;
    };

    const animate = (now: number) => {
      if (isStopped) {
        return;
      }

      if (now - lastTick >= GLITCH_FRAME_INTERVAL_MS) {
        lastTick = now;

        const isCompleted = updateScrambleFrame();

        if (isCompleted) {
          return;
        }
      }

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      isStopped = true;

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      if (holdTimeout) {
        clearTimeout(holdTimeout);
      }
    };
  }, [isActive, isDocumentVisible, keywordIndex]);

  return <span className="inline-block text-brand-600 dark:text-red-300">{displayKeyword}</span>;
};

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isHeroInView = useInView(sectionRef, { amount: 0.35 });
  const { resolvedTheme } = useTheme();
  const lowPerformanceMode = useLowPerformanceMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  const lineColors = mounted && resolvedTheme === 'dark' ? DARK_LINE_COLORS : LIGHT_LINE_COLORS;
  const reversedLineColors = [...lineColors].reverse();
  const activeRainbowLines = lowPerformanceMode ? reversedLineColors.slice(0, 2) : reversedLineColors;

  const heroContent = (
    <>
      <h2 className="section-heading mx-auto max-w-4xl text-balance text-[2.7rem] leading-[1.05] text-slate-900 sm:text-6xl md:text-7xl dark:text-slate-100">
        I build{' '}
        <span className="inline-block align-baseline">
          <GlitchKeyword isActive={isHeroInView} />
        </span>
        {' '}and lead projects
      </h2>
      <p className="section-lead mx-auto max-w-2xl text-balance">
        Hi, I am Zaidan Ahmad, a Mechatronics and Artificial Intelligence undergraduate.
      </p>
      <div className="mx-auto max-w-lg">
        <HeroTypingAnimation />
      </div>
      <div className="flex justify-center gap-4 pt-2">
        <Link
          href="https://www.linkedin.com/in/zaidanahmad/"
          target="_blank"
          className="social-pill"
          aria-label="LinkedIn"
        >
          <Linkedin size={22} />
        </Link>
        <Link
          href="https://github.com/FactSwift"
          target="_blank"
          className="social-pill"
          aria-label="GitHub"
        >
          <Github size={22} />
        </Link>
        <Link
          href="https://www.instagram.com/zaidanahm.ai/"
          target="_blank"
          className="social-pill"
          aria-label="Instagram"
        >
          <Instagram size={22} />
        </Link>
      </div>
    </>
  );

  return (
    <section ref={sectionRef} id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-16 pt-36 sm:px-6 lg:px-8">
      <div className="hero-rainbow-layer" aria-hidden="true">
        <div className="hero-rainbow-stack">
          {activeRainbowLines.map((color, index) => (
            <motion.div
              key={`rainbow-stack-${color}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: lowPerformanceMode ? 0.78 : 1.5, delay: index * (lowPerformanceMode ? 0.08 : 0.2), ease: 'easeOut' }}
              className={`hero-rainbow-trail ${lowPerformanceMode ? 'hero-rainbow-trail-lite' : ''}`}
              style={{ backgroundColor: color, color, transformOrigin: 'left' }}
            />
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: lowPerformanceMode ? 14 : 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: lowPerformanceMode ? 0.42 : 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-5xl space-y-8 text-center"
      >
        {heroContent}
      </motion.div>
    </section>
  );
};

export default Home;
