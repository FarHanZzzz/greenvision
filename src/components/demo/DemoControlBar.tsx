import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
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
    { label: "Step 0: AI Detection", desc: "AI flagged waste accumulation at UIU Gate 2 (GV-CAM-004)" },
    { label: "Step 1: Human Verification", desc: "Operator confirmed incident via optical feed" },
    { label: "Step 2: Dispatch & Routing", desc: "Supervisor assigned Rahim Uddin (01307726701)" },
    { label: "Step 3: Task Accepted", desc: "Rahim accepted task on mobile & en route" },
    { label: "Step 4: Cleanup in Progress", desc: "Rahim arrived at UIU Gate 2 and started work" },
    { label: "Step 5: Evidence Uploaded", desc: "After-cleanup photo submitted for supervisor review" },
    { label: "Step 6: Closed & Verified", desc: "Supervisor approved! Map & Green Score updated" },
  ];

  const currentStepInfo = stepLabels[Math.min(simStep, stepLabels.length - 1)];

  // Minimized floating pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[450]">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-950/95 backdrop-blur-md border border-emerald-500/50 rounded-full shadow-2xl text-white text-xs font-bold hover:bg-slate-900 transition hover:scale-105"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-emerald-300 font-mono">{currentStepInfo.label}</span>
          <span className="text-slate-400">|</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-300">
            <span>Controls</span>
            <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[450] w-[95%] max-w-5xl bg-slate-950/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl shadow-2xl p-2.5 text-white transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Demo Badge & Scenario Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
            <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>DEMO ENGINE</span>
          </div>

          <select
            value={activeScenario}
            onChange={(e) => setScenario(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="waste_dumping_gate2">Primary Showcase: UIU Gate 2 Waste Dumping</option>
            <option value="bin_overflow_cafeteria">Scenario 2: UIU Cafeteria Bin Overflow</option>
            <option value="waterlogging_parking">Scenario 3: UIU Parking South Ponding</option>
            <option value="normal">Normal Monitoring Baseline</option>
          </select>
        </div>

        {/* Middle: Step Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-emerald-300 font-mono">{currentStepInfo.label}:</span>
          <span className="text-slate-300 text-[11px] truncate max-w-xs">{currentStepInfo.desc}</span>
        </div>

        {/* Right: Controls & Speed */}
        <div className="flex items-center gap-1.5">
          
          {/* Play / Pause */}
          <button
            onClick={() => setSimulationRunning(!isSimulating)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow transition ${
              isSimulating
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title={isSimulating ? "Pause Simulation" : "Auto-Play Scenario"}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Pause' : 'Play'}</span>
          </button>

          {/* Manual Step Forward */}
          <button
            onClick={() => nextSimStep()}
            disabled={simStep >= 6}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Advance 1 Step in Loop"
          >
            <span>Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Speed Multiplier */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                  simSpeed === spd
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Trigger Manual Incident */}
          <button
            onClick={triggerManualIncident}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
            title="Inject Random Optical Anomaly"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Reset Baseline */}
          <button
            onClick={resetDemoToBaseline}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 transition"
            title="Reset to Initial Baseline"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition ml-1"
            title="Minimize Bar to Slim Pill"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};
