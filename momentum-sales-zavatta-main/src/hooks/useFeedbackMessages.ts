import { useRef, useCallback } from "react";

const feedbackPool = [
  "Boa! Você está mais perto da sua próxima venda. 🎯",
  "Consistência constrói resultado. 💪",
  "Execução perfeita. Continue. ⚡",
  "Você está jogando o jogo certo. 🏆",
  "Cada ação conta. Siga em frente. 🚀",
  "Disciplina hoje, resultado amanhã. 🔥",
  "Mais um passo rumo ao seu objetivo. ✨",
  "Foco no processo. O resultado vem. 💎",
  "Momentum ativado! Continue assim. ⭐",
  "Você está construindo seu resultado agora. 📈",
];

export function useFeedbackMessages() {
  const lastIndexRef = useRef(-1);

  const getNextMessage = useCallback(() => {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * feedbackPool.length);
    } while (idx === lastIndexRef.current && feedbackPool.length > 1);
    lastIndexRef.current = idx;
    return feedbackPool[idx];
  }, []);

  return { getNextMessage };
}
