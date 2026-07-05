"use client";

import { useRouter } from "next/navigation";
import { clearToken } from "../lib/api";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        clearToken();
        router.replace("/login");
      }}
      className={className}
    >
      Log out
    </button>
  );
}
