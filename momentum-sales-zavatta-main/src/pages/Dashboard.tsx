import { useApp } from "@/contexts/AppContext";
import { useMotivationalQuote } from "@/hooks/useMotivationalQuote";
import { useDecisionEngine } from "@/hooks/useDecisionEngine";
import { useInsights } from "@/hooks/useInsights";
import ProgressBar from "@/components/ProgressBar";
import StatCard from "@/components/StatCard";
import ActionGuidanceCard from "@/components/ActionGuidanceCard";
import InsightCard from "@/components/InsightCard";
import PaceIndicator from "@/components/PaceIndicator";
import EmptyState from "@/components/EmptyState";
import StreakIndicator from "@/components/StreakIndicator";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Phone, MessageSquare, MapPin, FileText, DollarSign, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function Dashboard() {
  const { dailyStats, monthlyProjection, financial, goals, activities } = useApp();
  const quote = useMotivationalQuote();
  const navigate = useNavigate();

  const engine = useDecisionEngine(dailyStats, goals, financial, activities);
  const insights = useInsights(activities, financial);

  const todayHasActivity = useMemo(() => {
    const today = new Date().toDateString();
    return activities.some((a) => new Date(a.createdAt).toDateString() === today);
  }, [activities]);

  const showEmptyState = !todayHasActivity && engine.paceStatus === "not_started";

  return (
    <div className="space-y-5 pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Momentum Sales</h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground mt-1 italic"
        >
          "{quote}"
        </motion.p>
      </div>

      {/* Empty State OR Full Dashboard */}
      {showEmptyState ? (
        <EmptyState />
      ) : (
        <>
          {/* Pace Indicator */}
          <PaceIndicator
            status={engine.paceStatus}
            message={engine.paceMessage}
            recoveryMessage={engine.recoveryMessage}
            expectedByNow={engine.expectedByNow}
            currentContacts={dailyStats.contacts}
          />

          {/* Daily Progress */}
          <div className="rounded-xl bg-card p-5 space-y-3" style={{ boxShadow: "var(--shadow-card)" }}>
            <ProgressBar value={dailyStats.progress} label="Progresso Diário" />
            <p className="text-xs text-muted-foreground">
              Faltam{" "}
              <strong className="text-accent">{dailyStats.contactsToNextSale}</strong>{" "}
              contatos para a próxima venda estimada
            </p>
          </div>

          {/* Action Guidance */}
          <ActionGuidanceCard
            actions={engine.actions}
            onAction={() => navigate("/add")}
          />

          {/* Activity Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Phone} label="Contatos" value={dailyStats.contacts} index={0} />
            <StatCard icon={MessageSquare} label="Follow-ups" value={dailyStats.followups} index={1} />
            <StatCard icon={MapPin} label="Visitas" value={dailyStats.visits} index={2} />
            <StatCard icon={FileText} label="Propostas" value={dailyStats.proposals} index={3} />
          </div>

          {/* Revenue Cards */}
          <div className="rounded-xl bg-secondary p-5 text-secondary-foreground" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 opacity-70" />
              <span className="text-xs font-medium uppercase tracking-wider opacity-70">Receita Estimada Hoje</span>
            </div>
            <AnimatedCounter
              value={Math.round(dailyStats.estimatedRevenue)}
              formatFn={(v) => formatCurrency(v)}
              className="text-2xl font-bold"
            />
          </div>

          <div className="rounded-xl bg-success p-5 text-success-foreground" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 opacity-70" />
              <span className="text-xs font-medium uppercase tracking-wider opacity-70">Projeção Mensal</span>
            </div>
            <AnimatedCounter
              value={Math.round(monthlyProjection)}
              formatFn={(v) => formatCurrency(v)}
              className="text-2xl font-bold"
            />
            <p className="text-xs mt-1 opacity-70">Baseado no seu ritmo atual</p>
          </div>

          {/* Streak Indicator */}
          <StreakIndicator
            streak={dailyStats.streak}
            activities={activities}
            dailyGoal={goals.dailyContactGoal}
          />

          {/* Performance Insights */}
          <InsightCard insights={insights} />
        </>
      )}

      {/* Quick Add Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/add")}
        className="w-full rounded-xl bg-primary py-4 text-center text-primary-foreground font-semibold text-lg shadow-lg active:opacity-90 transition-opacity"
      >
        + Registrar Atividade
      </motion.button>
    </div>
  );
}
