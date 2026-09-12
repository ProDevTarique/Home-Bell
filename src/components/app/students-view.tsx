import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Student } from "@/lib/types";
import { looksLikePhone } from "@/lib/utils";
import { useSchoolStore } from "@/lib/store";

const emptyForm = { name: "", batch: "", parentName: "", phone: "" };

export function StudentsView() {
  const students = useSchoolStore((s) => s.students);
  const addStudent = useSchoolStore((s) => s.addStudent);
  const updateStudent = useSchoolStore((s) => s.updateStudent);
  const removeStudent = useSchoolStore((s) => s.removeStudent);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      [s.name, s.batch, s.parentName, s.phone].join(" ").toLowerCase().includes(q),
    );
  }, [students, query]);

  function save() {
    if (!form.name.trim() || !form.batch.trim() || !form.phone.trim()) {
      toast.error("Name, class, and phone are required.");
      return;
    }
    if (!looksLikePhone(form.phone)) {
      toast.error("Enter a valid parent phone number with country code.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      batch: form.batch.trim(),
      parentName: form.parentName.trim(),
      phone: form.phone.trim(),
    };
    if (editing) updateStudent(editing.id, payload);
    else addStudent(payload);
    setOpen(false);
    toast.success(editing ? "Student updated." : "Student added.");
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <Input className="pl-10" placeholder="Search name, class, or phone" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <Button className="w-full" onClick={() => { setEditing(null); setForm(emptyForm); setOpen(true); }}>
        <Plus className="size-4" />
        Add student
      </Button>
      <p className="text-sm text-muted">{filtered.length} in the list</p>
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted">No students yet. Add a child or import a list in Setup.</Card>
        ) : (
          filtered.map((s) => (
            <Card key={s.id} className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-muted">
                  {s.batch}
                  {s.parentName ? ` · ${s.parentName}` : ""}
                </p>
                <p className="mt-1 font-mono text-xs text-subtle">{s.phone}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(s); setForm({ name: s.name, batch: s.batch, parentName: s.parentName, phone: s.phone }); setOpen(true); }}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { removeStudent(s.id); toast.success("Removed."); }}>
                  <Trash2 className="size-4 text-danger" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit student" : "Add student"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="st-name">Child name</Label>
              <Input id="st-name" className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="st-batch">Class / batch</Label>
              <Input id="st-batch" className="mt-1" placeholder="Class 1A" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="st-parent">Parent name</Label>
              <Input id="st-parent" className="mt-1" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="st-phone">Parent phone</Label>
              <Input id="st-phone" className="mt-1" inputMode="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <Button className="w-full" onClick={save}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
