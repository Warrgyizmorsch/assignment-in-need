import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import Header from "@/components/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Assignment In Need | 100% Original Academic Help",
  description: "Get 100% ORIGINAL + 100% Plagiarism-free Assignment Help within 48 Hours or Less. A one-stop writing service for Business, Law, Nursing, and Engineering assignments, essays, and case studies.",
  keywords: ["assignment help", "plagiarism-free writing", "case study writing", "business law essays", "nursing assignment help", "engineering report help"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
