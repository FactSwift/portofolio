"use client";

import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import Image from 'next/image';
import SectionWrapper from './section-wrapper';

const experiences = [
  {
    position: "Machine Learning Engineer Intern",
    company: "BPJS Ketenagakerjaan",
    time: "Jul 2025 - Aug 2025",
    description: [
      "Developed a functional prototype, JAGOTK.AI, an RAG-based chatbot.",
      "Integrated with an identity database and embedded FAQ documents.",
      "The system utilizes OCR and facial comparison to assist users."
    ],
    images: ['/images/ptk1.jpg']
  },
  {
    position: "Head of Science and Technology Research Department",
    company: "HIMATRONIKA-AI",
    time: "Dec 2024 - Present",
    description: [
      "Led the department in organizing campus-wide competitions.",
      "Conducted research initiatives and developing robotics innovations."
    ],
    images: ['/images/keristek1.jpg']
  },
  {
    position: "Staff of Study and Research Department",
    company: "HIMATRONIKA-AI",
    time: "Jan 2024 - Dec 2024",
    description: [
      "Contributed to various innovation projects.",
      "Actively participated in community service volunteering."
    ],
    images: ['/images/sturi1.jpg']
  }
];

const Experiences = () => {
  return (
    <SectionWrapper id="experiences">
      <div className="mx-auto w-[min(1120px,92%)]">
        <div className="mb-14 text-center">
          <span className="section-kicker">Work Experience</span>
          <h2 className="section-heading mt-4 text-slate-900 dark:text-slate-100">Where I have shipped impact</h2>
          <p className="section-lead mx-auto mt-4 max-w-2xl">
            Hands-on roles focused on building practical machine learning products and leading technical initiatives.
          </p>
        </div>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.article
              key={`${exp.company}-${exp.position}`}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="surface-card overflow-hidden p-4 md:p-6"
            >
              <div className="grid gap-6 md:grid-cols-[280px_1fr] md:items-center">
                <div className="relative h-56 overflow-hidden rounded-2xl">
                  <Image
                    src={exp.images[0]}
                    alt={`${exp.position} at ${exp.company}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <span className="chip">
                    <Briefcase size={14} className="mr-2" />
                    {exp.time}
                  </span>
                  <h3 className="mt-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">{exp.position}</h3>
                  <p className="mt-1 text-base font-semibold text-brand-600 dark:text-red-300">{exp.company}</p>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
                    {exp.description.map((item, i) => (
                      <li key={`${exp.company}-${i}`} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-500 dark:bg-red-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Experiences;
