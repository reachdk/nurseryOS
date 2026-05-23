"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/login/actions";

const links = [
  { href: "/", label: "Home" },
  { href: "/plants", label: "Plants" },
  { href: "/batches/new", label: "Plant" },
  { href: "/sync", label: "Sync" },
];

const NAV_SHELL =
  "fixed bottom-0 left-1/2 z-10 w-full max-w-lg -translate-x-1/2 border-t border-[var(--accent)] bg-white px-2 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:max-w-4xl xl:max-w-5xl";

export function Nav() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <nav className={NAV_SHELL}>
      <ul className="flex justify-between gap-1">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <li key={link.href} className="flex-1">
              <Link
                href={link.href}
                className={`block rounded-lg px-2 py-2 text-center text-xs font-medium transition-colors ${
                  active
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted)] hover:bg-[var(--background)]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
        <li className="shrink-0">
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg px-2 py-2 text-xs font-medium text-[var(--muted)] hover:bg-[var(--background)]"
            >
              Out
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
