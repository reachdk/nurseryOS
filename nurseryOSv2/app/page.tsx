import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
        nurseryOSv2
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
        Nursery inventory &amp; availability
      </h1>
      <p className="text-lg text-stone-600">
        Responsive web app scaffold. Availability is calculated, not guessed.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Open app shell
        </Link>
        <Link
          href="/api/health"
          className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          API health
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
