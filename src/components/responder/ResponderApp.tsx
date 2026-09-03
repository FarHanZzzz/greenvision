import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Camera, 
  Upload, 
  ArrowRight, 
  Play, 
  Check, 
  FileText,
  Navigation,
  Compass,
  Sparkles,
  PhoneCall,
  Smartphone
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';
import { EVIDENCE_IMAGES } from '../../data/mockData';

export const ResponderApp: React.FC = () => {
  const incidents = useGreenVisionStore((s) => s.incidents);
  const users = useGreenVisionStore((s) => s.users);
  const acceptTask = useGreenVisionStore((s) => s.acceptTask);
  const startWork = useGreenVisionStore((s) => s.startWork);
  const resolveTask = useGreenVisionStore((s) => s.resolveTask);
  const openContactModal = useGreenVisionStore((s) => s.openContactModal);

  // Default field responder persona: Rahim Uddin (Cleaning Team B, 01307726701)
  const rahimUser = users.find(u => u.id === 'usr-resp-1') || {
    id: "usr-resp-1",
    name: "Rahim Uddin",
    role: "FIELD_RESPONDER" as const,
    roleTitle: "Lead Sanitarian Responder",
    team: "Cleaning Team B",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    phone: "01307726701",
    email: "rahim.field@uiu.ac.bd",
    completedTasksToday: 4
  };

  // Filter tasks for Rahim / active triage queue (Resolves User Request 9)
  const myTasks = incidents.filter(i => 
    i.assignedResponderId === 'usr-resp-1' || 
    i.status === 'ASSIGNED' || 
    i.status === 'CONFIRMED' || 
    i.id === 'GV-1042' || 
    i.id === 'GV-1039' || 
    i.id === 'GV-1035'
  );

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedEvidencePreset, setSelectedEvidencePreset] = useState<'wasteAfter' | 'binAfter' | 'waterAfter'>('wasteAfter');
  const [responderNote, setResponderNote] = useState('Area swept, bagged, and sanitized with bio-spray disinfectant.');
  const [showNavigationModal, setShowNavigationModal] = useState(false);

  // Active task: user selected, or first open task, or fallback to first
  const currentTask = (selectedTaskId ? myTasks.find(t => t.id === selectedTaskId) : null) || 
    myTasks.find(t => t.status !== 'CLOSED') || 
    myTasks[0];

  return (
    <div className="w-full max-w-[390px] mx-auto bg-slate-950 text-white rounded-[2.5rem] shadow-2xl border-[6px] border-slate-800 flex flex-col justify-between overflow-hidden relative max-h-[calc(100vh-210px)] h-[550px] font-sans">
      
      {/* Smartphone Speaker Ear-piece & Camera Notch */}
      <div className="bg-slate-950 px-6 pt-2 pb-2 border-b border-slate-800 shrink-0">
        <div className="w-20 h-3.5 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-800 mr-2"></div>
          <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
        </div>

        <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
          <span className="font-bold text-slate-200">GV Responder v1.0</span>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
            GPS: UIU DHAKA
          </span>
        </div>

        {/* Worker Persona Header */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={rahimUser.avatar}
              alt={rahimUser.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500 shadow"
            />
            <div>
              <div className="font-bold text-xs text-slate-100">{rahimUser.name}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">{rahimUser.team} • 01307726701</div>
            </div>
          </div>

          <button
            onClick={() => openContactModal("01307726701")}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center gap-1 text-[10px] font-bold border border-slate-700"
            title="Buzz Mobile 01307726701"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Buzz</span>
          </button>
        </div>
      </div>

      {/* Task Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/70 text-xs shrink-0">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`flex-1 py-2 font-bold transition text-center border-b-2 text-[11px] ${
            activeTab === 'ACTIVE' ? 'border-emerald-500 text-emerald-400 bg-slate-800/40' : 'border-transparent text-slate-400'
          }`}
        >
          My Tasks ({myTasks.filter(t => t.status !== 'CLOSED').length})
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`flex-1 py-2 font-bold transition text-center border-b-2 text-[11px] ${
            activeTab === 'HISTORY' ? 'border-emerald-500 text-emerald-400 bg-slate-800/40' : 'border-transparent text-slate-400'
          }`}
        >
          Performance
        </button>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {activeTab === 'ACTIVE' && (
          <div className="space-y-2.5">
            
            {/* Multi-Task Selector Bar (Resolves User Request 9) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {myTasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap transition flex items-center gap-1 shrink-0 ${
                    currentTask?.id === t.id
                      ? 'bg-emerald-600 text-white shadow'
                      : t.status === 'CLOSED'
                      ? 'bg-slate-900 text-slate-500 border border-slate-800'
                      : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span>{t.id}</span>
                  {t.status === 'CLOSED' ? (
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  ) : t.status === 'PENDING_APPROVAL' ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              ))}
            </div>

            {currentTask ? (
              <div className="space-y-3">
                
                {/* Task Header Box */}
                <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400">{currentTask.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      currentTask.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      currentTask.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                    {currentTask.priority} PRIORITY
                  </span>
                </div>

                <h3 className="font-bold text-xs text-slate-100 mt-1">{currentTask.title}</h3>
                
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate max-w-[170px]">{currentTask.locationName}</span>
                  </div>
                  
                  <button
                    onClick={() => setShowNavigationModal(true)}
                    className="text-sky-400 hover:text-sky-300 font-mono text-[10px] font-bold flex items-center gap-1 bg-sky-950/70 px-2 py-0.5 rounded border border-sky-800/60"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Route</span>
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Status Phase:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800">
                    {currentTask.status}
                  </span>
                </div>
              </div>

              {/* Real Photographic Before Evidence */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  Incident Photo (AI Camera Snapshot):
                </span>
                <div className="mt-1 relative rounded-xl overflow-hidden border border-slate-800 shadow">
                  <img
                    src={currentTask.beforeEvidenceUrl}
                    alt="Before Work"
                    className="w-full h-28 object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-slate-950/85 text-[8px] font-mono text-emerald-300 px-1.5 py-0.5 rounded">
                    CCTV GV-CAM-004 SNAPSHOT
                  </span>
                </div>
              </div>

              {/* Step Actions */}
              <div className="space-y-2 pt-1">
                
                {/* 1. ACCEPT DISPATCH */}
                {(currentTask.status === 'ASSIGNED' || currentTask.status === 'CONFIRMED') && (
                  <button
                    onClick={() => acceptTask(currentTask.id)}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>ACCEPT TASK & START TRAVEL</span>
                  </button>
                )}

                {/* 2. ARRIVED & START CLEANUP */}
                {currentTask.status === 'ACCEPTED' && (
                  <button
                    onClick={() => startWork(currentTask.id)}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>ARRIVED AT SITE — START CLEANUP</span>
                  </button>
                )}

                {/* 3. ATTACH AFTER PHOTO & RESOLVE */}
                {currentTask.status === 'IN_PROGRESS' && (
                  <div className="space-y-2.5 bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">Attach Cleaned Photo:</span>
                      <span className="text-emerald-400 text-[10px] font-mono">READY</span>
                    </div>

                    {/* Photo preset selector */}
                    <div className="grid grid-cols-3 gap-1 text-[9px] font-mono">
                      <button
                        onClick={() => setSelectedEvidencePreset('wasteAfter')}
                        className={`p-1 rounded border text-center transition ${
                          selectedEvidencePreset === 'wasteAfter' ? 'bg-emerald-600 text-white border-emerald-500 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        Sidewalk Clean
                      </button>
                      <button
                        onClick={() => setSelectedEvidencePreset('binAfter')}
                        className={`p-1 rounded border text-center transition ${
                          selectedEvidencePreset === 'binAfter' ? 'bg-emerald-600 text-white border-emerald-500 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        Bin Emptied
                      </button>
                      <button
                        onClick={() => setSelectedEvidencePreset('waterAfter')}
                        className={`p-1 rounded border text-center transition ${
                          selectedEvidencePreset === 'waterAfter' ? 'bg-emerald-600 text-white border-emerald-500 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        Drain Cleared
                      </button>
                    </div>

                    {/* Photo preview */}
                    <div className="relative rounded-xl overflow-hidden border border-emerald-500/50 shadow">
                      <img
                        src={EVIDENCE_IMAGES[selectedEvidencePreset]}
                        alt="After Cleaned"
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>ATTACHED</span>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={responderNote}
                      onChange={(e) => setResponderNote(e.target.value)}
                      placeholder="Add field notes for supervisor..."
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                    />

                    <button
                      onClick={() => resolveTask(currentTask.id, EVIDENCE_IMAGES[selectedEvidencePreset], responderNote)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>MARK RESOLVED (SUBMIT EVIDENCE)</span>
                    </button>
                  </div>
                )}

                {/* 4. PENDING SUPERVISOR VERIFICATION */}
                {currentTask.status === 'PENDING_APPROVAL' && (
                  <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/60 text-center space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 mx-auto" />
                    <div className="font-bold text-xs text-purple-200">Awaiting Supervisor Verification</div>
                    <p className="text-[10px] text-purple-300">Resolution photo uploaded. Supervisor is cross-checking live CCTV feed.</p>
                  </div>
                )}

                {/* 5. CLOSED */}
                {currentTask.status === 'CLOSED' && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-700/60 text-center space-y-2 shadow-lg">
                    <Sparkles className="w-5 h-5 text-emerald-400 mx-auto" />
                    <div>
                      <div className="font-extrabold text-xs text-emerald-200 uppercase tracking-wide">
                        Task Verified & Closed!
                      </div>
                      <p className="text-[10px] text-emerald-300 mt-0.5">
                        Supervisor approved resolution. UIU Green Score incremented (+2 pts).
                      </p>
                    </div>

                    {myTasks.some(t => t.id !== currentTask.id && t.status !== 'CLOSED') && (
                      <button
                        onClick={() => {
                          const nextTask = myTasks.find(t => t.id !== currentTask.id && t.status !== 'CLOSED');
                          if (nextTask) setSelectedTaskId(nextTask.id);
                        }}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                      >
                        <span>Start Next Assigned Task</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              No active tasks assigned to your roster.
            </div>
          )}
        </div>
      )}

        {/* History Tab */}
        {activeTab === 'HISTORY' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-mono">Tasks Today</span>
                <div className="text-xl font-black text-emerald-400 mt-0.5">4</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-mono">Avg Turnaround</span>
                <div className="text-xl font-black text-sky-400 mt-0.5">14m</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Recent Approvals:</span>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200 text-xs">UIU Block A Crates</div>
                  <div className="text-[9px] text-slate-400">Approved by Kamal Hossain</div>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-[10px]">+15 pts</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Modal */}
      {showNavigationModal && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 p-4 flex flex-col justify-between text-xs">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="font-bold text-sm">UIU Campus Navigation</span>
              </div>
              <button
                onClick={() => setShowNavigationModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                Close
              </button>
            </div>

            <div className="mt-3 bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold">Directions to {currentTask?.locationName}:</div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                <li>Exit Central Waste Depot along rear service path.</li>
                <li>Turn North past UIU Academic Complex Engineering foyer.</li>
                <li>Reach Gate 2 perimeter archway along Madani Avenue.</li>
                <li>Target spillage is located on sidewalk pavers beside vendor stalls.</li>
              </ol>
            </div>
          </div>

          <button
            onClick={() => setShowNavigationModal(false)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 font-bold text-xs shadow-md"
          >
            Got It
          </button>
        </div>
      )}

      {/* Bottom Phone Bar */}
      <div className="p-2 bg-slate-950 border-t border-slate-900 flex items-center justify-center shrink-0">
        <div className="w-20 h-1 bg-slate-700 rounded-full"></div>
      </div>

    </div>
  );
};
