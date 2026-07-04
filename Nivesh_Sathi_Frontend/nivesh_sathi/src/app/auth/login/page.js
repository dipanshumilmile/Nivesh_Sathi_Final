// src/app/auth/login/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    if (token && name) router.replace("/");
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // if your backend now returns { token, name, email, profession }
      const result = await login(form);
      let token = result;
      let name = form.email.split("@")[0];
      let email = form.email;
      let profession = "";

      // support both old (string) and new (object) responses
      if (typeof result === "object" && result !== null) {
        token = result.token;
        name = result.name || name;
        email = result.email || email;
        profession = result.profession || "";
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userProfession", profession);

      router.push("/");
    } catch (err) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-sm border border-slate-200 px-6 py-8">
        <h1 className="text-2xl font-bold mb-1 text-center text-slate-900">
          Welcome back 👋
        </h1>
        <p className="text-xs text-slate-500 mb-6 text-center">
          Log in to access your personalised fund insights.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-slate-500">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="text-emerald-600 font-medium hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </main>
  );
}
