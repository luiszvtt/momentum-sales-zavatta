import { useApp } from "@/contexts/AppContext";
import { Phone, MessageSquare, MapPin, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFeedbackMessages } from "@/hooks/useFeedbackMessages";
import type { ActivityType } from "@/types";

const activityButtons: { type: ActivityType; icon: typeof Phone; label: string; color: string }[] = [
  { type: "contact", icon: Phone, label: "Contato", color: "bg-accent text-accent-foreground" },
  { type: "followup", icon: MessageSquare, label: "Follow-up", color: "bg-secondary text-secondary-foreground" },
  { type: "visit", icon: MapPin, label: "Visita", color: "bg-success text-success-foreground" },
  { type: "proposal", icon: FileText, label: "Proposta", color: "bg-primary text-primary-foreground" },
];

export default function AddActivity() {
  const { addActivity, dailyStats, financial } = useApp();
  const { getNextMessage } = useFeedbackMessages();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [revenueImpact, setRevenueImpact] = useState<string | null>(null);

  const handleAdd = (type: ActivityType) => {
    addActivity(type);
    setFeedback(getNextMessage());

    // Show revenue impact for contacts
    if (type === "contact") {
      const impact = financial.averageTicket * financial.commissionRate * financial.conversionRate;
      setRevenueImpact(`+R$ ${Math.round(impact).toLocaleString("pt-BR")} potencial`);
    } else {
      setRevenueImpact(null);
    }

    setTimeout(() => {
      setFeedback(null);
      setRevenueImpact(null);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 pb-24 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-2">Registrar Atividade</h2>
      <p className="text-sm text-muted-foreground mb-8">Toque para registrar com um clique</p>

      <div className="grid grid-cols-2 gap-4 w-full">
        {activityButtons.map(({ type, icon: Icon, label, color }) => (
          <motion.button
            key={type}
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleAdd(type)}
            className={`flex flex-col items-center justify-center gap-3 rounded-2xl p-8 ${color} shadow-md active:opacity-90 transition-opacity`}
          >
            <Icon className="h-10 w-10" />
            <span className="text-base font-semibold">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Quick stats */}
      <div className="mt-6 w-full grid grid-cols-4 gap-2 text-center">
        {[
          { label: "Contatos", value: dailyStats.contacts },
          { label: "Follow-ups", value: dailyStats.followups },
          { label: "Visitas", value: dailyStats.visits },
          { label: "Propostas", value: dailyStats.proposals },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-card p-2" style={{ boxShadow: "var(--shadow-card)" }}>
            <p className="text-lg font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 rounded-xl bg-success/10 px-6 py-3 text-center space-y-1"
          >
            <p className="text-sm font-medium text-success">{feedback}</p>
            {revenueImpact && (
              <p className="text-xs font-semibold text-accent">{revenueImpact}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
