import { motion } from "framer-motion";
import { Flame, Trophy, Star } from "lucide-react";
import { useMemo } from "react";
import type { Activity } from "@/types";

interface Props {
  streak: number;
  activities: Activity[];
  dailyGoal: number;
}

function getMilestone(streak: number): { icon: typeof Flame; label: string; color: string } | null {
  if (streak >= 30) return { icon: Trophy, label: "Lenda", color: "text-yellow-500" };
  if (streak >= 14) return { icon: Star, label: "Imparável", color: "text-accent" };
  if (streak >= 7) return { icon: Flame, label: "Em chamas", color: "text-destructive" };
  return null;
}

export default function StreakIndicator({ streak, activities, dailyGoal }: Props) {
  const weeklyConsistency = useMemo(() => {
    const now = new Date();
    let daysHit = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStr = d.toDateString();
      const count = activities.filter(
        (a) => a.type === "contact" && new Date(a.createdAt).toDateString() === dayStr
      ).length;
      if (count >= dailyGoal) daysHit++;
    }
    return Math.round((daysHit / 7) * 100);
  }, [activities, dailyGoal]);

  const milestone = getMilestone(streak);

  if (streak === 0 && weeklyConsistency === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="rounded-xl bg-card p-4 space-y-3"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-destructive" />
          <span className="text-base font-bold text-foreground">
            {streak} {streak === 1 ? "dia" : "dias"} consecutivos
          </span>
        </div>
        {milestone && (
          <div className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5">
            <milestone.icon className={`h-3.5 w-3.5 ${milestone.color}`} />
            <span className="text-xs font-semibold text-foreground">{milestone.label}</span>
          </div>
        )}
      </div>

      {/* Weekly consistency bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Consistência semanal</span>
          <span className="font-semibold text-foreground">{weeklyConsistency}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${weeklyConsistency}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* 7-day dots */}
      <div className="flex justify-between gap-1">
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const dayStr = d.toDateString();
          const count = activities.filter(
            (a) => a.type === "contact" && new Date(a.createdAt).toDateString() === dayStr
          ).length;
          const hit = count >= dailyGoal;
          const dayLabel = ["D", "S", "T", "Q", "Q", "S", "S"][d.getDay()];
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  hit ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {hit ? "✓" : dayLabel}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
