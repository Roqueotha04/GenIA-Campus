import type { Metadata } from "next";
import { Geist, Instrument_Serif, Roboto } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/providers/MotionProvider";

const headingFont = Geist({
  subsets: ["latin"],
  variable: "--font-heading-face",
  display: "swap",
});

const bodyFont = Geist({
  subsets: ["latin"],
  variable: "--font-body-face",
  display: "swap",
});

const accentFont = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-accent-face",
  display: "swap",
});

const campusFont = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Campus Generación IA",
    template: "%s · Generación IA",
  },
  description:
    "Campus virtual de Generación IA: niveles, módulos, presentaciones y actividades con puntaje.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${headingFont.variable} ${bodyFont.variable} ${accentFont.variable} ${campusFont.variable} h-full antialiased`}
    >
      <body className="min-h-full font-body">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
