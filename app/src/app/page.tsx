import Header from './components/header';
import Home from './components/home';
import About from './components/about';
import Experiences from './components/experiences';
import Projects from './components/projects';
import Activities from './components/activities';
import Contact from './components/contact';
import { Github, Linkedin, Instagram } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface)] py-10 backdrop-blur">
      <div className="mx-auto w-[min(1120px,92%)] text-center">
        <div className="mb-4 flex justify-center gap-4">
          <Link href="https://www.linkedin.com/in/zaidanahmad/" target="_blank" className="social-pill" aria-label="LinkedIn">
            <Linkedin size={24} />
          </Link>
          <Link href="https://github.com/FactSwift" target="_blank" className="social-pill" aria-label="GitHub">
            <Github size={24} />
          </Link>
          <Link href="https://www.instagram.com/zaidanahm.ai/" target="_blank" className="social-pill" aria-label="Instagram">
            <Instagram size={24} />
          </Link>
        </div>
        <p className="text-sm tracking-wide text-[color:var(--muted)]">
          &copy; {new Date().getFullYear()} Zaidan Ahmad. 3D models created by dark_igorek.
        </p>
      </div>
    </footer>
  );
};

export default function Page() {
  return (
    <main className="site-shell">
      <Header />
      <Home />
      <About />
      <Experiences />
      <Projects />
      <Activities />
      <Contact />
      <Footer />
    </main>
  );
}
