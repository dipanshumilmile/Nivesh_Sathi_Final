"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);

  // Load auth info from localStorage (full name)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName"); // should be full name from login

    if (token && name) {
      setUser({ name });
    } else {
      setUser(null);
    }
  }, [pathname]);

  // Close menu when clicking anywhere outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUser(null);
    setShowMenu(false);
    router.push("/auth/login");
  };

  const handleProfile = () => {
    setShowMenu(false);
    router.push("/profile"); // create this page later
  };

  const initial =
    user?.name && user.name.length > 0
      ? user.name.charAt(0).toUpperCase()
      : "U";

  return (
    <header className="bg-green-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Image
            src="/logo.jpeg"
            alt="NiveshSathi logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span>NiveshSathi</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-8 text-sm text-slate-600">
          <Link href="/fund-analytics">Fund Analytics</Link>
          <Link href="/ai-recommendation">AI Recommendations</Link>
          <Link href="/risk-simulator">Risk Simulator</Link>
          <Link href="/compare-funds">Compare Funds</Link>
          <Link href="/learning-hub">Learning Hub</Link>
        </div>

        {/* Auth Area */}
        {!user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium text-sm"
            >
              Sign up
            </Link>
          </div>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu((v) => !v)}
              className="flex items-center gap-3 cursor-pointer rounded-full px-2 py-1 hover:bg-emerald-100 transition"
            >
              {/* Avatar with first letter */}
              <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                {initial}
              </div>
              <span className="text-sm font-medium text-slate-700 max-w-[140px] truncate">
                {user.name}
              </span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg border border-slate-100 py-1 text-sm z-20">
                <button
                  onClick={handleProfile}
                  className="flex w-full items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    {initial}
                  </span>
                  <span>Profile</span>
                </button>

                <div className="my-1 h-px bg-slate-100" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
