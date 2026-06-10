import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <PageHeader
        title="Sign in"
        description="Staff login lands in REA-35. Supabase Auth will connect here."
      />
      <p className="text-sm text-stone-600">
        Once auth is wired, counter and nursery staff will sign in with email or mobile.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex justify-center rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
      >
        Back to app shell preview
      </Link>
    </main>
  );
}
