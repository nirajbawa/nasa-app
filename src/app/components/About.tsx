"use client";
import { motion } from "framer-motion";

const cards = [
  {
    icon: "🌍",
    title: "NASA Data",
    desc: "Soil, climate, and vegetation insights that drive decisions.",
  },
  {
    icon: "🚜",
    title: "Farming Simulation",
    desc: "Plan irrigation, fertilization, and livestock strategies.",
  },
  {
    icon: "🎮",
    title: "Gamified Learning",
    desc: "Make choices and see outcomes in real time.",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--brand-green-500)]">
            Why NASA Farm Navigators?
          </h2>
          <p className="mt-3 text-black/70">
            A bridge between NASA Earth data and sustainable farming practices.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, idx) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="rounded-xl p-6 shadow-xl hover-glow glass border border-white/40"
            >
              <div className="text-3xl">{c.icon}</div>
              <h3 className="mt-3 font-semibold text-lg">{c.title}</h3>
              <p className="mt-2 text-sm text-black/70">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
