import { createContext, useContext } from "react";
import type { CategoryKey } from "./data";

export type ScreenKey =
  | "splash"
  | "onboard"
  | "login"
  | "signup"
  | "home"
  | "map"
  | "machine"
  | "route"
  | "identify"
  | "processing"
  | "verification"
  | "success"
  | "rewards"
  | "rewardDetails"
  | "redemption"
  | "history"
  | "txn"
  | "profile"
  | "settings"
  | "states";

export type TabKey = "home" | "map" | "rewards" | "profile";

export interface AppState {
  points: number;
  machineId: string;
  rewardId: string;
  txnId: string;
  category: CategoryKey;
  invalidItem: boolean;
  emptyMachines: boolean;
  emptyHistory: boolean;
  emptyRewards: boolean;
}

export interface Nav {
  screen: ScreenKey;
  tab: TabKey;
  canGoBack: boolean;
  state: AppState;
  go: (screen: ScreenKey, patch?: Partial<AppState>) => void;
  back: () => void;
  goTab: (tab: TabKey) => void;
  reset: (screen: ScreenKey, patch?: Partial<AppState>) => void;
  set: (patch: Partial<AppState>) => void;
}

export const NavContext = createContext<Nav | null>(null);

export function useNav(): Nav {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within NavContext");
  return ctx;
}

export const TAB_FOR_SCREEN: Partial<Record<ScreenKey, TabKey>> = {
  home: "home",
  map: "map",
  machine: "map",
  route: "map",
  rewards: "rewards",
  rewardDetails: "rewards",
  profile: "profile",
  settings: "profile",
  history: "profile",
  txn: "profile",
};
