import React from 'react';
import { CommandMap } from '../map/CommandMap';
import { OverviewDashboard } from '../dashboard/OverviewDashboard';
import { ResponderApp } from '../responder/ResponderApp';
import { Columns, Smartphone, LayoutDashboard, Radio } from 'lucide-react';

export const DualDemoView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Dual Screen Banner */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Columns className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">DUAL-VIEW SHOWCASE MODE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                REAL-TIME SYNC
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Watch actions taken on the Field Responder App (right) reflect instantaneously on the Central Command Center (left).
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>WEBSOCKET SYNC ACTIVE</span>
        </div>
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Command Center & Map (8 Cols) */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Campus Command Map & Optical Surveillance
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Dhaka Central Node</span>
            </div>
            <CommandMap />
          </div>

          <OverviewDashboard />
        </div>

        {/* Right Column: Mobile Phone Frame for Responder Rahim (4 Cols) */}
        <div className="xl:col-span-4 sticky top-20">
          <div className="text-center mb-2 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-bold uppercase font-mono">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Field Responder Interface (Rahim)</span>
          </div>

          <ResponderApp />
        </div>

      </div>

    </div>
  );
};
