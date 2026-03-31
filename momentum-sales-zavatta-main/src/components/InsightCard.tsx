import { motion } from "framer-motion";
import { TrendingUp, Target, Zap, Clock } from "lucide-react";
import type { Insight } from "@/hooks/useInsights";

const iconMap = {
  "trending-up": TrendingUp,
  target: Target,
  zap: Zap,
  clock: Clock,
};

export default function InsightCard({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Inteligência de Performance
      </h3>
      <div className="rounded-xl bg-card p-4 space-y-3" style={{ boxShadow: "var(--shadow-card)" }}>
        {insights.map((insight, i) => {
          const Icon = iconMap[insight.icon];
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="rounded-lg bg-accent/10 p-1.5 shrink-0">
                <Icon className="h-3.5 w-3.5 text-accent" />
              </div>
              <p className="text-sm text-foreground leading-snug">{insight.message}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
