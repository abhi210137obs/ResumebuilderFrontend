"use client";

import { AlertTriangle, FilePlus2, FileText, Plus, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StateMessage } from "@/components/ui/StateMessage";
import { getErrorMessage, resumeApi } from "@/lib/api";
import type { ResumeSummary } from "@/lib/types";
import type { CreateResumeValues } from "@/lib/validators";
import { useAuthStore } from "@/store/authStore";
import { CreateResumeModal } from "./CreateResumeModal";
import { ResumeCard } from "./ResumeCard";

type LoadState = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; resumes: ResumeSummary[] };
type BusyAction = "duplicate" | "download" | "delete";

export function DashboardView() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ResumeSummary | null>(null);
  const [busy, setBusy] = useState<Record<string, BusyAction | undefined>>({});

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      setState({ status: "ready", resumes: await resumeApi.list() });
    } catch (error) {
      setState({ status: "error", message: getErrorMessage(error, "Could not load your resumes.") });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    void load();
  }, [load]);

  const setResumes = (update: (resumes: ResumeSummary[]) => ResumeSummary[]) =>
    setState((current) => (current.status === "ready" ? { status: "ready", resumes: update(current.resumes) } : current));

  const withBusy = async (id: string, action: BusyAction, task: () => Promise<void>) => {
    setBusy((current) => ({ ...current, [id]: action }));
    try {
      await task();
    } finally {
      setBusy((current) => ({ ...current, [id]: undefined }));
    }
  };

  const handleCreate = async (values: CreateResumeValues) => {
    try {
      const resume = await resumeApi.create({
        ...values,
        personal: { fullName: user?.name ?? "", email: user?.email ?? "", phone: "", location: "", links: [] },
      });
      toast.success("Resume created");
      setCreateOpen(false);
      router.push(`/editor/${resume.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not create the resume."));
    }
  };

  const handleDuplicate = (resume: ResumeSummary) =>
    withBusy(resume.id, "duplicate", async () => {
      try {
        const copy = await resumeApi.duplicate(resume.id);
        setResumes((resumes) => [
          { id: copy.id, title: copy.title, template: copy.template, updatedAt: copy.updatedAt ?? new Date().toISOString() },
          ...resumes,
        ]);
        toast.success(`Created "${copy.title}"`);
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not duplicate the resume."));
      }
    });

  const handleDownload = (resume: ResumeSummary) =>
    withBusy(resume.id, "download", async () => {
      const toastId = toast.loading("Generating PDF…");
      try {
        await resumeApi.downloadPdf(resume.id, resume.title);
        toast.success("PDF downloaded", { id: toastId });
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not generate the PDF."), { id: toastId });
      }
    });

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    await withBusy(target.id, "delete", async () => {
      try {
        await resumeApi.remove(target.id);
        setResumes((resumes) => resumes.filter((resume) => resume.id !== target.id));
        toast.success(`Deleted "${target.title}"`);
        setPendingDelete(null);
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not delete the resume."));
      }
    });
  };

  const hasResumes = state.status === "ready" && state.resumes.length > 0;

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">My resumes</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {user ? `Hi ${user.name.split(" ")[0]}, ` : ""}create, edit and export your resumes.
          </p>
        </div>
        {hasResumes && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            New resume
          </Button>
        )}
      </div>

      <div className="mt-8" aria-live="polite" aria-busy={state.status === "loading"}>
        {state.status === "loading" && (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading resumes">
            {Array.from({ length: 3 }, (_, index) => (
              <li key={index} className="h-56 animate-pulse rounded-2xl border border-zinc-200 bg-white p-5">
                <div className="h-24 rounded-lg bg-zinc-100" />
                <div className="mt-4 h-4 w-2/3 rounded bg-zinc-100" />
                <div className="mt-2 h-3 w-1/3 rounded bg-zinc-100" />
              </li>
            ))}
          </ul>
        )}

        {state.status === "error" && (
          <StateMessage
            tone="error"
            icon={AlertTriangle}
            title="Something went wrong"
            description={state.message}
            action={
              <Button variant="outline" onClick={load}>
                <RotateCw className="size-4" aria-hidden="true" />
                Try again
              </Button>
            }
          />
        )}

        {state.status === "ready" && state.resumes.length === 0 && (
          <StateMessage
            icon={FileText}
            title="No resumes yet"
            description="Create your first resume and watch it come to life with a live preview."
            action={
              <Button size="lg" onClick={() => setCreateOpen(true)}>
                <FilePlus2 className="size-4" aria-hidden="true" />
                Create your first resume
              </Button>
            }
          />
        )}

        {hasResumes && (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {state.resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                busy={busy[resume.id]}
                onDuplicate={() => handleDuplicate(resume)}
                onDownload={() => handleDownload(resume)}
                onDelete={() => setPendingDelete(resume)}
              />
            ))}
          </ul>
        )}
      </div>

      <CreateResumeModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete resume?"
        description={
          pendingDelete ? (
            <>
              &ldquo;{pendingDelete.title}&rdquo; will be permanently deleted. This action cannot be undone.
            </>
          ) : undefined
        }
        confirmLabel="Delete"
        variant="danger"
        loading={pendingDelete ? busy[pendingDelete.id] === "delete" : false}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
