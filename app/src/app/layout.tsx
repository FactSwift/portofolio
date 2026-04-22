import type { Metadata } from "next";
import { Prompt, Barlow } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-prompt",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Zaidan Ahmad's Portfolio",
  description: "A modern portfolio website built with Next.js and Tailwind CSS.",
  icons: {
    shortcut: "/favicon/favicon.ico",
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${prompt.variable} ${barlow.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
