import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "NurseryOS",
  description: "Nursery inventory, orders, and availability",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2d6a4f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
          <header className="sticky top-0 z-10 border-b border-[var(--accent)] bg-[var(--primary)] px-4 py-3 text-white shadow-sm">
            <h1 className="text-lg font-semibold tracking-tight">NurseryOS</h1>
            <p className="text-xs text-[var(--accent)]">Inventory & availability</p>
          </header>
          <main className="flex-1 px-4 py-4 pb-24">{children}</main>
          <Nav />
        </div>
      </body>
    </html>
  );
}
