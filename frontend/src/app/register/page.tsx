"use client";

import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      alert("🎉 Registered successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 overflow-hidden relative">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>

      {/* Register Card */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Create Account
          </h1>

          <p className="text-slate-400 mt-3">
            Join and start saving your notes beautifully ✨
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>

        {/* Switch to Login */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
