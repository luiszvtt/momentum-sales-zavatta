import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import { motion } from "framer-motion";

export default function FinancialSettings() {
  const { financial, updateFinancial } = useApp();
  const [values, setValues] = useState({
    averageTicket: financial.averageTicket,
    commissionRate: financial.commissionRate * 100,
    conversionRate: financial.conversionRate * 100,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateFinancial({
      averageTicket: values.averageTicket,
      commissionRate: values.commissionRate / 100,
      conversionRate: values.conversionRate / 100,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { key: "averageTicket" as const, label: "Ticket Médio (R$)", suffix: "" },
    { key: "commissionRate" as const, label: "Taxa de Comissão (%)", suffix: "%" },
    { key: "conversionRate" as const, label: "Taxa de Conversão (%)", suffix: "%" },
  ];

  return (
    <div className="space-y-6 pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-foreground">Configuração Financeira</h2>
      <p className="text-sm text-muted-foreground">Ajuste seus parâmetros financeiros</p>

      <div className="space-y-4">
        {fields.map(({ key, label }) => (
          <div key={key} className="rounded-xl bg-card p-4 space-y-2" style={{ boxShadow: "var(--shadow-card)" }}>
            <label className="text-sm font-medium text-foreground">{label}</label>
            <input
              type="number"
              step={key === "averageTicket" ? 1000 : 0.5}
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
        {saved ? "✓ Salvo!" : "Salvar Configuração"}
      </motion.button>
    </div>
  );
}
