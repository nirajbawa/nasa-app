"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Lottie dynamically (placeholders, provide JSON later)
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const steps = [
  { title: "Pick your farm", icon: "🌾", desc: "Choose location and farm type." },
  { title: "Explore NASA data", icon: "🛰️", desc: "View soil moisture, climate, and vegetation." },
  { title: "Make decisions", icon: "💧", desc: "Set irrigation and fertilization plans." },
  { title: "See your impact", icon: "📊", desc: "Track yields, water use, and sustainability." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-gradient-to-b from-white to-[var(--brand-green-100)]/60">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--brand-green-500)]">
            How It Works
          </h2>
          <p className="mt-2 text-black/70">A quick, gamified flow from setup to insights.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {steps.map((s, idx) => (
            <motion.a
              key={s.title}
              href="#join"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="relative block rounded-xl bg-white p-6 shadow-xl border hover-glow cursor-pointer"
            >
              {/* Placeholder Lottie area */}
              <div className="h-24 flex items-center justify-center">
                {/* Replace with: <Lottie animationData={yourJson} loop autoPlay /> */}
                <div className="text-3xl">{s.icon}</div>
              </div>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-black/70">{s.desc}</p>
              {/* Arrow connector except last */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-[var(--brand-green-400)]">➜</div>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
