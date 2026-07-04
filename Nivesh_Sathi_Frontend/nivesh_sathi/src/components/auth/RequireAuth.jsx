"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
    } else {
      setAllowed(true);
    }
  }, [router]);

  if (!allowed) {
    return null; // ⛔ prevent UI flash
  }

  return children;
}
