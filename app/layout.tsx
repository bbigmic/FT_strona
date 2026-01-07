import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import { CRMProvider } from "./context/CRMContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Feliz Trade Ltd - Future of Automation",
  description: "Profesjonalne usługi tworzenia agentów AI, systemów SaaS i stron internetowych.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-black text-white`}>
        <LanguageProvider>
          <CRMProvider>
            {children}
          </CRMProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
