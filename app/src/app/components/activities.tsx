"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import SectionWrapper from './section-wrapper';

const activities = [
  {
    title: 'Career Future Development',
    image: '/images/activities/cfd.jpg',
    description: 'Staff of Event for 4 batches, from March 29th to October 11th 2024.',
  },
  {
    title: 'Trisula Suaka',
    image: '/images/activities/trisula.jpeg',
    description:
      'Staff of event at a community service in which I taught rural elementary students about science with fun projects.',
  },
  {
    title: 'PLKM',
    image: '/images/activities/plkm.jpg',
    description: 'Campus leadership training participant and group leader.',
  },
  {
    title: 'Metastro',
    image: '/images/activities/metastro.jpeg',
    description: 'Disciplinary Committee.',
  },
  {
    title: 'MOKA-KU 2024',
    image: '/images/activities/mokaku.jpg',
    description: 'Staff of Mentor in an orientation and welcoming event for freshmen.',
  },
  {
    title: 'Algorithmia Fest 1.0 (2024)',
    image: '/images/activities/algo1.jpg',
    description: 'Staff of event, in charge of being an MC and project expo.',
  },
  {
    title: 'Algorithmia Fest 2.0 (2025)',
    image: '/images/activities/algo2.jpeg',
    description: 'Steering Committee.',
  },
  {
    title: 'Bocah Digital',
    image: '/images/activities/bocahdigital.jpeg',
    description: 'Volunteered in a community service for educating elementary students.',
  },
];

const Activities = () => {
  return (
    <SectionWrapper id="activities">
      <div className="mx-auto w-[min(1120px,92%)]">
        <div className="mb-12 text-center">
          <span className="section-kicker">Activities</span>
          <h2 className="section-heading mt-4 text-slate-900 dark:text-slate-100">What I do outside classes and projects</h2>
          <p className="section-lead mx-auto mt-4 max-w-2xl">
            Stuff like committees and volunteers, outside of projects and academics.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity, index) => (
            <motion.article
              key={activity.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="surface-card flex h-full items-start gap-4 p-4"
            >
              <div className="relative h-20 w-24 flex-none overflow-hidden rounded-xl border border-[color:var(--border)] bg-white/40 dark:bg-slate-800/45">
                <Image
                  src={activity.image}
                  alt={`${activity.title} documentation`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-slate-100">{activity.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                  {activity.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Activities;