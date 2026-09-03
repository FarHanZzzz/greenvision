import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Maximize2, 
  Scan, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';
import { CameraRecord } from '../../types';

export const LiveCCTVGrid: React.FC = () => {
  const cameras = useGreenVisionStore((s) => s.cameras);
  const selectedCameraId = useGreenVisionStore((s) => s.selectedCameraId);
  const setSelectedCameraId = useGreenVisionStore((s) => s.setSelectedCameraId);
  const triggerManualIncident = useGreenVisionStore((s) => s.triggerManualIncident);

  const [feedTime, setFeedTime] = useState('');
  const [filterZone, setFilterZone] = useState('ALL');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setFeedTime(now.toLocaleTimeString('en-GB', { hour12: false }) + '.' + Math.floor(now.getMilliseconds() / 100));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Display top 8 cameras for grid view
  const displayCameras = filterZone === 'ALL' 
    ? cameras.slice(0, 8) 
    : cameras.filter(c => c.locationId === filterZone);

  return (
    <div className="space-y-4">
      
      {/* CCTV Grid Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-100">Simulated CCTV Surveillance Matrix</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                16 NODES ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-400">Optical stream with real-time AI environmental bounding box inference</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={triggerManualIncident}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Optical Anomaly</span>
          </button>
        </div>
      </div>

      {/* Camera 8-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayCameras.map((cam) => {
          const isSelected = selectedCameraId === cam.id;
          const hasIncident = cam.currentIncidentId !== undefined;

          return (
            <div
              key={cam.id}
              onClick={() => setSelectedCameraId(cam.id)}
              className={`group relative rounded-xl overflow-hidden bg-slate-950 border transition cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                  : hasIncident
                  ? 'border-red-500/60 shadow-lg shadow-red-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Simulated Camera Feed Canvas */}
              <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
                
                {/* Background Grid Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

                {/* Scanline Overlay */}
                <div className="absolute inset-0 cctv-scanline pointer-events-none opacity-40"></div>

                {/* Simulated CCTV Visual Subject */}
                <div className="relative text-center p-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 group-hover:scale-105 transition">
                    <Camera className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-2 font-medium">
                    {cam.name}
                  </div>
                </div>

                {/* AI Bounding Box Overlay if Active Incident on this Camera */}
                {hasIncident && (
                  <div className="absolute inset-4 border-2 border-red-500 border-dashed rounded-lg flex flex-col justify-between p-2 bg-red-500/5 animate-pulse">
                    <div className="self-start px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold shadow">
                      AI: {cam.coverageCategory.replace('_', ' ')} (94%)
                    </div>
                    <div className="self-end text-[9px] font-mono text-red-400 font-bold bg-slate-950/80 px-1.5 py-0.5 rounded">
                      ROI: [340, 210, 180, 120]
                    </div>
                  </div>
                )}

                {/* Top HUD Bar */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-950/70 backdrop-blur-sm px-2 py-1 rounded">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="font-bold text-white">{cam.id}</span>
                  </div>
                  <div className="text-emerald-400 font-bold">{feedTime}</div>
                </div>

                {/* Bottom HUD Bar */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded">
                  <span>{cam.locationName}</span>
                  <span className="text-slate-500">{cam.feedResolution.split(' ')[0]}</span>
                </div>
              </div>

              {/* Feed Card Footer */}
              <div className="p-2.5 bg-slate-900 text-xs flex items-center justify-between border-t border-slate-800">
                <span className="text-slate-400 text-[11px] font-medium truncate max-w-[160px]">
                  {cam.coverageCategory.replace('_', ' ')}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  hasIncident ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {hasIncident ? 'EVENT ACTIVE' : 'NOMINAL'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
