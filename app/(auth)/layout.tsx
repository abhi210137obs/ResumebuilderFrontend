import type { ReactNode } from "react";
import { GuestOnly } from "@/components/auth/AuthGuards";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-indigo-50 via-white to-white">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pt-8 pb-16 sm:items-center sm:pt-0">
        <GuestOnly>{children}</GuestOnly>
      </main>
    </div>
  );
}
