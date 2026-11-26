import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/providers/MotionProvider";

const siteFont = Roboto({
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
    <html lang="es" className={`${siteFont.variable} h-full antialiased`}>
      <body className="min-h-full font-body">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
