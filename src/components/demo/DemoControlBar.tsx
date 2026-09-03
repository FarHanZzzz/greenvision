import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  PlusCircle, 
  ArrowRight, 
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';

export const DemoControlBar: React.FC = () => {
  const isSimulating = useGreenVisionStore((s) => s.isSimulating);
  const simSpeed = useGreenVisionStore((s) => s.simSpeed);
  const simStep = useGreenVisionStore((s) => s.simStep);
  const activeScenario = useGreenVisionStore((s) => s.activeScenario);
  const setSimSpeed = useGreenVisionStore((s) => s.setSimSpeed);
  const setSimulationRunning = useGreenVisionStore((s) => s.setSimulationRunning);
  const setScenario = useGreenVisionStore((s) => s.setScenario);
  const nextSimStep = useGreenVisionStore((s) => s.nextSimStep);
  const resetDemoToBaseline = useGreenVisionStore((s) => s.resetDemoToBaseline);
  const triggerManualIncident = useGreenVisionStore((s) => s.triggerManualIncident);

  const [isMinimized, setIsMinimized] = useState(false);

  const stepLabels = [
    { label: "Step 0: AI Detection", desc: "AI flagged waste accumulation at Gate 2 (GV-CAM-004)" },
    { label: "Step 1: Verification", desc: "Operator confirmed incident via optical feed" },
    { label: "Step 2: Dispatch", desc: "Supervisor assigned Rahim Uddin (01307726701)" },
    { label: "Step 3: Accepted", desc: "Rahim accepted task on mobile & en route" },
    { label: "Step 4: Cleanup Work", desc: "Rahim arrived at Gate 2 and started work" },
    { label: "Step 5: Evidence", desc: "After-cleanup photo submitted for supervisor review" },
    { label: "Step 6: Verified & Closed", desc: "Supervisor approved! Map & Green Score updated" },
  ];

  const currentStepInfo = stepLabels[Math.min(simStep, stepLabels.length - 1)];

  // Minimized floating pill (ultra-compact)
  if (isMinimized) {
    return (
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[450]">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/95 backdrop-blur-md border border-emerald-500/60 rounded-full shadow-2xl text-white text-xs font-bold hover:bg-slate-900 transition hover:scale-105"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-emerald-300 font-mono text-[11px]">{currentStepInfo.label}</span>
          <span className="text-slate-500">|</span>
          <span className="flex items-center gap-0.5 text-[10px] text-slate-300">
            <span>Controls</span>
            <ChevronUp className="w-3 h-3 text-emerald-400" />
          </span>
        </button>
      </div>
    );
  }

  // Compact floating control bar
  return (
    <div className="fixed bottom-2.5 left-1/2 -translate-x-1/2 z-[450] w-auto max-w-[94vw] bg-slate-950/95 backdrop-blur-md border border-emerald-500/40 rounded-xl shadow-2xl px-3 py-1.5 text-white transition-all">
      <div className="flex items-center gap-2 text-xs">
        
        {/* Badge & Scenario */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
            <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">SIM</span>
          </span>

          <select
            value={activeScenario}
            onChange={(e) => setScenario(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-[11px] text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 font-medium max-w-[180px] sm:max-w-[220px] truncate"
          >
            <option value="waste_dumping_gate2">Gate 2 Waste Dumping</option>
            <option value="bin_overflow_cafeteria">Cafeteria Bin Overflow</option>
            <option value="waterlogging_parking">Parking South Ponding</option>
          </select>
        </div>

        {/* Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-emerald-300 font-mono">{currentStepInfo.label}</span>
        </div>

        {/* Play / Pause */}
        <button
          onClick={() => {
            if (simStep >= (activeScenario === 'waste_dumping_gate2' ? 6 : activeScenario === 'bin_overflow_cafeteria' ? 4 : 3)) {
              resetDemoToBaseline();
              setTimeout(() => setSimulationRunning(true), 150);
            } else {
              setSimulationRunning(!isSimulating);
            }
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold shadow transition shrink-0 ${
            isSimulating
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
          title={isSimulating ? "Pause Simulation" : "Auto-Play Closed Loop"}
        >
          {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isSimulating ? 'Pause' : 'Play'}</span>
        </button>

        {/* Step Button */}
        <button
          onClick={() => nextSimStep()}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shrink-0"
          title="Advance 1 Step in Closed Loop"
        >
          <span>Step</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        {/* Speed */}
        <div className="hidden sm:flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
          {[1, 2, 5].map((spd) => (
            <button
              key={spd}
              onClick={() => setSimSpeed(spd)}
              className={`px-1.5 py-0.5 rounded font-mono font-bold transition ${
                simSpeed === spd
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Inject Anomaly */}
        <button
          onClick={triggerManualIncident}
          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition shrink-0"
          title="Inject Optical Anomaly"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
        </button>

        {/* Reset */}
        <button
          onClick={resetDemoToBaseline}
          className="p-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 transition shrink-0"
          title="Reset Baseline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Minimize */}
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
          title="Minimize Bar"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
