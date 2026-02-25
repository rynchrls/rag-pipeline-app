"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import AuthSvc from "@/api/services/auth.service";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false); // <-- loading state
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simple client-side validation
    if (formData.password !== formData.confirmPassword) {
      addToast("Passwords do not match!", "error");
      return;
    }

    try {
      await AuthSvc.register(formData);
      addToast("Register successful!", "success");
    } catch (error: unknown) {
      addToast((error as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 shadow-xl">
              <Sparkles size={36} />
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
            Rag Pipeline
          </h1>

          <p className="mt-4 text-slate-400 text-sm">
            Register to start building your intelligent document pipelines.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Full Name
              </label>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition">
                <User size={18} className="text-slate-400 mr-3" />
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="bg-transparent w-full outline-none text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Email</label>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition">
                <Mail size={18} className="text-slate-400 mr-3" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="bg-transparent w-full outline-none text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Password
              </label>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition">
                <Lock size={18} className="text-slate-400 mr-3" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-transparent w-full outline-none text-sm"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Confirm Password
              </label>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition">
                <Lock size={18} className="text-slate-400 mr-3" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-transparent w-full outline-none text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading} // disable while loading
              className={`w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition shadow-lg font-medium flex justify-center items-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Rag Pipeline • Built by{" "}
          <a
            href="https://github.com/rag-pipeline"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition"
          >
            Ryan Charles Alcaraz
          </a>
        </div>
      </div>
    </div>
  );
}
