"use client";

import { motion, Variants } from 'framer-motion';
import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id: string;
}

const sectionVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 70,
    filter: 'blur(6px)',
  },
  onscreen: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className, id }) => {
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
