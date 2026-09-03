import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Info,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';

export const GreenScoreView: React.FC = () => {
  const getGreenScore = useGreenVisionStore((s) => s.getGreenScore);
  const scoreData = getGreenScore();

  const componentsList = [
    {
      key: 'incidentResolution',
      label: 'Incident Resolution Rate',
      weight: '30%',
      score: scoreData.components.incidentResolution.score,
      desc: 'Proportion of detected environmental anomalies successfully closed with verified photo evidence.'
    },
    {
      key: 'responseEfficiency',
      label: 'Response & SLA Velocity',
      weight: '20%',
      score: scoreData.components.responseEfficiency.score,
      desc: 'Average duration between human verification and field responder physical arrival on site.'
    },
    {
      key: 'recurringReduction',
      label: 'Hotspot & Repeat Reduction',
      weight: '20%',
      score: scoreData.components.recurringReduction.score,
      desc: 'Effectiveness of preventive actions in reducing recurring incident spikes at known problem zones.'
    },
    {
      key: 'wastePerformance',
      label: 'Waste Management Triage',
      weight: '15%',
      score: scoreData.components.wastePerformance.score,
      desc: 'Speed and thoroughness of clearing bin overflows and illegal dump piles before crowd exposure.'
    },
    {
      key: 'areaCleanliness',
      label: 'Area Cleanliness Index',
      weight: '15%',
      score: scoreData.components.areaCleanliness.score,
      desc: 'Normalized visual sanitation baseline assessed through continuous CCTV background sampling.'
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 p-6 rounded-3xl border border-slate-800 text-white flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight">OPERATIONAL GREEN SCORE</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              REAL-TIME COMPOSITE
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike static certifications, the GreenVision Operational Green Score evaluates the active responsiveness of an organization. Higher scores reward fast verification, complete evidence closure, and continuous reduction of recurring waste hotspots.
          </p>
        </div>

        {/* Big Score Badge */}
        <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-emerald-500/30 shadow-inner">
          <div className="text-center">
            <div className="text-4xl font-black bg-gradient-to-tr from-emerald-400 to-teal-200 bg-clip-text text-transparent font-mono">
              {scoreData.overallScore}
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Score / 100</span>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div>
            <div className="text-xs font-bold text-emerald-400 font-mono">GRADE {scoreData.grade}</div>
            <div className="text-sm font-black text-slate-100">{scoreData.status}</div>
            <div className="text-[10px] text-emerald-500 font-semibold">+{scoreData.trendComparisonPct}% vs last month</div>
          </div>
        </div>
      </div>

      {/* 5 Weighted Score Component Cards (PRD Section 35) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {componentsList.map((comp) => (
          <div key={comp.key} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{comp.label}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                  Weight: {comp.weight}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{comp.desc}</p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold font-mono">
                <span className="text-slate-500">Component Score</span>
                <span className="text-emerald-700 text-sm">{comp.score} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${comp.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}

        {/* 6th Card: Actionable Ways to Improve Score */}
        <div className="bg-emerald-950/40 p-5 rounded-2xl border border-emerald-500/30 text-emerald-950 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 font-mono">How to Reach Grade A+</h4>
            </div>
            <ul className="mt-2 text-xs text-emerald-900 space-y-1.5 list-disc list-inside">
              <li>Deploy additional waste bin at Gate 2 to reduce perimeter dumping by 18%.</li>
              <li>Maintain response times below 15 minutes during afternoon vendor rush.</li>
              <li>Ensure 100% supervisor verification with photo evidence for all closed events.</li>
            </ul>
          </div>

          <div className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1 cursor-pointer hover:underline">
            <span>Download Detailed Green Score Audit</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Mandatory PRD Disclaimer (Section 35) */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Info className="w-4 h-4 text-slate-400" />
        <span>
          <strong>Methodology Note:</strong> This Operational Green Score is an <em>illustrative prototype scoring model</em> designed to demonstrate closed-loop response metrics. It does not constitute formal ISO or ESG accreditation.
        </span>
      </div>

    </div>
  );
};
