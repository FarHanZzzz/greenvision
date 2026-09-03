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
  RotateCcw,
  MapPin,
  Video,
  PhoneCall,
  Smartphone,
  Flame,
  Sparkles,
  X,
  ArrowRight,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';
import { IncidentRecord, IncidentStatus, IncidentPriority, UserProfile } from '../../types';

export const IncidentsCenter: React.FC = () => {
  const incidents = useGreenVisionStore((s) => s.incidents);
  const users = useGreenVisionStore((s) => s.users);
  const setSelectedIncidentId = useGreenVisionStore((s) => s.setSelectedIncidentId);
  const setSelectedCameraId = useGreenVisionStore((s) => s.setSelectedCameraId);
  const setCommandSubTab = useGreenVisionStore((s) => s.setCommandSubTab);
  const setInterface = useGreenVisionStore((s) => s.setInterface);
  const confirmIncident = useGreenVisionStore((s) => s.confirmIncident);
  const assignIncident = useGreenVisionStore((s) => s.assignIncident);
  const reassignIncident = useGreenVisionStore((s) => s.reassignIncident);
  const deescalateIncident = useGreenVisionStore((s) => s.deescalateIncident);
  const approveResolution = useGreenVisionStore((s) => s.approveResolution);
  const openContactModal = useGreenVisionStore((s) => s.openContactModal);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN'>('TABLE');

  // Inspection Drawer state (Resolves user request 6)
  const [inspectingIncident, setInspectingIncident] = useState<IncidentRecord | null>(null);

  // Multi-Responder Reassignment Modal state (Resolves user request 4)
  const [reassigningIncident, setReassigningIncident] = useState<IncidentRecord | null>(null);
  const [chosenResponderId, setChosenResponderId] = useState<string>("usr-resp-1");
  const [reassignReason, setReassignReason] = useState<string>("Workload rebalance and rapid response");

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

  // Responders roster
  const fieldResponders = users.filter(u => u.role === 'FIELD_RESPONDER');

  // Kanban Columns (PRD Section 14)
  const kanbanColumns: { status: IncidentStatus; label: string; color: string; nextLabel: string }[] = [
    { status: 'PENDING_VERIFICATION', label: 'AI Verification', color: 'border-amber-500', nextLabel: 'Confirm' },
    { status: 'CONFIRMED', label: 'Confirmed (Ready to Assign)', color: 'border-sky-500', nextLabel: 'Dispatch' },
    { status: 'ASSIGNED', label: 'Assigned / In Transit', color: 'border-indigo-500', nextLabel: 'Start Work' },
    { status: 'IN_PROGRESS', label: 'Work In Progress', color: 'border-blue-500', nextLabel: 'Submit Evidence' },
    { status: 'PENDING_APPROVAL', label: 'Supervisor Review', color: 'border-purple-500', nextLabel: 'Approve & Close' },
    { status: 'CLOSED', label: 'Closed & Verified', color: 'border-emerald-500', nextLabel: 'Verified' },
  ];

  const handleNavigateToMap = (inc: IncidentRecord) => {
    setSelectedIncidentId(inc.id);
    setCommandSubTab('MAP');
  };

  const handleOpenCCTV = (cameraId: string) => {
    setSelectedCameraId(cameraId);
  };

  const handleExecuteReassign = () => {
    if (!reassigningIncident) return;
    reassignIncident(reassigningIncident.id, chosenResponderId, reassignReason);
    setReassigningIncident(null);
  };

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

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="CLOSED">Closed</option>
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

      {/* View Mode: TABLE (Resolves User Requests 2, 6, 7) */}
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
                    onClick={() => setInspectingIncident(inc)}
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
                        inc.status === 'PENDING_APPROVAL' ? 'bg-purple-100 text-purple-800 font-bold animate-pulse' :
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
                    
                    {/* UI-Friendly Interactive Quick Actions (User Request 2) */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {inc.status === 'PENDING_VERIFICATION' && (
                          <>
                            <button
                              onClick={() => confirmIncident(inc.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                              title="Verify and confirm incident"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => deescalateIncident(inc.id, 'Operator marked false alarm')}
                              className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition"
                              title="De-escalate / Dismiss"
                            >
                              De-escalate
                            </button>
                          </>
                        )}

                        {inc.status === 'CONFIRMED' && (
                          <>
                            <button
                              onClick={() => setReassigningIncident(inc)}
                              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow-sm flex items-center gap-1"
                              title="Dispatch a field responder"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Dispatch</span>
                            </button>
                            <button
                              onClick={() => deescalateIncident(inc.id, 'Operator dismissed prior to dispatch')}
                              className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition"
                              title="De-escalate"
                            >
                              De-escalate
                            </button>
                          </>
                        )}

                        {(inc.status === 'ASSIGNED' || inc.status === 'IN_PROGRESS' || inc.status === 'ACCEPTED') && (
                          <>
                            <button
                              onClick={() => setReassigningIncident(inc)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition"
                              title="Reassign to another responder"
                            >
                              Reassign
                            </button>
                            <button
                              onClick={() => deescalateIncident(inc.id, 'Downgraded by supervisor')}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs transition"
                              title="De-escalate"
                            >
                              De-escalate
                            </button>
                          </>
                        )}

                        {inc.status === 'PENDING_APPROVAL' && (
                          <button
                            onClick={() => approveResolution(inc.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow flex items-center gap-1"
                            title="Approve evidence and close"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {/* Interactive Eye Button that navigates to detail modal (Resolves User Request 6) */}
                        <button
                          onClick={() => setInspectingIncident(inc)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                          title="Inspect Details & Evidence"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Inspect</span>
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View Mode: KANBAN BOARD (Resolves User Request 3) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colIncidents = filteredIncidents.filter(i => i.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col min-w-[230px]"
              >
                <div className={`flex items-center justify-between pb-2 mb-2 border-b-2 ${col.color}`}>
                  <span className="font-bold text-xs text-slate-800 truncate">{col.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                    {colIncidents.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[580px]">
                  {colIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-slate-900">{inc.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            inc.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {inc.priority}
                          </span>
                        </div>
                        <div className="font-bold text-slate-800 text-xs mt-1">{inc.categoryLabel}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{inc.locationName}</div>

                        {inc.assignedResponderName && (
                          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                            <span className="text-slate-400">Assigned:</span>
                            <span className="font-semibold text-slate-800">{inc.assignedResponderName}</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Navigation & Action Bar on Kanban Card */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        
                        {/* Navigation Row */}
                        <div className="grid grid-cols-3 gap-1 text-[10px]">
                          <button
                            onClick={() => handleNavigateToMap(inc)}
                            className="py-1 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 font-semibold flex items-center justify-center gap-0.5 transition"
                            title="Navigate to Map"
                          >
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>Map</span>
                          </button>
                          <button
                            onClick={() => handleOpenCCTV(inc.cameraId)}
                            className="py-1 rounded bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 font-semibold flex items-center justify-center gap-0.5 transition"
                            title="Open Camera Stream"
                          >
                            <Video className="w-3 h-3 text-sky-600" />
                            <span>CCTV</span>
                          </button>
                          <button
                            onClick={() => setInspectingIncident(inc)}
                            className="py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center justify-center gap-0.5 transition"
                            title="Inspect Details"
                          >
                            <Eye className="w-3 h-3 text-emerald-400" />
                            <span>View</span>
                          </button>
                        </div>

                        {/* Stage Progression Action Button */}
                        {inc.status === 'PENDING_VERIFICATION' && (
                          <button
                            onClick={() => confirmIncident(inc.id)}
                            className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow-sm flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Verify & Confirm</span>
                          </button>
                        )}

                        {inc.status === 'CONFIRMED' && (
                          <button
                            onClick={() => setReassigningIncident(inc)}
                            className="w-full py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] transition shadow-sm flex items-center justify-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Dispatch Team</span>
                          </button>
                        )}

                        {(inc.status === 'ASSIGNED' || inc.status === 'IN_PROGRESS') && (
                          <div className="grid grid-cols-2 gap-1">
                            <button
                              onClick={() => setReassigningIncident(inc)}
                              className="py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] transition"
                            >
                              Reassign
                            </button>
                            <button
                              onClick={() => deescalateIncident(inc.id)}
                              className="py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] transition"
                            >
                              De-escalate
                            </button>
                          </div>
                        )}

                        {inc.status === 'PENDING_APPROVAL' && (
                          <button
                            onClick={() => approveResolution(inc.id)}
                            className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition shadow-sm flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve Resolution</span>
                          </button>
                        )}

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. INTERACTIVE INCIDENT INSPECTION DRAWER (Resolves User Requests 2, 6, 7) */}
      {/* ========================================================================= */}
      {inspectingIncident && (
        <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-base font-bold text-emerald-400">{inspectingIncident.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    inspectingIncident.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    inspectingIncident.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {inspectingIncident.priority} PRIORITY
                  </span>
                </div>
                <button
                  onClick={() => setInspectingIncident(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Location */}
              <div>
                <h3 className="text-base font-bold text-slate-100">{inspectingIncident.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{inspectingIncident.locationName}</span>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  {inspectingIncident.description}
                </p>
              </div>

              {/* Status Stepper */}
              <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                  Lifecycle Phase: <strong className="text-emerald-400">{inspectingIncident.status}</strong>
                </span>
                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">1. Detected</span>
                  <span>→</span>
                  <span className={`px-2 py-0.5 rounded ${inspectingIncident.status !== 'PENDING_VERIFICATION' ? 'bg-emerald-950 text-emerald-400 font-bold' : 'bg-slate-800 text-slate-500'}`}>2. Verified</span>
                  <span>→</span>
                  <span className={`px-2 py-0.5 rounded ${inspectingIncident.assignedResponderName ? 'bg-emerald-950 text-emerald-400 font-bold' : 'bg-slate-800 text-slate-500'}`}>3. Dispatched</span>
                  <span>→</span>
                  <span className={`px-2 py-0.5 rounded ${inspectingIncident.status === 'CLOSED' ? 'bg-emerald-950 text-emerald-400 font-bold' : 'bg-slate-800 text-slate-500'}`}>4. Closed</span>
                </div>
              </div>

              {/* Photographic Evidence: Before & After (Resolves User Request 4) */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                  Photographic Evidence Record
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 block mb-1">AI CCTV Detection Snapshot:</span>
                    <div className="rounded-xl overflow-hidden border border-slate-800 aspect-video bg-black relative">
                      <img
                        src={inspectingIncident.beforeEvidenceUrl}
                        alt="Before Cleanup"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-amber-300">
                        BEFORE
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 block mb-1">Field Resolution Photo:</span>
                    <div className="rounded-xl overflow-hidden border border-slate-800 aspect-video bg-black relative flex items-center justify-center">
                      {inspectingIncident.afterEvidenceUrl ? (
                        <>
                          <img
                            src={inspectingIncident.afterEvidenceUrl}
                            alt="After Cleanup"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 bg-emerald-950/90 text-emerald-300 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold">
                            AFTER (VERIFIED)
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic p-2 text-center">
                          Awaiting field upload
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Responder Card */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Assigned Unit:</span>
                  <div className="font-bold text-slate-100 text-sm mt-0.5">
                    {inspectingIncident.assignedResponderName || 'Unassigned (Awaiting Dispatch)'}
                  </div>
                  <div className="text-[11px] text-slate-400">Department: {inspectingIncident.assignedDepartment}</div>
                </div>
                <button
                  onClick={() => {
                    setReassigningIncident(inspectingIncident);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-bold hover:bg-indigo-900 transition text-xs"
                >
                  Change / Reassign
                </button>
              </div>

            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="pt-4 border-t border-slate-800 space-y-2 mt-4">
              
              {/* Navigation row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    handleNavigateToMap(inspectingIncident);
                    setInspectingIncident(null);
                  }}
                  className="py-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700/50 font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-900 transition"
                >
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>View on Live Map</span>
                </button>
                <button
                  onClick={() => {
                    handleOpenCCTV(inspectingIncident.cameraId);
                    setInspectingIncident(null);
                  }}
                  className="py-2 rounded-xl bg-sky-950 text-sky-300 border border-sky-700/50 font-bold flex items-center justify-center gap-1.5 hover:bg-sky-900 transition"
                >
                  <Video className="w-4 h-4 text-sky-400" />
                  <span>Open CCTV Stream</span>
                </button>
              </div>

              {/* Status Actions */}
              {inspectingIncident.status === 'PENDING_VERIFICATION' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      confirmIncident(inspectingIncident.id);
                      setInspectingIncident(null);
                    }}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Event</span>
                  </button>
                  <button
                    onClick={() => {
                      deescalateIncident(inspectingIncident.id, 'Marked false alarm by operator');
                      setInspectingIncident(null);
                    }}
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                  >
                    De-escalate / Reject
                  </button>
                </div>
              )}

              {inspectingIncident.status === 'PENDING_APPROVAL' && (
                <button
                  onClick={() => {
                    approveResolution(inspectingIncident.id);
                    setInspectingIncident(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Resolution & Close</span>
                </button>
              )}

              {inspectingIncident.status !== 'CLOSED' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      deescalateIncident(inspectingIncident.id, 'Hazard downgraded by operator');
                      setInspectingIncident(null);
                    }}
                    className="flex-1 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 font-semibold text-xs transition"
                  >
                    De-escalate
                  </button>
                  <button
                    onClick={() => openContactModal("01307726701")}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Buzz Phone</span>
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE MULTI-RESPONDER REASSIGN MODAL (Resolves User Request 4)   */}
      {/* ========================================================================= */}
      {reassigningIncident && (
        <div className="fixed inset-0 z-[600] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden text-white shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm">Assign / Reassign Responder</span>
              </div>
              <button
                onClick={() => setReassigningIncident(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300">
              Target Incident: <strong className="text-emerald-400 font-mono">{reassigningIncident.id}</strong> — {reassigningIncident.categoryLabel} ({reassigningIncident.locationName})
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                Select Field Responder (5 Active Units):
              </label>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {fieldResponders.map((resp) => (
                  <div
                    key={resp.id}
                    onClick={() => setChosenResponderId(resp.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      chosenResponderId === resp.id
                        ? 'bg-emerald-950/80 border-emerald-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={resp.avatar}
                        alt={resp.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                          <span>{resp.name}</span>
                          {chosenResponderId === resp.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{resp.roleTitle} • {resp.team}</div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">📱 {resp.phone}</div>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      {resp.status || 'AVAILABLE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-slate-400 block">
                Dispatch / Reassignment Directive Note:
              </label>
              <input
                type="text"
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="Operational priority / workload balance instructions..."
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setReassigningIncident(null)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReassign}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
              >
                Confirm Assignment
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
