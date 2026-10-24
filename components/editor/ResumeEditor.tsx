"use client";

import axios from "axios";
import { AlertTriangle, ArrowLeft, FileQuestion, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { StateMessage } from "@/components/ui/StateMessage";
import { getErrorMessage, resumeApi } from "@/lib/api";
import { normalizeResume } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";
import { useEditorStore } from "@/store/editorStore";
import { EditorWorkspace } from "./EditorWorkspace";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string; notFound: boolean }
  | { status: "ready"; resume: ResumeData };

export function ResumeEditor({ id }: { id: string }) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const load = useEditorStore((store) => store.load);

  useEffect(() => {
    let cancelled = false;
    resumeApi
      .get(id)
      .then((resume) => {
        if (cancelled) return;
        const normalized = normalizeResume(resume);
        load(id, normalized, resume.updatedAt);
        setState({ status: "ready", resume: normalized });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({
          status: "error",
          notFound: axios.isAxiosError(error) && error.response?.status === 404,
          message: getErrorMessage(error, "Could not load this resume."),
        });
      });
    return () => {
      cancelled = true;
    };
  }, [id, attempt, load]);

  if (state.status === "loading") return <FullPageSpinner label="Loading your resume" />;

  if (state.status === "error") {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 items-center px-4 py-16">
        <StateMessage
          className="w-full"
          tone={state.notFound ? "neutral" : "error"}
          icon={state.notFound ? FileQuestion : AlertTriangle}
          title={state.notFound ? "Resume not found" : "Could not load resume"}
          description={state.notFound ? "This resume doesn't exist or you don't have access to it." : state.message}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href="/dashboard" variant="outline">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to dashboard
              </ButtonLink>
              {!state.notFound && (
                <Button
                  onClick={() => {
                    setState({ status: "loading" });
                    setAttempt((value) => value + 1);
                  }}
                >
                  <RotateCw className="size-4" aria-hidden="true" />
                  Try again
                </Button>
              )}
            </div>
          }
        />
      </main>
    );
  }

  return <EditorWorkspace key={id} resumeId={id} initialResume={state.resume} />;
}
