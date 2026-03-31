import { useMemo } from "react";

const morningQuotes = [
  "Comece forte. Os primeiros contatos definem o dia.",
  "Hoje é mais um passo rumo ao seu objetivo.",
  "Bom dia! Seu resultado depende da sua primeira ação.",
  "Disciplina matinal gera resultado à tarde.",
];

const afternoonQuotes = [
  "Mantenha o ritmo. A consistência gera resultado.",
  "Você está construindo seu resultado agora.",
  "Foco no processo, o resultado vem.",
  "Cada contato te aproxima da sua próxima venda.",
];

const eveningQuotes = [
  "Último esforço do dia. Cada ação conta.",
  "Termine forte. Amanhã começa com o momentum de hoje.",
  "Disciplina hoje, resultado amanhã.",
  "Quem executa até o fim, colhe os frutos.",
];

export function useMotivationalQuote() {
  return useMemo(() => {
    const hour = new Date().getHours();
    const pool = hour < 12 ? morningQuotes : hour < 18 ? afternoonQuotes : eveningQuotes;
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);
}

export function getActionFeedback(): string {
  const feedbacks = [
    "Boa! Continue assim! 🔥",
    "Mais um passo rumo ao resultado! 💪",
    "Consistência gera resultado! ✨",
    "Você está no caminho certo! 🚀",
  ];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}
