import { useCallback, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { NavContext, TAB_FOR_SCREEN } from "./lib/nav";
import type { AppState, Nav, ScreenKey, TabKey } from "./lib/nav";
import { PhoneFrame, BottomNav } from "./components/kit";
import { SplashScreen, OnboardScreen, LoginScreen, SignUpScreen } from "./screens/auth";
import { HomeScreen } from "./screens/home";
import { MapScreen, MachineScreen, RouteScreen } from "./screens/map";
import { IdentifyScreen, ProcessingScreen, VerificationScreen, SuccessScreen } from "./screens/recycle";
import { RewardsScreen, RewardDetailsScreen, RedemptionScreen } from "./screens/rewards";
import { HistoryScreen, TxnScreen } from "./screens/history";
import { ProfileScreen, SettingsScreen } from "./screens/profile";
import { StatesScreen } from "./screens/states";
import { USER } from "./lib/data";

const INITIAL: AppState = {
  points: USER.points,
  machineId: "SR-04",
  rewardId: "RW-COFFEE",
  txnId: "TXN-9F2A41",
  category: "plastic",
  invalidItem: false,
  emptyMachines: false,
  emptyHistory: false,
  emptyRewards: false,
};

// Screens that show the bottom navigation bar
const TABBED: ScreenKey[] = ["home", "map", "rewards", "profile"];

const TAB_ROOT: Record<TabKey, ScreenKey> = {
  home: "home",
  map: "map",
  rewards: "rewards",
  profile: "profile",
};

const SCREENS: Record<ScreenKey, ComponentType> = {
  splash: SplashScreen,
  onboard: OnboardScreen,
  login: LoginScreen,
  signup: SignUpScreen,
  home: HomeScreen,
  map: MapScreen,
  machine: MachineScreen,
  route: RouteScreen,
  identify: IdentifyScreen,
  processing: ProcessingScreen,
  verification: VerificationScreen,
  success: SuccessScreen,
  rewards: RewardsScreen,
  rewardDetails: RewardDetailsScreen,
  redemption: RedemptionScreen,
  history: HistoryScreen,
  txn: TxnScreen,
  profile: ProfileScreen,
  settings: SettingsScreen,
  states: StatesScreen,
};

export default function App() {
  const [stack, setStack] = useState<ScreenKey[]>(["splash"]);
  const [state, setState] = useState<AppState>(INITIAL);

  const screen = stack[stack.length - 1];

  const go = useCallback((next: ScreenKey, patch?: Partial<AppState>) => {
    if (patch) setState((s) => ({ ...s, ...patch }));
    setStack((st) => [...st, next]);
  }, []);

  const back = useCallback(() => {
    setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));
  }, []);

  const reset = useCallback((next: ScreenKey, patch?: Partial<AppState>) => {
    if (patch) setState((s) => ({ ...s, ...patch }));
    setStack([next]);
  }, []);

  const goTab = useCallback((tab: TabKey) => {
    // switching tabs clears any preview-only demo flags
    setState((s) => ({ ...s, emptyMachines: false, emptyHistory: false, emptyRewards: false, invalidItem: false }));
    setStack([TAB_ROOT[tab]]);
  }, []);

  const set = useCallback((patch: Partial<AppState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const tab: TabKey = TAB_FOR_SCREEN[screen] ?? "home";

  const nav: Nav = useMemo(
    () => ({ screen, tab, canGoBack: stack.length > 1, state, go, back, goTab, reset, set }),
    [screen, tab, stack.length, state, go, back, goTab, reset, set],
  );

  const Current = SCREENS[screen];
  const showNav = TABBED.includes(screen);

  return (
    <NavContext.Provider value={nav}>
      <PhoneFrame>
        <div key={screen} className="absolute inset-0 animate-fade-up">
          <Current />
        </div>
        {showNav && <BottomNav />}
      </PhoneFrame>
    </NavContext.Provider>
  );
}
