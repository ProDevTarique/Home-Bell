import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { downloadText, parseStudentsCsv, studentsToCsv } from "@/lib/csv";
import { useSchoolStore } from "@/lib/store";

export function SettingsView() {
  const students = useSchoolStore((s) => s.students);
  const templates = useSchoolStore((s) => s.templates);
  const settings = useSchoolStore((s) => s.settings);
  const updateSettings = useSchoolStore((s) => s.updateSettings);
  const replaceStudents = useSchoolStore((s) => s.replaceStudents);
  const loadSample = useSchoolStore((s) => s.loadSample);
  const updateTemplate = useSchoolStore((s) => s.updateTemplate);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pinDraft, setPinDraft] = useState(settings.pin);

  function exportList() {
    downloadText("home-bell-students.csv", studentsToCsv(students));
    toast.success("Student list downloaded.");
  }

  function onImport(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseStudentsCsv(String(reader.result ?? ""));
      if (parsed.length === 0) {
        toast.error("No valid rows found.");
        return;
      }
      replaceStudents(parsed);
      toast.success(`Imported ${parsed.length} students.`);
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-5">
        <p className="font-display text-lg">School</p>
        <div>
          <Label htmlFor="school">School name</Label>
          <Input id="school" className="mt-1" value={settings.schoolName} onChange={(e) => updateSettings({ schoolName: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="test-phone">Test phone (your number)</Label>
          <Input id="test-phone" className="mt-1" inputMode="tel" placeholder="+91 …" value={settings.testPhone} onChange={(e) => updateSettings({ testPhone: e.target.value })} />
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="size-4 accent-primary" checked={settings.speakStatus} onChange={(e) => updateSettings({ speakStatus: e.target.checked })} />
          Speak a confirmation after notify
        </label>
      </Card>
      <Card className="space-y-3 p-5">
        <p className="font-display text-lg">PIN lock</p>
        <Input inputMode="numeric" maxLength={8} placeholder="Set PIN" value={pinDraft} onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, ""))} />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => {
            if (pinDraft.length < 4) { toast.error("Use at least 4 digits."); return; }
            updateSettings({ pin: pinDraft, pinEnabled: true });
            toast.success("PIN saved.");
          }}>Save PIN</Button>
          <Button variant="outline" onClick={() => {
            updateSettings({ pinEnabled: false, pin: "" });
            setPinDraft("");
            toast.success("PIN turned off.");
          }}>Turn off</Button>
        </div>
      </Card>
      <Card className="space-y-3 p-5">
        <p className="font-display text-lg">Share list between phones</p>
        <p className="text-sm text-muted">Export a CSV on the headmaster phone, then send the file to the driver and Import.</p>
        <Button className="w-full" onClick={exportList}>Export students.csv</Button>
        <input ref={fileRef} type="file" accept=".csv,text/csv,text/plain" className="hidden" onChange={(e) => onImport(e.target.files?.[0])} />
        <Button variant="secondary" className="w-full" onClick={() => fileRef.current?.click()}>Import CSV</Button>
        <Button variant="outline" className="w-full" onClick={() => { loadSample(); toast.success("Sample class loaded."); }}>Load sample class</Button>
      </Card>
      <Card className="space-y-3 p-5">
        <p className="font-display text-lg">Message templates</p>
        {templates.map((t) => (
          <div key={t.id} className="space-y-1">
            <Label>{t.title}</Label>
            <Textarea value={t.body} onChange={(e) => updateTemplate(t.id, { body: e.target.value })} />
          </div>
        ))}
      </Card>
      <Card className="space-y-2 p-5">
        <p className="font-display text-lg">Put Home Bell on the Home Screen</p>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
          <li>Delete the old Home Bell icon if it is already there.</li>
          <li>Open this page in Safari (iPhone) or Chrome (Android).</li>
          <li>Share / menu → Add to Home Screen. The name should read Home Bell and the icon is the school logo.</li>
          <li>Open the new Home Bell icon after adding it to your home screen.</li>
        </ol>
      </Card>
    </div>
  );
}
