import { Container, Milk, Newspaper } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CategoryKey = "metal" | "plastic" | "paper";

export interface Category {
  key: CategoryKey;
  label: string;
  short: string;
  examples: string;
  icon: LucideIcon;
  color: string;
  tint: string;
}

export const CATEGORIES: Record<CategoryKey, Category> = {
  metal: {
    key: "metal",
    label: "Metal / Cans",
    short: "Metal",
    examples: "Beverage cans, metal cans",
    icon: Container,
    color: "var(--color-metal)",
    tint: "var(--color-metal-tint)",
  },
  plastic: {
    key: "plastic",
    label: "Plastic",
    short: "Plastic",
    examples: "Water bottles, containers",
    icon: Milk,
    color: "var(--color-plastic)",
    tint: "var(--color-plastic-tint)",
  },
  paper: {
    key: "paper",
    label: "Paper / Cardboard",
    short: "Paper",
    examples: "Paper, cardboard",
    icon: Newspaper,
    color: "var(--color-paper)",
    tint: "var(--color-paper-tint)",
  },
};

export const CATEGORY_LIST = [CATEGORIES.metal, CATEGORIES.plastic, CATEGORIES.paper];

export type MachineStatus = "available" | "busy" | "offline";

export interface Machine {
  id: string;
  name: string;
  building: string;
  distance: string;
  walkMins: number;
  status: MachineStatus;
  accepts: CategoryKey[];
  fill: "Low" | "Moderate" | "High";
  x: number; // map position %
  y: number;
}

export const MACHINES: Machine[] = [
  { id: "SR-04", name: "Library North", building: "Main Library · Level 1", distance: "80 m", walkMins: 1, status: "available", accepts: ["metal", "plastic", "paper"], fill: "Low", x: 46, y: 38 },
  { id: "SR-11", name: "Student Union", building: "Union Hall · Entrance", distance: "240 m", walkMins: 3, status: "available", accepts: ["metal", "plastic"], fill: "Moderate", x: 68, y: 56 },
  { id: "SR-02", name: "Engineering Court", building: "Block C · Foyer", distance: "410 m", walkMins: 5, status: "busy", accepts: ["plastic", "paper"], fill: "High", x: 28, y: 64 },
  { id: "SR-19", name: "Science Atrium", building: "Physics Wing · Ground", distance: "520 m", walkMins: 6, status: "offline", accepts: ["metal", "plastic", "paper"], fill: "Moderate", x: 58, y: 22 },
];

export interface Txn {
  id: string;
  category: CategoryKey;
  points: number;
  date: string;
  time: string;
  machine: string;
  location: string;
}

export const HISTORY: Txn[] = [
  { id: "TXN-9F2A41", category: "plastic", points: 15, date: "Aug 30, 2026", time: "09:12", machine: "SR-04", location: "Library North" },
  { id: "TXN-9E8C03", category: "metal", points: 20, date: "Aug 29, 2026", time: "16:44", machine: "SR-11", location: "Student Union" },
  { id: "TXN-9D1B77", category: "paper", points: 10, date: "Aug 28, 2026", time: "11:05", machine: "SR-04", location: "Library North" },
  { id: "TXN-9C6612", category: "plastic", points: 15, date: "Aug 27, 2026", time: "14:20", machine: "SR-02", location: "Engineering Court" },
  { id: "TXN-9B0049", category: "metal", points: 20, date: "Aug 25, 2026", time: "10:31", machine: "SR-11", location: "Student Union" },
  { id: "TXN-9A7715", category: "paper", points: 10, date: "Aug 24, 2026", time: "08:57", machine: "SR-19", location: "Science Atrium" },
];

export interface Reward {
  id: string;
  name: string;
  partner: string;
  cost: number;
  detail: string;
  accent: string;
  tint: string;
}

export const REWARDS: Reward[] = [
  { id: "RW-COFFEE", name: "Campus coffee", partner: "Example café", cost: 120, detail: "One regular hot drink at a participating campus café.", accent: "var(--color-paper)", tint: "var(--color-paper-tint)" },
  { id: "RW-PRINT", name: "Printing credits", partner: "Library services", cost: 80, detail: "50 pages of black & white printing at library stations.", accent: "var(--color-metal)", tint: "var(--color-metal-tint)" },
  { id: "RW-TOTE", name: "Campus tote bag", partner: "Campus store", cost: 260, detail: "A reusable cotton tote from the campus store — sample reward.", accent: "var(--color-plastic)", tint: "var(--color-plastic-tint)" },
  { id: "RW-LOCKER", name: "Locker week pass", partner: "Facilities", cost: 340, detail: "One week of priority locker access — example benefit.", accent: "var(--color-ink)", tint: "#EDEBE6" },
];

export const USER = {
  name: "Nour Hassan",
  first: "Nour",
  email: "nour.hassan@university.edu",
  studentId: "20-11458",
  faculty: "Computer Science",
  university: "Riverside University",
  points: 245,
  recycled: 38,
};

export const POINTS_BY_CATEGORY: Record<CategoryKey, number> = { plastic: 15, metal: 20, paper: 10 };
