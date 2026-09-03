import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  MapPin, 
  AlertTriangle,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';

export const AnalyticsView: React.FC = () => {
  const incidents = useGreenVisionStore((s) => s.incidents);

  // 1. Category Distribution data derived from incidents
  const categoryCounts: Record<string, number> = {};
  incidents.forEach(i => {
    categoryCounts[i.categoryLabel] = (categoryCounts[i.categoryLabel] || 0) + 1;
  });

  const categoryData = Object.keys(categoryCounts).map(k => ({
    name: k,
    value: categoryCounts[k]
  }));

  const COLORS = ['#10B981', '#059669', '#F59E0B', '#0284C7', '#6366F1', '#EF4444'];

  // 2. Hourly Incident Distribution (PRD Section 34: Peak at 4 PM - 7 PM)
  const hourlyData = [
    { hour: '8 AM', count: 3 },
    { hour: '10 AM', count: 6 },
    { hour: '12 PM', count: 12 },
    { hour: '2 PM', count: 9 },
    { hour: '4 PM', count: 28 }, // Peak
    { hour: '6 PM', count: 34 }, // Peak
    { hour: '8 PM', count: 18 },
    { hour: '10 PM', count: 4 },
  ];

  // 3. Top Zone Hotspots
  const zoneData = [
    { zone: 'Gate 2 & Perimeter', incidents: 38, resolved: 37 },
    { zone: 'Central Cafeteria', incidents: 22, resolved: 21 },
    { zone: 'Parking South Bay', incidents: 14, resolved: 13 },
    { zone: 'Academic Block A', incidents: 9, resolved: 9 },
    { zone: 'Main Campus Gate', incidents: 6, resolved: 6 },
  ];

  // 4. Weekly Resolution Velocity Trend
  const trendData = [
    { day: 'Mon', detected: 14, resolved: 14, avgMinutes: 19 },
    { day: 'Tue', detected: 16, resolved: 15, avgMinutes: 21 },
    { day: 'Wed', detected: 19, resolved: 19, avgMinutes: 17 },
    { day: 'Thu', detected: 22, resolved: 21, avgMinutes: 16 },
    { day: 'Fri', detected: 25, resolved: 24, avgMinutes: 18 },
    { day: 'Sat', detected: 11, resolved: 11, avgMinutes: 14 },
    { day: 'Sun', detected: 8, resolved: 8, avgMinutes: 15 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Analytics Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black tracking-tight">ENVIRONMENTAL OPERATIONS ANALYTICS</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational intelligence computed from 75 historical and live CCTV incident workflows.
          </p>
        </div>
        <span className="text-[11px] font-mono bg-slate-800 text-emerald-400 px-3 py-1 rounded-lg border border-slate-700">
          DATASET: PAST 30 DAYS
        </span>
      </div>

      {/* Row 1: Weekly Volume & Hourly Peak Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Volume & Resolution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Weekly Incident Volume vs Resolution</h3>
              <p className="text-xs text-slate-500">Track how many detected anomalies are verified & closed</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              98.2% Resolution Rate
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="detected" fill="#cbd5e1" name="Detected" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Incident Distribution (Peak 4-7 PM) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Diurnal Hourly Distribution (Peak Heatmap)</h3>
              <p className="text-xs text-slate-500">Pinpointing high-risk temporal clusters across campus</p>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              Peak: 4 PM – 7 PM
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2.5} name="Incident Count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Category Breakdown & Zone Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown Donut */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Environmental Category Breakdown</h3>
              <p className="text-xs text-slate-500">Waste management dominates campus operational load</p>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-2">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }}></span>
                <span className="text-slate-600">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Zone Hotspot Ranking */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Campus Zone Hotspot Ranking</h3>
              <p className="text-xs text-slate-500">Frequency of confirmed environmental incidents by zone</p>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              Gate 2 = 51% Load
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="zone" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                <Tooltip />
                <Bar dataKey="incidents" fill="#0f766e" radius={[0, 4, 4, 0]} name="Total Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
