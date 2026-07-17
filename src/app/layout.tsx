import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Picnic Island | Theme Park & Booking",
  description: "Book hotels, ferry tickets, and theme park experiences on Picnic Island.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 dark:bg-neutral-950">
        <Nav />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-black/10 dark:border-white/10 py-6 text-center text-xs text-neutral-500">
          Picnic Island Theme Park &copy; {new Date().getFullYear()} — Online Booking System
        </footer>
      </body>
    </html>
  );
}
