import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "NurseryOS",
  description: "Nursery inventory and availability",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2d6a4f",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <AppShell userEmail={user?.email ?? null}>{children}</AppShell>
      </body>
    </html>
  );
}
