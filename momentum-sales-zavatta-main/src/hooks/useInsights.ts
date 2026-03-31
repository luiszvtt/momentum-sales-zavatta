import { useMemo } from "react";
import type { Activity, FinancialConfig } from "@/types";

export interface Insight {
  id: string;
  message: string;
  type: "trend" | "projection" | "optimization";
  icon: "trending-up" | "target" | "zap" | "clock";
}

export function useInsights(activities: Activity[], financial: FinancialConfig): Insight[] {
  return useMemo(() => {
    const insights: Insight[] = [];
    const contacts = activities.filter((a) => a.type === "contact");
    if (contacts.length === 0) return insights;

    // Daily average
    const dateSet = new Set(contacts.map((a) => new Date(a.createdAt).toDateString()));
    const workedDays = dateSet.size || 1;
    const dailyAvg = contacts.length / workedDays;

    // Current month projection
    const { conversionRate, averageTicket, commissionRate } = financial;
    const monthlyProjection = dailyAvg * conversionRate * averageTicket * commissionRate * 30;

    insights.push({
      id: "monthly-proj",
      message: `No ritmo atual, você alcançará R$ ${Math.round(monthlyProjection).toLocaleString("pt-BR")} este mês.`,
      type: "projection",
      icon: "trending-up",
    });

    // +5 contacts impact
    const boostedProjection = (dailyAvg + 5) * conversionRate * averageTicket * commissionRate * 30;
    const increase = monthlyProjection > 0 ? Math.round(((boostedProjection - monthlyProjection) / monthlyProjection) * 100) : 0;
    if (increase > 0) {
      insights.push({
        id: "boost",
        message: `Aumentar +5 contatos/dia pode elevar sua receita em ${increase}%.`,
        type: "optimization",
        icon: "zap",
      });
    }

    // Best performance window
    const hourCounts: Record<number, number> = {};
    contacts.forEach((c) => {
      const h = new Date(c.createdAt).getHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
    const bestHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0];
    if (bestHour) {
      const h = Number(bestHour[0]);
      insights.push({
        id: "best-window",
        message: `Sua melhor janela de performance é entre ${h}:00–${h + 2}:00.`,
        type: "trend",
        icon: "clock",
      });
    }

    // Weekly consistency
    const now = new Date();
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      return d.toDateString();
    });
    const activeDaysLast7 = last7.filter((d) => dateSet.has(d)).length;
    if (activeDaysLast7 >= 5) {
      insights.push({
        id: "consistency",
        message: `Você esteve ativo ${activeDaysLast7} dos últimos 7 dias. Excelente consistência!`,
        type: "trend",
        icon: "target",
      });
    }

    return insights.slice(0, 4);
  }, [activities, financial]);
}
