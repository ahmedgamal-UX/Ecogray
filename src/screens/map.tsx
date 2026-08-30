import { useState } from "react";
import { Search, LocateFixed, Navigation, Info, ChevronRight, X, MapPinOff, Clock, Recycle } from "lucide-react";
import { useNav } from "../lib/nav";
import { Screen, TopBar, PillButton, StatusBadge, CategoryPill, CategoryIconTile, Chip, Card } from "../components/kit";
import { CATEGORIES, CATEGORY_LIST, MACHINES } from "../lib/data";
import type { CategoryKey } from "../lib/data";

/* ---------------------------------- Map ---------------------------------- */

const DOT: Record<string, string> = {
  available: "var(--color-success)",
  busy: "var(--color-warning)",
  offline: "var(--color-error)",
};

export function MapScreen() {
  const nav = useNav();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<CategoryKey | null>(null);
  const empty = nav.state.emptyMachines;

  const machines = MACHINES.filter(
    (m) =>
      (!filter || m.accepts.includes(filter)) &&
      (q === "" || (m.name + m.building).toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <Screen scroll={false} pad={false} className="bg-bg">
      {/* Map canvas */}
      <div className="absolute inset-0 bg-[#EDECE6]">
        {/* stylized streets */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="52" height="52" patternUnits="userSpaceOnUse">
              <path d="M52 0H0V52" fill="none" stroke="#E1DFD8" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d="M-20 320 Q160 260 420 380" fill="none" stroke="#E1DFD8" strokeWidth="16" />
          <path d="M120 -20 Q170 300 90 900" fill="none" stroke="#E1DFD8" strokeWidth="16" />
          <path d="M300 -20 Q260 380 360 900" fill="none" stroke="#E1DFD8" strokeWidth="12" />
          <ellipse cx="60%" cy="46%" rx="120" ry="90" fill="#E4F0EC" />
        </svg>

        {!empty &&
          machines.map((m) => (
            <button
              key={m.id}
              onClick={() => nav.go("machine", { machineId: m.id })}
              className="absolute -translate-x-1/2 -translate-y-1/2 active:scale-95 transition"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
            >
              <span className="relative grid place-items-center h-11 w-11 rounded-full bg-surface shadow-[0_8px_18px_-6px_rgba(0,0,0,0.35)] border border-line">
                <Recycle size={18} strokeWidth={2.3} className="text-ink" />
                <span
                  className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-surface"
                  style={{ background: DOT[m.status] }}
                />
              </span>
            </button>
          ))}

        {/* user location */}
        <span className="absolute left-[44%] top-[52%] -translate-x-1/2 -translate-y-1/2">
          <span className="block h-4 w-4 rounded-full bg-[var(--color-metal)] ring-4 ring-[var(--color-metal)]/25" />
        </span>
      </div>

      {/* Top search overlay */}
      <div className="relative z-10 px-6 pt-2">
        <div className="flex items-center gap-2.5 h-[52px] px-4 rounded-2xl bg-surface border border-line shadow-[0_10px_24px_-14px_rgba(0,0,0,0.25)]">
          <Search size={18} className="text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search machines or buildings"
            className="flex-1 bg-transparent outline-none text-[14.5px] text-ink placeholder:text-faint"
          />
          {q && <button onClick={() => setQ("")}><X size={16} className="text-faint" /></button>}
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto scroll-area">
          <Chip active={!filter} onClick={() => setFilter(null)}>All machines</Chip>
          {CATEGORY_LIST.map((c) => (
            <Chip key={c.key} active={filter === c.key} color={c.color} onClick={() => setFilter(filter === c.key ? null : c.key)}>
              {c.short}
            </Chip>
          ))}
        </div>
      </div>

      <button className="absolute right-6 bottom-[300px] z-10 grid place-items-center h-12 w-12 rounded-full bg-surface border border-line shadow-lg active:scale-95">
        <LocateFixed size={20} className="text-ink" />
      </button>

      {/* Bottom sheet: list */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        <div className="bg-surface rounded-t-[30px] border-t border-line shadow-[0_-16px_40px_-20px_rgba(0,0,0,0.25)] pb-28 pt-3 px-6 max-h-[280px] overflow-y-auto scroll-area">
          <div className="h-1.5 w-10 rounded-full bg-line-strong mx-auto mb-4" />
          {empty ? (
            <EmptyMachines />
          ) : (
            <>
              <p className="font-display font-bold text-[16px] text-ink mb-3">
                {machines.length} machine{machines.length !== 1 && "s"} nearby
              </p>
              <div className="flex flex-col gap-2.5">
                {machines.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => nav.go("machine", { machineId: m.id })}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-line active:bg-elevated transition text-left"
                  >
                    <span className="grid place-items-center h-11 w-11 rounded-xl bg-elevated shrink-0">
                      <Recycle size={19} className="text-ink" strokeWidth={2.2} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14.5px] text-ink truncate">{m.name}</p>
                      <p className="text-[12.5px] text-muted truncate">{m.distance} · {m.walkMins} min walk</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}

function EmptyMachines() {
  return (
    <div className="py-6 flex flex-col items-center text-center">
      <span className="grid place-items-center h-14 w-14 rounded-2xl bg-elevated text-faint mb-3">
        <MapPinOff size={24} strokeWidth={2} />
      </span>
      <p className="font-display font-bold text-[16px] text-ink">No machines nearby</p>
      <p className="text-[13.5px] text-muted mt-1 px-6">
        We couldn&apos;t find a machine in this area. Try widening your search.
      </p>
    </div>
  );
}

/* ----------------------------- Machine details --------------------------- */

export function MachineScreen() {
  const nav = useNav();
  const m = MACHINES.find((x) => x.id === nav.state.machineId) ?? MACHINES[0];
  const unavailable = m.status === "offline";

  return (
    <Screen className="bg-bg">
      <TopBar title="Machine" right={<button className="grid place-items-center h-10 w-10 rounded-full bg-surface border border-line"><Info size={18} className="text-ink" /></button>} />

      {/* Hero */}
      <Card className="p-5 mt-1">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-[12px] text-faint">{m.id}</span>
            <h1 className="font-display font-extrabold text-[26px] tracking-tight text-ink mt-1 leading-tight">{m.name}</h1>
            <p className="text-[14px] text-muted mt-1">{m.building}</p>
          </div>
          <StatusBadge status={m.status} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-5">
          <Stat label="Distance" value={m.distance} />
          <Stat label="Walk" value={`${m.walkMins} min`} />
          <Stat label="Capacity" value={m.fill} />
        </div>
      </Card>

      {unavailable && (
        <div className="mt-3 flex items-start gap-2.5 p-3.5 rounded-2xl bg-[var(--color-error-tint)]">
          <MapPinOff size={18} className="text-[var(--color-error)] mt-0.5" />
          <div>
            <p className="text-[13.5px] font-semibold text-[var(--color-error)]">Machine offline</p>
            <p className="text-[12.5px] text-[var(--color-error)]/80">This unit is temporarily out of service. Try another nearby.</p>
          </div>
        </div>
      )}

      {/* Accepted categories */}
      <div className="mt-6">
        <h2 className="font-display font-bold text-[17px] text-ink mb-3">Accepts</h2>
        <div className="flex flex-col gap-2.5">
          {CATEGORY_LIST.map((c) => {
            const ok = m.accepts.includes(c.key);
            return (
              <div
                key={c.key}
                className={`flex items-center gap-3 p-3 rounded-2xl border ${ok ? "bg-surface border-line" : "border-line opacity-45"}`}
              >
                <CategoryIconTile cat={c} size={44} />
                <div className="flex-1">
                  <p className="font-semibold text-[14.5px] text-ink">{c.label}</p>
                  <p className="text-[12.5px] text-muted">{c.examples}</p>
                </div>
                {!ok && <span className="text-[12px] font-semibold text-faint">Not accepted</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 mb-4 flex items-start gap-2 text-[12.5px] text-muted px-1">
        <Clock size={14} className="mt-0.5 shrink-0" />
        <span>Machine sorts, classifies and compresses items automatically once inserted.</span>
      </div>

      <div className="pb-8">
        <PillButton icon={Navigation} onClick={() => nav.go("route")} disabled={unavailable}>
          {unavailable ? "Machine unavailable" : "Navigate here"}
        </PillButton>
      </div>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-elevated border border-line p-3">
      <p className="text-[11.5px] text-muted">{label}</p>
      <p className="font-display font-bold text-[16px] text-ink mt-0.5">{value}</p>
    </div>
  );
}

/* --------------------------------- Route --------------------------------- */

export function RouteScreen() {
  const nav = useNav();
  const m = MACHINES.find((x) => x.id === nav.state.machineId) ?? MACHINES[0];
  return (
    <Screen scroll={false} pad={false} className="bg-bg">
      <div className="absolute inset-0 bg-[#EDECE6]">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="grid2" width="52" height="52" patternUnits="userSpaceOnUse">
              <path d="M52 0H0V52" fill="none" stroke="#E1DFD8" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
          <path
            d="M175 640 C 175 520, 260 470, 250 360 C 244 290, 300 250, 300 180"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="2 13"
          />
        </svg>
        <span className="absolute left-[45%] top-[76%] -translate-x-1/2 -translate-y-1/2">
          <span className="block h-4 w-4 rounded-full bg-[var(--color-metal)] ring-4 ring-[var(--color-metal)]/25" />
        </span>
        <span className="absolute left-[77%] top-[21%] -translate-x-1/2 -translate-y-1/2 grid place-items-center h-11 w-11 rounded-full bg-ink text-white shadow-lg">
          <Navigation size={18} strokeWidth={2.4} />
        </span>
      </div>

      <div className="relative z-10 px-6 pt-2">
        <TopBar />
      </div>

      <div className="absolute bottom-0 inset-x-0 z-20 px-6 pb-8">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-success)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" /> On route
          </div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight text-ink mt-2">{m.name}</h1>
          <div className="flex items-center gap-5 mt-3">
            <RouteStat label="Distance" value={m.distance} />
            <span className="h-8 w-px bg-line" />
            <RouteStat label="Walk time" value={`${m.walkMins} min`} />
            <span className="h-8 w-px bg-line" />
            <RouteStat label="Arrive" value="9:14 AM" />
          </div>
          <div className="mt-5">
            <PillButton icon={ChevronRight} onClick={() => nav.go("identify")}>
              I&apos;ve arrived
            </PillButton>
          </div>
        </Card>
      </div>
    </Screen>
  );
}

function RouteStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11.5px] text-muted">{label}</p>
      <p className="font-display font-bold text-[16px] text-ink mt-0.5">{value}</p>
    </div>
  );
}
