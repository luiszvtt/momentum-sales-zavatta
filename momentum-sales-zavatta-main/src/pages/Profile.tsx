import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, updateUser } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-foreground">Perfil</h2>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <User className="h-8 w-8 text-accent" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div className="rounded-xl bg-card p-4 space-y-2" style={{ boxShadow: "var(--shadow-card)" }}>
          <label className="text-sm font-medium text-foreground">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
          />
        </div>
        <div className="rounded-xl bg-card p-4 space-y-2" style={{ boxShadow: "var(--shadow-card)" }}>
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
          />
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        className="w-full rounded-xl bg-primary py-4 text-center text-primary-foreground font-semibold text-lg"
      >
        {saved ? "✓ Salvo!" : "Salvar Perfil"}
      </motion.button>

      {/* Settings links */}
      <div className="space-y-2">
        <button
          onClick={() => navigate("/financial")}
          className="flex w-full items-center gap-3 rounded-xl bg-card p-4 text-foreground active:bg-muted transition-colors"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Configuração Financeira</span>
        </button>
        <button
          onClick={() => navigate("/reminders")}
          className="flex w-full items-center gap-3 rounded-xl bg-card p-4 text-foreground active:bg-muted transition-colors"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Lembretes Inteligentes</span>
        </button>
      </div>
    </div>
  );
}
