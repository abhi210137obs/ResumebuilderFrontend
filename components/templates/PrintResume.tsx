"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { getErrorMessage, resumeApi } from "@/lib/api";
import { normalizeResume } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";
import { ResumeTemplate } from ".";

type PrintState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; resume: ResumeData };

export function PrintResume({ id }: { id: string }) {
  const [state, setState] = useState<PrintState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    resumeApi
      .get(id)
      .then((resume) => {
        if (cancelled) return;
        const normalized = normalizeResume(resume);
        document.title = normalized.title || "Resume";
        setState({ status: "ready", resume: normalized });
      })
      .catch((error) => {
        if (cancelled) return;
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        setState({
          status: "error",
          message:
            status === 401
              ? "You need to be logged in to view this resume."
              : status === 404
                ? "Resume not found."
                : getErrorMessage(error, "Could not load this resume."),
        });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <main className="print-root flex min-h-screen flex-1 justify-center bg-zinc-200 py-8 print:bg-white print:py-0">
      {state.status === "loading" && (
        <p className="no-print self-center text-sm text-zinc-500" role="status">
          Loading resume…
        </p>
      )}
      {state.status === "error" && (
        <p className="self-center rounded-lg bg-white px-4 py-3 text-sm text-red-600 shadow" role="alert">
          {state.message}
        </p>
      )}
      {state.status === "ready" && (
        <div className="h-fit shadow-xl print:shadow-none" data-print-ready="true">
          <ResumeTemplate resume={state.resume} />
        </div>
      )}
    </main>
  );
}
