import { useMemo } from "react";
import type { DailyStats, Goals, FinancialConfig, Activity } from "@/types";

export interface ActionGuidance {
  id: string;
  priority: "high" | "medium" | "low";
  message: string;
  type: "contact" | "followup" | "visit" | "proposal" | "general";
  impact?: string;
}

export type PaceStatus = "ahead" | "on_track" | "behind" | "not_started";

interface DecisionEngineResult {
  actions: ActionGuidance[];
  paceStatus: PaceStatus;
  pacePercentage: number;
  expectedByNow: number;
  paceMessage: string;
  recoveryMessage: string | null;
}

function getTimeProgress(): number {
  const now = new Date();
  const hour = now.getHours();
  // Work window: 8am - 8pm (12 hours)
  const workStart = 8;
  const workEnd = 20;
  if (hour < workStart) return 0;
  if (hour >= workEnd) return 1;
  return (hour - workStart) / (workEnd - workStart);
}

function getTimePeriod(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function useDecisionEngine(
  dailyStats: DailyStats,
  goals: Goals,
  financial: FinancialConfig,
  activities: Activity[]
): DecisionEngineResult {
  return useMemo(() => {
    const timeProgress = getTimeProgress();
    const period = getTimePeriod();
    const { contacts, followups, visits, proposals } = dailyStats;
    const { dailyContactGoal, dailyFollowupGoal, dailyVisitGoal } = goals;
    const { conversionRate } = financial;

    const expectedContacts = Math.round(dailyContactGoal * timeProgress);
    const expectedFollowups = Math.round(dailyFollowupGoal * timeProgress);

    const contactDelta = contacts - expectedContacts;
    const totalToday = contacts + followups + visits + proposals;

    // Pace status
    let paceStatus: PaceStatus;
    let pacePercentage: number;
    if (totalToday === 0 && timeProgress > 0.1) {
      paceStatus = "not_started";
      pacePercentage = 0;
    } else if (contactDelta >= 2) {
      paceStatus = "ahead";
      pacePercentage = expectedContacts > 0 ? (contacts / expectedContacts) * 100 : 100;
    } else if (contactDelta >= -1) {
      paceStatus = "on_track";
      pacePercentage = expectedContacts > 0 ? (contacts / expectedContacts) * 100 : 100;
    } else {
      paceStatus = "behind";
      pacePercentage = expectedContacts > 0 ? (contacts / expectedContacts) * 100 : 0;
    }

    // Pace message
    const paceMessages: Record<PaceStatus, string> = {
      ahead: "Você está acima do ritmo esperado! Continue assim.",
      on_track: "Você está no ritmo. Mantenha a consistência.",
      behind: `Você deveria ter ${expectedContacts} contatos até agora. Faltam ${Math.max(0, expectedContacts - contacts)} para recuperar o ritmo.`,
      not_started: "Você ainda não começou hoje. Seu resultado depende do que você faz agora.",
    };

    // Recovery message
    let recoveryMessage: string | null = null;
    if (paceStatus === "behind") {
      const remaining = dailyContactGoal - contacts;
      const hoursLeft = Math.max(1, (20 - new Date().getHours()));
      const perHour = Math.ceil(remaining / hoursLeft);
      recoveryMessage = `Recuperável: complete ${perHour} contatos por hora nas próximas ${hoursLeft}h.`;
    }

    // Build prioritized actions
    const actions: ActionGuidance[] = [];

    const contactsToSale = conversionRate > 0 ? Math.ceil(1 / conversionRate) : 0;
    const contactsToNextSale = contactsToSale > 0 ? contactsToSale - (contacts % contactsToSale) : 0;

    if (contacts < dailyContactGoal) {
      const remaining = dailyContactGoal - contacts;
      const contactRevenue = financial.averageTicket * financial.commissionRate * financial.conversionRate;
      actions.push({
        id: "contacts-gap",
        priority: remaining > dailyContactGoal * 0.5 ? "high" : "medium",
        message: period === "morning"
          ? `Comece forte: faça ${Math.min(remaining, 5)} contatos agora para garantir seu ritmo.`
          : `Faltam ${remaining} contatos para bater a meta. Execute agora.`,
        type: "contact",
        impact: `+R$ ${Math.round(remaining * contactRevenue).toLocaleString("pt-BR")} potencial`,
      });
    }

    if (contactsToNextSale > 0 && contactsToNextSale <= 5) {
      actions.push({
        id: "next-sale",
        priority: "high",
        message: `Você está a ${contactsToNextSale} contatos da sua próxima venda estimada.`,
        type: "contact",
        impact: `R$ ${Math.round(financial.averageTicket * financial.commissionRate).toLocaleString("pt-BR")} em comissão`,
      });
    }

    if (followups < dailyFollowupGoal) {
      const remaining = dailyFollowupGoal - followups;
      actions.push({
        id: "followups-gap",
        priority: remaining > dailyFollowupGoal * 0.6 ? "high" : "medium",
        message: `Seus follow-ups estão abaixo do ideal. Execute ${remaining} agora para manter a eficiência de conversão.`,
        type: "followup",
      });
    }

    if (visits < dailyVisitGoal) {
      const remaining = dailyVisitGoal - visits;
      actions.push({
        id: "visits-gap",
        priority: "low",
        message: `Agende ${remaining} ${remaining === 1 ? "visita" : "visitas"} para aumentar sua taxa de fechamento.`,
        type: "visit",
      });
    }

    if (paceStatus === "ahead" && actions.length === 0) {
      actions.push({
        id: "excellent",
        priority: "low",
        message: "Execução excelente! Você está acima de todos os indicadores. Mantenha o foco.",
        type: "general",
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return {
      actions,
      paceStatus,
      pacePercentage: Math.min(pacePercentage, 150),
      expectedByNow: expectedContacts,
      paceMessage: paceMessages[paceStatus],
      recoveryMessage,
    };
  }, [dailyStats, goals, financial, activities]);
}
