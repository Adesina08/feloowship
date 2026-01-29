import { useMemo } from "react";

interface ConfettiProps {
  active: boolean;
}

const confettiColors = [
  "#0ea5e9",
  "#10b981",
  "#f97316",
  "#facc15",
  "#ef4444",
  "#6366f1",
];

export const Confetti = ({ active }: ConfettiProps) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 0.8,
        color: confettiColors[index % confettiColors.length],
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <style>
        {`
          @keyframes confetti-fall {
            0% {
              transform: translateY(-10vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationName: "confetti-fall",
            animationTimingFunction: "ease-in",
            animationFillMode: "forwards",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
          className="absolute top-0 h-3 w-2"
        />
      ))}
    </div>
  );
};
