"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    // If no token → redirect to register
    if (!token) {
      router.push("/register");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-slate-900"></div>

      {/* Glow Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl"></div>

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-cyan-500/20">
            N
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            Notes<span className="text-cyan-400">Flow</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/notes"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-500/20"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="max-w-5xl text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
          Organize Your Thoughts
          <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Beautifully & Effortlessly
          </span>
        </h1>

        <p className="max-w-2xl mt-8 text-lg md:text-xl text-slate-400 leading-relaxed">
          A modern note-taking experience with secure authentication,
          lightning-fast performance, and a stunning interface powered by
          Next.js & Tailwind CSS.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5 mt-12">
          <Link
            href="/notes"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-semibold hover:scale-105 transition-all duration-200 shadow-2xl shadow-cyan-500/30"
          >
            Start Writing →
          </Link>
        </div>
      </main>
    </div>
  );
}
