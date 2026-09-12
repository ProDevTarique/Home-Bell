import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid() {
  return crypto.randomUUID();
}

export function nowIso() {
  return new Date().toISOString();
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function digitsPhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export function looksLikePhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.length >= 8 && d.length <= 15;
}
