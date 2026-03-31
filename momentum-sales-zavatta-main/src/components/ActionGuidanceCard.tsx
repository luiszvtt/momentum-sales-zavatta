import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import type { ActionGuidance } from "@/hooks/useDecisionEngine";

interface Props {
  actions: ActionGuidance[];
  onAction?: (type: string) => void;
}

const priorityConfig = {
  high: { icon: AlertTriangle, border: "border-l-destructive", bg: "bg-destructive/5" },
  medium: { icon: Zap, border: "border-l-accent", bg: "bg-accent/5" },
  low: { icon: CheckCircle2, border: "border-l-success", bg: "bg-success/5" },
};

export default function ActionGuidanceCard({ actions, onAction }: Props) {
  if (actions.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Próximas Ações
      </h3>
      {actions.slice(0, 3).map((action, i) => {
        const config = priorityConfig[action.priority];
        const Icon = config.icon;
        return (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-lg border-l-4 ${config.border} ${config.bg} p-3 cursor-pointer active:opacity-80 transition-opacity`}
            onClick={() => onAction?.(action.type)}
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-start gap-2">
              <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug">{action.message}</p>
                {action.impact && (
                  <p className="text-xs text-accent font-semibold mt-1">{action.impact}</p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
