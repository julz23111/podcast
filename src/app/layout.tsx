import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import HeaderNav from "@/components/header-nav";
import ThemeProvider from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weekly Bust Podcast",
  description: "Official website for the podcast — listen, read show notes, and subscribe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "flex min-h-screen flex-col")}>
        <ThemeProvider>
          <HeaderNav />

          <main className="flex-1 max-w-5xl mx-auto p-4">{children}</main>

          <footer className="backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border-t border-gray-200 dark:border-gray-800 mt-12">
            <div className="max-w-5xl mx-auto text-center p-4 text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} The Weekly Bust. All rights reserved.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}