import React from 'react';
import { 
  HelpCircle, 
  X, 
  MapPin, 
  Video, 
  CheckCircle2, 
  Flame, 
  Users, 
  Award, 
  Smartphone,
  ExternalLink,
  Info
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';

export const SystemGuideModal: React.FC = () => {
  const isGuideModalOpen = useGreenVisionStore((s) => s.isGuideModalOpen);
  const closeGuideModal = useGreenVisionStore((s) => s.closeGuideModal);

  if (!isGuideModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl text-white flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">GreenVision UIU System Guide & Explanations</h3>
              <p className="text-xs text-slate-400">A clear guide explaining all interface elements, map layers, KPIs, and operational workflows</p>
            </div>
          </div>

          <button
            onClick={closeGuideModal}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1 text-xs leading-relaxed">
          
          {/* Section 1: What is GreenVision? */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>1. What is GreenVision?</span>
            </h4>
            <p className="text-slate-300">
              GreenVision is an AI-powered environmental operations platform deployed at <strong>United International University (UIU), Madani Avenue, Badda, Dhaka</strong>. It converts standard campus CCTV security cameras into an active sensing network that detects waste accumulation, bin overflows, and drainage waterlogging, then routes tasks to sanitation teams and verifies physical cleanup through before-and-after photographic evidence.
            </p>
          </div>

          {/* Section 2: What are the Things on the Map? */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>2. What are the Elements on the Campus Map?</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
                  <span>Red Pulsing Pin (Critical Incident)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Unresolved anomaly requiring urgent containment (e.g. Gate 2 waste spillage along Madani Ave). SLA is strict 30 minutes.
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span>Blue Pin (Field Team Responding)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Assigned field worker (Rahim Uddin) has accepted the task and is traveling to or currently cleaning the site.
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  <span>Purple Pin (Awaiting Approval)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Worker has submitted the "After" cleanup photo from their mobile phone. Shift supervisor must verify before closing.
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Green Pin (Verified & Resolved)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Physical resolution confirmed. Incident is formally closed, and the campus Green Score increases.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: The 10 UIU Campus Zones */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              <span>3. Campus Zones & Camera Monitoring Nodes</span>
            </h4>
            <p className="text-slate-300">
              The platform monitors 10 distinct zones across United City, Madani Avenue:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-[11px]">
              <li className="bg-slate-800/40 p-2 rounded-lg">• <strong>UIU Main Gate:</strong> Pedestrian & vehicular traffic onto Madani Ave.</li>
              <li className="bg-slate-800/40 p-2 rounded-lg">• <strong>Gate 2 Hotspot:</strong> Evening street food vendor crowd spillage.</li>
              <li className="bg-slate-800/40 p-2 rounded-lg">• <strong>Central Cafeteria:</strong> Lunch hour bin overflow & packaging litter.</li>
              <li className="bg-slate-800/40 p-2 rounded-lg">• <strong>Academic Complex:</strong> Lecture halls, library, and student courtyards.</li>
              <li className="bg-slate-800/40 p-2 rounded-lg">• <strong>South Parking & Bus Bay:</strong> Low-lying ramp prone to monsoon ponding.</li>
              <li className="bg-slate-800/40 p-2 rounded-lg">• <strong>Central Waste Depot:</strong> Segregated sorting composter and truck dock.</li>
            </ul>
          </div>

          {/* Section 4: Operational Green Score */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>4. What is the Operational Green Score?</span>
            </h4>
            <p className="text-slate-300">
              Unlike passive ESG dashboards, GreenVision calculates a real-time mathematical score (0–100) based on:
            </p>
            <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
              <div className="bg-slate-800 p-2 rounded-lg"><strong>Resolution Rate</strong><br/><span className="text-emerald-400 font-bold">30% Weight</span></div>
              <div className="bg-slate-800 p-2 rounded-lg"><strong>Response Speed</strong><br/><span className="text-emerald-400 font-bold">20% Weight</span></div>
              <div className="bg-slate-800 p-2 rounded-lg"><strong>Repeat Reduction</strong><br/><span className="text-emerald-400 font-bold">20% Weight</span></div>
              <div className="bg-slate-800 p-2 rounded-lg"><strong>Waste Triage</strong><br/><span className="text-emerald-400 font-bold">15% Weight</span></div>
              <div className="bg-slate-800 p-2 rounded-lg"><strong>Cleanliness Index</strong><br/><span className="text-emerald-400 font-bold">15% Weight</span></div>
            </div>
          </div>

          {/* Section 5: How to Buzz / Contact the Responder */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
            <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>5. Contacting Field Responder (Rahim Uddin)</span>
            </h4>
            <p className="text-slate-200">
              You can directly buzz and message Rahim's active mobile number <strong>01307726701</strong> by clicking the <strong>"Contact"</strong> or <strong>"Dispatch"</strong> buttons across the map and operations center. This opens the two-way SMS terminal where you can call, send SMS via GSM cloud gateway, or select customized instruction templates.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">GreenVision Environmental Intelligence • UIU Dhaka Campus</span>
          <button
            onClick={closeGuideModal}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
          >
            Got It, Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
