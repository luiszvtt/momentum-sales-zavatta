import { useApp } from "@/contexts/AppContext";
import { useInsights } from "@/hooks/useInsights";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";
import { motion } from "framer-motion";
import InsightCard from "@/components/InsightCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import StreakIndicator from "@/components/StreakIndicator";

export default function Statistics() {
  const { weeklyActivities, dailyStats, financial, activities, goals } = useApp();
  const insights = useInsights(activities, financial);

  const weeklyData = useMemo(() => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const now = new Date();
    return days.map((name, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - now.getDay() + i);
      const dayStr = date.toDateString();
      const contacts = weeklyActivities.filter(
        (a) => a.type === "contact" && new Date(a.createdAt).toDateString() === dayStr
      ).length;
      const total = weeklyActivities.filter(
        (a) => new Date(a.createdAt).toDateString() === dayStr
      ).length;
      return { name, contacts, total };
    });
  }, [weeklyActivities]);

  // Trend data (last 14 days)
  const trendData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (13 - i));
      const dayStr = d.toDateString();
      const contacts = activities.filter(
        (a) => a.type === "contact" && new Date(a.createdAt).toDateString() === dayStr
      ).length;
      return { day: `${d.getDate()}/${d.getMonth() + 1}`, contacts };
    });
  }, [activities]);

  const totalContacts = activities.filter((a) => a.type === "contact").length;
  const totalProposals = activities.filter((a) => a.type === "proposal").length;
  const conversionDisplay = totalContacts > 0 ? ((totalProposals / totalContacts) * 100).toFixed(1) : "0";

  const dateSet = new Set(
    activities.filter((a) => a.type === "contact").map((a) => new Date(a.createdAt).toDateString())
  );
  const dailyAvg = dateSet.size > 0 ? Math.round(totalContacts / dateSet.size) : 0;

  return (
    <div className="space-y-5 pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-foreground">Estatísticas</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total Contatos", value: totalContacts, color: "text-foreground" },
          { label: "Conversão", value: conversionDisplay, suffix: "%", color: "text-accent" },
          { label: "Média Diária", value: dailyAvg, color: "text-foreground" },
          { label: "Propostas", value: totalProposals, color: "text-success" },
        ].map(({ label, value, suffix, color }) => (
          <div key={label} className="rounded-xl bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <AnimatedCounter
              value={typeof value === "string" ? parseFloat(value) : value}
              suffix={suffix}
              className={`text-2xl font-bold ${color} mt-1 block`}
            />
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-card p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Atividades da Semana</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="contacts" name="Contatos" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" name="Total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 14-day Trend */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl bg-card p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Tendência de Contatos (14 dias)</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="contacts" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Streak */}
      <StreakIndicator streak={dailyStats.streak} activities={activities} dailyGoal={goals.dailyContactGoal} />

      {/* Insights */}
      <InsightCard insights={insights} />
    </div>
  );
}
