import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus, Target, BarChart3, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", icon: LayoutDashboard, label: "Início" },
  { path: "/statistics", icon: BarChart3, label: "Estatísticas" },
  { path: "/add", icon: Plus, label: "Ação", isMain: true },
  { path: "/goals", icon: Target, label: "Metas" },
  { path: "/profile", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          if (tab.isMain) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent shadow-lg active:scale-95 transition-transform"
              >
                <Icon className="h-6 w-6 text-accent-foreground" />
              </button>
            );
          }

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-2 transition-colors"
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? "text-accent" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -bottom-1 h-0.5 w-6 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
