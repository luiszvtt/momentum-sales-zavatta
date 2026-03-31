import { useState, useEffect, useCallback } from "react";

export interface Reminder {
  id: string;
  type: "contact" | "followup" | "visit" | "general";
  time: string; // HH:mm
  frequency: "daily" | "weekdays" | "custom";
  customDays?: number[]; // 0-6
  enabled: boolean;
  label: string;
}

const REMINDERS_KEY = "momentum-reminders";

function loadReminders(): Reminder[] {
  try {
    const saved = localStorage.getItem(REMINDERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
    { id: "1", type: "contact", time: "09:00", frequency: "weekdays", enabled: true, label: "Hora de fazer contatos" },
    { id: "2", type: "followup", time: "14:00", frequency: "weekdays", enabled: true, label: "Momento para follow-ups" },
    { id: "3", type: "visit", time: "10:00", frequency: "weekdays", enabled: false, label: "Agendar visitas" },
  ];
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(loadReminders);

  useEffect(() => {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  }, [reminders]);

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const updateReminder = useCallback((id: string, updates: Partial<Reminder>) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  const addReminder = useCallback((reminder: Omit<Reminder, "id">) => {
    setReminders((prev) => [...prev, { ...reminder, id: crypto.randomUUID() }]);
  }, []);

  const removeReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { reminders, toggleReminder, updateReminder, addReminder, removeReminder };
}
