import { useEffect } from 'react';
import { useGreenVisionStore } from './useGreenVisionStore';
import confetti from 'canvas-confetti';

export function useSimulationEngine() {
  const isSimulating = useGreenVisionStore((s) => s.isSimulating);
  const simSpeed = useGreenVisionStore((s) => s.simSpeed);
  const simStep = useGreenVisionStore((s) => s.simStep);
  const activeScenario = useGreenVisionStore((s) => s.activeScenario);
  const nextSimStep = useGreenVisionStore((s) => s.nextSimStep);
  const setSimulationRunning = useGreenVisionStore((s) => s.setSimulationRunning);

  const maxSteps = activeScenario === 'waste_dumping_gate2' ? 6 : activeScenario === 'bin_overflow_cafeteria' ? 4 : 3;

  useEffect(() => {
    if (!isSimulating) return;

    if (simStep >= maxSteps) {
      setSimulationRunning(false);
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

    // Step interval: 2200ms at 1x, 1100ms at 2x, 500ms at 5x
    const intervalTime = Math.max(500, Math.round(2200 / simSpeed));

    const timer = setTimeout(() => {
      nextSimStep();
    }, intervalTime);

    return () => clearTimeout(timer);
  }, [isSimulating, simStep, simSpeed, activeScenario, maxSteps, nextSimStep, setSimulationRunning]);
}
