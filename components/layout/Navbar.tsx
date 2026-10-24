"use client";

import { LayoutDashboard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("You have been logged out.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not log out cleanly."));
    } finally {
      setLoggingOut(false);
      router.replace("/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo href={status === "authenticated" ? "/dashboard" : "/"} />
        <div className="flex items-center gap-2">
          {status === "authenticated" && user ? (
            <>
              <ButtonLink href="/dashboard" variant="ghost" size="sm" className="hidden sm:inline-flex">
                <LayoutDashboard className="size-4" aria-hidden="true" />
                Dashboard
              </ButtonLink>
              <span className="hidden max-w-40 truncate text-sm text-zinc-600 md:inline" title={user.email}>
                {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout} loading={loggingOut}>
                {!loggingOut && <LogOut className="size-4" aria-hidden="true" />}
                Log out
              </Button>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">
                Log in
              </ButtonLink>
              <ButtonLink href="/register" size="sm">
                Get started
              </ButtonLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
