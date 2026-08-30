import { useState } from "react";
import {
  WifiOff,
  CircleAlert,
  Loader,
  MapPinOff,
  Inbox,
  GiftIcon,
  Ban,
  Lock,
  ScanLine,
  ChevronRight,
  RotateCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNav } from "../lib/nav";
import { Screen, TopBar, PillButton, Card } from "../components/kit";
import { MACHINES, REWARDS } from "../lib/data";

type Preview = null | "loading" | "error" | "offline";

export function StatesScreen() {
  const nav = useNav();
  const [preview, setPreview] = useState<Preview>(null);

  if (preview === "loading") return <LoadingState onBack={() => setPreview(null)} />;
  if (preview === "error") return <ErrorState onBack={() => setPreview(null)} />;
  if (preview === "offline") return <OfflineState onBack={() => setPreview(null)} />;

  const rows: { icon: LucideIcon; label: string; desc: string; onClick: () => void }[] = [
    { icon: Loader, label: "Loading", desc: "Skeleton placeholders", onClick: () => setPreview("loading") },
    { icon: CircleAlert, label: "Error", desc: "Something went wrong", onClick: () => setPreview("error") },
    { icon: WifiOff, label: "Offline", desc: "No connection", onClick: () => setPreview("offline") },
    { icon: MapPinOff, label: "No machines nearby", desc: "Empty · Map", onClick: () => nav.go("map", { emptyMachines: true }) },
    { icon: Inbox, label: "No recycling history", desc: "Empty · History", onClick: () => nav.go("history", { emptyHistory: true }) },
    { icon: GiftIcon, label: "No rewards available", desc: "Empty · Rewards", onClick: () => nav.go("rewards", { emptyRewards: true }) },
    { icon: Ban, label: "Machine unavailable", desc: "Offline unit", onClick: () => nav.go("machine", { machineId: MACHINES[3].id }) },
    { icon: Lock, label: "Insufficient points", desc: "Reward locked", onClick: () => nav.go("rewardDetails", { rewardId: REWARDS[3].id }) },
    { icon: ScanLine, label: "Invalid item", desc: "Not recognized", onClick: () => nav.go("verification", { invalidItem: true }) },
  ];

  return (
    <Screen className="bg-bg">
      <TopBar title="Interface states" />
      <p className="text-[13.5px] text-muted mb-4 ml-1">Preview the app&apos;s polished edge-case states.</p>
      <Card className="divide-y divide-line mb-8">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <button key={r.label} onClick={r.onClick} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-elevated transition text-left">
              <span className="grid place-items-center h-9 w-9 rounded-xl bg-elevated text-ink">
                <Icon size={17} strokeWidth={2.2} />
              </span>
              <div className="flex-1">
                <p className="text-[14.5px] font-medium text-ink">{r.label}</p>
                <p className="text-[12px] text-muted">{r.desc}</p>
              </div>
              <ChevronRight size={16} className="text-faint" />
            </button>
          );
        })}
      </Card>
    </Screen>
  );
}

/* ------------------------------- Loading --------------------------------- */

function LoadingState({ onBack }: { onBack: () => void }) {
  return (
    <Screen className="bg-bg">
      <TopBar title="Loading" onBack={onBack} />
      <div className="rounded-[var(--radius-card)] bg-ink/90 h-32 skeleton mt-1" />
      <div className="h-[54px] rounded-full skeleton mt-4" />
      <div className="mt-7 h-5 w-40 rounded-full skeleton" />
      <div className="mt-4 flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-[var(--radius-card)] border border-line p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl skeleton" />
            <div className="flex-1">
              <div className="h-4 w-32 rounded-full skeleton" />
              <div className="h-3 w-20 rounded-full skeleton mt-2" />
            </div>
            <div className="h-4 w-8 rounded-full skeleton" />
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* ------------------------- Generic full states --------------------------- */

function FullState({
  icon: Icon,
  tint,
  color,
  title,
  body,
  primary,
  onPrimary,
  onBack,
}: {
  icon: LucideIcon;
  tint: string;
  color: string;
  title: string;
  body: string;
  primary: string;
  onPrimary: () => void;
  onBack: () => void;
}) {
  return (
    <Screen className="bg-bg" scroll={false}>
      <TopBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
        <span className="animate-pop grid place-items-center h-24 w-24 rounded-full" style={{ background: tint, color }}>
          <Icon size={42} strokeWidth={2.1} />
        </span>
        <h1 className="font-display font-extrabold text-[26px] tracking-tight text-ink mt-6">{title}</h1>
        <p className="text-[15px] text-muted mt-2.5 px-6 leading-relaxed">{body}</p>
      </div>
      <div className="pb-8">
        <PillButton icon={RotateCw} onClick={onPrimary}>{primary}</PillButton>
      </div>
    </Screen>
  );
}

function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <FullState
      icon={CircleAlert}
      tint="var(--color-error-tint)"
      color="var(--color-error)"
      title="Something went wrong"
      body="We hit a snag loading this. Please try again in a moment."
      primary="Try again"
      onPrimary={onBack}
      onBack={onBack}
    />
  );
}

function OfflineState({ onBack }: { onBack: () => void }) {
  return (
    <FullState
      icon={WifiOff}
      tint="var(--color-metal-tint)"
      color="var(--color-metal)"
      title="You&apos;re offline"
      body="Check your connection to find machines and sync your recycling activity."
      primary="Retry connection"
      onPrimary={onBack}
      onBack={onBack}
    />
  );
}
