// Lightweight client-side persistence for the MVP demo (enquiries, tasks, AI activity).
// Structured so it can be swapped for Lovable Cloud tables without touching the UI.

export type Enquiry = {
  id: string;
  businessId: string;
  businessName: string;
  type: "quote" | "service" | "message" | "booking";
  name: string;
  contact: string;
  service: string;
  message: string;
  preferredDate: string;
  preferredTime: string;
  budget: string;
  status: "new" | "contacted" | "in_progress" | "completed" | "declined";
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  due: string;
  status: "todo" | "done";
  source: "manual" | "meeting-notes" | "planner";
  createdAt: string;
};

export type Activity = { id: string; tool: string; summary: string; createdAt: string };

type Shape = { enquiries: Enquiry[]; tasks: Task[]; activity: Activity[] };

const KEY = "bcsa.store.v1";
const EMPTY: Shape = { enquiries: [], tasks: [], activity: [] };

let cache: Shape | null = null;

function read(): Shape {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...(JSON.parse(raw) as Shape) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: Shape) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("bcsa:store"));
  } catch {
    /* storage unavailable */
  }
}

export function getStore() {
  return read();
}

export function subscribe(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("bcsa:store", listener);
  return () => window.removeEventListener("bcsa:store", listener);
}

function id() {
  return Math.random().toString(36).slice(2, 10);
}

export function addEnquiry(enquiry: Omit<Enquiry, "id" | "createdAt" | "status">) {
  const store = read();
  const record: Enquiry = { ...enquiry, id: id(), status: "new", createdAt: new Date().toISOString() };
  write({ ...store, enquiries: [record, ...store.enquiries] });
  return record;
}

export function setEnquiryStatus(enquiryId: string, status: Enquiry["status"]) {
  const store = read();
  write({ ...store, enquiries: store.enquiries.map((e) => (e.id === enquiryId ? { ...e, status } : e)) });
}

export function addTasks(tasks: Array<Omit<Task, "id" | "createdAt" | "status">>) {
  const store = read();
  const records: Task[] = tasks.map((t) => ({ ...t, id: id(), status: "todo", createdAt: new Date().toISOString() }));
  write({ ...store, tasks: [...records, ...store.tasks] });
  return records;
}

export function updateTask(taskId: string, patch: Partial<Task>) {
  const store = read();
  write({ ...store, tasks: store.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)) });
}

export function deleteTask(taskId: string) {
  const store = read();
  write({ ...store, tasks: store.tasks.filter((t) => t.id !== taskId) });
}

export function logActivity(tool: string, summary: string) {
  const store = read();
  const record: Activity = { id: id(), tool, summary, createdAt: new Date().toISOString() };
  write({ ...store, activity: [record, ...store.activity].slice(0, 40) });
}
