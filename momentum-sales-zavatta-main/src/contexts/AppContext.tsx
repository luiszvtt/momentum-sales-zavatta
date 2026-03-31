import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import type { Activity, ActivityType, Goals, FinancialConfig, UserProfile, DailyStats } from "@/types";

interface AppState {
  user: UserProfile;
  goals: Goals;
  financial: FinancialConfig;
  activities: Activity[];
}

interface AppContextType extends AppState {
  addActivity: (type: ActivityType) => void;
  updateGoals: (goals: Partial<Goals>) => void;
  updateFinancial: (config: Partial<FinancialConfig>) => void;
  updateUser: (user: Partial<UserProfile>) => void;
  dailyStats: DailyStats;
  weeklyActivities: Activity[];
  monthlyProjection: number;
}

const defaultUser: UserProfile = {
  id: "local-user",
  name: "Corretor",
  email: "corretor@email.com",
  createdAt: new Date().toISOString(),
};

const defaultGoals: Goals = {
  userId: "local-user",
  monthlyGoal: 100000,
  weeklyGoal: 25000,
  dailyContactGoal: 10,
  dailyFollowupGoal: 5,
  dailyVisitGoal: 3,
};

const defaultFinancial: FinancialConfig = {
  userId: "local-user",
  averageTicket: 500000,
  commissionRate: 0.06,
  conversionRate: 0.05,
};

const STORAGE_KEY = "momentum-sales-data";

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    user: defaultUser,
    goals: defaultGoals,
    financial: defaultFinancial,
    activities: [],
  };
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isThisWeek(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return d >= startOfWeek;
}

function computeStreak(activities: Activity[], dailyGoal: number): number {
  if (dailyGoal <= 0) return 0;
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayStr = day.toDateString();
    const count = activities.filter(
      (a) => a.type === "contact" && new Date(a.createdAt).toDateString() === dayStr
    ).length;
    if (count >= dailyGoal) {
      streak++;
    } else if (i === 0) {
      // today not yet complete, skip
      continue;
    } else {
      break;
    }
  }
  return streak;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addActivity = useCallback((type: ActivityType) => {
    const activity: Activity = {
      id: crypto.randomUUID(),
      userId: "local-user",
      type,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, activities: [...s.activities, activity] }));
  }, []);

  const updateGoals = useCallback((goals: Partial<Goals>) => {
    setState((s) => ({ ...s, goals: { ...s.goals, ...goals } }));
  }, []);

  const updateFinancial = useCallback((config: Partial<FinancialConfig>) => {
    setState((s) => ({ ...s, financial: { ...s.financial, ...config } }));
  }, []);

  const updateUser = useCallback((user: Partial<UserProfile>) => {
    setState((s) => ({ ...s, user: { ...s.user, ...user } }));
  }, []);

  const dailyStats = useMemo<DailyStats>(() => {
    const todayActivities = state.activities.filter((a) => isToday(a.createdAt));
    const contacts = todayActivities.filter((a) => a.type === "contact").length;
    const followups = todayActivities.filter((a) => a.type === "followup").length;
    const visits = todayActivities.filter((a) => a.type === "visit").length;
    const proposals = todayActivities.filter((a) => a.type === "proposal").length;

    const { dailyContactGoal } = state.goals;
    const { conversionRate, averageTicket, commissionRate } = state.financial;

    const progress = dailyContactGoal > 0 ? Math.min(contacts / dailyContactGoal, 1) : 0;
    const estimatedSales = conversionRate > 0 ? contacts / (1 / conversionRate) : 0;
    const estimatedRevenue = estimatedSales * averageTicket * commissionRate;
    const contactsPerSale = conversionRate > 0 ? Math.ceil(1 / conversionRate) : 0;
    const contactsToNextSale = contactsPerSale > 0 ? contactsPerSale - (contacts % contactsPerSale) : 0;
    const streak = computeStreak(state.activities, dailyContactGoal);

    return { contacts, followups, visits, proposals, progress, estimatedRevenue, contactsToNextSale, streak };
  }, [state.activities, state.goals, state.financial]);

  const weeklyActivities = useMemo(
    () => state.activities.filter((a) => isThisWeek(a.createdAt)),
    [state.activities]
  );

  const monthlyProjection = useMemo(() => {
    const { conversionRate, averageTicket, commissionRate } = state.financial;
    const allDates = new Set(
      state.activities.filter((a) => a.type === "contact").map((a) => new Date(a.createdAt).toDateString())
    );
    const workedDays = allDates.size || 1;
    const totalContacts = state.activities.filter((a) => a.type === "contact").length;
    const dailyAverage = totalContacts / workedDays;
    return conversionRate > 0
      ? (dailyAverage * conversionRate) * averageTicket * commissionRate * 30
      : 0;
  }, [state.activities, state.financial]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        addActivity,
        updateGoals,
        updateFinancial,
        updateUser,
        dailyStats,
        weeklyActivities,
        monthlyProjection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
