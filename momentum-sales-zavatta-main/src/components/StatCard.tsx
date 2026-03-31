import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  subtitle?: string;
  variant?: "default" | "highlight" | "success";
  index?: number;
}

export default function StatCard({ icon: Icon, label, value, subtitle, variant = "default", index = 0 }: StatCardProps) {
  const bgClass =
    variant === "highlight"
      ? "bg-secondary text-secondary-foreground"
      : variant === "success"
      ? "bg-success text-success-foreground"
      : "bg-card text-card-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`rounded-xl p-4 shadow-sm ${bgClass}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 opacity-70" />
        <span className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</span>
      </div>
      <p className="text-2xl font-bold animate-count-up">{value}</p>
      {subtitle && <p className="text-xs mt-1 opacity-70">{subtitle}</p>}
    </motion.div>
  );
}
