"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./MapClient"), { ssr: false });

export default function DataPreview() {
  return (
    <section id="data" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--brand-green-500)]">
            Interactive Data Preview
          </h2>
          <p className="mt-3 text-black/70 max-w-prose">
            Explore a live map with blinking markers. Hover markers to view NASA-like mock metrics
            such as soil moisture, rainfall, and vegetation index. Smooth pan/zoom supported.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="relative rounded-xl border p-3 shadow-sm bg-[var(--brand-green-100)]/60"
        >
          <MapClient />
        </motion.div>
      </div>
    </section>
  );
}
