import type { Metadata } from "next";
import { Outfit, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import { PageTransitionProvider } from "./components/PageTransition";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Sudipta Sarkar — Artist Portfolio",
  description: "Sudipta Sarkar is an artist who loves to draw and sketch. She loves coffee, colors, and beautiful lineart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-brand-bg text-brand-dark selection:bg-brand-accent selection:text-brand-dark">
        <SmoothScroll />
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  );
}
