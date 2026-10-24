import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <DashboardView />
      </main>
    </div>
  );
}
