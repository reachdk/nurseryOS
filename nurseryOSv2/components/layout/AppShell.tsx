import Link from "next/link";
import { MobileMenu, MobileNav, SidebarNav } from "@/components/layout/Nav";
import { SignOutButton } from "@/components/layout/SignOutButton";
import type { AppUser } from "@/server/lib/permissions";
import { visibleNavItems } from "@/server/lib/permissions";

type AppShellProps = {
  user: AppUser | null;
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  const navItems = visibleNavItems(user);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-semibold text-emerald-800">
              nurseryOSv2
            </Link>
            <MobileMenu items={navItems} />
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-600">
            {user ? (
              <>
                <span>
                  {user.name} · {user.roleName}
                </span>
                <SignOutButton />
              </>
            ) : (
              <Link href="/login" className="font-medium text-emerald-700 hover:underline">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside className="hidden w-52 shrink-0 md:block">
          <SidebarNav items={navItems} />
        </aside>
        <main className="min-w-0 flex-1 pb-20 md:pb-6">{children}</main>
      </div>

      <MobileNav items={navItems} />
    </div>
  );
}
