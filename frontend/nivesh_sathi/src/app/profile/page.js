"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profession: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    // For now we only know name/email from localStorage or decode later
    const storedEmail = localStorage.getItem("userEmail") || "";
    const storedProfession = localStorage.getItem("userProfession") || "";

    setProfile({
      name: name || "User",
      email: storedEmail,
      profession: storedProfession,
    });
    setLoaded(true);
  }, [router]);

  const initial =
    profile.name && profile.name.length > 0
      ? profile.name.charAt(0).toUpperCase()
      : "U";

  if (!loaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-10 w-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Your profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal details and preferences.
          </p>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex gap-6 items-center">
          <div className="h-16 w-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-semibold">
            {initial}
          </div>
          <div>
            <p className="text-sm text-slate-500">Signed in as</p>
            <p className="text-lg font-semibold text-slate-900">
              {profile.name}
            </p>
            {profile.email && (
              <p className="text-xs text-slate-500 mt-1">{profile.email}</p>
            )}
            {profile.profession && (
              <p className="mt-1 text-xs text-slate-500">
                Profession:{" "}
                <span className="font-medium text-slate-800">
                  {profile.profession}
                </span>
              </p>
            )}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Account settings
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Coming soon: update your name, email, and profession.
            </p>
            <button
              type="button"
              disabled
              className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-medium text-slate-500 cursor-not-allowed"
            >
              Edit profile (disabled)
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Security
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              In a future version, you will be able to change your password
              from here.
            </p>
            <button
              type="button"
              disabled
              className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-medium text-slate-500 cursor-not-allowed"
            >
              Change password (disabled)
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
