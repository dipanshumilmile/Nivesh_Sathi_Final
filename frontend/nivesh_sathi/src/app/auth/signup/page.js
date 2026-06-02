// src/app/auth/signup/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../../../lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profession: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await signup(form);
      router.push("/auth/login");
    } catch (err) {
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-sm border border-slate-200 px-6 py-8">
        <h1 className="text-2xl font-bold mb-1 text-center text-slate-900">
          Create your account 🚀
        </h1>
        <p className="text-xs text-slate-500 mb-6 text-center">
          Set up your profile to get personalised fund analytics.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Full Name
            </label>
            <input
              name="name"
              placeholder="Your name"
              onChange={handleChange}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Create a strong password"
              onChange={handleChange}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Profession
            </label>
            <select
              name="profession"
              onChange={handleChange}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select Profession</option>
              <option>Student</option>
              <option>Working Professional</option>
              <option>Investor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-emerald-600 font-medium hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </main>
  );
}
