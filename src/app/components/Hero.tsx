"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { PrimaryButton, SecondaryButton } from "./buttons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden hero-animated-gradient">
      {/* Floating icons */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div className="absolute left-6 top-10 text-3xl float-slow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.8, y: 0 }}>🛰️</motion.div>
        <motion.div className="absolute right-10 top-16 text-3xl float-med" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.8, y: 0 }}>🌿</motion.div>
        <motion.div className="absolute left-1/3 bottom-12 text-3xl float-fast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.8, y: 0 }}>🌾</motion.div>
        <motion.div className="absolute right-1/4 bottom-16 text-3xl float-med" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.8, y: 0 }}>🚁</motion.div>
      </div>
      <div className="absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full bg-[var(--brand-green-200)]/60 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-32 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--brand-green-500)]">
            <span className="mr-2">🌱</span> NASA Farm Navigators
          </h1>
          <p className="text-lg text-black/70 max-w-prose">
            Learn sustainable farming through real NASA data while playing an engaging game.
          </p>
          <div className="flex flex-wrap gap-4">
            <PrimaryButton href="#join" className="btn-neon hover-bounce">Start Game</PrimaryButton>
            <SecondaryButton href="#about" className="hover-flip">Learn More</SecondaryButton>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="glass rounded-xl p-4 shadow-xl hover-glow"
        >
          <Image
            src="/farm-illustration.svg"
            alt="Farm with crops, satellite, and fields"
            width={900}
            height={600}
            className="w-full h-auto"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
