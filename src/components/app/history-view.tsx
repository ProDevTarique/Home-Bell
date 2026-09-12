import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatWhen } from "@/lib/utils";
import { useSchoolStore } from "@/lib/store";

export function HistoryView() {
  const history = useSchoolStore((s) => s.history);
  const clearHistory = useSchoolStore((s) => s.clearHistory);
  if (history.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-muted">
        Sends will appear here so you can show a parent that a notice went out.
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{history.length} recent sends</p>
        <Button variant="ghost" size="sm" onClick={() => { clearHistory(); toast.success("History cleared."); }}>
          Clear
        </Button>
      </div>
      {history.map((h) => (
        <Card key={h.id} className="p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-medium">{h.batch}</p>
            <p className="text-xs text-subtle">{formatWhen(h.at)}</p>
          </div>
          <p className="mt-1 text-sm text-muted">
            {h.count} parent{h.count === 1 ? "" : "s"}
          </p>
          <p className="mt-2 text-sm leading-relaxed">{h.message}</p>
        </Card>
      ))}
    </div>
  );
}
