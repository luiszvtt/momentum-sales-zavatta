import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const emptyMessages = [
  "Seu resultado depende do que você faz agora.",
  "Cada minuto parado é oportunidade perdida.",
  "O primeiro passo é o mais importante.",
  "Comece agora. Os resultados virão.",
];

export default function EmptyState() {
  const navigate = useNavigate();
  const message = emptyMessages[Math.floor(Math.random() * emptyMessages.length)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl bg-card p-8 text-center space-y-4"
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
        <Rocket className="h-8 w-8 text-accent" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground">Você ainda não começou hoje.</h3>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/add")}
        className="rounded-xl bg-accent px-8 py-3 text-accent-foreground font-semibold text-base shadow-lg"
      >
        Começar agora →
      </motion.button>
    </motion.div>
  );
}
