"use client";

import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';
import { Download } from 'lucide-react';
import { useRef } from 'react';
import SectionWrapper from './section-wrapper';

const Commodore64Model = dynamic<{ isActive?: boolean }>(() => import('./ui/Commodore64Model'), {
  ssr: false,
  loading: () => (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[2rem] border border-white/75 bg-slate-100/80 shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/50" />
  ),
});

const About = () => {
  const modelContainerRef = useRef<HTMLDivElement | null>(null);
  const shouldLoadModel = useInView(modelContainerRef, {
    once: true,
    amount: 0.2,
  });

  const isModelInView = useInView(modelContainerRef, {
    amount: 0.1,
    margin: '120px 0px',
  });

  return (
    <SectionWrapper id="about">
      <div className="mx-auto w-[min(1120px,92%)]">
        <div className="mb-10 text-center lg:text-left">
          <span className="section-kicker">About</span>
        </div>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            className="surface-card p-8 md:p-10"
          >
            <h2 className="section-heading mb-6 text-slate-900 dark:text-slate-100">
              Engineering ideas into usable products.
            </h2>
            <div className="space-y-4 text-left">
              <p className="section-lead">
                I am an undergraduate student in Mechatronics and Artificial Intelligence at Indonesia University
                of Education, with hands-on experience in maintaining machine learning systems and operations.
              </p>
              <p className="section-lead">
                My work spans RAG-based chatbot systems, OCR pipelines, and computer vision applications. I also worked
                in full-stack and game design projects. 
              </p>
            </div>
            <div className="mt-8 text-left">
              <a href="https://drive.google.com/file/d/1T3GFIPxMyvMnG72WSoq2EmmKYGHgF41Y/view?usp=sharing" className="action-btn" aria-label="Download CV">
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </a>
            </div>
          </motion.div>
          <motion.div
            ref={modelContainerRef}
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="absolute -inset-4 rounded-[2rem] border border-brand-300/55 dark:border-red-800/55" />
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-mint-300/45 blur-2xl dark:bg-mint-600/25" />
            {shouldLoadModel ? (
              <Commodore64Model isActive={isModelInView} />
            ) : (
              <div className="relative h-[420px] w-full overflow-hidden rounded-[2rem] border border-white/75 bg-slate-100/80 shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/50" />
            )}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;
