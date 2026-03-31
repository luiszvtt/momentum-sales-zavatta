import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0-1
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ value, label, showPercentage = true }: ProgressBarProps) {
  const percentage = Math.round(Math.min(value, 1) * 100);
  const isComplete = percentage >= 100;

  return (
    <div className="space-y-1.5">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium text-foreground">{label}</span>}
          {showPercentage && (
            <span className={`font-semibold ${isComplete ? "text-success" : "text-accent"}`}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full rounded-full ${isComplete ? "bg-success animate-pulse-success" : "bg-accent"}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
