import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  formatFn?: (v: number) => string;
}

export default function AnimatedCounter({ value, prefix = "", suffix = "", className = "", duration = 600, formatFn }: Props) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;

    const startTime = performance.now();
    let rafId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        prevRef.current = to;
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);

  const formatted = formatFn ? formatFn(display) : `${prefix}${display.toLocaleString("pt-BR")}${suffix}`;

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.7, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {formatted}
    </motion.span>
  );
}
