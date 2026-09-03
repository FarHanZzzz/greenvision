import React, { useState } from 'react';
import { HeaderNav } from './components/layout/HeaderNav';
import { DemoControlBar } from './components/demo/DemoControlBar';
import { CommandMap } from './components/map/CommandMap';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { LiveCCTVGrid } from './components/cameras/LiveCCTVGrid';
import { CCTVCanvasFeed } from './components/cameras/CCTVCanvasFeed';
import { CamerasManagementView } from './components/cameras/CamerasManagementView';
import { TeamsManagementView } from './components/teams/TeamsManagementView';
import { LocationsView } from './components/locations/LocationsView';
import { SettingsView } from './components/settings/SettingsView';
import { IncidentsCenter } from './components/incidents/IncidentsCenter';
import { OperationsDashboard } from './components/operations/OperationsDashboard';
import { ResponderApp } from './components/responder/ResponderApp';
import { ContactResponderModal } from './components/responder/ContactResponderModal';
import { SystemGuideModal } from './components/guide/SystemGuideModal';
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
  Users,
  MapPin,
  Sliders,
  Radio,
  X,
  ExternalLink
} from 'lucide-react';

export function App() {
  // Activate background simulation runner
  useSimulationEngine();

  const currentInterface = useGreenVisionStore((s) => s.currentInterface);
  const selectedCameraId = useGreenVisionStore((s) => s.selectedCameraId);
  const setSelectedCameraId = useGreenVisionStore((s) => s.setSelectedCameraId);
  const cameras = useGreenVisionStore((s) => s.cameras);

  // Sub-navigation within Central Command Center (PRD Section 17)
  const [commandSubTab, setCommandSubTab] = useState<
    'OVERVIEW' | 'MAP' | 'INCIDENTS' | 'CCTV' | 'ANALYTICS' | 'GREENSCORE' | 'REPORTS' | 'CAMERAS' | 'TEAMS' | 'ZONES' | 'SETTINGS'
  >('OVERVIEW');

  const selectedCamera = cameras.find(c => c.id === selectedCameraId);

  const commandNavItems = [
    { id: 'OVERVIEW', label: 'Overview', icon: LayoutDashboard },
    { id: 'MAP', label: 'Command Map', icon: MapIcon },
    { id: 'INCIDENTS', label: 'Incidents Directory', icon: AlertCircle },
    { id: 'CCTV', label: 'Live CCTV Matrix', icon: Video },
    { id: 'ANALYTICS', label: 'Analytics & Trends', icon: BarChart3 },
    { id: 'GREENSCORE', label: 'Operational Green Score', icon: Award },
    { id: 'REPORTS', label: 'Reports', icon: FileText },
    { id: 'CAMERAS', label: 'Cameras Inventory', icon: Video },
    { id: 'TEAMS', label: 'Field Teams', icon: Users },
    { id: 'ZONES', label: 'Campus Zones', icon: MapPin },
    { id: 'SETTINGS', label: 'Settings', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-20">
      
      {/* Global Navigation Header with UIU Branding & Guide */}
      <HeaderNav />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 py-4">
        
        {/* INTERFACE 1: CENTRAL COMMAND CENTER */}
        {currentInterface === 'COMMAND_CENTER' && (
          <div className="space-y-4">
            
            {/* Command Center Sub-Navigation Tabs */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto">
              {commandNavItems.map((tab) => {
                const Icon = tab.icon;
                const isActive = commandSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCommandSubTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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
              <div className="space-y-4">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <MapIcon className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                        Dhaka — Live Environmental Grid
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Real-time GPS & Optical Tracking • Madani Ave, Dhaka</span>
                  </div>
                  <CommandMap />
                </div>
                <OverviewDashboard />
              </div>
            )}

            {commandSubTab === 'MAP' && (
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <CommandMap />
              </div>
            )}

            {commandSubTab === 'INCIDENTS' && <IncidentsCenter />}

            {commandSubTab === 'CCTV' && <LiveCCTVGrid />}

            {commandSubTab === 'ANALYTICS' && <AnalyticsView />}

            {commandSubTab === 'GREENSCORE' && <GreenScoreView />}

            {commandSubTab === 'REPORTS' && <ReportsView />}

            {commandSubTab === 'CAMERAS' && <CamerasManagementView />}

            {commandSubTab === 'TEAMS' && <TeamsManagementView />}

            {commandSubTab === 'ZONES' && <LocationsView />}

            {commandSubTab === 'SETTINGS' && <SettingsView />}

          </div>
        )}

        {/* INTERFACE 2: OPERATIONS & CONTROL ROOM */}
        {currentInterface === 'OPERATIONS' && (
          <OperationsDashboard />
        )}

        {/* INTERFACE 3: FIELD RESPONDER MOBILE APPLICATION (Clean Responsive Fitting) */}
        {currentInterface === 'RESPONDER' && (
          <div className="py-2 flex flex-col items-center">
            <div className="text-center mb-3">
              <h2 className="text-lg font-black text-slate-900">FIELD RESPONDER MOBILE TERMINAL</h2>
              <p className="text-xs text-slate-500">
                Live view of the handheld application used by Rahim Uddin (Cleaning Team B • 01307726701).
              </p>
            </div>
            <ResponderApp />
          </div>
        )}

        {/* DUAL DEMO SHOWCASE MODE */}
        {currentInterface === 'DUAL_DEMO' && (
          <DualDemoView />
        )}

      </main>

      {/* Floating Controllable Demo Control Bar with Minimize Toggle */}
      <DemoControlBar />

      {/* Interactive SMS & Call Dispatcher Modal (01307726701) */}
      <ContactResponderModal />

      {/* Interactive System Guide Modal ("Tell me what are things") */}
      <SystemGuideModal />

      {/* Fullscreen Live CCTV Modal with Canvas Animation (Resolves Image 1) */}
      {selectedCameraId && selectedCamera && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl text-white flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Video className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-bold text-sm">
                  {selectedCamera.id}: {selectedCamera.name} ({selectedCamera.locationName})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  OPTICAL LIVE FEED
                </span>
              </div>
              <button
                onClick={() => setSelectedCameraId(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Animated Canvas Video Stream */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <CCTVCanvasFeed
                camera={selectedCamera}
                hasIncident={selectedCamera.currentIncidentId !== undefined}
                className="w-full h-full"
                showDetails={true}
              />
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                <span>Coverage Target: <strong className="text-slate-200">{selectedCamera.coverageCategory.replace('_', ' ')}</strong></span>
                <span className="mx-2">•</span>
                <span>Inference: <strong className="text-emerald-400 font-mono">1080p 30fps AI Optical</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCameraId(null)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow-md"
                >
                  Close Stream
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
