import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, IdCard, GraduationCap, UserRound, ArrowRight } from "lucide-react";
import { useNav } from "../lib/nav";
import { Screen, TopBar, PillButton, Field, CategoryIconTile } from "../components/kit";
import { CATEGORY_LIST } from "../lib/data";

/* --------------------------------- Splash -------------------------------- */

function BrandMark({ size = 76, light = false }: { size?: number; light?: boolean }) {
  // Three overlapping material discs forming an abstract, non-cliché mark.
  const dots = ["var(--color-metal)", "var(--color-plastic)", "var(--color-paper)"];
  const r = size * 0.28;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Loopa mark">
      <g>
        <circle cx="38" cy="40" r={r / (size / 100)} fill={dots[0]} opacity="0.95" />
        <circle cx="62" cy="40" r={r / (size / 100)} fill={dots[1]} opacity="0.9" style={{ mixBlendMode: "multiply" }} />
        <circle cx="50" cy="62" r={r / (size / 100)} fill={dots[2]} opacity="0.9" style={{ mixBlendMode: "multiply" }} />
      </g>
    </svg>
  );
}

export function SplashScreen() {
  const nav = useNav();
  useEffect(() => {
    const t = setTimeout(() => nav.reset("onboard"), 2100);
    return () => clearTimeout(t);
  }, []);
  return (
    <Screen scroll={false} className="bg-bg">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="animate-pop flex flex-col items-center">
          <BrandMark size={92} />
          <h1 className="font-display font-extrabold text-[34px] tracking-tight text-ink mt-5">Loopa</h1>
          <p className="text-[13.5px] text-muted mt-1">Smart campus recycling</p>
        </div>
      </div>
      <div className="pb-16 flex flex-col items-center gap-3">
        <div className="h-1 w-28 rounded-full bg-line overflow-hidden">
          <div className="h-full w-1/2 bg-ink rounded-full" style={{ animation: "pulseSoft 1.1s ease-in-out infinite" }} />
        </div>
      </div>
    </Screen>
  );
}

/* ------------------------------- Onboarding ------------------------------ */

const SLIDES = [
  {
    kicker: "01",
    title: "Recycle smarter",
    body: "Loopa connects you to smart machines that sort and process what you drop in — no guesswork.",
  },
  {
    kicker: "02",
    title: "Find. Recycle. Earn.",
    body: "Locate the nearest machine, recycle in seconds, and collect points every single time.",
  },
  {
    kicker: "03",
    title: "Make an impact",
    body: "Every item you recycle keeps your campus cleaner. Small habits, shared across everyone.",
  },
];

export function OnboardScreen() {
  const nav = useNav();
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  const s = SLIDES[i];
  return (
    <Screen scroll={false} className="bg-bg">
      <div className="flex items-center justify-between h-12">
        <div className="flex gap-1.5">
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-7 bg-ink" : "w-1.5 bg-line-strong"}`}
            />
          ))}
        </div>
        <button onClick={() => nav.reset("login")} className="text-[14px] font-semibold text-muted">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center" key={i}>
        {/* Editorial illustrative panel built from brand geometry */}
        <div className="animate-fade-up relative h-[300px] rounded-[32px] bg-surface border border-line overflow-hidden mb-9">
          <div className="absolute -top-10 -right-8 h-44 w-44 rounded-full" style={{ background: "var(--color-plastic-tint)" }} />
          <div className="absolute bottom-8 -left-10 h-40 w-40 rounded-full" style={{ background: "var(--color-paper-tint)" }} />
          <div className="absolute top-10 left-8 h-24 w-24 rounded-full" style={{ background: "var(--color-metal-tint)" }} />
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex gap-3">
              {CATEGORY_LIST.map((c, idx) => (
                <div
                  key={c.key}
                  className="animate-pop"
                  style={{ animationDelay: `${idx * 90}ms` }}
                >
                  <CategoryIconTile cat={c} size={64} />
                </div>
              ))}
            </div>
          </div>
          <span className="absolute bottom-5 left-6 font-mono text-[12px] text-faint">{s.kicker} / 03</span>
        </div>

        <div className="animate-fade-up">
          <h1 className="font-display font-extrabold text-[33px] leading-[1.05] tracking-tight text-ink">
            {s.title}
          </h1>
          <p className="text-[15.5px] leading-relaxed text-muted mt-3 pr-4">{s.body}</p>
        </div>
      </div>

      <div className="pb-8">
        <PillButton
          icon={last ? undefined : ArrowRight}
          onClick={() => (last ? nav.reset("login") : setI(i + 1))}
        >
          {last ? "Get started" : "Continue"}
        </PillButton>
      </div>
    </Screen>
  );
}

/* --------------------------------- Login --------------------------------- */

export function LoginScreen() {
  const nav = useNav();
  const [email, setEmail] = useState("nour.hassan@university.edu");
  const [pw, setPw] = useState("recycle123");
  const [show, setShow] = useState(false);
  return (
    <Screen className="bg-bg">
      <div className="pt-6 pb-2">
        <BrandMark size={54} />
        <h1 className="font-display font-extrabold text-[30px] tracking-tight text-ink mt-5">Welcome back</h1>
        <p className="text-[15px] text-muted mt-1.5">Sign in with your university account.</p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Field label="University email" value={email} onChange={setEmail} icon={Mail} type="email" />
        <Field
          label="Password"
          value={pw}
          onChange={setPw}
          icon={Lock}
          type={show ? "text" : "password"}
          right={
            <button onClick={() => setShow(!show)} className="text-faint" aria-label="Toggle password">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
        <button className="self-end text-[13.5px] font-semibold text-ink -mt-1">Forgot password?</button>
      </div>

      <div className="mt-7">
        <PillButton onClick={() => nav.reset("home")}>Log in</PillButton>
      </div>

      <p className="text-center text-[14px] text-muted mt-8 pb-8">
        New to Loopa?{" "}
        <button onClick={() => nav.go("signup")} className="font-semibold text-ink underline underline-offset-2">
          Create an account
        </button>
      </p>
    </Screen>
  );
}

/* --------------------------------- Sign up ------------------------------- */

export function SignUpScreen() {
  const nav = useNav();
  const [f, setF] = useState({ name: "", email: "", sid: "", faculty: "", pw: "" });
  const up = (k: string) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  return (
    <Screen className="bg-bg">
      <TopBar />
      <div className="pt-1 pb-2">
        <h1 className="font-display font-extrabold text-[30px] tracking-tight text-ink">Create account</h1>
        <p className="text-[15px] text-muted mt-1.5">A few details to link you to campus machines.</p>
      </div>

      <div className="mt-5 flex flex-col gap-3.5">
        <Field label="Full name" value={f.name} onChange={up("name")} icon={UserRound} placeholder="Nour Hassan" />
        <Field label="University email" value={f.email} onChange={up("email")} icon={Mail} placeholder="you@university.edu" />
        <Field label="Student ID" value={f.sid} onChange={up("sid")} icon={IdCard} placeholder="20-11458" />
        <Field label="Faculty" value={f.faculty} onChange={up("faculty")} icon={GraduationCap} placeholder="Computer Science" />
        <Field label="Password" value={f.pw} onChange={up("pw")} icon={Lock} type="password" placeholder="Create a password" />
      </div>

      <div className="mt-7 pb-8">
        <PillButton onClick={() => nav.reset("home")}>Create account</PillButton>
        <p className="text-center text-[12.5px] text-faint mt-4 px-6 leading-relaxed">
          By continuing you agree to Loopa&apos;s campus recycling terms.
        </p>
      </div>
    </Screen>
  );
}
