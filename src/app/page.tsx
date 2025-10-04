import Hero from "@/components/Hero";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import DataPreview from "@/components/DataPreview";
import Rewards from "@/components/Rewards";
import Join from "@/components/Join";
import Footer from "@/components/Footer";
import { redirect } from 'next/navigation';
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans">
      <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
        <nav className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="font-extrabold text-[var(--brand-green-500)]">🌱 NASA Farm Navigators</div>
          <div className="hidden sm:flex gap-6 text-sm">
            <a href="#about" className="hover:underline">About</a>
            <a href="#how" className="hover:underline">How It Works</a>
            <a href="#data" className="hover:underline">Data</a>
            <a href="#rewards" className="hover:underline">Rewards</a>
            <Link href="/sign-in" className="hover:underline">Sign In</Link>
          </div>
        </nav>
      </header>
      <main id="main">
        <Hero />
        <About />
        <HowItWorks />
        <DataPreview />
        <Rewards />
        <Join />
      </main>
      <Footer />
    </div>
  );

}

