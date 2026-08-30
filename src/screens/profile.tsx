import {
  ChevronRight,
  Settings as SettingsIcon,
  Clock,
  Recycle,
  Bell,
  ShieldCheck,
  Globe,
  CircleHelp,
  LogOut,
  UserRound,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNav } from "../lib/nav";
import { Screen, TopBar, Card, PillButton, CategoryIconTile } from "../components/kit";
import { CATEGORY_LIST, HISTORY, USER } from "../lib/data";

export function ProfileScreen() {
  const nav = useNav();

  const counts = CATEGORY_LIST.map((c) => ({
    cat: c,
    n: HISTORY.filter((h) => h.category === c.key).length,
  }));

  return (
    <Screen className="bg-bg">
      <div className="flex items-center justify-between pt-3 h-14">
        <h1 className="font-display font-extrabold text-[24px] tracking-tight text-ink">Profile</h1>
        <button
          onClick={() => nav.go("settings")}
          className="grid place-items-center h-11 w-11 rounded-full bg-surface border border-line"
        >
          <SettingsIcon size={19} className="text-ink" />
        </button>
      </div>

      {/* Identity */}
      <Card className="p-5 mt-2 flex items-center gap-4">
        <span className="h-16 w-16 rounded-full bg-ink grid place-items-center text-white font-display font-extrabold text-[24px]">
          {USER.first[0]}
        </span>
        <div className="min-w-0">
          <h2 className="font-display font-bold text-[19px] text-ink leading-tight">{USER.name}</h2>
          <p className="text-[13px] text-muted mt-0.5">{USER.faculty}</p>
          <p className="text-[12px] text-faint mt-0.5 font-mono">ID {USER.studentId}</p>
        </div>
      </Card>

      <p className="text-[13px] text-muted mt-3 ml-1">{USER.university}</p>

      {/* Stat pair */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Card className="p-4">
          <Recycle size={20} className="text-ink" strokeWidth={2.2} />
          <p className="font-display font-extrabold text-[26px] text-ink mt-3 leading-none">{USER.recycled}</p>
          <p className="text-[12.5px] text-muted mt-1">Items recycled</p>
        </Card>
        <Card className="p-4">
          <Clock size={20} className="text-ink" strokeWidth={2.2} />
          <p className="font-display font-extrabold text-[26px] text-ink mt-3 leading-none">{nav.state.points}</p>
          <p className="text-[12.5px] text-muted mt-1">Total points</p>
        </Card>
      </div>

      {/* Breakdown */}
      <div className="mt-4">
        <Card className="p-4">
          <p className="font-display font-bold text-[15px] text-ink mb-3.5">By material</p>
          <div className="flex flex-col gap-3.5">
            {counts.map(({ cat, n }) => (
              <div key={cat.key} className="flex items-center gap-3">
                <CategoryIconTile cat={cat} size={38} />
                <span className="flex-1 text-[14px] font-medium text-ink">{cat.label}</span>
                <span className="font-mono text-[13.5px] text-muted">{n}×</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <button
        onClick={() => nav.go("history")}
        className="w-full flex items-center justify-between mt-4 mb-32 p-4 rounded-[var(--radius-card)] bg-surface border border-line active:bg-elevated transition"
      >
        <span className="flex items-center gap-3 text-[14.5px] font-semibold text-ink">
          <Clock size={18} strokeWidth={2.2} /> Recycling history
        </span>
        <ChevronRight size={18} className="text-faint" />
      </button>
    </Screen>
  );
}

/* -------------------------------- Settings ------------------------------- */

interface Item {
  icon: LucideIcon;
  label: string;
  meta?: string;
  onClick?: () => void;
  danger?: boolean;
}

export function SettingsScreen() {
  const nav = useNav();

  const groups: { title: string; items: Item[] }[] = [
    {
      title: "Account",
      items: [
        { icon: UserRound, label: "Account", meta: USER.email },
        { icon: Bell, label: "Notifications", meta: "On" },
        { icon: ShieldCheck, label: "Privacy" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: Globe, label: "Language", meta: "English" },
        { icon: CircleHelp, label: "Help" },
        { icon: Layers, label: "Interface states", meta: "Preview", onClick: () => nav.go("states") },
      ],
    },
  ];

  return (
    <Screen className="bg-bg">
      <TopBar title="Settings" />
      <div className="flex flex-col gap-6 mt-1 pb-8">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="text-[12.5px] font-semibold text-muted mb-2 ml-1 uppercase tracking-wide">{g.title}</p>
            <Card className="divide-y divide-line">
              {g.items.map((it) => {
                const Icon = it.icon;
                return (
                  <button
                    key={it.label}
                    onClick={it.onClick}
                    className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-elevated transition text-left"
                  >
                    <span className="grid place-items-center h-9 w-9 rounded-xl bg-elevated text-ink">
                      <Icon size={17} strokeWidth={2.2} />
                    </span>
                    <span className="flex-1 text-[14.5px] font-medium text-ink">{it.label}</span>
                    {it.meta && <span className="text-[13px] text-muted">{it.meta}</span>}
                    <ChevronRight size={16} className="text-faint" />
                  </button>
                );
              })}
            </Card>
          </div>
        ))}

        <PillButton variant="destructive" icon={LogOut} onClick={() => nav.reset("login")}>
          Log out
        </PillButton>
        <p className="text-center text-[12px] text-faint">Loopa · Smart campus recycling · v1.0</p>
      </div>
    </Screen>
  );
}
