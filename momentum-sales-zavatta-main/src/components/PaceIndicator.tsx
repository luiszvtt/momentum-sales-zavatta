import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import type { PaceStatus } from "@/hooks/useDecisionEngine";

interface Props {
  status: PaceStatus;
  message: string;
  recoveryMessage: string | null;
  expectedByNow: number;
  currentContacts: number;
}

const statusConfig: Record<PaceStatus, { icon: typeof TrendingUp; color: string; bg: string; label: string }> = {
  ahead: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", label: "Acima do ritmo" },
  on_track: { icon: Minus, color: "text-accent", bg: "bg-accent/10", label: "No ritmo" },
  behind: { icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10", label: "Abaixo do ritmo" },
  not_started: { icon: AlertCircle, color: "text-muted-foreground", bg: "bg-muted", label: "Não iniciado" },
};

export default function PaceIndicator({ status, message, recoveryMessage, expectedByNow, currentContacts }: Props) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl ${config.bg} p-4 space-y-2`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${config.color}`} />
          <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
        </div>
        {status !== "not_started" && (
          <span className="text-xs text-muted-foreground">
            {currentContacts}/{expectedByNow} esperados
          </span>
        )}
      </div>
      <p className="text-sm text-foreground">{message}</p>
      {recoveryMessage && (
        <p className="text-xs font-medium text-accent">{recoveryMessage}</p>
      )}
    </motion.div>
  );
}
