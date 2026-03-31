export type ActivityType = "contact" | "followup" | "visit" | "proposal";

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  createdAt: string; // ISO string
}

export interface Goals {
  userId: string;
  monthlyGoal: number;
  weeklyGoal: number;
  dailyContactGoal: number;
  dailyFollowupGoal: number;
  dailyVisitGoal: number;
}

export interface FinancialConfig {
  userId: string;
  averageTicket: number;
  commissionRate: number; // 0-1
  conversionRate: number; // 0-1
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface DailyStats {
  contacts: number;
  followups: number;
  visits: number;
  proposals: number;
  progress: number; // 0-1
  estimatedRevenue: number;
  contactsToNextSale: number;
  streak: number;
}
