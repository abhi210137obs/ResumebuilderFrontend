"use client";

import { useCallback, useEffect, useRef } from "react";
import { getErrorMessage, resumeApi } from "@/lib/api";
import { serializeResume } from "@/lib/resume";
import { resumeSchema } from "@/lib/validators";
import { useEditorStore } from "@/store/editorStore";

export const AUTOSAVE_DELAY_MS = 1500;

export function useAutosave(resumeId: string, delay = AUTOSAVE_DELAY_MS) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef<Promise<boolean> | null>(null);
  const saveRef = useRef<() => Promise<boolean>>(() => Promise.resolve(true));

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const schedule = useCallback(() => {
    clearTimer();
    timer.current = setTimeout(() => void saveRef.current(), delay);
  }, [delay]);

  const save = useCallback(async (): Promise<boolean> => {
    clearTimer();
    if (inFlight.current) await inFlight.current;

    const { resume, isDirty, setSaving, setSaveError, markSaved } = useEditorStore.getState();
    if (!resume || !isDirty) return true;

    const parsed = resumeSchema.safeParse(resume);
    if (!parsed.success) {
      setSaveError("Fix the highlighted fields to save your changes.");
      return false;
    }

    const snapshot = serializeResume(resume);
    setSaving();
    const request = resumeApi
      .update(resumeId, parsed.data)
      .then((updated) => {
        markSaved(snapshot, updated.updatedAt);
        return true;
      })
      .catch((error) => {
        setSaveError(getErrorMessage(error, "Could not save your changes."));
        return false;
      })
      .finally(() => {
        inFlight.current = null;
      });
    inFlight.current = request;

    const ok = await request;
    if (ok && useEditorStore.getState().isDirty) schedule();
    return ok;
  }, [resumeId, schedule]);

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  useEffect(() => {
    const unsubscribe = useEditorStore.subscribe((state, prev) => {
      if (state.resume === prev.resume) return;
      if (state.isDirty) schedule();
      else clearTimer();
    });
    return () => {
      unsubscribe();
      clearTimer();
      const { resume, isDirty } = useEditorStore.getState();
      if (resume && isDirty) {
        const parsed = resumeSchema.safeParse(resume);
        if (parsed.success) resumeApi.update(resumeId, parsed.data).catch(() => undefined);
      }
    };
  }, [resumeId, schedule]);

  return { saveNow: save };
}
