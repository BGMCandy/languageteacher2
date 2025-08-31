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
      <body className={`antialiased`}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
