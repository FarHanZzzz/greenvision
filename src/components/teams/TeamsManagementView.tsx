import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowUpRight,
  Send,
  Sparkles
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';
import { UserProfile } from '../../types';

export const TeamsManagementView: React.FC = () => {
  const users = useGreenVisionStore((s) => s.users);
  const incidents = useGreenVisionStore((s) => s.incidents);

  // Group teams (PRD Section 38)
  const teams = [
    {
      name: "Cleaning Team B (Sanitation Rapid Response)",
      department: "CLEANING",
      supervisor: users.find(u => u.id === 'usr-sup-1'),
      responders: users.filter(u => u.team === 'Cleaning Team B'),
      zoneCoverage: "Gate 2, Cafeteria, Waste Hub",
      activeTasks: incidents.filter(i => i.assignedResponderName?.includes('Rahim') && i.status !== 'CLOSED').length,
      avgSpeed: "6.4 mins",
      standing: "HIGH EFFICIENCY"
    },
    {
      name: "Cleaning Team A (Courtyard & Grounds)",
      department: "CLEANING",
      supervisor: users.find(u => u.id === 'usr-sup-1'),
      responders: users.filter(u => u.team === 'Cleaning Team A'),
      zoneCoverage: "Academic Blocks A & B, Courtyards",
      activeTasks: incidents.filter(i => (i.assignedResponderName?.includes('Faruk') || i.assignedResponderName?.includes('Sultana')) && i.status !== 'CLOSED').length,
      avgSpeed: "6.9 mins",
      standing: "OPTIMAL"
    },
    {
      name: "Facilities & Maintenance Team (Civil Works)",
      department: "MAINTENANCE",
      supervisor: users.find(u => u.id === 'usr-sup-2'),
      responders: users.filter(u => u.department === 'MAINTENANCE' && u.role === 'FIELD_RESPONDER'),
      zoneCoverage: "Drainage Sump, Parking South, Lake Channel",
      activeTasks: incidents.filter(i => i.assignedDepartment === 'MAINTENANCE' && i.status !== 'CLOSED').length,
      avgSpeed: "12.0 mins",
      standing: "STANDBY"
    },
    {
      name: "Campus Security & Traffic Control Unit",
      department: "SECURITY",
      supervisor: users.find(u => u.role === 'CONTROL_OPERATOR'),
      responders: users.filter(u => u.department === 'SECURITY'),
      zoneCoverage: "Main Gate, Parking North, Perimeter Roads",
      activeTasks: incidents.filter(i => i.assignedDepartment === 'SECURITY' && i.status !== 'CLOSED').length,
      avgSpeed: "4.8 mins",
      standing: "READY"
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black tracking-tight">OPERATIONAL FIELD TEAMS & ROSTERS</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active workforce units responsible for physical incident resolution, evidence capture, and campus sanitation.
          </p>
        </div>
        <span className="text-xs font-mono bg-slate-800 text-emerald-400 px-3 py-1 rounded-lg border border-slate-700">
          4 REGISTERED TEAMS
        </span>
      </div>

      {/* Teams Grid (PRD Section 38) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4">
            
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold uppercase">
                    {team.department}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1.5">{team.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Coverage: {team.zoneCoverage}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-bold text-[10px]">
                  {team.standing}
                </span>
              </div>

              {/* Workload Stats Bar */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Active Tasks</span>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{team.activeTasks}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Avg Response</span>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">{team.avgSpeed}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Field Strength</span>
                  <div className="text-base font-bold text-sky-700 mt-0.5">{team.responders.length || 1} staff</div>
                </div>
              </div>

              {/* Supervisor & Personnel */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Shift Supervisor:</span>
                  <div className="flex items-center gap-2">
                    <img src={team.supervisor?.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-bold text-slate-800">{team.supervisor?.name}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Field Responders:</span>
                  {team.responders.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                      <div className="flex items-center gap-2">
                        <img src={r.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-slate-800">{r.name}</div>
                          <div className="text-[10px] text-slate-400">{r.roleTitle}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          r.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                        }`}>
                          {r.status || 'AVAILABLE'}
                        </span>
                        <a href={`tel:${r.phone}`} className="p-1 rounded hover:bg-slate-200 text-slate-600" title="Call">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">{team.supervisor?.phone}</span>
              <button
                onClick={() => alert(`Direct radio channel connected to ${team.name}`)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] flex items-center gap-1.5 transition"
              >
                <Send className="w-3 h-3 text-emerald-400" />
                <span>Radio Dispatch</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
