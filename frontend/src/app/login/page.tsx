"use client";

import Link from "next/link";
import { useState } from "react";
import { saveToken } from "@/lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        alert("❌ Login failed");
        return;
      }
      const data = await res.json();

      saveToken(data.access_token);
      window.location.href = "/notes";
    } catch (error) {
      console.error(error);
      alert("❌ Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <p className="text-slate-400 mt-3">
            Login to continue to your notes ✨
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
              className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Switch to Register */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
