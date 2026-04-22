"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { HeroTypingAnimation, LIGHT_LINE_COLORS, DARK_LINE_COLORS } from '@/app/components/ui/HeroTypingAnimation';

const BUILD_KEYWORDS = ['AI models', 'Web-apps', 'IoT Systems'];
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [displayKeyword, setDisplayKeyword] = useState(BUILD_KEYWORDS[0]);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let frame = 0;
    const target = BUILD_KEYWORDS[keywordIndex];
    let holdTimeout: ReturnType<typeof setTimeout> | null = null;

    const scrambleInterval = setInterval(() => {
      frame += 1;
      const revealCount = Math.max(0, frame - 2);

      const glitchedText = target
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '-') {
            return char;
          }

          if (index < revealCount) {
            return char;
          }

          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        })
        .join('');

      setDisplayKeyword(glitchedText);

      if (revealCount >= target.length) {
        clearInterval(scrambleInterval);
        setDisplayKeyword(target);

        holdTimeout = setTimeout(() => {
          setKeywordIndex((prev) => (prev + 1) % BUILD_KEYWORDS.length);
        }, 1200);
      }
    }, 45);

    return () => {
      clearInterval(scrambleInterval);

      if (holdTimeout) {
        clearTimeout(holdTimeout);
      }
    };
  }, [keywordIndex]);

  const lineColors = mounted && resolvedTheme === 'dark' ? DARK_LINE_COLORS : LIGHT_LINE_COLORS;
  const reversedLineColors = [...lineColors].reverse();

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-16 pt-36 sm:px-6 lg:px-8">
      <div className="hero-rainbow-layer" aria-hidden="true">
        <div className="hero-rainbow-stack">
          {reversedLineColors.map((color, index) => (
            <motion.div
              key={`rainbow-stack-${color}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: index * 0.2, ease: 'easeOut' }}
              className="hero-rainbow-trail"
              style={{ backgroundColor: color, color, transformOrigin: 'left' }}
            />
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-5xl space-y-8 text-center"
      >
        <h2 className="section-heading mx-auto max-w-4xl text-balance text-[2.7rem] leading-[1.05] text-slate-900 sm:text-6xl md:text-7xl dark:text-slate-100">
          I build{' '}
          <span className="inline-block align-baseline">
            <span className="inline-block text-brand-600 dark:text-red-300">
              {displayKeyword}
            </span>
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
      </motion.div>
    </section>
  );
};

export default Home;
