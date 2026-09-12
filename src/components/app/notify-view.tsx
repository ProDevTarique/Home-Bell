import { Bell, Copy, MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { buzz, copyText, groupSmsUri, personalize, singleSmsUri, speak } from "@/lib/sms";
import { useSchoolStore } from "@/lib/store";
import { nowIso } from "@/lib/utils";

export function NotifyView() {
  const students = useSchoolStore((s) => s.students);
  const templates = useSchoolStore((s) => s.templates);
  const settings = useSchoolStore((s) => s.settings);
  const logSend = useSchoolStore((s) => s.logSend);

  const batches = useMemo(() => {
    const set = new Set(students.map((s) => s.batch).filter(Boolean));
    return ["All classes", ...Array.from(set).sort()];
  }, [students]);

  const [batch, setBatch] = useState(batches[1] ?? "All classes");
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [custom, setCustom] = useState("");
  const [open, setOpen] = useState(false);

  const template = templates.find((t) => t.id === templateId);
  const body = custom.trim() || template?.body || "";
  const recipients = useMemo(() => {
    if (batch === "All classes") return students;
    return students.filter((s) => s.batch === batch);
  }, [students, batch]);
  const preview = recipients[0]
    ? personalize(body, recipients[0], settings.schoolName)
    : personalize(body, { name: "Student", batch }, settings.schoolName);
  const sameForAll = !body.includes("[Name]");

  function confirmSend() {
    if (recipients.length === 0) {
      toast.error("No students in this class.");
      return;
    }
    if (!body.trim()) {
      toast.error("Write a message first.");
      return;
    }
    setOpen(true);
  }

  async function send() {
    const messages = recipients.map((s) => ({
      student: s,
      text: personalize(body, s, settings.schoolName),
    }));
    const phones = messages.map((m) => m.student.phone);
    if (sameForAll) {
      window.location.href = groupSmsUri(phones, messages[0]?.text ?? preview);
    } else if (messages.length === 1) {
      window.location.href = singleSmsUri(messages[0]!.student.phone, messages[0]!.text);
    } else {
      await copyText(`${preview}\n\n${phones.join(", ")}`);
      window.location.href = groupSmsUri(phones, preview);
    }
    logSend({ at: nowIso(), batch, count: recipients.length, message: preview });
    buzz();
    if (settings.speakStatus) speak(`Messages ready for ${recipients.length} parents in ${batch}.`);
    setOpen(false);
    toast.success(`SMS composer opened for ${recipients.length} parents.`);
  }

  async function copyInstead() {
    const phones = recipients.map((s) => s.phone).join(", ");
    const ok = await copyText(`${preview}\n\n${phones}`);
    toast[ok ? "success" : "error"](ok ? "Message and numbers copied." : "Could not copy.");
  }

  async function testSend() {
    const phone = settings.testPhone.trim();
    if (!phone) {
      toast.error("Add a test phone number in Setup.");
      return;
    }
    window.location.href = singleSmsUri(phone, preview);
    toast.success("Test SMS composer opened.");
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-xl p-5">
        <Label>Class leaving now</Label>
        <Select value={batch} onValueChange={setBatch}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Choose class" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mt-2 text-sm text-muted">
          {recipients.length} parent{recipients.length === 1 ? "" : "s"} will be notified
        </p>
      </Card>
      <Card className="rounded-xl p-5">
        <Label>Message</Label>
        <Select
          value={templateId}
          onValueChange={(id) => {
            setTemplateId(id);
            setCustom("");
          }}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea className="mt-3" value={custom || body} onChange={(e) => setCustom(e.target.value)} />
        <p className="mt-2 text-xs text-subtle">Use [Name], [Batch], and [School]. They fill in automatically.</p>
      </Card>
      <Card className="rounded-xl bg-bg p-5">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Preview</p>
        <p className="mt-2 text-sm leading-relaxed">{preview}</p>
      </Card>
      <Button className="h-14 w-full text-base" size="lg" onClick={confirmSend}>
        <Bell className="size-5" />
        Notify parents
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={copyInstead}>
          <Copy className="size-4" />
          Copy
        </Button>
        <Button variant="secondary" onClick={testSend}>
          <MessageSquare className="size-4" />
          Test SMS
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send to {recipients.length} parents?</DialogTitle>
            <DialogDescription>
              This opens your phone’s SMS app with the numbers and message filled in. Tap Send there.
            </DialogDescription>
          </DialogHeader>
          <p className="rounded-md bg-bg p-3 text-sm leading-relaxed">{preview}</p>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={send}>
              Open SMS
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
