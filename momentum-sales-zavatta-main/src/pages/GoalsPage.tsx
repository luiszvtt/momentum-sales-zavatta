import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import { motion } from "framer-motion";

interface GoalInput {
  key: keyof ReturnType<typeof useDefaults>;
  label: string;
}

function useDefaults() {
  const { goals } = useApp();
  return {
    monthlyGoal: goals.monthlyGoal,
    weeklyGoal: goals.weeklyGoal,
    dailyContactGoal: goals.dailyContactGoal,
    dailyFollowupGoal: goals.dailyFollowupGoal,
    dailyVisitGoal: goals.dailyVisitGoal,
  };
}

const fields: GoalInput[] = [
  { key: "monthlyGoal", label: "Meta Mensal (R$)" },
  { key: "weeklyGoal", label: "Meta Semanal (R$)" },
  { key: "dailyContactGoal", label: "Contatos / Dia" },
  { key: "dailyFollowupGoal", label: "Follow-ups / Dia" },
  { key: "dailyVisitGoal", label: "Visitas / Dia" },
];

export default function GoalsPage() {
  const { goals, updateGoals } = useApp();
  const [values, setValues] = useState({
    monthlyGoal: goals.monthlyGoal,
    weeklyGoal: goals.weeklyGoal,
    dailyContactGoal: goals.dailyContactGoal,
    dailyFollowupGoal: goals.dailyFollowupGoal,
    dailyVisitGoal: goals.dailyVisitGoal,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateGoals(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-foreground">Metas</h2>
      <p className="text-sm text-muted-foreground">Defina suas metas diárias e mensais</p>

      <div className="space-y-4">
        {fields.map(({ key, label }) => (
          <div key={key} className="rounded-xl bg-card p-4 space-y-2" style={{ boxShadow: "var(--shadow-card)" }}>
            <label className="text-sm font-medium text-foreground">{label}</label>
            <input
              type="number"
              value={values[key]}
              onChange={(e) => setValues((v) => ({ ...v, [key]: Number(e.target.value) }))}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
            />
          </div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        className="w-full rounded-xl bg-primary py-4 text-center text-primary-foreground font-semibold text-lg"
      >
        {saved ? "✓ Salvo!" : "Salvar Metas"}
      </motion.button>
    </div>
  );
}
