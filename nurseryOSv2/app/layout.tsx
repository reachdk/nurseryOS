import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "nurseryOSv2",
  description: "Nursery inventory, advance order and availability management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
