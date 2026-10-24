"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import toast, { Toaster } from "react-hot-toast";
import { setUnauthorizedHandler } from "@/lib/api";
import { isPrintRoute, loginUrlWithNext } from "@/lib/navigation";
import { useAuthStore } from "@/store/authStore";

export function AppProviders({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isPrintRoute()) void useAuthStore.getState().init();
  }, []);

  useEffect(
    () =>
      setUnauthorizedHandler(() => {
        if (isPrintRoute()) return;
        const { status, clear } = useAuthStore.getState();
        clear();
        if (status === "authenticated") {
          toast.error("Your session has expired. Please log in again.", { id: "session-expired" });
        }
        router.replace(loginUrlWithNext());
      }),
    [router],
  );

  return (
    <>
      {children}
      <Toaster
        position="bottom-center"
        containerClassName="no-print"
        toastOptions={{
          duration: 4000,
          className: "text-sm",
          style: { borderRadius: "10px", padding: "10px 14px" },
        }}
      />
    </>
  );
}
