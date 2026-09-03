import { useEffect } from 'react';
import { useGreenVisionStore } from './useGreenVisionStore';
import confetti from 'canvas-confetti';

export function useSimulationEngine() {
  const isSimulating = useGreenVisionStore((s) => s.isSimulating);
  const simSpeed = useGreenVisionStore((s) => s.simSpeed);
  const simStep = useGreenVisionStore((s) => s.simStep);
  const nextSimStep = useGreenVisionStore((s) => s.nextSimStep);
  const setSimulationRunning = useGreenVisionStore((s) => s.setSimulationRunning);

  useEffect(() => {
    if (!isSimulating) return;

    if (simStep >= 6) {
      setSimulationRunning(false);
      // Trigger festive celebration confetti on successful closed-loop completion!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#059669', '#34D399', '#3B82F6']
        });
      } catch (e) {
        // Fallback gracefully
      }
      return;
    }

    // Step interval adjusted by speed multiplier (base: 3200ms)
    const intervalTime = Math.max(800, 3200 / simSpeed);

    const timer = setTimeout(() => {
      nextSimStep();
    }, intervalTime);

    return () => clearTimeout(timer);
  }, [isSimulating, simStep, simSpeed, nextSimStep, setSimulationRunning]);
}
