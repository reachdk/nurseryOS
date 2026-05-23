"use client";

import { usePathname } from "next/navigation";
import { Nav } from "@/components/Nav";

const SHELL_CLASS =
  "mx-auto flex min-h-dvh w-full max-w-lg flex-col lg:max-w-4xl xl:max-w-5xl";

export function AppShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string | null;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className={SHELL_CLASS}>
      <header className="sticky top-0 z-10 border-b border-[var(--accent)] bg-[var(--primary)] px-4 py-3 text-white shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">NurseryOS</h1>
            <p className="text-xs text-[var(--accent)]">Inventory & availability</p>
          </div>
          {userEmail && (
            <p className="max-w-[50%] truncate text-right text-xs text-[var(--accent)]">
              {userEmail}
            </p>
          )}
        </div>
      </header>
      <main className="flex-1 px-4 py-4 pb-24">{children}</main>
      <Nav />
    </div>
  );
}
