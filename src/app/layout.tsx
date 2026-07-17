import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
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

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sand-50 dark:bg-lagoon-900">
        <Nav />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-lagoon-900/10 dark:border-white/10 py-6 text-center text-xs text-lagoon-900/50 dark:text-sand-100/50">
          Picnic Island Theme Park &copy; {new Date().getFullYear()} — Online Booking System
        </footer>
      </body>
    </html>
  );
}
