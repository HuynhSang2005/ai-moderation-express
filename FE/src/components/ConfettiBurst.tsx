import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiBurst({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;
    const end = Date.now() + 500; // 0.5s
    function frame() {
      confetti({
        particleCount: 40,
        spread: 60,
        startVelocity: 35,
        ticks: 180,
        origin: { y: 0.2 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    }
    frame();
  }, [active]);

  return null;
}
