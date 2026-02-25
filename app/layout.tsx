import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GrowHubTips | Nurturing Your Green Thumb, One Tip at a Time.",
  description: "Home gardening, indoor plants, urban farming, and plant care troubleshooting tips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jakarta.variable} antialiased bg-[#F9F9F9]`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
