"use client";

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Image from 'next/image';
import SectionWrapper from './section-wrapper';

const About = () => {
  return (
    <SectionWrapper id="about" className="bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:space-x-12">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-200 mb-8 text-center lg:text-left"
            >
              About Me
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-slate-50 dark:bg-slate-800 p-8 rounded-lg shadow-md"
            >
              <div className="text-lg text-slate-600 dark:text-slate-400 space-y-4 text-left">
                <p>
                  I am an undergraduate student pursuing a degree in Mechatronics and Artificial Intelligence at Universitas Pendidikan Indonesia. I have a strong passion and hands-on experience in the field of Machine Learning, with a portfolio of projects including the development of Chatbots/LLMs, Optical Character Recognition (OCR) systems, and Computer Vision applications.
                </p>
              </div>
              <div className="text-center lg:text-left">
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download CV
                </a>
              </div>
            </motion.div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Image
                src="/images/me1.png"
                alt="Zaidan Ahmad"
                width={400}
                height={400}
                className="rounded-full shadow-lg dark:shadow-lg-dark"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;
