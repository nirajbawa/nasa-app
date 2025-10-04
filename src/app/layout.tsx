import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-mono",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NASA Farm Navigators",
  description:
    "Learn sustainable farming through real NASA data while playing an engaging game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${nunito.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
