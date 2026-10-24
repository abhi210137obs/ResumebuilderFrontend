import { create } from "zustand";
import { serializeResume } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";

export type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

interface EditorState {
  resumeId: string | null;
  resume: ResumeData | null;
  savedSnapshot: string;
  isDirty: boolean;
  saveStatus: SaveStatus;
  saveError: string | null;
  lastSavedAt: string | null;
  load: (id: string, resume: ResumeData, updatedAt?: string) => void;
  setResume: (resume: ResumeData) => void;
  setSaving: () => void;
  setSaveError: (message: string) => void;
  markSaved: (snapshot: string, updatedAt?: string) => void;
  reset: () => void;
}

const initialState = {
  resumeId: null,
  resume: null,
  savedSnapshot: "",
  isDirty: false,
  saveStatus: "idle" as SaveStatus,
  saveError: null,
  lastSavedAt: null,
};

const idleStatus = (lastSavedAt: string | null): SaveStatus => (lastSavedAt ? "saved" : "idle");

export const useEditorStore = create<EditorState>()((set) => ({
  ...initialState,
  load: (id, resume, updatedAt) =>
    set({
      ...initialState,
      resumeId: id,
      resume,
      savedSnapshot: serializeResume(resume),
      lastSavedAt: updatedAt ?? null,
    }),
  setResume: (resume) =>
    set((state) => {
      const isDirty = serializeResume(resume) !== state.savedSnapshot;
      let saveStatus = state.saveStatus;
      if (state.saveStatus !== "saving") {
        saveStatus = isDirty ? "pending" : idleStatus(state.lastSavedAt);
      }
      return { resume, isDirty, saveStatus };
    }),
  setSaving: () => set({ saveStatus: "saving", saveError: null }),
  setSaveError: (message) => set({ saveStatus: "error", saveError: message }),
  markSaved: (snapshot, updatedAt) =>
    set((state) => {
      const lastSavedAt = updatedAt ?? new Date().toISOString();
      const isDirty = state.resume ? serializeResume(state.resume) !== snapshot : false;
      return {
        savedSnapshot: snapshot,
        isDirty,
        lastSavedAt,
        saveError: null,
        saveStatus: isDirty ? "pending" : "saved",
      };
    }),
  reset: () => set(initialState),
}));
