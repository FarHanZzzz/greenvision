import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';

export const ReportsView: React.FC = () => {
  const incidents = useGreenVisionStore((s) => s.incidents);
  const getGreenScore = useGreenVisionStore((s) => s.getGreenScore);

  const [selectedReport, setSelectedReport] = useState<'DAILY' | 'WEEKLY' | 'HOTSPOT'>('DAILY');

  const greenScore = getGreenScore();
  const totalIncidents = incidents.length;
  const closedIncidents = incidents.filter(i => i.status === 'CLOSED').length;

  return (
    <div className="space-y-6">
      
      {/* Reports Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black tracking-tight">EXECUTIVE ENVIRONMENTAL REPORTS</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured operational intelligence dossiers for campus leadership, facility directors, and sustainability audits.
          </p>
        </div>

        {/* Report Selector Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedReport('DAILY')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedReport === 'DAILY' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily Operations Brief
          </button>
          <button
            onClick={() => setSelectedReport('WEEKLY')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedReport === 'WEEKLY' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly Campus Audit
          </button>
          <button
            onClick={() => setSelectedReport('HOTSPOT')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedReport === 'HOTSPOT' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gate 2 Hotspot Dossier
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 max-w-4xl mx-auto space-y-6 text-slate-800">
        
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs font-mono font-bold text-emerald-700 tracking-wider uppercase">
              GREENVISION • OPERATIONS INTELLIGENCE SYSTEM
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {selectedReport === 'DAILY' && "Daily Environmental Operations Summary"}
              {selectedReport === 'WEEKLY' && "Weekly Campus Environmental Audit Briefing"}
              {selectedReport === 'HOTSPOT' && "Gate 2 Perimeter Waste Hotspot Analysis"}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 font-mono">
              <span>Facility: GreenVision Demo Campus (Dhaka)</span>
              <span>•</span>
              <span>Generated: Today at 6:45 PM BST</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert("Dossier exported to PDF successfully.")}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Executive Summary Paragraph */}
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <h3 className="font-bold text-sm text-slate-900 uppercase font-mono">1. Executive Summary</h3>
          <p>
            During this reporting cycle, GreenVision monitored 16 optical CCTV nodes across 10 designated campus operational zones. A total of <strong className="text-slate-900">{totalIncidents} environmental events</strong> were registered and managed through the human-in-the-loop verification workflow. The operational loop achieved a <strong className="text-emerald-700">{Math.round((closedIncidents / totalIncidents) * 100)}% verified resolution rate</strong> with an average physical dispatch-to-resolution duration of 18.4 minutes.
          </p>
        </div>

        {/* Key Metrics Table */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900 uppercase font-mono">2. Operational Performance Scorecard</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Operational Green Score</span>
              <div className="text-xl font-bold text-emerald-700 mt-0.5">{greenScore.overallScore} / 100</div>
              <span className="text-[10px] text-slate-400">Grade {greenScore.grade} Standing</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Verified Closed Events</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">{closedIncidents}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">100% Photo Audited</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Avg Response Time</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">6.8 mins</div>
              <span className="text-[10px] text-slate-400">&lt; 15m SLA Benchmark</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Active Hotspot Zones</span>
              <div className="text-xl font-bold text-amber-600 mt-0.5">Gate 2</div>
              <span className="text-[10px] text-slate-400">38 Total Events</span>
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="space-y-2 pt-4 border-t border-slate-200 text-xs">
          <h3 className="font-bold text-sm text-slate-900 uppercase font-mono">3. Tactical Operational Directives</h3>
          <ul className="space-y-2 list-disc list-inside text-slate-600">
            <li>
              <strong className="text-slate-800">Cleaning Team B Schedule Shift:</strong> Adjust evening sweep intervals forward by 45 minutes to intercept vendor crowd dispersion at Gate 2 between 4:00 PM and 7:00 PM.
            </li>
            <li>
              <strong className="text-slate-800">Infrastructure Upgrades:</strong> Station dual heavy-duty 240L bins at Cafeteria Terrace and Gate 2 North perimeter.
            </li>
            <li>
              <strong className="text-slate-800">Monsoon Drainage Clearing:</strong> Schedule bi-weekly preventive pump maintenance for Parking South drainage sump before the weekend forecast.
            </li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            <div className="font-bold text-slate-800">Dr. Tariqul Islam</div>
            <div className="text-[11px]">Director of Campus Facilities</div>
          </div>

          <div className="text-right">
            <div className="font-bold text-slate-800">Farhana Yasmin</div>
            <div className="text-[11px]">Chief Sustainability Officer</div>
          </div>
        </div>

      </div>

    </div>
  );
};
