"use client";

import { motion, Variants } from 'framer-motion';
import React from 'react';
import { useLowPerformanceMode } from '@/app/hooks/useLowPerformanceMode';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id: string;
}

const sectionVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 40,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className, id }) => {
  const lowPerformanceMode = useLowPerformanceMode();

  if (lowPerformanceMode) {
    return (
      <section id={id} className={`relative py-24 md:py-28 ${className ?? ''}`}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={`relative py-24 md:py-28 ${className ?? ''}`}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;
