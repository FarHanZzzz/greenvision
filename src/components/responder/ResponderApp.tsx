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
  Sparkles
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';
import { EVIDENCE_IMAGES } from '../../data/mockData';

export const ResponderApp: React.FC = () => {
  const incidents = useGreenVisionStore((s) => s.incidents);
  const activeUser = useGreenVisionStore((s) => s.activeUser);
  const acceptTask = useGreenVisionStore((s) => s.acceptTask);
  const startWork = useGreenVisionStore((s) => s.startWork);
  const resolveTask = useGreenVisionStore((s) => s.resolveTask);

  // Default to Rahim's tasks or show first active
  const myTasks = incidents.filter(i => 
    i.assignedResponderId === activeUser.id || 
    i.assignedResponderId === "usr-resp-1" ||
    i.id === "GV-1042" || 
    i.id === "GV-1039"
  );

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [responderNote, setResponderNote] = useState('Area thoroughly cleared, bagged, and sanitized with bio-spray.');

  const currentTask = myTasks[selectedTaskIndex] || myTasks[0];

  return (
    <div className="max-w-md mx-auto bg-slate-900 text-white min-h-[640px] rounded-3xl shadow-2xl border-4 border-slate-800 flex flex-col justify-between overflow-hidden">
      
      {/* Smartphone Top Notch & Header */}
      <div>
        <div className="bg-slate-950 px-5 pt-3 pb-3 border-b border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="font-bold text-white">GV Field App</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
              GPS ONLINE
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <div className="font-bold text-sm text-slate-100">{activeUser.name}</div>
                <div className="text-[11px] text-emerald-400 font-medium">{activeUser.team || "Cleaning Team B"}</div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Today</span>
              <div className="text-xs font-bold text-emerald-400">{activeUser.completedTasksToday || 4} Done</div>
            </div>
          </div>
        </div>

        {/* Task Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`flex-1 py-2.5 font-bold transition text-center border-b-2 ${
              activeTab === 'ACTIVE' ? 'border-emerald-500 text-emerald-400 bg-slate-800/40' : 'border-transparent text-slate-400'
            }`}
          >
            Assigned Tasks ({myTasks.filter(t => t.status !== 'CLOSED').length})
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`flex-1 py-2.5 font-bold transition text-center border-b-2 ${
              activeTab === 'HISTORY' ? 'border-emerald-500 text-emerald-400 bg-slate-800/40' : 'border-transparent text-slate-400'
            }`}
          >
            History & Stats
          </button>
        </div>

        {/* ACTIVE TASK BODY (PRD Section 29 & 30) */}
        {activeTab === 'ACTIVE' && (
          <div className="p-4 space-y-4">
            {currentTask ? (
              <div className="space-y-4">
                
                {/* Task Card Header */}
                <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400">{currentTask.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      currentTask.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      currentTask.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {currentTask.priority} PRIORITY
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 mt-1.5">{currentTask.title}</h3>
                  
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{currentTask.locationName}</span>
                    <span className="text-emerald-400 font-mono font-semibold ml-auto">~180m away</span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Current Phase:</span>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      {currentTask.status}
                    </span>
                  </div>
                </div>

                {/* Before Evidence Photo */}
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Incident AI Snapshot:</span>
                  <div className="mt-1 relative rounded-xl overflow-hidden border border-slate-700">
                    <img
                      src={currentTask.beforeEvidenceUrl}
                      alt="Before Work"
                      className="w-full h-36 object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-slate-950/80 text-[9px] font-mono text-slate-300 px-1.5 py-0.5 rounded">
                      CCTV DETECTION EVIDENCE
                    </span>
                  </div>
                </div>

                {/* Work Execution Action Progression */}
                <div className="space-y-2 pt-2">
                  
                  {/* Step 1: ACCEPT TASK */}
                  {currentTask.status === 'ASSIGNED' && (
                    <button
                      onClick={() => acceptTask(currentTask.id)}
                      className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>ACCEPT DISPATCH & NAVIGATE</span>
                    </button>
                  )}

                  {/* Step 2: START WORK */}
                  {currentTask.status === 'ACCEPTED' && (
                    <button
                      onClick={() => startWork(currentTask.id)}
                      className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>ARRIVED AT SITE — START CLEANUP</span>
                    </button>
                  )}

                  {/* Step 3: SUBMIT PHOTO & MARK RESOLVED */}
                  {currentTask.status === 'IN_PROGRESS' && (
                    <div className="space-y-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">Completion Evidence:</span>
                        <span className="text-emerald-400 text-[10px] font-mono">CAMERA READY</span>
                      </div>

                      {/* Photo preview */}
                      <div className="relative rounded-lg overflow-hidden border border-emerald-500/50">
                        <img
                          src={EVIDENCE_IMAGES.wasteAfter}
                          alt="After"
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PHOTO ATTACHED</span>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={responderNote}
                        onChange={(e) => setResponderNote(e.target.value)}
                        placeholder="Add responder field note..."
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />

                      <button
                        onClick={() => resolveTask(currentTask.id, EVIDENCE_IMAGES.wasteAfter, responderNote)}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>MARK RESOLVED (SUBMIT TO SUPERVISOR)</span>
                      </button>
                    </div>
                  )}

                  {/* Step 4: AWAITING SUPERVISOR APPROVAL */}
                  {currentTask.status === 'PENDING_APPROVAL' && (
                    <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-800/60 text-center space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto" />
                      <div className="font-bold text-xs text-purple-200">Awaiting Supervisor Verification</div>
                      <p className="text-[11px] text-purple-300">Resolution photo submitted. Kamal Hossain is reviewing CCTV feed.</p>
                    </div>
                  )}

                  {/* Step 5: CLOSED */}
                  {currentTask.status === 'CLOSED' && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-center space-y-1">
                      <Sparkles className="w-6 h-6 text-emerald-400 mx-auto" />
                      <div className="font-bold text-xs text-emerald-200">Incident Fully Verified & Closed!</div>
                      <p className="text-[11px] text-emerald-300">Great work! Green Score updated across campus.</p>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                No active tasks in your queue right now.
              </div>
            )}
          </div>
        )}

        {/* HISTORY & STATS TAB */}
        {activeTab === 'HISTORY' && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Tasks Today</span>
                <div className="text-2xl font-black text-emerald-400 mt-0.5">4</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Avg Fix Time</span>
                <div className="text-2xl font-black text-sky-400 mt-0.5">14m</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Recent Completions</span>
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">GV-1031: Block A Packaging</div>
                  <div className="text-[10px] text-slate-400">Resolved in 18 mins • Approved</div>
                </div>
                <span className="text-emerald-400 font-bold font-mono">+10 pts</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Smartphone Bottom Home Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-center">
        <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
      </div>

    </div>
  );
};
