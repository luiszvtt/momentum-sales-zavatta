import { useReminders, type Reminder } from "@/hooks/useReminders";
import { motion } from "framer-motion";
import { Bell, Plus, Trash2, Phone, MessageSquare, MapPin, Briefcase } from "lucide-react";
import { useState } from "react";

const typeConfig = {
  contact: { icon: Phone, label: "Contatos", color: "text-accent" },
  followup: { icon: MessageSquare, label: "Follow-ups", color: "text-secondary" },
  visit: { icon: MapPin, label: "Visitas", color: "text-success" },
  general: { icon: Briefcase, label: "Geral", color: "text-foreground" },
};

const frequencyLabels: Record<string, string> = {
  daily: "Todos os dias",
  weekdays: "Dias úteis",
  custom: "Personalizado",
};

export default function RemindersPage() {
  const { reminders, toggleReminder, addReminder, removeReminder, updateReminder } = useReminders();
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType] = useState<Reminder["type"]>("contact");
  const [newTime, setNewTime] = useState("09:00");
  const [newFreq, setNewFreq] = useState<Reminder["frequency"]>("weekdays");
  const [newLabel, setNewLabel] = useState("");

  const handleAdd = () => {
    addReminder({
      type: newType,
      time: newTime,
      frequency: newFreq,
      enabled: true,
      label: newLabel || typeConfig[newType].label,
    });
    setShowAdd(false);
    setNewLabel("");
  };

  return (
    <div className="space-y-5 pb-24 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Lembretes</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-accent-foreground text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Novo
        </motion.button>
      </div>
      <p className="text-sm text-muted-foreground">
        Configure lembretes inteligentes para manter sua disciplina.
      </p>

      {/* Add form */}
      {showAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl bg-card p-4 space-y-3"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tipo</label>
            <div className="grid grid-cols-4 gap-2">
              {(["contact", "followup", "visit", "general"] as const).map((t) => {
                const cfg = typeConfig[t];
                const Icon = cfg.icon;
                return (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    className={`flex flex-col items-center gap-1 rounded-lg p-2 text-xs font-medium transition-colors ${
                      newType === t ? "bg-accent/10 text-accent ring-1 ring-accent" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Horário</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Frequência</label>
              <select
                value={newFreq}
                onChange={(e) => setNewFreq(e.target.value as Reminder["frequency"])}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="daily">Diário</option>
                <option value="weekdays">Dias úteis</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Mensagem (opcional)</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Ex: Hora de fazer contatos"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            className="w-full rounded-lg bg-primary py-2.5 text-primary-foreground font-semibold"
          >
            Adicionar Lembrete
          </motion.button>
        </motion.div>
      )}

      {/* Reminder list */}
      <div className="space-y-2">
        {reminders.map((r, i) => {
          const cfg = typeConfig[r.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-xl bg-card p-4"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className={`rounded-lg bg-muted p-2 ${cfg.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{r.label}</p>
                <p className="text-xs text-muted-foreground">
                  {r.time} · {frequencyLabels[r.frequency]}
                </p>
              </div>
              <button
                onClick={() => removeReminder(r.id)}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {/* Toggle */}
              <button
                onClick={() => toggleReminder(r.id)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  r.enabled ? "bg-accent" : "bg-muted"
                }`}
              >
                <motion.div
                  animate={{ x: r.enabled ? 20 : 2 }}
                  className="absolute top-1 h-4 w-4 rounded-full bg-card shadow"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </motion.div>
          );
        })}

        {reminders.length === 0 && (
          <div className="rounded-xl bg-card p-6 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum lembrete configurado.</p>
            <p className="text-xs text-muted-foreground mt-1">Adicione lembretes para manter sua disciplina.</p>
          </div>
        )}
      </div>
    </div>
  );
}
