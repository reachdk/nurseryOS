"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/server/lib/permissions";

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-emerald-50 text-emerald-900"
          : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
      }`}
    >
      {item.label}
    </Link>
  );
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="hidden flex-col gap-1 md:flex" aria-label="Main navigation">
      {items.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </nav>
  );
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const mobileItems = items.filter((i) => i.mobilePriority).slice(0, 4);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4 gap-1 px-2 py-2">
        {mobileItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-12 flex-col items-center justify-center rounded-lg px-1 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function MobileMenu({ items }: { items: NavItem[] }) {
  return (
    <details className="group md:hidden">
      <summary className="cursor-pointer list-none rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700">
        Menu
      </summary>
      <div className="mt-2 flex flex-col gap-1 rounded-lg border border-stone-200 bg-white p-2 shadow-sm">
        {items.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
    </details>
  );
}
