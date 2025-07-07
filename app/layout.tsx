import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import React from "react";
import "./globals.css";
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "الكروت التفاعلية",
  description: "لعبة أسئلة تفاعلية للفرق",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
