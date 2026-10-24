import type { ReactNode } from "react";
import { RequireAuth } from "@/components/auth/AuthGuards";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
