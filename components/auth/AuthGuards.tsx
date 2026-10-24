"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { getSafeNext, loginUrlWithNext } from "@/lib/navigation";
import { useAuthStore } from "@/store/authStore";

export function RequireAuth({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace(loginUrlWithNext());
  }, [status, router]);

  if (status !== "authenticated") {
    return <FullPageSpinner label={status === "unauthenticated" ? "Redirecting to login" : "Loading your account"} />;
  }
  return children;
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace(getSafeNext());
  }, [status, router]);

  if (status === "authenticated") return <FullPageSpinner label="Redirecting" />;
  if (status !== "unauthenticated") return <FullPageSpinner />;
  return children;
}
