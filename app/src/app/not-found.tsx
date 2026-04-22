import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="site-shell flex min-h-screen items-center justify-center px-6 py-16">
      <section className="surface-card w-full max-w-xl p-10 text-center">
        <p className="section-kicker">404</p>
        <h1 className="section-heading mt-4 text-slate-900 dark:text-slate-100">Page not found</h1>
        <p className="section-lead mt-4">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="action-btn mt-8">
          Back to home
        </Link>
      </section>
    </main>
  );
}
