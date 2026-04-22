"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThemeSwitcher } from './theme-switcher';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About', 'Experiences', 'Projects', 'Activities', 'Contact'];

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'pt-3' : 'pt-5'}`}
    >
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
    </motion.header>
  );
};

export default Header;
