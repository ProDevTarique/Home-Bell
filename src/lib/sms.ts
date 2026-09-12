import { digitsPhone } from "./utils";

function fillTemplate(
  body: string,
  vars: { name: string; batch: string; school: string },
) {
  return body
    .replaceAll("[Name]", vars.name)
    .replaceAll("[Batch]", vars.batch)
    .replaceAll("[School]", vars.school);
}

export function personalize(
  body: string,
  student: { name: string; batch: string },
  school: string,
) {
  return fillTemplate(body, {
    name: student.name,
    batch: student.batch,
    school,
  });
}

export function groupSmsUri(phones: string[], body: string) {
  const nums = phones.map(digitsPhone).filter(Boolean);
  const encoded = encodeURIComponent(body);
  return `sms:${nums.join(",")}?body=${encoded}`;
}

export function singleSmsUri(phone: string, body: string) {
  return `sms:${digitsPhone(phone)}?body=${encodeURIComponent(body)}`;
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function speak(text: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    synth.speak(u);
  } catch {
    /* ignore */
  }
}

export function buzz() {
  try {
    navigator.vibrate?.(180);
  } catch {
    /* ignore */
  }
}
