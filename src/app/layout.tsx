import type { Metadata } from "next";
import { Bangers, Fugaz_One } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { AuthProvider } from "@/contexts/AuthContext";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bangers",
});

const fugazOne = Fugaz_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fugaz-one",
});

export const metadata: Metadata = {
  title: "Language Teacher - Learn Japanese, Thai & More",
  description: "Master Japanese Kanji, Thai characters, and other languages with interactive flashcards, practice sessions, and comprehensive learning tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bangers.variable} ${fugazOne.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <Header />
          <main className="">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
