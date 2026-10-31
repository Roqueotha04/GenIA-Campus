import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";

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
      className={`${headingFont.variable} ${bodyFont.variable} ${accentFont.variable} h-full antialiased`}
    >
      <body className="min-h-full font-body">
        <MotionProvider>
          <SessionProvider>{children}</SessionProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
