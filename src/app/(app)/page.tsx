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

