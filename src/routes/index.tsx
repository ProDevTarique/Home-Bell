import { createFileRoute } from "@tanstack/react-router";
import { useLayoutEffect, useState } from "react";
import { Toaster } from "sonner";
import { HistoryView } from "@/components/app/history-view";
import { NotifyView } from "@/components/app/notify-view";
import { PinGate } from "@/components/app/pin-gate";
import { SettingsView } from "@/components/app/settings-view";
import { StudentsView } from "@/components/app/students-view";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSchoolStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [ready, setReady] = useState(false);
  const unlocked = useSchoolStore((s) => s.unlocked);
  const schoolName = useSchoolStore((s) => s.settings.schoolName);
  const count = useSchoolStore((s) => s.students.length);

  useLayoutEffect(() => {
    const finish = () => {
      useSchoolStore.getState().setHydrated();
      setReady(true);
    };
    try {
      const result = useSchoolStore.persist.rehydrate();
      if (result && typeof result.then === "function") {
        void result.then(finish, finish);
      } else {
        finish();
      }
    } catch {
      finish();
    }
  }, []);

  if (!ready) {
    return (
      <main className="mx-auto min-h-dvh max-w-lg px-4 pb-16 pt-8">
        <img src="/school-logo.png" alt="" className="size-16 rounded-full bg-surface object-contain" />
        <h1 className="mt-3 font-display text-4xl leading-none tracking-tight">Home Bell</h1>
        <p className="mt-3 text-sm text-muted">Tap once when a class leaves.</p>
      </main>
    );
  }

  if (!unlocked) return <PinGate />;

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 pb-16 pt-8">
      <Toaster position="top-center" richColors />
      <header className="mb-6 flex items-start gap-3">
        <img
          src="/school-logo.png"
          alt="New Mother India English School"
          className="size-16 shrink-0 rounded-full bg-surface object-contain ring-1 ring-border"
        />
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{schoolName}</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <h1 className="font-display text-4xl leading-none tracking-tight">Home Bell</h1>
            <Badge>{count} students</Badge>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Tap once when a class leaves. The phone’s SMS app carries the notice to every parent in that batch.
          </p>
        </div>
      </header>
      <Tabs defaultValue="notify">
        <TabsList>
          <TabsTrigger value="notify">Notify</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
        </TabsList>
        <TabsContent value="notify">
          <NotifyView />
        </TabsContent>
        <TabsContent value="students">
          <StudentsView />
        </TabsContent>
        <TabsContent value="history">
          <HistoryView />
        </TabsContent>
        <TabsContent value="setup">
          <SettingsView />
        </TabsContent>
      </Tabs>
    </main>
  );
}
