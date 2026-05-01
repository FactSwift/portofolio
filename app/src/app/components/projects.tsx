"use client";

import { motion } from 'framer-motion';
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import SectionWrapper from './section-wrapper';

const projects = [
  {
    title: "JAGOTK.AI",
    description: "An RAG chatbot with multi-functionalities for identity verification and answering frequently asked questions. Actively and currently used by BPJS Ketenagakerjaan.",
    images: ["/images/jagotk1.jpg"],
    tags: ["Python", "LangChain", "Transformers", "FastAPI", "Uvicorn", "Docker"],
    liveUrl: null,
    githubUrl: null
  },
  {
    title: "Aang IoT Air Control System",
    description: "A remote web app-controlled air purifier with smart monitoring and an autonomous system that can be managed from anywhere. We won 'People's Choice Award'",
    images: ["/images/aang2.jpeg", "/images/aang1.jpeg"],
    tags: ["Firebase", "Vite", "ESP32", "Python"],
    liveUrl: null,
    githubUrl: "https://github.com/FactSwift/Aang-Air-Control-System"
  },
  {
    title: "Kyuubi: Nasu Town Digital Map",
    description: "A digital map and smart guide with a physical AI chatbot that can help tourists in any language for Nasu Town tourism in Japan. This project won 2nd best during the Cross-cultural Engineering Project at SIT Omiya Campus.",
    images: ["/images/Kyuubi1.png", "/images/Kyuubi2.jpeg", "/images/Kyuubi3.jpg"],
    tags: ["NextJS", "Vercel", "OpenStreetMap", "OpenAI"],
    liveUrl: null,
    githubUrl: "https://github.com/FactSwift/Kyubii"
  },
  {
    title: "Mechiu",
    description: "A Java-based, ocean-themed typing game designed for education and typing practice. This college project for our Object-Oriented Programming course won the 'Best Project' award.",
    images: ["/images/mechiu1.jpg", "/images/mechiu2.jpg", "/images/mechiu3.jpg"],
    tags: ["Java", "JavaFX"],
    liveUrl: null,
    githubUrl: "https://github.com/FactSwift/MecHiu"
  },
  {
    title: "Line Follower",
    description: "A-graded line follower robot capable of heat detection for 5th semester final Robotics project.",
    images: ["/images/linefollow.jpg"],
    tags: ["ESP32", "Open CV", "C++", "MQTT"],
    liveUrl: null,
    githubUrl: null
  },
  {
    title: "Firefighter RC",
    description: "A-graded firefighter RC car with both autonomous control via detection and manual remotely controlled. Made for 3rd semester Control Systems and Microcontroller finals project.",
    images: ["/images/firefighter.jpg"],
    tags: ["ESP32", "C++"],
    liveUrl: null,
    githubUrl: null
  }
];

const ProjectCard = ({ project, index }: { project: typeof projects[0], index: number }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="surface-card group flex h-[560px] min-w-[320px] max-w-[320px] snap-center flex-col overflow-hidden md:h-[600px] md:min-w-[380px] md:max-w-[380px]"
    >
      <div className="relative h-56 w-full overflow-hidden">
        {project.images.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt={`${project.title} screenshot ${i + 1}`}
            fill
            style={{ objectFit: 'cover' }}
            className={`transition-opacity duration-500 ${i === currentImage ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
        {project.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/65 bg-black/35 p-1.5 text-white transition-colors hover:bg-black/55"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/65 bg-black/35 p-1.5 text-white transition-colors hover:bg-black/55"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      <div className="flex flex-grow flex-col p-6">
        <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">{project.title}</h3>
        <p
          className="mt-2 flex-grow text-sm leading-relaxed text-[color:var(--muted)] md:text-base"
          style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {project.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span
              key={tag}
                className="rounded-full border border-brand-300/80 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-red-800/80 dark:bg-red-950/30 dark:text-red-200"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-end gap-4">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              className="text-slate-700 transition-colors hover:text-brand-600 dark:text-slate-200 dark:hover:text-red-300"
              aria-label={`${project.title} live demo`}
            >
              <ExternalLink size={24} />
            </Link>
          )}
          {project.githubUrl ? (
            <Link
              href={project.githubUrl}
              target="_blank"
              className="text-slate-700 transition-colors hover:text-brand-600 dark:text-slate-200 dark:hover:text-red-300"
              aria-label={`${project.title} GitHub repository`}
            >
              <Github size={24} />
            </Link>
          ) : (
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Private Repository</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollProjects = (direction: 'left' | 'right') => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const amount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <SectionWrapper id="projects">
      <div className="mx-auto w-[min(1120px,92%)]">
        <div className="mb-10 flex flex-col gap-5 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <span className="section-kicker">Projects</span>
            <h2 className="section-heading mt-4 text-slate-900 dark:text-slate-100">Selected builds and experiments</h2>
            <p className="section-lead mx-auto mt-4 max-w-2xl md:mx-0">
              A mix of production-facing systems and exploratory builds across AI, backend APIs, and product engineering.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 md:justify-end">
            <button
              type="button"
              onClick={() => scrollProjects('left')}
              className="social-pill h-12 w-12"
              aria-label="Scroll projects left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollProjects('right')}
              className="social-pill h-12 w-12"
              aria-label="Scroll projects right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-visible pb-6 pr-2 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Projects;
