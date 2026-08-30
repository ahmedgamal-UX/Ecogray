import { ChevronRight, Inbox, ShieldCheck, Copy } from "lucide-react";
import { useNav } from "../lib/nav";
import { Screen, TopBar, Card, CategoryPill } from "../components/kit";
import { CATEGORIES, HISTORY } from "../lib/data";

export function HistoryScreen() {
  const nav = useNav();
  const empty = nav.state.emptyHistory;

  // group by date
  const groups = HISTORY.reduce<Record<string, typeof HISTORY>>((acc, t) => {
    (acc[t.date] ??= []).push(t);
    return acc;
  }, {});
  const total = HISTORY.reduce((s, t) => s + t.points, 0);

  return (
    <Screen className="bg-bg">
      <TopBar title="History" />
      {empty ? (
        <div className="flex flex-col items-center text-center py-24">
          <span className="grid place-items-center h-16 w-16 rounded-2xl bg-elevated text-faint mb-4">
            <Inbox size={26} />
          </span>
          <p className="font-display font-bold text-[17px] text-ink">No recycling yet</p>
          <p className="text-[13.5px] text-muted mt-1.5 px-10">Your recycled items will appear here once you use a machine.</p>
        </div>
      ) : (
        <>
          <Card className="p-4 flex items-center justify-between mt-1">
            <div>
              <p className="text-[12.5px] text-muted">Total earned</p>
              <p className="font-display font-extrabold text-[22px] text-ink">{total} <span className="text-[13px] font-semibold text-muted">pts</span></p>
            </div>
            <div className="text-right">
              <p className="text-[12.5px] text-muted">Items</p>
              <p className="font-display font-extrabold text-[22px] text-ink">{HISTORY.length}</p>
            </div>
          </Card>

          <div className="mt-6 pb-32 flex flex-col gap-5">
            {Object.entries(groups).map(([date, items]) => (
              <div key={date}>
                <p className="text-[12.5px] font-semibold text-muted mb-2 ml-1">{date}</p>
                <Card className="divide-y divide-line">
                  {items.map((t) => {
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
                          <p className="font-semibold text-[14.5px] text-ink">{cat.label}</p>
                          <p className="text-[12.5px] text-muted">{t.location} · {t.time}</p>
                        </div>
                        <span className="font-mono text-[14px] font-medium text-ink mr-1">+{t.points}</span>
                        <ChevronRight size={16} className="text-faint" />
                      </button>
                    );
                  })}
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
    </Screen>
  );
}

/* --------------------------- Transaction details ------------------------- */

export function TxnScreen() {
  const nav = useNav();
  const t = HISTORY.find((x) => x.id === nav.state.txnId) ?? HISTORY[0];
  const cat = CATEGORIES[t.category];

  return (
    <Screen className="bg-bg">
      <TopBar title="Transaction" />
      <div className="flex flex-col items-center text-center mt-2">
        <CategoryPill cat={cat} />
        <p className="font-display font-extrabold text-[40px] text-ink mt-4 leading-none">+{t.points}</p>
        <p className="text-[13.5px] text-muted mt-1">points earned</p>
        <span className="mt-4 inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[var(--color-success-tint)] text-[var(--color-success)] text-[12.5px] font-semibold">
          <ShieldCheck size={14} /> Verified
        </span>
      </div>

      <Card className="mt-7 divide-y divide-line">
        <DetailRow label="Material" value={cat.label} />
        <DetailRow label="Date" value={t.date} />
        <DetailRow label="Time" value={t.time} />
        <DetailRow label="Machine" value={t.machine} />
        <DetailRow label="Location" value={t.location} />
        <DetailRow label="Transaction ID" value={t.id} mono copy />
      </Card>

      <div className="mt-4 mb-8 text-center text-[12px] text-faint px-6">
        Recorded automatically by the machine at the time of recycling.
      </div>
    </Screen>
  );
}

function DetailRow({ label, value, mono = false, copy = false }: { label: string; value: string; mono?: boolean; copy?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-[13.5px] text-muted">{label}</span>
      <span className={`flex items-center gap-2 text-[14px] text-ink ${mono ? "font-mono" : "font-medium"}`}>
        {value}
        {copy && <Copy size={14} className="text-faint" />}
      </span>
    </div>
  );
}
