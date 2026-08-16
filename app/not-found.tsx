import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-32">
      <p className="text-sm text-muted">404</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight">
        This page is not here.
      </h1>
      <Link
        href="/"
        className="mt-8 text-sm text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
      >
        Back to work
      </Link>
    </main>
  );
}
