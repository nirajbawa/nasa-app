"use client";
import { motion } from "framer-motion";
import { PrimaryButton, SecondaryButton } from "./buttons";

export default function Join() {
  return (
    <section id="join" className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="rounded-2xl border p-10 shadow-sm bg-[var(--brand-green-100)]/50"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--brand-green-500)]">
            🚀 Join the NASA Space Apps 2025 Challenge
          </h2>
          <p className="mt-3 text-black/70 max-w-2xl mx-auto">
            Build solutions that empower farmers with Earth observation data and sustainability insights.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <PrimaryButton href="#" as="a">Join the Challenge</PrimaryButton>
            <SecondaryButton href="#tutorials" as="a">View Tutorials</SecondaryButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
