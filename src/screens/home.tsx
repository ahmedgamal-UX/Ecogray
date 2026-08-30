import { Bell, ChevronRight, Navigation, MapPin, Recycle } from "lucide-react";
import { useNav } from "../lib/nav";
import { Screen, Card, PillButton, StatusBadge, CategoryPill, SectionHead, ProgressRing } from "../components/kit";
import { CATEGORIES, HISTORY, MACHINES, USER } from "../lib/data";

export function HomeScreen() {
  const nav = useNav();
  const nearest = MACHINES[0];
  const recent = HISTORY.slice(0, 3);
  const goal = 300;
  const progress = Math.min(nav.state.points / goal, 1);

  return (
    <Screen className="bg-bg">
      {/* Header */}
      <div className="flex items-center justify-between pt-3 pb-5">
        <div>
          <p className="text-[14px] text-muted">Good morning</p>
          <h1 className="font-display font-extrabold text-[26px] tracking-tight text-ink leading-tight">
            Hey, {USER.first} 👋
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative grid place-items-center h-11 w-11 rounded-full bg-surface border border-line">
            <Bell size={19} strokeWidth={2.2} className="text-ink" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[var(--color-error)] ring-2 ring-surface" />
          </button>
          <button
            onClick={() => nav.goTab("profile")}
            className="h-11 w-11 rounded-full bg-ink grid place-items-center text-white font-display font-bold"
          >
            {USER.first[0]}
          </button>
        </div>
      </div>

      {/* Points hero */}
      <Card className="p-5 bg-ink border-ink text-white overflow-hidden relative">
        <div className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/[0.06]" />
        <div className="flex items-center justify-between relative">
          <div>
            <p className="text-[13px] text-white/60 font-medium">Your points</p>
            <p className="font-display font-extrabold text-[46px] leading-none mt-1">{nav.state.points}</p>
            <div className="flex items-center gap-1.5 mt-3 text-white/70 text-[13px]">
              <Recycle size={15} strokeWidth={2.3} />
              <span>{USER.recycled} items recycled</span>
            </div>
          </div>
          <ProgressRing value={progress} size={92} stroke={9} color="white" track="rgba(255,255,255,0.16)">
            <div className="text-center">
              <p className="font-mono text-[15px] font-medium">{Math.round(progress * 100)}%</p>
              <p className="text-[9.5px] text-white/50">to {goal}</p>
            </div>
          </ProgressRing>
        </div>
      </Card>

      {/* Primary action */}
      <div className="mt-4">
        <PillButton icon={MapPin} onClick={() => nav.goTab("map")}>
          Find a machine
        </PillButton>
      </div>

      {/* Nearest machine */}
      <div className="mt-7">
        <SectionHead
          title="Nearest to you"
          action={
            <button onClick={() => nav.goTab("map")} className="text-[13.5px] font-semibold text-muted flex items-center gap-0.5">
              Map <ChevronRight size={15} />
            </button>
          }
        />
        <Card onClick={() => nav.go("machine", { machineId: nearest.id })} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-[17px] text-ink">{nearest.name}</h3>
                <span className="font-mono text-[11px] text-faint">{nearest.id}</span>
              </div>
              <p className="text-[13px] text-muted mt-0.5">{nearest.building}</p>
            </div>
            <StatusBadge status={nearest.status} />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-1.5">
              {nearest.accepts.map((k) => (
                <CategoryPill key={k} cat={CATEGORIES[k]} size="sm" />
              ))}
            </div>
            <div className="flex items-center gap-1 text-[13px] font-semibold text-ink">
              <Navigation size={14} strokeWidth={2.4} />
              {nearest.distance}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="mt-7 pb-32">
        <SectionHead
          title="Recent activity"
          action={
            <button onClick={() => nav.go("history")} className="text-[13.5px] font-semibold text-muted flex items-center gap-0.5">
              See all <ChevronRight size={15} />
            </button>
          }
        />
        <Card className="divide-y divide-line">
          {recent.map((t) => {
            const cat = CATEGORIES[t.category];
            const Icon = cat.icon;
            return (
              <button
                key={t.id}
                onClick={() => nav.go("txn", { txnId: t.id })}
                className="w-full flex items-center gap-3 p-3.5 text-left active:bg-elevated transition"
              >
                <span className="grid place-items-center h-10 w-10 rounded-xl shrink-0" style={{ background: cat.tint, color: cat.color }}>
                  <Icon size={19} strokeWidth={2.2} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14.5px] text-ink truncate">{cat.label}</p>
                  <p className="text-[12.5px] text-muted">{t.location} · {t.time}</p>
                </div>
                <span className="font-mono text-[14px] font-medium text-ink">+{t.points}</span>
              </button>
            );
          })}
        </Card>
      </div>
    </Screen>
  );
}
