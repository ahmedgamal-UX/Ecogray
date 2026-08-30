import type { ReactNode } from "react";
import {
  ArrowLeft,
  Home,
  MapPin,
  Gift,
  User,
  Wifi,
  BatteryFull,
  SignalHigh,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNav } from "../lib/nav";
import type { TabKey } from "../lib/nav";
import type { Category, MachineStatus } from "../lib/data";

/* ----------------------------- Phone frame ------------------------------ */

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full w-full flex items-center justify-center py-8 px-4">
      <div className="relative">
        <div
          className="relative w-[390px] h-[844px] rounded-[54px] bg-[#0b0b0d] p-[11px] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]"
        >
          <div className="relative w-full h-full rounded-[44px] overflow-hidden bg-bg">
            {/* Dynamic island */}
            <div className="absolute top-[11px] left-1/2 -translate-x-1/2 z-50 h-[30px] w-[112px] rounded-full bg-[#0b0b0d]" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? "text-white" : "text-ink";
  return (
    <div className={`relative z-40 flex items-center justify-between px-7 pt-3.5 pb-1 ${c}`}>
      <span className="font-mono text-[15px] font-medium tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        <SignalHigh size={16} strokeWidth={2.5} />
        <Wifi size={16} strokeWidth={2.5} />
        <BatteryFull size={20} strokeWidth={2.2} />
      </div>
    </div>
  );
}

/* ------------------------------- Screen --------------------------------- */

export function Screen({
  children,
  className = "",
  scroll = true,
  dark = false,
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  scroll?: boolean;
  dark?: boolean;
  pad?: boolean;
}) {
  return (
    <div className={`absolute inset-0 flex flex-col ${dark ? "bg-ink" : ""} ${className}`}>
      <StatusBar dark={dark} />
      <div
        className={`flex-1 min-h-0 ${scroll ? "overflow-y-auto scroll-area" : "overflow-hidden"} ${
          pad ? "px-6" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------- Top bar -------------------------------- */

export function TopBar({
  title,
  onBack,
  right,
  dark = false,
}: {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  dark?: boolean;
}) {
  const nav = useNav();
  const back = onBack ?? nav.back;
  return (
    <div className="flex items-center justify-between h-12 mb-1">
      <button
        onClick={back}
        aria-label="Back"
        className={`grid place-items-center h-10 w-10 rounded-full border transition active:scale-[0.92] ${
          dark ? "border-white/15 text-white bg-white/5" : "border-line bg-surface text-ink hover:bg-elevated"
        }`}
      >
        <ArrowLeft size={19} strokeWidth={2.4} />
      </button>
      {title && (
        <span className={`font-display font-bold text-[17px] ${dark ? "text-white" : "text-ink"}`}>
          {title}
        </span>
      )}
      <div className="h-10 w-10 flex items-center justify-center">{right}</div>
    </div>
  );
}

/* ------------------------------- Buttons -------------------------------- */

type BtnVariant = "primary" | "secondary" | "tertiary" | "destructive";

export function PillButton({
  children,
  onClick,
  variant = "primary",
  full = true,
  disabled = false,
  icon: Icon,
  size = "lg",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  full?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  size?: "lg" | "md";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.97] disabled:cursor-not-allowed select-none";
  const sizes = size === "lg" ? "h-[54px] px-6 text-[16px]" : "h-11 px-5 text-[14px]";
  const variants: Record<BtnVariant, string> = {
    primary: "bg-ink text-white hover:bg-ink-soft shadow-[0_10px_24px_-10px_rgba(23,24,28,0.6)]",
    secondary: "bg-surface text-ink border border-line-strong hover:bg-elevated",
    tertiary: "bg-transparent text-ink hover:bg-black/[0.04]",
    destructive: "bg-[var(--color-error-tint)] text-[var(--color-error)] hover:brightness-95",
  };
  const disabledCls = "bg-[#E7E5DF] text-faint shadow-none border-transparent hover:bg-[#E7E5DF]";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes} ${full ? "w-full" : ""} ${disabled ? disabledCls : variants[variant]}`}
    >
      {Icon && <Icon size={size === "lg" ? 19 : 17} strokeWidth={2.3} />}
      {children}
    </button>
  );
}

/* --------------------------------- Card --------------------------------- */

export function Card({
  children,
  className = "",
  onClick,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "div" | "button";
}) {
  const Cmp: any = onClick ? "button" : as;
  return (
    <Cmp
      onClick={onClick}
      className={`text-left bg-surface rounded-[var(--radius-card)] border border-line ${
        onClick ? "transition hover:border-line-strong active:scale-[0.99] w-full" : ""
      } ${className}`}
    >
      {children}
    </Cmp>
  );
}

/* --------------------------- Chips & badges ----------------------------- */

export function Chip({
  children,
  active = false,
  onClick,
  color,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={active && color ? { background: color, borderColor: color } : undefined}
      className={`shrink-0 h-9 px-4 rounded-full text-[13px] font-semibold border transition active:scale-95 ${
        active
          ? color
            ? "text-white"
            : "bg-ink text-white border-ink"
          : "bg-surface text-ink-soft border-line hover:border-line-strong"
      }`}
    >
      {children}
    </button>
  );
}

export function CategoryPill({ cat, size = "md" }: { cat: Category; size?: "sm" | "md" }) {
  const Icon = cat.icon;
  const s = size === "sm" ? "h-7 px-2.5 text-[11px] gap-1" : "h-8 px-3 text-[12.5px] gap-1.5";
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${s}`}
      style={{ background: cat.tint, color: cat.color }}
    >
      <Icon size={size === "sm" ? 12 : 14} strokeWidth={2.4} />
      {cat.short}
    </span>
  );
}

export function CategoryIconTile({ cat, size = 48 }: { cat: Category; size?: number }) {
  const Icon = cat.icon;
  return (
    <span
      className="inline-grid place-items-center rounded-2xl shrink-0"
      style={{ width: size, height: size, background: cat.tint, color: cat.color }}
    >
      <Icon size={size * 0.45} strokeWidth={2.2} />
    </span>
  );
}

const STATUS_META: Record<MachineStatus, { label: string; color: string; tint: string }> = {
  available: { label: "Available", color: "var(--color-success)", tint: "var(--color-success-tint)" },
  busy: { label: "In use", color: "var(--color-warning)", tint: "#F7EEDC" },
  offline: { label: "Offline", color: "var(--color-error)", tint: "var(--color-error-tint)" },
};

export function StatusBadge({ status }: { status: MachineStatus }) {
  const m = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 h-7 pl-2 pr-2.5 rounded-full text-[12px] font-semibold"
      style={{ background: m.tint, color: m.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
      {m.label}
    </span>
  );
}

/* ------------------------------- Section -------------------------------- */

export function SectionHead({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <h2 className="font-display font-bold text-[19px] text-ink">{title}</h2>
      {action}
    </div>
  );
}

/* ----------------------------- Bottom nav ------------------------------- */

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "map", label: "Map", icon: MapPin },
  { key: "rewards", label: "Rewards", icon: Gift },
  { key: "profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const nav = useNav();
  return (
    <div className="absolute bottom-0 inset-x-0 z-40 pointer-events-none">
      <div className="pointer-events-auto mx-5 mb-5 h-[68px] rounded-[30px] bg-ink/95 backdrop-blur flex items-center justify-around px-3 shadow-[0_20px_40px_-14px_rgba(0,0,0,0.5)]">
        {TABS.map((t) => {
          const active = nav.tab === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => nav.goTab(t.key)}
              className="relative flex flex-col items-center justify-center gap-1 w-16 h-full"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.6 : 2}
                className={active ? "text-white" : "text-white/45"}
              />
              <span className={`text-[10.5px] font-semibold ${active ? "text-white" : "text-white/45"}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------- Progress ring ------------------------------ */

export function ProgressRing({
  value,
  size = 62,
  stroke = 7,
  color = "var(--color-ink)",
  track = "var(--color-line)",
  children,
}: {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value)}
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ----------------------------- Text input ------------------------------- */

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
  right,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  right?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[12.5px] font-semibold text-muted mb-1.5 ml-1">{label}</span>
      <div className="flex items-center gap-2.5 h-[52px] px-4 rounded-2xl bg-surface border border-line focus-within:border-ink transition">
        {Icon && <Icon size={18} strokeWidth={2.2} className="text-faint" />}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[15px] text-ink placeholder:text-faint"
        />
        {right}
      </div>
    </label>
  );
}
