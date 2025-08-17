import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Financy - Gestión Financiera Personal",
  description:
    "Aplicación de gestión financiera personal para controlar ingresos, gastos y presupuestos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased financy-theme text-foreground bg-background`}
      >
        <Providers>
          <LanguageProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <main>{children}</main>
            </div>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
