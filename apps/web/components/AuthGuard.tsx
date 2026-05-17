"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { getToken } from "@/lib/api";

export default function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return <div className="p-6 text-slate-600">Checking authentication...</div>;
  return <>{children}</>;
}
