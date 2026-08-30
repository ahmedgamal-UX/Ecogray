import { useEffect, useState } from "react";
import { QrCode, ScanLine, Check, CircleAlert, Sparkles, ArrowRight } from "lucide-react";
import { useNav } from "../lib/nav";
import { Screen, TopBar, PillButton, CategoryIconTile, ProgressRing } from "../components/kit";
import { CATEGORIES, MACHINES, POINTS_BY_CATEGORY } from "../lib/data";

/* ----------------------------- Identification ---------------------------- */

export function IdentifyScreen() {
  const nav = useNav();
  const m = MACHINES.find((x) => x.id === nav.state.machineId) ?? MACHINES[0];
  return (
    <Screen dark scroll={false}>
      <TopBar dark title="Identify" />
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-white/60 text-[14px]">Connected to</p>
        <p className="font-display font-bold text-[18px] text-white mt-0.5">{m.name} · {m.id}</p>

        <div className="relative mt-10 h-64 w-64 grid place-items-center">
          <div className="absolute inset-0 rounded-[40px] border border-white/12" />
          {/* scan corners */}
          {["top-4 left-4", "top-4 right-4 rotate-90", "bottom-4 right-4 rotate-180", "bottom-4 left-4 -rotate-90"].map((p) => (
            <span key={p} className={`absolute ${p} h-8 w-8 border-t-[3px] border-l-[3px] border-white rounded-tl-lg`} />
          ))}
          <div className="grid place-items-center h-40 w-40 rounded-3xl bg-white/[0.06]">
            <QrCode size={96} strokeWidth={1.4} className="text-white" />
          </div>
          <div className="absolute left-8 right-8 h-0.5 bg-[var(--color-plastic)] shadow-[0_0_16px_var(--color-plastic)]" style={{ animation: "pulseSoft 1.6s ease-in-out infinite" }} />
        </div>

        <div className="mt-10 flex items-center gap-2 text-white/80">
          <ScanLine size={18} />
          <p className="text-[15px]">Identify yourself to start recycling.</p>
        </div>
        <p className="text-white/45 text-[13px] mt-2">Scan the code shown on the machine.</p>
      </div>

      <div className="px-6 pb-8">
        <PillButton variant="secondary" onClick={() => nav.go("processing")}>
          Simulate scan
        </PillButton>
      </div>
    </Screen>
  );
}

/* ------------------------------- Processing ------------------------------ */

const STEPS = ["Insert waste", "Detecting", "Classifying", "Compressing"];

export function ProcessingScreen() {
  const nav = useNav();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STEPS.length) {
      const t = setTimeout(() => nav.go("verification"), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 1400 : 1100);
    return () => clearTimeout(t);
  }, [step]);

  const progress = Math.min(step / STEPS.length, 1);

  return (
    <Screen dark scroll={false}>
      <div className="h-12" />
      <div className="flex-1 flex flex-col items-center justify-center">
        <ProgressRing value={progress} size={188} stroke={10} color="var(--color-plastic)" track="rgba(255,255,255,0.1)">
          <div className="text-center">
            <p className="font-display font-extrabold text-[44px] text-white leading-none">
              {Math.round(progress * 100)}
              <span className="text-[20px] text-white/50">%</span>
            </p>
            <p className="text-white/50 text-[12px] mt-1">Processing</p>
          </div>
        </ProgressRing>

        <div className="mt-12 w-full px-2 flex flex-col gap-3">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s} className={`flex items-center gap-3 transition ${!done && !active ? "opacity-35" : ""}`}>
                <span
                  className={`grid place-items-center h-8 w-8 rounded-full shrink-0 transition ${
                    done ? "bg-[var(--color-plastic)] text-white" : active ? "border-2 border-white/50 text-white" : "border border-white/25 text-white/40"
                  }`}
                >
                  {done ? <Check size={16} strokeWidth={3} /> : <span className="font-mono text-[12px]">{i + 1}</span>}
                </span>
                <span className={`text-[15px] ${done || active ? "text-white font-semibold" : "text-white/50"}`}>{s}</span>
                {active && <span className="ml-auto flex gap-1">{[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 rounded-full bg-white" style={{ animation: `pulseSoft 1s ${d * 0.2}s infinite` }} />)}</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="pb-8 text-center text-white/40 text-[13px]">Keep the machine door closed while processing.</div>
    </Screen>
  );
}

/* ------------------------------ Verification ----------------------------- */

export function VerificationScreen() {
  const nav = useNav();
  const invalid = nav.state.invalidItem;
  const cat = CATEGORIES[nav.state.category];
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (invalid) return;
    const t = setTimeout(() => setVerified(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (invalid) {
    return (
      <Screen className="bg-bg" scroll={false}>
        <TopBar title="Verification" />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <span className="animate-pop grid place-items-center h-24 w-24 rounded-full bg-[var(--color-error-tint)] text-[var(--color-error)]">
            <CircleAlert size={44} strokeWidth={2.2} />
          </span>
          <h1 className="font-display font-extrabold text-[26px] text-ink mt-6">Item not recognized</h1>
          <p className="text-[15px] text-muted mt-2 px-4">
            The machine couldn&apos;t classify this item. It will be returned — please remove it and try a supported material.
          </p>
        </div>
        <div className="pb-8 flex flex-col gap-2.5">
          <PillButton onClick={() => nav.set({ invalidItem: false })}>Try another item</PillButton>
          <PillButton variant="tertiary" onClick={() => nav.reset("home")}>Cancel</PillButton>
        </div>
      </Screen>
    );
  }

  return (
    <Screen className="bg-bg" scroll={false}>
      <TopBar title="Verification" onBack={() => nav.reset("home")} />
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="relative animate-pop">
          <CategoryIconTile cat={cat} size={120} />
          <span
            className={`absolute -bottom-1 -right-1 grid place-items-center h-10 w-10 rounded-full ring-4 ring-bg transition ${
              verified ? "bg-[var(--color-success)]" : "bg-line-strong"
            }`}
          >
            {verified ? <Check size={20} strokeWidth={3} className="text-white" /> : <span className="h-3 w-3 rounded-full bg-white" style={{ animation: "pulseSoft 0.8s infinite" }} />}
          </span>
        </div>

        <p className="text-[13px] font-semibold uppercase tracking-wide text-muted mt-8">Detected material</p>
        <h1 className="font-display font-extrabold text-[30px] tracking-tight mt-1" style={{ color: cat.color }}>
          {cat.label}
        </h1>
        <p className="text-[14.5px] text-muted mt-2">
          {verified ? "Verified and sorted into the right compartment." : "Confirming classification…"}
        </p>
      </div>

      <div className="pb-8">
        <PillButton icon={verified ? ArrowRight : undefined} disabled={!verified} onClick={() => nav.go("success")}>
          {verified ? "Continue" : "Verifying…"}
        </PillButton>
      </div>
    </Screen>
  );
}

/* -------------------------------- Success -------------------------------- */

export function SuccessScreen() {
  const nav = useNav();
  const cat = CATEGORIES[nav.state.category];
  const earned = POINTS_BY_CATEGORY[nav.state.category];
  const Icon = cat.icon;

  useEffect(() => {
    nav.set({ points: nav.state.points + earned });
  }, []);

  return (
    <Screen dark scroll={false}>
      {/* confetti-ish dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => {
          const colors = ["var(--color-metal)", "var(--color-plastic)", "var(--color-paper)", "#ffffff"];
          return (
            <span
              key={i}
              className="absolute h-2 w-2 rounded-full animate-fade-up"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${10 + ((i * 53) % 55)}%`,
                background: colors[i % colors.length],
                animationDelay: `${(i % 6) * 90}ms`,
                opacity: 0.85,
              }}
            />
          );
        })}
      </div>

      <div className="h-12" />
      <div className="flex-1 flex flex-col items-center justify-center text-center relative">
        <span className="animate-pop grid place-items-center h-28 w-28 rounded-full bg-[var(--color-success)] text-white shadow-[0_0_50px_-6px_var(--color-success)]">
          <Check size={56} strokeWidth={2.6} />
        </span>
        <div className="flex items-center gap-2 mt-7 text-white/70">
          <Sparkles size={16} />
          <span className="text-[14px]">Recycling successful</span>
        </div>
        <h1 className="font-display font-extrabold text-[34px] tracking-tight text-white mt-2 leading-tight px-6">
          Nice one, that counts.
        </h1>

        <div className="mt-8 flex items-center gap-3 rounded-full bg-white/[0.07] pl-3 pr-6 py-2.5">
          <span className="grid place-items-center h-10 w-10 rounded-full" style={{ background: cat.tint, color: cat.color }}>
            <Icon size={20} strokeWidth={2.3} />
          </span>
          <div className="text-left">
            <p className="text-[12px] text-white/50">{cat.label}</p>
            <p className="font-display font-bold text-white text-[16px]">+{earned} points</p>
          </div>
        </div>

        <p className="mt-6 text-white/60 text-[14px]">
          New balance <span className="font-mono text-white font-medium">{nav.state.points}</span> points
        </p>
      </div>

      <div className="pb-8">
        <PillButton variant="secondary" onClick={() => nav.reset("home")}>Done</PillButton>
      </div>
    </Screen>
  );
}
