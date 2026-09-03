import React, { useState } from 'react';
import { HeaderNav } from './components/layout/HeaderNav';
import { DemoControlBar } from './components/demo/DemoControlBar';
import { CommandMap } from './components/map/CommandMap';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { LiveCCTVGrid } from './components/cameras/LiveCCTVGrid';
import { IncidentsCenter } from './components/incidents/IncidentsCenter';
import { OperationsDashboard } from './components/operations/OperationsDashboard';
import { ResponderApp } from './components/responder/ResponderApp';
import { DualDemoView } from './components/demo/DualDemoView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { GreenScoreView } from './components/greenscore/GreenScoreView';
import { ReportsView } from './components/reports/ReportsView';
import { useGreenVisionStore } from './store/useGreenVisionStore';
import { useSimulationEngine } from './store/simulationRunner';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  AlertCircle, 
  Video, 
  BarChart3, 
  Award, 
  FileText,
  MapPin,
  Radio,
  X
} from 'lucide-react';

export function App() {
  // Activate background simulation runner
  useSimulationEngine();

  const currentInterface = useGreenVisionStore((s) => s.currentInterface);
  const selectedCameraId = useGreenVisionStore((s) => s.selectedCameraId);
  const setSelectedCameraId = useGreenVisionStore((s) => s.setSelectedCameraId);
  const cameras = useGreenVisionStore((s) => s.cameras);

  // Sub-navigation within Central Command Center
  const [commandSubTab, setCommandSubTab] = useState<
    'OVERVIEW' | 'MAP' | 'INCIDENTS' | 'CCTV' | 'ANALYTICS' | 'GREENSCORE' | 'REPORTS'
  >('OVERVIEW');

  const selectedCamera = cameras.find(c => c.id === selectedCameraId);

  const commandNavItems = [
    { id: 'OVERVIEW', label: 'Overview', icon: LayoutDashboard },
    { id: 'MAP', label: 'Live Command Map', icon: MapIcon },
    { id: 'INCIDENTS', label: 'Incidents Directory', icon: AlertCircle },
    { id: 'CCTV', label: 'Live CCTV Matrix', icon: Video },
    { id: 'ANALYTICS', label: 'Analytics & Trends', icon: BarChart3 },
    { id: 'GREENSCORE', label: 'Operational Green Score', icon: Award },
    { id: 'REPORTS', label: 'Reports & Audits', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-24">
      
      {/* Global Navigation Header */}
      <HeaderNav />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 py-6">
        
        {/* INTERFACE 1: CENTRAL COMMAND CENTER */}
        {currentInterface === 'COMMAND_CENTER' && (
          <div className="space-y-6">
            
            {/* Command Center Sub-Navigation Tabs */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto">
              {commandNavItems.map((tab) => {
                const Icon = tab.icon;
                const isActive = commandSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCommandSubTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Views */}
            {commandSubTab === 'OVERVIEW' && (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapIcon className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                        Live Campus Environmental Map
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Real-time GPS & Optical Tracking</span>
                  </div>
                  <CommandMap />
                </div>
                <OverviewDashboard />
              </div>
            )}

            {commandSubTab === 'MAP' && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <CommandMap />
              </div>
            )}

            {commandSubTab === 'INCIDENTS' && <IncidentsCenter />}

            {commandSubTab === 'CCTV' && <LiveCCTVGrid />}

            {commandSubTab === 'ANALYTICS' && <AnalyticsView />}

            {commandSubTab === 'GREENSCORE' && <GreenScoreView />}

            {commandSubTab === 'REPORTS' && <ReportsView />}

          </div>
        )}

        {/* INTERFACE 2: OPERATIONS & CONTROL ROOM */}
        {currentInterface === 'OPERATIONS' && (
          <OperationsDashboard />
        )}

        {/* INTERFACE 3: FIELD RESPONDER MOBILE APPLICATION */}
        {currentInterface === 'RESPONDER' && (
          <div className="py-6 flex flex-col items-center">
            <div className="text-center mb-4">
              <h2 className="text-xl font-extrabold text-slate-900">FIELD RESPONDER MOBILE INTERFACE</h2>
              <p className="text-xs text-slate-500 mt-1">Simulated view of the Android / iOS field worker app used by campus sanitation staff.</p>
            </div>
            <ResponderApp />
          </div>
        )}

        {/* DUAL DEMO SHOWCASE MODE */}
        {currentInterface === 'DUAL_DEMO' && (
          <DualDemoView />
        )}

      </main>

      {/* Floating Controllable Demo Control Bar */}
      <DemoControlBar />

      {/* Fullscreen Camera Modal if Selected */}
      {selectedCameraId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl text-white">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-bold text-sm">{selectedCamera?.id}: {selectedCamera?.name}</span>
              </div>
              <button
                onClick={() => setSelectedCameraId(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 cctv-scanline opacity-40"></div>
              
              <div className="text-center">
                <Radio className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
                <div className="text-xs font-mono text-slate-400 mt-2 font-semibold">
                  LIVE OPTICAL STREAM — {selectedCamera?.locationName}
                </div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">
                  1080p 30fps • AI VISION INFERENCE ACTIVE
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest animate-pulse">
                REC
              </div>
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span>Coverage: <strong className="text-slate-200">{selectedCamera?.coverageCategory}</strong></span>
              <button
                onClick={() => setSelectedCameraId(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition"
              >
                Close Stream
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
