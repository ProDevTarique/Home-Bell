import type { MessageTemplate, Student } from "./types";
import { uid } from "./utils";

export function sampleStudents(): Student[] {
  const rows: Array<[string, string, string, string]> = [
    ["Aanya Sharma", "Class 1A", "Priya Sharma", "+91 98765 43011"],
    ["Rohan Patel", "Class 1A", "Nilesh Patel", "+91 98765 43012"],
    ["Meera Iyer", "Class 1A", "Lakshmi Iyer", "+91 98765 43013"],
    ["Kabir Khan", "Class 1B", "Sameera Khan", "+91 98765 43021"],
    ["Diya Nair", "Class 1B", "Anil Nair", "+91 98765 43022"],
    ["Ishaan Reddy", "Class 2A", "Kavitha Reddy", "+91 98765 43031"],
    ["Sara Joseph", "Class 2A", "Thomas Joseph", "+91 98765 43032"],
    ["Arjun Menon", "Class 2A", "Rina Menon", "+91 98765 43033"],
  ];
  return rows.map(([name, batch, parentName, phone]) => ({
    id: uid(),
    name,
    batch,
    parentName,
    phone,
  }));
}

export function defaultTemplates(): MessageTemplate[] {
  return [
    {
      id: "left-home",
      title: "Left for home",
      body: "Dear Parent, [Name] from [Batch] has left school for home. — [School]",
    },
    {
      id: "bus-delay",
      title: "Bus delayed 15 min",
      body: "Dear Parent, the [Batch] bus is delayed by about 15 minutes. [Name] is with the school staff. — [School]",
    },
    {
      id: "arrived",
      title: "Arrived at school",
      body: "Dear Parent, [Name] from [Batch] has arrived at school. — [School]",
    },
    {
      id: "collect-gate",
      title: "Please collect from gate",
      body: "Dear Parent, please collect [Name] ([Batch]) from the school gate. — [School]",
    },
  ];
}
