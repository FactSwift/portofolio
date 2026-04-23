"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThemeSwitcher } from './theme-switcher';
import { useLowPerformanceMode } from '@/app/hooks/useLowPerformanceMode';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const lowPerformanceMode = useLowPerformanceMode();

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const next = window.scrollY > 16;
        setScrolled((previous) => (previous === next ? previous : next));
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = ['Home', 'About', 'Experiences', 'Projects', 'Activities', 'Contact'];
  const headerClassName = `fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'pt-3' : 'pt-5'}`;
  const headerContent = (
    <div
      className={`mx-auto flex w-[min(1120px,92%)] items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur-xl transition-all duration-300 md:px-6 ${
        scrolled
          ? 'border-slate-300/75 bg-white/86 shadow-[0_20px_55px_-35px_rgba(15,23,42,0.55)] dark:border-slate-700/80 dark:bg-slate-900/84'
          : 'border-slate-300/45 bg-white/55 shadow-[0_16px_42px_-32px_rgba(15,23,42,0.48)] dark:border-slate-700/60 dark:bg-slate-900/52'
      }`}
    >
      <h1 className="font-heading text-xl font-bold tracking-[0.1em] text-slate-900 dark:text-slate-100 sm:text-2xl">
        <Link href="#home" className="transition-colors hover:text-brand-600 dark:hover:text-red-300">
          ZAIDAN A.
        </Link>
      </h1>
      <nav className="hidden items-center gap-7 md:flex">
        {navLinks.map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 transition-colors duration-300 hover:text-brand-600 dark:text-slate-200 dark:hover:text-red-300"
          >
            {item}
          </Link>
        ))}
      </nav>
      <ThemeSwitcher />
    </div>
  );

  return (
    <motion.header
      initial={{ y: lowPerformanceMode ? -26 : -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: lowPerformanceMode ? 0.28 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={headerClassName}
    >
      {headerContent}
    </motion.header>
  );
};

export default Header;
