import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  duration?: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

const CountdownTimer = ({ duration = 60, onTimeUp, isRunning }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft <= 0, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLow = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <motion.div
      className={`font-mono text-sm px-3 py-1 rounded border ${
        isCritical
          ? "border-destructive/60 bg-destructive/10 text-destructive"
          : isLow
          ? "border-secondary/60 bg-secondary/10 text-secondary"
          : "border-primary/40 bg-primary/5 text-primary"
      }`}
      animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
      transition={isCritical ? { repeat: Infinity, duration: 0.5 } : {}}
    >
      <span className="tracking-widest font-display text-xs mr-1">⏱</span>
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </motion.div>
  );
};

export default CountdownTimer;
