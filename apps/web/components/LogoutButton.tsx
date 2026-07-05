"use client";

import { useRouter } from "next/navigation";
import { clearSession, getUserRole } from "../lib/api";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        const role = getUserRole();
        clearSession();
        router.replace(role === "admin" ? "/admin/login" : "/login");
      }}
      className={className}
    >
      Log out
    </button>
  );
}
