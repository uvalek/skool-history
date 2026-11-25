import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import { SCRIPT_TEMA } from "@/lib/tema";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Elizaveta | Portal de Historia",
  description:
    "Portal de recursos educativos de historia para estudiantes de secundaria y universidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Oscuro es el valor por defecto, asi que la clase viaja ya en el HTML
    // del servidor. suppressHydrationWarning es necesario porque el script de
    // abajo puede quitarla antes de que React hidrate, y sin el avisaria de
    // que el DOM no coincide con lo que renderizo.
    <html
      lang="es"
      className={`${plusJakarta.variable} ${manrope.variable} h-full dark`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
