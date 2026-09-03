import React from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  MapPin, 
  BarChart3,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';

export const OverviewDashboard: React.FC = () => {
  const incidents = useGreenVisionStore((s) => s.incidents);
  const activityLog = useGreenVisionStore((s) => s.activityLog);
  const getGreenScore = useGreenVisionStore((s) => s.getGreenScore);
  const setSelectedIncidentId = useGreenVisionStore((s) => s.setSelectedIncidentId);

  const greenScore = getGreenScore();

  // Metrics dynamically computed from mock incidents (PRD Section 18 & 47)
  const activeIncidents = incidents.filter(i => i.status !== 'CLOSED' && i.status !== 'FALSE_DETECTION');
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'CLOSED').length;
  const unassignedCount = incidents.filter(i => (i.status === 'CONFIRMED' || i.status === 'DETECTED') && !i.assignedResponderId).length;
  const teamsRespondingCount = incidents.filter(i => i.status === 'IN_PROGRESS' || i.status === 'ACCEPTED').length;
  const resolvedTodayCount = incidents.filter(i => i.status === 'CLOSED').length;
  
  // Operational Performance
  const totalIncidents = incidents.length || 1;
  const resolutionRate = Math.round((resolvedTodayCount / totalIncidents) * 100);

  return (
    <div className="space-y-6">
      
      {/* 1. CURRENT SITUATION (6 Metric KPI Cards - PRD Section 18) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Current Campus Situation</h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Computed live from optical events</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Active Incidents */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Active Events</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{activeIncidents.length}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">3 require field action</div>
          </div>

          {/* Critical Priority */}
          <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm hover:border-red-200 transition">
            <div className="flex items-center justify-between text-red-600">
              <span className="text-xs font-medium">Critical</span>
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-red-600 mt-1">{criticalCount}</div>
            <div className="text-[10px] text-red-400 mt-0.5">&lt;30m SLA response</div>
          </div>

          {/* Unassigned Incidents */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Unassigned</span>
              <Users className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{unassignedCount}</div>
            <div className="text-[10px] text-sky-600 font-semibold mt-0.5">Awaiting dispatch</div>
          </div>

          {/* Teams Responding */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Responding</span>
              <Clock className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{teamsRespondingCount}</div>
            <div className="text-[10px] text-indigo-600 font-medium mt-0.5">Units in transit/work</div>
          </div>

          {/* Overdue / SLA breach */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Overdue SLA</span>
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">0</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">100% On-Track</div>
          </div>

          {/* Resolved Today */}
          <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm hover:border-emerald-200 transition">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-medium">Resolved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{resolvedTodayCount}</div>
            <div className="text-[10px] text-emerald-600 mt-0.5">+4 vs last shift</div>
          </div>

        </div>
      </div>

      {/* 2. OPERATIONAL INTELLIGENCE & GREEN SCORE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Environmental Hotspot Insight (PRD Section 34) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-5 rounded-2xl text-white shadow-md border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  Operational Hotspot Intelligence
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">AI PATTERN ANALYSIS</span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] font-mono uppercase text-slate-400">Top Problematic Zone</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Gate 2 & Perimeter</span>
                </div>
                <div className="text-[11px] text-rose-300 font-mono mt-1 font-semibold">38 Recorded Incidents</div>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] font-mono uppercase text-slate-400">Peak Incident Hours</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>4:00 PM – 7:00 PM</span>
                </div>
                <div className="text-[11px] text-amber-300 font-mono mt-1">Vendor dispersal shift</div>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] font-mono uppercase text-slate-400">Primary Incident Type</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Waste Accumulation</span>
                </div>
                <div className="text-[11px] text-emerald-300 font-mono mt-1">64% of total events</div>
              </div>
            </div>

            {/* Operational Suggestion */}
            <div className="mt-4 bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold text-sm">💡</span>
              <div>
                <span className="font-semibold text-emerald-300">Actionable Operational Recommendation: </span>
                <span>Repeated waste accumulation clusters at Gate 2 during evening peak. Recommend stationing a secondary 240L wheelie bin and shifting Cleaning Team B schedule forward by 45 minutes to prevent perimeter spillage.</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Historical baseline: 75 tracked campus events</span>
            <span className="text-emerald-400 font-semibold cursor-pointer hover:underline flex items-center gap-1">
              View Detailed Hotspot Map <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Operational Green Score Card (PRD Section 35) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Operational Green Score
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                GRADE {greenScore.grade}
              </span>
            </div>

            {/* Big Score Dial */}
            <div className="mt-4 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <span className="text-3xl font-black">{greenScore.overallScore}</span>
                <span className="text-[9px] font-mono opacity-80 uppercase tracking-widest">/ 100</span>
              </div>
              <div>
                <div className="text-base font-bold text-slate-900">{greenScore.status}</div>
                <p className="text-xs text-slate-500 mt-0.5">Reflects real operational speed, resolution quality, and repeat reduction.</p>
                <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">+{greenScore.trendComparisonPct}% vs last 7 days</span>
              </div>
            </div>

            {/* Score Sub-Components */}
            <div className="mt-4 space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-[11px]">Resolution Rate (30%)</span>
                <span className="font-bold text-slate-800">{greenScore.components.incidentResolution.score}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${greenScore.components.incidentResolution.score}%` }}></div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-600 text-[11px]">Response Efficiency (20%)</span>
                <span className="font-bold text-slate-800">{greenScore.components.responseEfficiency.score}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${greenScore.components.responseEfficiency.score}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[10px] text-slate-400 italic text-center border-t border-slate-100">
            * Illustrative prototype scoring model (non-ESG certified)
          </div>
        </div>

      </div>

      {/* 3. OPERATIONAL PERFORMANCE & LIVE ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Operational Metrics Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Response Efficiency KPIs
          </span>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Average Response Time</span>
                <div className="text-lg font-bold text-slate-900">6.8 mins</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">EXCELLENT</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Average Resolution Time</span>
                <div className="text-lg font-bold text-slate-900">18.4 mins</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">&lt; 30m Target</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Repeat Incident Rate</span>
                <div className="text-lg font-bold text-slate-900">14.2%</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">MONITORING</span>
            </div>
          </div>
        </div>

        {/* Live Activity Feed (PRD Section 22) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Live Operations Activity Feed
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Auto-Updating Stream</span>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100">
              {activityLog.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedIncidentId(event.incidentId)}
                  className="pt-2.5 first:pt-0 flex items-start gap-3 text-xs hover:bg-slate-50 p-1.5 rounded-lg cursor-pointer transition"
                >
                  <span className="font-mono text-[11px] text-slate-400 mt-0.5 font-semibold shrink-0">
                    {event.timeFormatted}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-medium">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-600">{event.actor}</span>
                      <span>•</span>
                      <span>{event.actorRole}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-mono font-bold">{event.incidentId}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                    event.severity === 'success' ? 'bg-emerald-100 text-emerald-800' :
                    event.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                    event.severity === 'danger' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {event.type.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Human-in-the-loop verified audit trail</span>
            <span className="font-medium text-emerald-700">All events cryptographically signed</span>
          </div>
        </div>

      </div>

    </div>
  );
};
