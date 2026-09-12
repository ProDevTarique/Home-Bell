import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSchoolStore } from "@/lib/store";

export function PinGate() {
  const pin = useSchoolStore((s) => s.settings.pin);
  const schoolName = useSchoolStore((s) => s.settings.schoolName);
  const unlock = useSchoolStore((s) => s.unlock);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (value === pin) {
      setError("");
      unlock();
    } else {
      setError("That PIN does not match.");
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10">
      <img src="/school-logo.png" alt="" className="mx-auto size-24 rounded-full bg-surface object-contain" />
      <p className="mt-4 text-center text-sm font-medium uppercase tracking-[0.14em] text-muted">
        {schoolName}
      </p>
      <h1 className="mt-2 text-center font-display text-4xl tracking-tight">Home Bell</h1>
      <p className="mt-3 text-center text-muted">Enter the school PIN to open the notifier on this phone.</p>
      <Input
        className="mt-6 tracking-[0.4em]"
        inputMode="numeric"
        maxLength={8}
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="PIN"
        autoFocus
      />
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      <Button className="mt-4 w-full" size="lg" onClick={submit}>
        Unlock
      </Button>
    </main>
  );
}
