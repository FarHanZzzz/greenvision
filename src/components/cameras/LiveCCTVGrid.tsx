import React, { useState } from 'react';
import { 
  Video, 
  Maximize2, 
  Sparkles,
  Filter,
  Eye,
  Radio,
  Clock
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';
import { CCTVCanvasFeed } from './CCTVCanvasFeed';

export const LiveCCTVGrid: React.FC = () => {
  const cameras = useGreenVisionStore((s) => s.cameras);
  const selectedCameraId = useGreenVisionStore((s) => s.selectedCameraId);
  const setSelectedCameraId = useGreenVisionStore((s) => s.setSelectedCameraId);
  const triggerManualIncident = useGreenVisionStore((s) => s.triggerManualIncident);

  const [filterZone, setFilterZone] = useState('ALL');
  const [gridColumns, setGridColumns] = useState<4 | 8 | 16>(8);

  const displayCameras = filterZone === 'ALL' 
    ? cameras.slice(0, gridColumns) 
    : cameras.filter(c => c.locationId === filterZone);

  return (
    <div className="space-y-4">
      
      {/* CCTV Grid Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Video className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-100">Live Campus CCTV Surveillance Matrix</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                16 NODES ONLINE • UIU DHAKA
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live simulated optical feeds with real-time AI bounding box inference & human movement tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          
          {/* Density Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[4, 8, 16].map((num) => (
              <button
                key={num}
                onClick={() => setGridColumns(num as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  gridColumns === num ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {num} Feeds
              </button>
            ))}
          </div>

          <button
            onClick={triggerManualIncident}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Optical Anomaly</span>
          </button>
        </div>
      </div>

      {/* Camera Live Feeds Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${
        gridColumns === 4 ? 'lg:grid-cols-2' : gridColumns === 16 ? 'lg:grid-cols-4' : 'lg:grid-cols-4'
      } gap-4`}>
        {displayCameras.map((cam) => {
          const isSelected = selectedCameraId === cam.id;
          const hasIncident = cam.currentIncidentId !== undefined;

          return (
            <div
              key={cam.id}
              onClick={() => setSelectedCameraId(cam.id)}
              className={`group relative rounded-2xl overflow-hidden bg-slate-950 border transition cursor-pointer shadow-md ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                  : hasIncident
                  ? 'border-red-500/80 shadow-red-950/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Live Canvas Video Feed */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <CCTVCanvasFeed
                  camera={cam}
                  hasIncident={hasIncident}
                  className="w-full h-full"
                />

                {/* Inspect Stream Hover Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-[1px]">
                  <button className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expand Full Feed</span>
                  </button>
                </div>
              </div>

              {/* Feed Card Footer */}
              <div className="p-2.5 bg-slate-900 text-xs flex items-center justify-between border-t border-slate-800">
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-slate-200 text-xs truncate">{cam.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{cam.locationName}</div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                  hasIncident ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
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
