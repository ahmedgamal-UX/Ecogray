import { Coffee, Printer, ShoppingBag, Ticket, Check, ChevronRight, GiftIcon, Sparkles, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNav } from "../lib/nav";
import { Screen, TopBar, PillButton, Card, SectionHead } from "../components/kit";
import { REWARDS } from "../lib/data";
import type { Reward } from "../lib/data";

const ICONS: Record<string, LucideIcon> = {
  "RW-COFFEE": Coffee,
  "RW-PRINT": Printer,
  "RW-TOTE": ShoppingBag,
  "RW-LOCKER": Ticket,
};

export function RewardsScreen() {
  const nav = useNav();
  const points = nav.state.points;
  const empty = nav.state.emptyRewards;

  return (
    <Screen className="bg-bg">
      <div className="pt-3 pb-2 flex items-end justify-between">
        <div>
          <h1 className="font-display font-extrabold text-[28px] tracking-tight text-ink">Rewards</h1>
          <p className="text-[14px] text-muted mt-0.5">Turn points into campus perks.</p>
        </div>
      </div>

      {/* Balance strip */}
      <Card className="p-4 bg-ink border-ink text-white flex items-center justify-between mt-2">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center h-11 w-11 rounded-full bg-white/10">
            <Sparkles size={20} className="text-white" />
          </span>
          <div>
            <p className="text-[12px] text-white/55">Available balance</p>
            <p className="font-display font-extrabold text-[24px] leading-tight">{points} <span className="text-[14px] font-semibold text-white/60">pts</span></p>
          </div>
        </div>
      </Card>

      {empty ? (
        <div className="flex flex-col items-center text-center py-20">
          <span className="grid place-items-center h-16 w-16 rounded-2xl bg-elevated text-faint mb-4">
            <GiftIcon size={26} />
          </span>
          <p className="font-display font-bold text-[17px] text-ink">No rewards available</p>
          <p className="text-[13.5px] text-muted mt-1.5 px-8">New campus perks are added regularly. Check back soon.</p>
        </div>
      ) : (
        <div className="mt-6 pb-32">
          <SectionHead title="Available" />
          <div className="grid grid-cols-2 gap-3">
            {REWARDS.map((r) => {
              const Icon = ICONS[r.id];
              const affordable = points >= r.cost;
              return (
                <button
                  key={r.id}
                  onClick={() => nav.go("rewardDetails", { rewardId: r.id })}
                  className="text-left rounded-[24px] border border-line bg-surface p-4 active:scale-[0.98] transition"
                >
                  <span className="grid place-items-center h-12 w-12 rounded-2xl mb-8" style={{ background: r.tint, color: r.accent }}>
                    <Icon size={22} strokeWidth={2.2} />
                  </span>
                  <p className="font-semibold text-[15px] text-ink leading-tight">{r.name}</p>
                  <p className="text-[12px] text-muted mt-0.5">{r.partner}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-mono text-[13.5px] font-medium text-ink">{r.cost} pts</span>
                    {!affordable && <Lock size={13} className="text-faint" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Screen>
  );
}

/* ----------------------------- Reward details ---------------------------- */

export function RewardDetailsScreen() {
  const nav = useNav();
  const r = REWARDS.find((x) => x.id === nav.state.rewardId) ?? REWARDS[0];
  const Icon = ICONS[r.id];
  const affordable = nav.state.points >= r.cost;
  const remaining = nav.state.points - r.cost;

  return (
    <Screen className="bg-bg">
      <TopBar title="Reward" />
      <div className="flex flex-col items-center text-center mt-2">
        <span className="grid place-items-center h-24 w-24 rounded-[28px]" style={{ background: r.tint, color: r.accent }}>
          <Icon size={44} strokeWidth={2} />
        </span>
        <h1 className="font-display font-extrabold text-[26px] tracking-tight text-ink mt-5">{r.name}</h1>
        <p className="text-[14px] text-muted mt-1">{r.partner}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-ink text-white font-mono text-[14px] font-medium">
          {r.cost} points
        </span>
      </div>

      <Card className="p-5 mt-7">
        <h2 className="font-display font-bold text-[15px] text-ink mb-1.5">About this reward</h2>
        <p className="text-[14px] leading-relaxed text-muted">{r.detail}</p>
        <div className="mt-4 flex items-center gap-2 text-[13px] text-muted">
          <Check size={16} className="text-[var(--color-success)]" />
          Example reward — not a claimed partnership.
        </div>
      </Card>

      <Card className="p-4 mt-3 flex items-center justify-between">
        <span className="text-[13.5px] text-muted">Your balance</span>
        <span className="font-mono text-[14px] font-medium text-ink">{nav.state.points} pts</span>
      </Card>

      {!affordable && (
        <div className="mt-3 flex items-center gap-2.5 p-3.5 rounded-2xl bg-[var(--color-error-tint)]">
          <Lock size={17} className="text-[var(--color-error)]" />
          <p className="text-[13px] font-semibold text-[var(--color-error)]">
            You need {r.cost - nav.state.points} more points to redeem this.
          </p>
        </div>
      )}

      <div className="mt-6 pb-8">
        <PillButton
          icon={affordable ? ChevronRight : undefined}
          disabled={!affordable}
          onClick={() => affordable && nav.go("redemption", { points: remaining })}
        >
          {affordable ? "Redeem reward" : "Not enough points"}
        </PillButton>
      </div>
    </Screen>
  );
}

/* --------------------------- Redemption success -------------------------- */

export function RedemptionScreen() {
  const nav = useNav();
  const r = REWARDS.find((x) => x.id === nav.state.rewardId) ?? REWARDS[0];
  return (
    <Screen dark scroll={false}>
      <div className="h-12" />
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <span className="animate-pop grid place-items-center h-24 w-24 rounded-full bg-[var(--color-success)] text-white shadow-[0_0_50px_-8px_var(--color-success)]">
          <Check size={50} strokeWidth={2.6} />
        </span>
        <h1 className="font-display font-extrabold text-[30px] tracking-tight text-white mt-7">Reward redeemed</h1>
        <p className="text-white/60 text-[15px] mt-2">{r.name}</p>

        <div className="mt-8 w-full rounded-[24px] bg-white/[0.06] p-5">
          <Row label="Reward" value={r.name} />
          <div className="h-px bg-white/10 my-3.5" />
          <Row label="Points used" value={`− ${r.cost} pts`} />
          <div className="h-px bg-white/10 my-3.5" />
          <Row label="Remaining balance" value={`${nav.state.points} pts`} strong />
        </div>
        <p className="text-white/45 text-[13px] mt-5 px-6">Show this confirmation at the partner location to claim.</p>
      </div>
      <div className="pb-8">
        <PillButton variant="secondary" onClick={() => nav.reset("rewards")}>Done</PillButton>
      </div>
    </Screen>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13.5px] text-white/55">{label}</span>
      <span className={`font-mono text-[14px] ${strong ? "text-white font-semibold" : "text-white/90"}`}>{value}</span>
    </div>
  );
}
