import React, { useState } from 'react';
import { 
  CheckSquare, 
  ShieldAlert, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  AlertTriangle, 
  Camera, 
  Send,
  Eye,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';
import { IncidentRecord, IncidentPriority } from '../../types';

export const OperationsDashboard: React.FC = () => {
  const incidents = useGreenVisionStore((s) => s.incidents);
  const users = useGreenVisionStore((s) => s.users);
  const activeUser = useGreenVisionStore((s) => s.activeUser);
  const confirmIncident = useGreenVisionStore((s) => s.confirmIncident);
  const rejectIncident = useGreenVisionStore((s) => s.rejectIncident);
  const assignIncident = useGreenVisionStore((s) => s.assignIncident);
  const approveResolution = useGreenVisionStore((s) => s.approveResolution);
  const reopenIncident = useGreenVisionStore((s) => s.reopenIncident);
  const setSelectedIncidentId = useGreenVisionStore((s) => s.setSelectedIncidentId);

  const [opsTab, setOpsTab] = useState<'ACTION_QUEUE' | 'AI_VERIFY' | 'DISPATCH' | 'APPROVAL'>('ACTION_QUEUE');

  // Filter queues
  const pendingVerification = incidents.filter(i => i.status === 'PENDING_VERIFICATION');
  const readyToAssign = incidents.filter(i => i.status === 'CONFIRMED' && !i.assignedResponderId);
  const pendingApproval = incidents.filter(i => i.status === 'PENDING_APPROVAL');
  const inProgress = incidents.filter(i => i.status === 'IN_PROGRESS' || i.status === 'ACCEPTED');

  // Available responders for dispatch
  const availableResponders = users.filter(u => u.role === 'FIELD_RESPONDER');

  return (
    <div className="space-y-6">
      
      {/* Operations Room Top Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black tracking-tight">OPERATIONS & CONTROL ROOM</h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              DISPATCH CONSOLE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active Shift Supervisor: <span className="text-slate-200 font-semibold">{activeUser.name}</span> • Triage, Verify, Dispatch, and Approve Work
          </p>
        </div>

        {/* Operational Queues Navigation Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          
          <button
            onClick={() => setOpsTab('ACTION_QUEUE')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              opsTab === 'ACTION_QUEUE' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Action Queue</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 font-mono">
              {incidents.filter(i => i.status !== 'CLOSED').length}
            </span>
          </button>

          <button
            onClick={() => setOpsTab('AI_VERIFY')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              opsTab === 'AI_VERIFY' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Verification</span>
            {pendingVerification.length > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-red-500 text-white font-bold animate-pulse font-mono">
                {pendingVerification.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setOpsTab('DISPATCH')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              opsTab === 'DISPATCH' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Dispatch</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
              {readyToAssign.length}
            </span>
          </button>

          <button
            onClick={() => setOpsTab('APPROVAL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              opsTab === 'APPROVAL' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Resolution Approval</span>
            {pendingApproval.length > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold font-mono">
                {pendingApproval.length}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* 1. ACTION QUEUE VIEW (PRD Section 25) */}
      {opsTab === 'ACTION_QUEUE' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Priority Triage Queue</h3>
              <p className="text-xs text-slate-500">Live operational incidents requiring human decision or monitoring</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Sorted by urgency & SLA</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID & Category</th>
                  <th className="py-3 px-4">Location & Camera</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Responder</th>
                  <th className="py-3 px-4">SLA Time</th>
                  <th className="py-3 px-4 text-right">Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incidents.filter(i => i.status !== 'CLOSED' && i.status !== 'FALSE_DETECTION').map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{inc.id}</div>
                      <div className="font-semibold text-slate-800 text-xs">{inc.categoryLabel}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{inc.locationName}</div>
                      <div className="text-[11px] text-slate-400">{inc.cameraName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        inc.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {inc.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {inc.assignedResponderName ? (
                        <div className="font-semibold text-slate-800">{inc.assignedResponderName}</div>
                      ) : (
                        <span className="text-red-500 font-semibold text-[11px] italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-700 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inc.slaMinutes}m SLA</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {inc.status === 'PENDING_VERIFICATION' ? (
                        <button
                          onClick={() => confirmIncident(inc.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
                        >
                          Verify AI
                        </button>
                      ) : inc.status === 'CONFIRMED' ? (
                        <button
                          onClick={() => assignIncident(inc.id, "usr-resp-1", "usr-sup-1")}
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition"
                        >
                          Dispatch Team
                        </button>
                      ) : inc.status === 'PENDING_APPROVAL' ? (
                        <button
                          onClick={() => approveResolution(inc.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
                        >
                          Review Evidence
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedIncidentId(inc.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                        >
                          Track Work
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. AI VERIFICATION STUDIO (PRD Section 26) */}
      {opsTab === 'AI_VERIFY' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>
                <strong>Human-in-the-Loop Protocol:</strong> AI detections must be verified by a control room operator before field response teams are mobilized.
              </span>
            </div>
            <span className="font-mono font-bold text-amber-800">{pendingVerification.length} In Queue</span>
          </div>

          {pendingVerification.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800">All AI detections have been triaged!</h4>
              <p className="text-xs text-slate-500 mt-1">No pending detections in queue right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingVerification.map((inc) => (
                <div key={inc.id} className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">{inc.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                          {inc.priority} PRIORITY
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{inc.locationName} • {inc.cameraName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-mono">CONFIDENCE</span>
                      <div className="text-sm font-black text-emerald-600">{Math.round(inc.aiConfidence * 100)}%</div>
                    </div>
                  </div>

                  {/* Visual Evidence Snapshot */}
                  <div className="p-4">
                    <div className="relative rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={inc.beforeEvidenceUrl}
                        alt="Detection Snapshot"
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-mono">
                        CCTV FEED SNAPSHOT
                      </div>
                    </div>

                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-700">Classification: </span>
                      <span className="text-slate-900 font-bold">{inc.categoryLabel}</span>
                      <p className="text-slate-500 mt-1">{inc.description}</p>
                    </div>

                    {/* Decision Buttons (PRD Section 26) */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => confirmIncident(inc.id, inc.priority, 'Confirmed by Operator via CCTV feed')}
                        className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                      >
                        <Check className="w-4 h-4" />
                        <span>CONFIRM INCIDENT</span>
                      </button>

                      <button
                        onClick={() => rejectIncident(inc.id, 'Artifact shadow / normal student activity')}
                        className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition"
                      >
                        <XCircle className="w-4 h-4 text-slate-400" />
                        <span>FALSE ALARM</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. TEAM DISPATCH HUB (PRD Section 28) */}
      {opsTab === 'DISPATCH' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Incidents Ready to Dispatch */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Incidents Awaiting Team Dispatch</h3>
            
            {readyToAssign.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                All confirmed incidents currently have dispatched field responders.
              </div>
            ) : (
              readyToAssign.map((inc) => (
                <div key={inc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{inc.id}</span>
                      <span className="text-xs font-bold text-slate-800">{inc.categoryLabel}</span>
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">{inc.priority}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{inc.locationName} • Routing: <strong className="text-emerald-700">{inc.assignedDepartment}</strong></div>
                  </div>

                  {/* Dispatch Button */}
                  <button
                    onClick={() => assignIncident(inc.id, "usr-resp-1", "usr-sup-1")}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Rahim (Team B)</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Right Col: Team Roster & Live Status */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">Field Responders Status</h3>
            
            <div className="space-y-2">
              {availableResponders.map((resp) => (
                <div key={resp.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={resp.avatar} alt={resp.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-slate-800">{resp.name}</div>
                      <div className="text-[10px] text-slate-500">{resp.team}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    resp.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {resp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. RESOLUTION VERIFICATION & APPROVAL (PRD Section 31 & 32) */}
      {opsTab === 'APPROVAL' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>Supervisor Quality Gate:</strong> Review the field responder's "After" photograph against the initial AI detection before closing the incident and updating the Green Score.
              </span>
            </div>
            <span className="font-mono font-bold text-emerald-800">{pendingApproval.length} Pending Approval</span>
          </div>

          {pendingApproval.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800">No resolutions pending review</h4>
              <p className="text-xs text-slate-500 mt-1">All completed tasks have been verified by shift supervisors.</p>
            </div>
          ) : (
            pendingApproval.map((inc) => (
              <div key={inc.id} className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{inc.id}</span>
                    <h4 className="font-bold text-slate-800 text-sm mt-0.5">{inc.title}</h4>
                    <p className="text-xs text-slate-500">{inc.locationName} • Resolved by <strong className="text-slate-700">{inc.assignedResponderName}</strong></p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-xs">
                    AWAITING APPROVAL
                  </span>
                </div>

                {/* Side-by-Side Before / After Evidence (PRD Section 31) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>BEFORE: Optical Detection</span>
                      <span className="text-[10px] font-mono text-red-600 font-semibold">CCTV {inc.cameraId}</span>
                    </div>
                    <img
                      src={inc.beforeEvidenceUrl}
                      alt="Before"
                      className="w-full h-56 object-cover rounded-xl border border-red-200 shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>AFTER: Field Responder Resolution</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-semibold">MOBILE UPLOAD</span>
                    </div>
                    <img
                      src={inc.afterEvidenceUrl || inc.beforeEvidenceUrl}
                      alt="After"
                      className="w-full h-56 object-cover rounded-xl border border-emerald-300 shadow-sm"
                    />
                  </div>
                </div>

                {/* Responder Notes */}
                {inc.responderNotes && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                    <strong>Responder Field Note: </strong> {inc.responderNotes}
                  </div>
                )}

                {/* Supervisor Approval Actions (PRD Section 32) */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    onClick={() => reopenIncident(inc.id, 'Debris still visible near north curb. Please re-sweep.')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reopen Incident</span>
                  </button>

                  <button
                    onClick={() => approveResolution(inc.id, 'CCTV confirmed spotless resolution. Approved.')}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>APPROVE & CLOSE INCIDENT</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
