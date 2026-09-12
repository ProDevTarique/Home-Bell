import type { Student } from "./types";
import { uid } from "./utils";

export function studentsToCsv(students: Student[]) {
  const header = "name,batch,parentName,phone";
  const rows = students.map((s) =>
    [s.name, s.batch, s.parentName, s.phone].map((v) => csvCell(v)).join(","),
  );
  return [header, ...rows].join("\n");
}

function csvCell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

export function parseStudentsCsv(text: string): Student[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const first = splitCsvLine(lines[0] ?? "");
  const hasHeader = first.some((h) => /name|batch|phone/i.test(h));
  const dataLines = hasHeader ? lines.slice(1) : lines;
  const header = hasHeader ? first.map((h) => h.trim().toLowerCase()) : null;

  const out: Student[] = [];
  for (const line of dataLines) {
    const cols = splitCsvLine(line);
    if (cols.length < 3) continue;
    const get = (key: string, fallbackIndex: number) => {
      if (!header) return cols[fallbackIndex] ?? "";
      const i = header.findIndex((h) => h === key || h.includes(key));
      return (i >= 0 ? cols[i] : cols[fallbackIndex]) ?? "";
    };
    const name = get("name", 0).trim();
    const batch = get("batch", 1).trim();
    const parentName = get("parent", 2).trim();
    const phone = (header ? get("phone", 3) : cols[3] ?? cols[2] ?? "").trim();
    if (!name || !batch || !phone) continue;
    out.push({
      id: uid(),
      name,
      batch,
      parentName: header ? parentName : cols.length > 3 ? cols[2] ?? "" : "",
      phone,
    });
  }
  return out;
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      cells.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}

export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
