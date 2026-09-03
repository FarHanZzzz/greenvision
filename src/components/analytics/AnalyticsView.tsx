import React, { useState } from 'react';
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
  AreaChart,
  Area,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  MapPin, 
  AlertTriangle,
  Calendar,
  Sparkles,
  Droplets,
  CloudRain,
  Trash2,
  Recycle,
  Scale,
  Waves,
  ShieldCheck,
  CheckCircle2,
  Gauge,
  Activity
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';
import { 
  calculateHourlyDistribution, 
  calculateZoneRankings, 
  calculateWeeklyTrend, 
  calculateKPIs 
} from '../../utils/analyticsCalculator';

export const AnalyticsView: React.FC = () => {
  const incidents = useGreenVisionStore((s) => s.incidents);
  const [activeMetricTab, setActiveMetricTab] = useState<'OVERVIEW' | 'WATERLOGGING' | 'ILLEGAL_DUMPING'>('OVERVIEW');

  // Dynamically compute all chart datasets from incidents
  const kpis = calculateKPIs(incidents);
  const hourlyData = calculateHourlyDistribution(incidents);
  const zoneData = calculateZoneRankings(incidents);
  const trendData = calculateWeeklyTrend(incidents);

  // Category Distribution data derived dynamically from incidents
  const categoryCounts: Record<string, number> = {};
  incidents.forEach(i => {
    categoryCounts[i.categoryLabel] = (categoryCounts[i.categoryLabel] || 0) + 1;
  });

  const categoryData = Object.keys(categoryCounts).map(k => ({
    name: k,
    value: categoryCounts[k]
  }));

  const COLORS = ['#10B981', '#059669', '#F59E0B', '#0284C7', '#6366F1', '#EF4444'];

  // =========================================================================
  // SPECIALIZED DATASET: WATERLOGGING & DRAINAGE METRICS & TRENDS (User Request 3)
  // =========================================================================
  const rainfallPondingTrends = [
    { event: 'Mon (Storm 1)', rainfall: 38, waterDepth: 16, drainTimeMin: 22, incidents: 3 },
    { event: 'Tue (Drizzle)', rainfall: 12, waterDepth: 5, drainTimeMin: 10, incidents: 1 },
    { event: 'Wed (Clear)', rainfall: 0, waterDepth: 0, drainTimeMin: 0, incidents: 0 },
    { event: 'Thu (Heavy Rain)', rainfall: 62, waterDepth: 24, drainTimeMin: 34, incidents: 5 },
    { event: 'Fri (Monsoon Burst)', rainfall: 78, waterDepth: 31, drainTimeMin: 42, incidents: 6 },
    { event: 'Sat (Showers)', rainfall: 25, waterDepth: 9, drainTimeMin: 15, incidents: 2 },
    { event: 'Sun (Overcast)', rainfall: 14, waterDepth: 6, drainTimeMin: 12, incidents: 1 },
  ];

  const drainageZoneClearance = [
    { zone: 'Madani Ave Gate 1 Culvert', avgDepthCm: 28, clearTimeMin: 38, risk: 'HIGH' },
    { zone: 'South Parking Bus Loop', avgDepthCm: 22, clearTimeMin: 26, risk: 'MEDIUM' },
    { zone: 'Underpass Access Ramp', avgDepthCm: 18, clearTimeMin: 20, risk: 'MEDIUM' },
    { zone: 'Academic Quad West Walkway', avgDepthCm: 11, clearTimeMin: 14, risk: 'LOW' },
    { zone: 'Sports Complex Field Side', avgDepthCm: 9, clearTimeMin: 12, risk: 'LOW' },
  ];

  const pumpTelemetry = [
    { id: 'PUMP-01', name: 'Madani Culvert Primary Storm Sump', flowLps: 142, status: 'ONLINE', capacityPct: 78 },
    { id: 'PUMP-02', name: 'UIU South Retention Basin Pump', flowLps: 98, status: 'ONLINE', capacityPct: 62 },
    { id: 'PUMP-03', name: 'Basement Parking Submersible Ejector', flowLps: 64, status: 'STANDBY', capacityPct: 15 },
  ];

  // =========================================================================
  // SPECIALIZED DATASET: ILLEGAL DUMPING & WASTE METRICS & TRENDS (User Request 3)
  // =========================================================================
  const dumpingWeekdayTrends = [
    { day: 'Monday', incidents: 4, massKg: 180, vendorSpillagePct: 45 },
    { day: 'Tuesday', incidents: 3, massKg: 140, vendorSpillagePct: 40 },
    { day: 'Wednesday', incidents: 5, massKg: 240, vendorSpillagePct: 65 },
    { day: 'Thursday', incidents: 8, massKg: 390, vendorSpillagePct: 82 },
    { day: 'Friday', incidents: 9, massKg: 460, vendorSpillagePct: 88 },
    { day: 'Saturday', incidents: 6, massKg: 280, vendorSpillagePct: 55 },
    { day: 'Sunday', incidents: 2, massKg: 90, vendorSpillagePct: 30 },
  ];

  const dumpingHourHeatmap = [
    { time: '06:00 - 09:00', label: 'Morning Commute', count: 2, volumeScore: 18 },
    { time: '09:00 - 12:00', label: 'Class Hours', count: 3, volumeScore: 25 },
    { time: '12:00 - 15:00', label: 'Lunch Break Peak', count: 8, volumeScore: 78 },
    { time: '15:00 - 18:00', label: 'Dispersal / Street Vendors', count: 12, volumeScore: 94 },
    { time: '18:00 - 21:00', label: 'Evening Peak Spill', count: 9, volumeScore: 82 },
    { time: '21:00 - 00:00', label: 'Night Quiet', count: 2, volumeScore: 15 },
  ];

  const wasteCompositionData = [
    { name: 'Single-Use Food Packaging', value: 42, color: '#ef4444' },
    { name: 'Polythene & Grocery Bags', value: 26, color: '#f59e0b' },
    { name: 'PET Beverage Bottles & Cups', value: 20, color: '#0284c7' },
    { name: 'Organic & Food Leftovers', value: 12, color: '#10b981' },
  ];

  const dumpingHotspotRankings = [
    { location: 'UIU Gate 2 Vendor Perimeter', incidents: 14, massKg: 620, risk: 'CRITICAL' },
    { location: 'Cafeteria Ground Floor Rear Alley', incidents: 8, massKg: 340, risk: 'HIGH' },
    { location: 'Sports Arena Bleachers South', incidents: 5, massKg: 210, risk: 'MEDIUM' },
    { location: 'Underpass North Wall Corner', incidents: 3, massKg: 130, risk: 'LOW' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Analytics Header & Tab Navigation (Resolves User Request 3) */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-black tracking-tight">ENVIRONMENTAL OPERATIONS ANALYTICS & TRENDS</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live operational intelligence, flood hydrology, and waste accumulation trends across United International University.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono bg-slate-800 text-emerald-400 px-3 py-1 rounded-lg border border-slate-700">
              {kpis.resolutionRatePct}% RESOLUTION RATE
            </span>
            <span className="text-[11px] font-mono bg-slate-800 text-sky-400 px-3 py-1 rounded-lg border border-slate-700">
              AVG FIX: {kpis.avgResolutionTimeMin}m
            </span>
          </div>
        </div>

        {/* Specialized Segmented Tabs (User Request 3) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveMetricTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeMetricTab === 'OVERVIEW'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>All Campus Metrics</span>
          </button>

          <button
            onClick={() => setActiveMetricTab('WATERLOGGING')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeMetricTab === 'WATERLOGGING'
                ? 'bg-sky-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Waves className="w-4 h-4 text-sky-300" />
            <span>Water Clogging & Monsoon Flood Trends</span>
          </button>

          <button
            onClick={() => setActiveMetricTab('ILLEGAL_DUMPING')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeMetricTab === 'ILLEGAL_DUMPING'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Trash2 className="w-4 h-4 text-amber-300" />
            <span>Illegal Dumping & Waste Accumulation Trends</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ALL CAMPUS OVERVIEW TAB                                                */}
      {/* ========================================================================= */}
      {activeMetricTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Row 1: Weekly Volume & Hourly Peak Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Weekly Volume & Resolution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Weekly Incident Volume vs Resolution</h3>
                  <p className="text-xs text-slate-500">Track how many detected anomalies are verified & closed by day</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {kpis.resolutionRatePct}% Verified
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

            {/* Hourly Incident Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Diurnal Hourly Distribution (Peak Analysis)</h3>
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
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {kpis.topCategoryName} Top
                </span>
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
                      {categoryData.map((_, index) => (
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
                  Top: {kpis.topProblemZoneName}
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
      )}

      {/* ========================================================================= */}
      {/* 2. WATERLOGGING & DRAINAGE METRICS & TRENDS TAB (User Request 3)           */}
      {/* ========================================================================= */}
      {activeMetricTab === 'WATERLOGGING' && (
        <div className="space-y-6">
          
          {/* Waterlogging KPI Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-medium">Monsoon Flood Events</span>
                <Waves className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">18 <span className="text-xs font-normal text-sky-600">tracked</span></div>
              <p className="text-[11px] text-slate-400 mt-0.5">Across 7 campus drainage basins</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-medium">Avg Drainage SLA</span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1">22.4 <span className="text-xs font-normal text-slate-500">mins</span></div>
              <p className="text-[11px] text-slate-400 mt-0.5">Target: &lt; 35 min under 50mm/h</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-medium">Peak Standing Depth</span>
                <Gauge className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-black text-red-600 mt-1">31 <span className="text-xs font-normal text-slate-500">cm</span></div>
              <p className="text-[11px] text-slate-400 mt-0.5">Madani Avenue Gate 1 Culvert</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-medium">Sump Pump Stations</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1">3 / 3 <span className="text-xs font-normal text-slate-500">Online</span></div>
              <p className="text-[11px] text-slate-400 mt-0.5">304 L/sec total drainage throughput</p>
            </div>
          </div>

          {/* Row 1: Rainfall vs Water Ponding & Incident Volume */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart: Rainfall vs Water Depth */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Monsoon Rainfall vs Water Ponding Depth</h3>
                  <p className="text-xs text-slate-500">Correlation between precipitation (mm) and standing puddle depth (cm)</p>
                </div>
                <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  Correlation: 0.94 r
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rainfallPondingTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="event" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="rainfall" fill="#bae6fd" stroke="#0284c7" name="Rainfall (mm)" />
                    <Area type="monotone" dataKey="waterDepth" fill="#fed7aa" stroke="#ea580c" name="Ponding Depth (cm)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart: Zone Clearance Duration */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Drainage Clearance Duration by Campus Zone</h3>
                  <p className="text-xs text-slate-500">Time required for sump pumps & gravity culverts to drain water</p>
                </div>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Critical SLA &lt; 30m
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={drainageZoneClearance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} unit="m" />
                    <YAxis dataKey="zone" type="category" stroke="#94a3b8" fontSize={10} width={150} />
                    <Tooltip />
                    <Bar dataKey="clearTimeMin" fill="#0284c7" radius={[0, 4, 4, 0]} name="Drainage Time (min)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Sump Pump Stations Telemetry Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">UIU Campus Stormwater Pumping Infrastructure</h3>
                <p className="text-xs text-slate-500">Real-time telemetry and pump station operational readiness</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All Stations Operational</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Station ID</th>
                    <th className="py-2.5 px-3">Infrastructure Asset</th>
                    <th className="py-2.5 px-3">Discharge Flow Rate</th>
                    <th className="py-2.5 px-3">Load Capacity</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pumpTelemetry.map(pump => (
                    <tr key={pump.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{pump.id}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{pump.name}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-sky-700">{pump.flowLps} L/sec</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${pump.capacityPct}%` }}></div>
                          </div>
                          <span className="text-[11px] font-mono">{pump.capacityPct}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pump.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {pump.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ILLEGAL DUMPING & WASTE ACCUMULATION TRENDS TAB (User Request 3)        */}
      {/* ========================================================================= */}
      {activeMetricTab === 'ILLEGAL_DUMPING' && (
        <div className="space-y-6">
          
          {/* Illegal Dumping KPI Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-medium">Illegal Dumping Events</span>
                <Trash2 className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">26 <span className="text-xs font-normal text-amber-600">this month</span></div>
              <p className="text-[11px] text-slate-400 mt-0.5">Concentrated around Gate 2 vendors</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-medium">Total Waste Cleared</span>
                <Scale className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1">1,540 <span className="text-xs font-normal text-slate-500">kg</span></div>
              <p className="text-[11px] text-slate-400 mt-0.5">Bi-weekly municipal pickup sync</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-medium">Rapid Triage Time</span>
                <Clock className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl font-black text-sky-600 mt-1">13.8 <span className="text-xs font-normal text-slate-500">mins</span></div>
              <p className="text-[11px] text-slate-400 mt-0.5">Dispatched to Rahim & Team B</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-medium">Recurrence Index</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1">-14% <span className="text-xs font-normal text-slate-500">reduction</span></div>
              <p className="text-[11px] text-slate-400 mt-0.5">Post CCTV automated AI deterrence</p>
            </div>
          </div>

          {/* Row 1: Weekday Dumping Spikes vs Vendor Dispersals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart: Weekday Dumping Spikes */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Illegal Dumping Incidents & Waste Mass by Day</h3>
                  <p className="text-xs text-slate-500">Clear spike on Thursday & Friday evenings due to perimeter food carts</p>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  Peak: Thu & Fri
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dumpingWeekdayTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="incidents" fill="#ea580c" name="Incidents Count" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="massKg" fill="#0284c7" name="Waste Mass (kg)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart: Diurnal 24-Hour Dumping Heatmap */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Diurnal Dumping Probability Heatmap</h3>
                  <p className="text-xs text-slate-500">High concentrations during lunch break (1-3 PM) & evening dispersal (5-8 PM)</p>
                </div>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Peak: 3 PM - 7 PM
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dumpingHourHeatmap}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="volumeScore" stroke="#dc2626" fill="#fee2e2" strokeWidth={2.5} name="Dumping Severity Index" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Row 2: Waste Composition & Hotspots */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Waste Composition Donut */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Waste Material Classification Composition</h3>
                  <p className="text-xs text-slate-500">Identified materials in illegal dumping piles via CCTV inference</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  68% Non-Biodegradable
                </span>
              </div>

              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={wasteCompositionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {wasteCompositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-2">
                {wasteCompositionData.map(entry => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }}></span>
                    <span className="text-slate-600">{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotspot Location Ranking */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Top Illegal Dumping Hotspots (Campus Perimeter)</h3>
                  <p className="text-xs text-slate-500">Locations requiring increased patrol frequency and bin placement</p>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  4 Active Zones
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {dumpingHotspotRankings.map((hotspot, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{hotspot.location}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {hotspot.incidents} Incidents • {hotspot.massKg} kg waste mass
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      hotspot.risk === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      hotspot.risk === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      hotspot.risk === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {hotspot.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
