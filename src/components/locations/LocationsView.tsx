import React from 'react';
import { 
  MapPin, 
  Video, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';

export const LocationsView: React.FC = () => {
  const zones = useGreenVisionStore((s) => s.zones);
  const incidents = useGreenVisionStore((s) => s.incidents);
  const setSelectedIncidentId = useGreenVisionStore((s) => s.setSelectedIncidentId);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black tracking-tight">CAMPUS OPERATIONAL ZONES & HOTSPOTS</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic monitoring sectors with risk profiles, camera densities, and automated operational suggestions.
          </p>
        </div>
        <span className="text-xs font-mono bg-slate-800 text-emerald-400 px-3 py-1 rounded-lg border border-slate-700">
          10 DESIGNATED SECTORS
        </span>
      </div>

      {/* 10 Zones Grid (PRD Section 43) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map((zone) => {
          const zoneIncidents = incidents.filter(i => i.locationId === zone.id);
          const activeInZone = zoneIncidents.filter(i => i.status !== 'CLOSED');

          return (
            <div key={zone.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{
                      backgroundColor: zone.riskLevel === 'CRITICAL' ? '#EF4444' : zone.riskLevel === 'HIGH' ? '#F97316' : '#10B981'
                    }}></span>
                    <span className="font-mono text-xs font-bold text-slate-500">{zone.code}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                    zone.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800 animate-pulse' :
                    zone.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    zone.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {zone.riskLevel} RISK
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-2">{zone.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{zone.description}</p>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">CCTV Nodes</span>
                    <div className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{zone.cameraCount} Cameras</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Recorded Events</span>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      {zoneIncidents.length} Total ({activeInZone.length} Active)
                    </div>
                  </div>
                </div>

                {/* AI Recommendation (PRD Section 34) */}
                {zone.recommendedAction && (
                  <div className="mt-3.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950">
                    <span className="font-bold text-emerald-800 flex items-center gap-1 mb-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Preventive Action:</span>
                    </span>
                    <span>{zone.recommendedAction}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px]">{zone.centerCoordinates[0].toFixed(4)}, {zone.centerCoordinates[1].toFixed(4)}</span>
                <span className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1">
                  <span>View on Map</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
