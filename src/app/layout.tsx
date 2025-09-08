import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { AuthProvider } from "@/contexts/AuthContext";

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
    <html lang="en">
      <head>
        {/* Preload critical fonts for better LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Bangers&family=Fugaz+One&display=swap" 
          as="style" 
        />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Bangers&family=Fugaz+One&display=swap" 
        />
      </head>
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
