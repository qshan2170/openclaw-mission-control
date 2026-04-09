import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DM_Serif_Display, IBM_Plex_Sans, Sora } from "next/font/google";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GlobalLoader } from "@/components/ui/global-loader";

export const metadata: Metadata = {
  title: "OpenClaw Mission Control",
  description: "A calm command center for every task.",
};

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const headingFont = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

const displayFont = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400"],
});

const themeInitScript = `(() => {
  const key = "openclaw-mission-control-theme";
  const stored = localStorage.getItem(key) || "system";
  const resolved = stored === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : stored;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
  document.documentElement.dataset.theme = stored;
})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} ${headingFont.variable} ${displayFont.variable} min-h-screen bg-app text-strong antialiased transition-colors duration-200`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <GlobalLoader />
              {children}
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
