"use client";
import { motion } from "framer-motion";

const badges = [
  { icon: "🌟", title: "Sustainable Farmer" },
  { icon: "🥕", title: "Crop Saver" },
  { icon: "💧", title: "Water Guardian" },
];

export default function Rewards() {
  return (
    <section id="rewards" className="bg-gradient-to-b from-[var(--brand-green-100)]/60 to-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--brand-green-500)]">
            Progress & Rewards
          </h2>
          <p className="mt-2 text-black/70">Unlock achievements as you play.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((b, idx) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, rotate: -1.5 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-6 shadow-xl border hover-glow text-center"
            >
              <div className="text-4xl">{b.icon}</div>
              <h3 className="mt-3 font-semibold">{b.title}</h3>
              <div className="mt-4 h-2 w-full bg-[var(--brand-green-100)] rounded-full">
                <div className="h-2 bg-[var(--brand-green-400)] rounded-full" style={{ width: `${60 + idx * 10}%` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
