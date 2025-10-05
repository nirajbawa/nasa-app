import Link from "next/link";
import React from "react";

function AppNav() {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
      <nav className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
             <Link href="/" className="hover:underline">
        <div className="font-extrabold text-[var(--brand-green-500)]">
          🌱 NASA Farm Navigators
        </div>
        </Link>
        <div className="hidden sm:flex gap-6 text-sm">
          <a href="#about" className="hover:underline">
            About
          </a>
          <a href="#how" className="hover:underline">
            How It Works
          </a>
          <a href="#data" className="hover:underline">
            Data
          </a>
          <a href="#rewards" className="hover:underline">
            Rewards
          </a>
          <Link href="/sign-in" className="hover:underline">
            Sign In
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default AppNav;
