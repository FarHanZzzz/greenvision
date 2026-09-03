import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Columns, 
  List, 
  UserCheck, 
  Eye,
  Check,
  RotateCcw
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';
import { IncidentRecord, IncidentStatus, IncidentPriority } from '../../types';

export const IncidentsCenter: React.FC = () => {
  const incidents = useGreenVisionStore((s) => s.incidents);
  const setSelectedIncidentId = useGreenVisionStore((s) => s.setSelectedIncidentId);
  const confirmIncident = useGreenVisionStore((s) => s.confirmIncident);
  const assignIncident = useGreenVisionStore((s) => s.assignIncident);
  const approveResolution = useGreenVisionStore((s) => s.approveResolution);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN'>('TABLE');

  // Filtering
  const filteredIncidents = incidents.filter((inc) => {
    if (selectedCategory !== 'ALL' && inc.category !== selectedCategory) return false;
    if (selectedPriority !== 'ALL' && inc.priority !== selectedPriority) return false;
    if (selectedStatus !== 'ALL' && inc.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.locationName.toLowerCase().includes(q) ||
        inc.cameraName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Kanban Columns (PRD Section 14)
  const kanbanColumns: { status: IncidentStatus; label: string; color: string }[] = [
    { status: 'PENDING_VERIFICATION', label: 'AI Verification', color: 'border-amber-500' },
    { status: 'CONFIRMED', label: 'Confirmed (Ready to Assign)', color: 'border-sky-500' },
    { status: 'ASSIGNED', label: 'Assigned / In Transit', color: 'border-indigo-500' },
    { status: 'IN_PROGRESS', label: 'Work In Progress', color: 'border-blue-500' },
    { status: 'PENDING_APPROVAL', label: 'Supervisor Review', color: 'border-purple-500' },
    { status: 'CLOSED', label: 'Closed & Verified', color: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-4">
      
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, location, or keyword..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Categories</option>
            <option value="WASTE_ACCUMULATION">Waste Accumulation</option>
            <option value="BIN_OVERFLOW">Bin Overflow</option>
            <option value="ILLEGAL_DUMPING">Illegal Dumping</option>
            <option value="WATERLOGGING">Waterlogging</option>
            <option value="TRAFFIC_CONGESTION">Traffic Congestion</option>
          </select>

          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* View Toggle (Table / Kanban) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition ${
                viewMode === 'TABLE' ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition ${
                viewMode === 'KANBAN' ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-500'
              }`}
              title="Kanban Board View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

        </div>
      </div>

      {/* View Mode: TABLE */}
      {viewMode === 'TABLE' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Incident ID</th>
                  <th className="py-3 px-4">Category & Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIncidents.slice(0, 25).map((inc) => (
                  <tr
                    key={inc.id}
                    className="hover:bg-slate-50 transition cursor-pointer"
                    onClick={() => setSelectedIncidentId(inc.id)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {inc.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{inc.categoryLabel}</div>
                      <div className="text-[11px] text-slate-400">{inc.locationName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        inc.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        inc.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {inc.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        inc.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-800' :
                        inc.status === 'PENDING_VERIFICATION' ? 'bg-amber-100 text-amber-800 font-bold animate-pulse' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-700">
                        {inc.assignedResponderName || <span className="text-slate-400 italic">Unassigned</span>}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {Math.round(inc.aiConfidence * 100)}%
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {inc.status === 'PENDING_VERIFICATION' ? (
                        <button
                          onClick={() => confirmIncident(inc.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition"
                        >
                          Confirm
                        </button>
                      ) : inc.status === 'CONFIRMED' ? (
                        <button
                          onClick={() => assignIncident(inc.id, "usr-resp-1")}
                          className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] transition"
                        >
                          Dispatch
                        </button>
                      ) : inc.status === 'PENDING_APPROVAL' ? (
                        <button
                          onClick={() => approveResolution(inc.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedIncidentId(inc.id)}
                          className="text-slate-400 hover:text-slate-600 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View Mode: KANBAN BOARD */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colIncidents = filteredIncidents.filter(i => i.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col min-w-[200px]"
              >
                <div className={`flex items-center justify-between pb-2 mb-2 border-b-2 ${col.color}`}>
                  <span className="font-bold text-xs text-slate-800 truncate">{col.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                    {colIncidents.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto max-h-[520px]">
                  {colIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => setSelectedIncidentId(inc.id)}
                      className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-emerald-500 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-slate-900">{inc.id}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          inc.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {inc.priority}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 text-xs mt-1 truncate">{inc.categoryLabel}</div>
                      <div className="text-[10px] text-slate-400 truncate">{inc.locationName}</div>

                      {inc.assignedResponderName && (
                        <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Responder:</span>
                          <span className="font-semibold text-slate-700">{inc.assignedResponderName.split(' ')[0]}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
