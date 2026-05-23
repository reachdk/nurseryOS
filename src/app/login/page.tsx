import Link from "next/link";
import { signIn } from "@/app/login/actions";
import { Card, Field, Input, Button } from "@/components/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-[var(--primary)]">NurseryOS</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Sign in to manage nursery inventory</p>
      </div>

      <Card>
        <form action={signIn} className="space-y-4">
          <input type="hidden" name="next" value={next ?? "/"} />
          <Field label="Email">
            <Input name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label="Password">
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
              {error}
            </p>
          )}
          <Button type="submit">Sign in</Button>
        </form>
      </Card>

      <p className="mt-4 text-center text-xs text-[var(--muted)]">
        Staff accounts are created by an admin in Supabase.{" "}
        <Link href="https://supabase.com/dashboard" className="text-[var(--primary)] underline">
          Supabase dashboard
        </Link>
      </p>
    </div>
  );
}
