"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useLowPerformanceMode } from '@/app/hooks/useLowPerformanceMode';

const TITLES = [
  'AI Engineer',
  'MLOps Engineer',
  'Full-stack Developer',
  'Team Leader'
];

export const LIGHT_LINE_COLORS = ['#ef6a37', '#ff9c66', '#5adacc', '#1f9d94'];
export const DARK_LINE_COLORS = ['#5effff', '#05ff76', '#ffea02', '#fe0000'];

const StackedLines = ({ colors, lowPerformanceMode }: { colors: string[]; lowPerformanceMode: boolean }) => {

  return (
    <div className="flex flex-col w-full space-y-[2px]">
      {colors.map((color, index) => (
        <motion.div
          key={color}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: lowPerformanceMode ? 0.68 : 1.5,
            delay: index * (lowPerformanceMode ? 0.08 : 0.2),
            ease: 'easeOut'
          }}
          className="hero-animated-line h-[2px] w-full md:h-[3px]"
          style={{
            color,
            backgroundColor: color,
            transformOrigin: 'left'
          }}
        />
      ))}
    </div>
  );
};

export const HeroTypingAnimation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const lowPerformanceMode = useLowPerformanceMode();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TITLES.length);
    }, lowPerformanceMode ? 4200 : 3500);

    return () => clearInterval(interval);
  }, [lowPerformanceMode]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lineColors = mounted && resolvedTheme === 'dark' ? DARK_LINE_COLORS : LIGHT_LINE_COLORS;
  const activeLineColors = lowPerformanceMode ? lineColors.slice(0, 2) : lineColors;

  return (
    <div className="w-full overflow-hidden">
      <div className="relative z-10 px-6 min-w-[220px] md:min-w-[280px] flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: lowPerformanceMode ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: lowPerformanceMode ? 0 : -6 }}
            transition={{ duration: lowPerformanceMode ? 0.16 : 0.22, ease: 'easeOut' }}
            className="hero-typing-text whitespace-nowrap text-sm font-semibold uppercase tracking-[0.24em] text-slate-700 dark:text-slate-100 md:text-base"
            style={{
              fontFamily: 'var(--font-barlow)'
            }}
          >
            {TITLES[currentIndex]}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: lowPerformanceMode ? 1.1 : 0.8, repeat: Infinity, ease: 'linear' }}
              className="hero-typing-cursor ml-2 inline-block h-[1em] w-[3px] bg-brand-500 align-middle dark:bg-red-300"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: lowPerformanceMode ? 0.9 : 2.1, ease: 'easeOut' }}
        className="relative z-0 mt-[2px] bg-transparent py-[2px]"
        style={{ transformOrigin: 'left' }}
      >
        <StackedLines colors={activeLineColors} lowPerformanceMode={lowPerformanceMode} />
      </motion.div>
    </div>
  );
};
