"use client";

import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import SectionWrapper from './section-wrapper';

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
  company: string;
};

type FormErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  message: '',
  company: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contact = () => {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const inputStyles =
    'mt-2 block w-full rounded-xl border border-[var(--field-border)] bg-[var(--field-bg)] px-4 py-3 text-sm text-slate-900 shadow-sm transition-all duration-300 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:ring-red-900/60';

  const statusClassName = useMemo(() => {
    if (status === 'success') {
      return 'rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300';
    }

    if (status === 'error') {
      return 'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300';
    }

    return '';
  }, [status]);

  const updateField = (field: keyof ContactFormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (values.name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }

    if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (values.message.trim().length < 10) {
      nextErrors.message = 'Please share a message with at least 10 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      setStatus('error');
      setMessage('Please fix the highlighted fields and try again.');
      return;
    }

    setStatus('sending');
    setMessage('Sending your message...');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          company: values.company,
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus('error');
        setMessage(result.message ?? 'Unable to send your message right now. Please try again.');
        return;
      }

      setStatus('success');
      setMessage(result.message ?? 'Thanks for reaching out. I will get back to you soon.');
      setErrors({});
      setValues(initialValues);
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again in a moment.');
    }
  };

  return (
    <SectionWrapper id="contact">
      <div className="mx-auto w-[min(1120px,92%)]">
        <div className="surface-card overflow-hidden p-6 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, x: -45 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="text-left"
            >
              <span className="section-kicker">Contact</span>
              <h2 className="section-heading mt-4 text-slate-900 dark:text-slate-100">
                Let&apos;s build something meaningful together.
              </h2>
              <p className="section-lead mt-4 max-w-md">
                Open to collaborations, internships, and project discussions around AI products.
              </p>
              <a
                href="https://www.linkedin.com/in/zaidanahmad/"
                target="_blank"
                rel="noopener noreferrer"
                className="outline-btn mt-6"
              >
                Connect on LinkedIn
              </a>
            </motion.div>
            <motion.form
              initial={{ opacity: 0, x: 45 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="space-y-5 text-left"
              onSubmit={handleSubmit}
              noValidate
            >
              <div>
                <label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className={inputStyles}
                  placeholder="John Doe"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p> : null}
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className={inputStyles}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p> : null}
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  className={inputStyles}
                  placeholder="Your message..."
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.message}</p> : null}
              </div>
              <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.company}
                  onChange={(event) => updateField('company', event.target.value)}
                />
              </div>
              {status === 'success' || status === 'error' ? (
                <p role="status" aria-live="polite" className={statusClassName}>
                  {message}
                </p>
              ) : null}
              <button
                type="submit"
                className="action-btn w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                disabled={status === 'sending'}
              >
                <Send className="mr-2 h-5 w-5" />
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Contact;
