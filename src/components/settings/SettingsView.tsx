import React from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Bell, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Zap, 
  CheckCircle2,
  Database
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';

export const SettingsView: React.FC = () => {
  const resetDemoToBaseline = useGreenVisionStore((s) => s.resetDemoToBaseline);
  const activeScenario = useGreenVisionStore((s) => s.activeScenario);
  const setScenario = useGreenVisionStore((s) => s.setScenario);
  const simSpeed = useGreenVisionStore((s) => s.simSpeed);
  const setSimSpeed = useGreenVisionStore((s) => s.setSimSpeed);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black tracking-tight">SYSTEM CONFIGURATION & DEMO CONTROL</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational SLA thresholds, routing policies, and simulation engine preferences.
          </p>
        </div>
      </div>

      {/* 1. Demo Engine Configuration (PRD Section 40) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>Showcase Simulation Engine</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Active Presentation Scenario:</label>
            <select
              value={activeScenario}
              onChange={(e) => setScenario(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="waste_dumping_gate2">Gate 2 Waste Dumping (Primary Showcase)</option>
              <option value="bin_overflow_cafeteria">Central Cafeteria Bin Overflow</option>
              <option value="waterlogging_parking">Parking South Drainage Ponding</option>
              <option value="normal">Normal Monitoring Baseline</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Playback Speed Multiplier:</label>
            <div className="flex items-center gap-2 mt-1">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimSpeed(spd)}
                  className={`flex-1 py-2 rounded-lg font-mono font-bold text-xs transition ${
                    simSpeed === spd ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {spd}x Speed
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Need to restart the live demonstration from scratch?</span>
          <button
            onClick={resetDemoToBaseline}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center gap-1.5 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Dataset to Baseline</span>
          </button>
        </div>
      </div>

      {/* 2. SLA Timers Configuration (PRD Section 15 & 25) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Operational SLA Response Benchmarks</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-red-50 rounded-xl border border-red-100">
            <span className="font-bold text-red-900 block">Critical Priority SLA</span>
            <span className="text-2xl font-black text-red-600 mt-1 block">30 mins</span>
            <span className="text-[10px] text-red-500 mt-0.5 block">Rapid emergency containment</span>
          </div>

          <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
            <span className="font-bold text-orange-900 block">High Priority SLA</span>
            <span className="text-2xl font-black text-orange-600 mt-1 block">45 mins</span>
            <span className="text-[10px] text-orange-500 mt-0.5 block">Standard perimeter cleanup</span>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
            <span className="font-bold text-amber-900 block">Medium Priority SLA</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">60 mins</span>
            <span className="text-[10px] text-amber-500 mt-0.5 block">Routine cafeteria empty cycle</span>
          </div>
        </div>
      </div>

      {/* 3. Automatic Department Routing Rules (PRD Section 27) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Automated Department Routing Matrix (Section 27)</span>
        </h3>

        <div className="divide-y divide-slate-100 text-xs text-slate-700">
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold">Waste Accumulation</span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">CLEANING TEAM</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold">Illegal Dumping</span>
            <span className="px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 font-bold font-mono">CLEANING + SECURITY</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold">Waterlogging / Drainage</span>
            <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold font-mono">MAINTENANCE TEAM</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold">Traffic Congestion</span>
            <span className="px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold font-mono">SECURITY UNIT</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold">Smoke Detection</span>
            <span className="px-2.5 py-0.5 rounded bg-red-100 text-red-800 font-bold font-mono">SAFETY & SECURITY</span>
          </div>
        </div>
      </div>

    </div>
  );
};
