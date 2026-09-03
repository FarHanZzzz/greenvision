import React, { useState } from 'react';
import { 
  Video, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  PowerOff, 
  Eye, 
  Camera as CameraIcon,
  Sparkles
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';
import { CameraRecord } from '../../types';

export const CamerasManagementView: React.FC = () => {
  const cameras = useGreenVisionStore((s) => s.cameras);
  const setSelectedCameraId = useGreenVisionStore((s) => s.setSelectedCameraId);
  const triggerManualIncident = useGreenVisionStore((s) => s.triggerManualIncident);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = cameras.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.locationName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const onlineCount = cameras.filter(c => c.status === 'ONLINE').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black tracking-tight">CCTV CAMERA INFRASTRUCTURE INVENTORY</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active optical surveillance nodes integrated with the GreenVision environmental inference layer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
            {onlineCount} / {cameras.length} NODES ONLINE
          </span>
          <button
            onClick={triggerManualIncident}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Anomaly</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Camera ID, name, or zone..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="ONLINE">Online</option>
          <option value="WARNING">Warning</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="OFFLINE">Offline</option>
        </select>
      </div>

      {/* Inventory Table (PRD Section 37) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Camera ID</th>
                <th className="py-3 px-4">Camera Name & Zone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">AI Coverage Target</th>
                <th className="py-3 px-4">Last Optical Event</th>
                <th className="py-3 px-4">Resolution & Angle</th>
                <th className="py-3 px-4 text-right">Stream Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cam) => (
                <tr key={cam.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelectedCameraId(cam.id)}>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                    <CameraIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cam.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{cam.name}</div>
                    <div className="text-[11px] text-slate-400">{cam.locationName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cam.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' :
                      cam.status === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {cam.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-700">{cam.coverageCategory.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {cam.lastEventTime}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {cam.feedResolution} ({cam.directionDeg}°)
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedCameraId(cam.id)}
                      className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] flex items-center gap-1 ml-auto transition"
                    >
                      <Eye className="w-3 h-3 text-emerald-400" />
                      <span>Feed</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
