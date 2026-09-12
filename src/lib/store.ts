import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultTemplates, sampleStudents } from "./sample-data";
import type { AppSettings, HistoryEntry, MessageTemplate, Student } from "./types";
import { uid } from "./utils";

type SchoolState = {
  hydrated: boolean;
  students: Student[];
  templates: MessageTemplate[];
  history: HistoryEntry[];
  settings: AppSettings;
  unlocked: boolean;
  setHydrated: () => void;
  unlock: () => void;
  lock: () => void;
  addStudent: (s: Omit<Student, "id">) => void;
  updateStudent: (id: string, patch: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  replaceStudents: (students: Student[]) => void;
  addTemplate: (t: Omit<MessageTemplate, "id">) => void;
  updateTemplate: (id: string, patch: Partial<MessageTemplate>) => void;
  removeTemplate: (id: string) => void;
  logSend: (entry: Omit<HistoryEntry, "id">) => void;
  clearHistory: () => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  loadSample: () => void;
};

const defaultSettings: AppSettings = {
  schoolName: "New Mother India English School",
  pin: "",
  pinEnabled: false,
  speakStatus: false,
  testPhone: "",
};

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      students: sampleStudents(),
      templates: defaultTemplates(),
      history: [],
      settings: defaultSettings,
      unlocked: true,
      setHydrated: () => {
        const pinOn = get().settings.pinEnabled && get().settings.pin.length >= 4;
        set({ hydrated: true, unlocked: !pinOn });
      },
      unlock: () => set({ unlocked: true }),
      lock: () => set({ unlocked: false }),
      addStudent: (s) =>
        set({ students: [{ ...s, id: uid() }, ...get().students] }),
      updateStudent: (id, patch) =>
        set({
          students: get().students.map((st) =>
            st.id === id ? { ...st, ...patch } : st,
          ),
        }),
      removeStudent: (id) =>
        set({ students: get().students.filter((st) => st.id !== id) }),
      replaceStudents: (students) => set({ students }),
      addTemplate: (t) =>
        set({ templates: [...get().templates, { ...t, id: uid() }] }),
      updateTemplate: (id, patch) =>
        set({
          templates: get().templates.map((t) =>
            t.id === id ? { ...t, ...patch } : t,
          ),
        }),
      removeTemplate: (id) =>
        set({ templates: get().templates.filter((t) => t.id !== id) }),
      logSend: (entry) =>
        set({
          history: [{ ...entry, id: uid() }, ...get().history].slice(0, 40),
        }),
      clearHistory: () => set({ history: [] }),
      updateSettings: (patch) =>
        set({ settings: { ...get().settings, ...patch } }),
      loadSample: () => set({ students: sampleStudents() }),
    }),
    {
      name: "home-bell-v1",
      skipHydration: true,
      partialize: (s) => ({
        students: s.students,
        templates: s.templates,
        history: s.history,
        settings: s.settings,
      }),
    },
  ),
);
