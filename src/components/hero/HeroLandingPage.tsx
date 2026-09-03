import React from 'react';
import { GenerativeTree } from '@/components/ui/generative-tree';
import { useGreenVisionStore, AppInterface } from '@/store/useGreenVisionStore';
import { 
  Radio, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Video, 
  Droplets, 
  Trash2, 
  Award, 
  Smartphone, 
  Layers, 
  CheckCircle2, 
  Zap, 
  ChevronRight, 
  Sparkles,
  Columns,
  MapPin,
  LayoutDashboard,
  SlidersHorizontal
} from 'lucide-react';

export const HeroLandingPage: React.FC = () => {
  const setInterface = useGreenVisionStore((s) => s.setInterface);
  const setCommandSubTab = useGreenVisionStore((s) => s.setCommandSubTab);

  const handleLaunchCommandCenter = (subTab: 'OVERVIEW' | 'MAP' | 'INCIDENTS' | 'CCTV' | 'ANALYTICS' | 'GREENSCORE' = 'OVERVIEW') => {
    setCommandSubTab(subTab);
    setInterface('COMMAND_CENTER');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#070d0b] text-slate-100 font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      
      {/* 1. Generative Tree Background - Contained to the Hero Viewport for Silky 120 FPS Scrolling */}
      <div 
        className="absolute top-0 left-0 right-0 h-[860px] sm:h-[920px] z-0 pointer-events-none overflow-hidden"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      >
        <GenerativeTree 
          hue={45}             // Shifts golden motes into glowing emerald/mint foliage
          saturation={1.3}     // Rich chlorophyll vibrancy
          brightness={1.05}    // Clean luminance against deep dark canvas
          speed={0.85}         // Majestic, serene branching flow
          particleAmount={0.9} // Optimized particle count for maximum FPS
          size={1.0}
          className="w-full h-full"
        />
        {/* Smooth atmospheric fade into the rest of the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070d0b]/40 via-transparent to-[#070d0b] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(16,185,129,0.09),transparent_65%)] pointer-events-none" />
      </div>

      {/* 2. Floating Top Clean Navigation Bar (Single Unified Header) */}
      <nav className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2">
        <div className="bg-[#0b1612]/95 border border-emerald-500/25 rounded-2xl px-5 py-3 flex items-center justify-between shadow-2xl shadow-black/60">
          
          {/* Brand Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 flex items-center justify-center shadow-md shadow-emerald-500/30">
              <div className="w-full h-full bg-[#070d0b] rounded-[10px] flex items-center justify-center">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
                GREENVISION
              </span>
              <span className="block text-[10px] font-mono text-emerald-400/80 tracking-widest uppercase">
                Dhaka Grid Intelligence
              </span>
            </div>
          </div>

          {/* Quick Nav Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#070d0b]/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleLaunchCommandCenter('OVERVIEW')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Central Command</span>
            </button>
            <button
              onClick={() => setInterface('OPERATIONS')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
              <span>Operations Room</span>
            </button>
            <button
              onClick={() => setInterface('RESPONDER')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Responder Mobile</span>
            </button>
            <button
              onClick={() => setInterface('DUAL_DEMO')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition flex items-center gap-1.5"
            >
              <Columns className="w-3.5 h-3.5 text-teal-400" />
              <span>Split Demo</span>
            </button>
          </div>

          {/* Primary CTA: Launch Command Center */}
          <button
            onClick={() => handleLaunchCommandCenter('OVERVIEW')}
            className="group relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </nav>

      {/* 3. Hero Section Stage */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-20 text-center">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0b1612]/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono tracking-wide uppercase shadow-lg mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Autonomous AI Environmental Intelligence • Urban Dhaka</span>
        </div>

        {/* Master Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 drop-shadow-sm">
          Intelligent Urban Ecology for{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
            Resilient Megacities
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 font-normal leading-relaxed mb-10 text-balance">
          Transforming standard municipal CCTV cameras into an autonomous environmental defense grid. 
          Real-time detection for illegal waste dumping, monsoon water ponding, and closed-loop field dispatch across Dhaka.
        </p>

        {/* Action Button Strip with High-Impact Command Center CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => handleLaunchCommandCenter('OVERVIEW')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <LayoutDashboard className="w-5 h-5 text-slate-950" />
            <span>Enter Command Center</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>

          <button
            onClick={() => setInterface('DUAL_DEMO')}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#0b1612]/95 hover:bg-[#10241d] text-slate-200 border border-emerald-500/30 hover:border-emerald-400/60 font-semibold text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <Columns className="w-5 h-5 text-emerald-400" />
            <span>Interactive Split Demo View</span>
          </button>

          <button
            onClick={() => handleLaunchCommandCenter('CCTV')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#0b1612]/80 hover:bg-[#10241d] text-slate-300 border border-slate-800 hover:border-slate-700 font-medium text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Video className="w-4 h-4 text-teal-400" />
            <span>Live CCTV Feeds</span>
          </button>
        </div>

        {/* Live System Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-[#0b1612]/95 border border-emerald-500/20 text-center shadow-lg">
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">94.2%</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">YOLOv8 AI Precision</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b1612]/95 border border-emerald-500/20 text-center shadow-lg">
            <div className="text-2xl sm:text-3xl font-black font-mono text-teal-300">&lt; 14 min</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Average Dispatch SLA</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b1612]/95 border border-emerald-500/20 text-center shadow-lg">
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">16 Cameras</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">UIU Dhaka Grid</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0b1612]/95 border border-emerald-500/20 text-center shadow-lg">
            <div className="text-2xl sm:text-3xl font-black font-mono text-teal-300">100%</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Closed-Loop Verification</div>
          </div>
        </div>

      </section>

      {/* 4. Feature 1: The Closed-Loop Operational Workflow (High-Performance Solid Cards) */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
            Autonomous Lifecycle
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            From Anomaly Detection to Clean Pavement in Minutes
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            A continuous automated pipeline bridging optical surveillance, human verification, and rapid municipal field action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-[#0b1612]/95 border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/50 transition shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-mono font-bold">
              01
            </div>
            <h3 className="font-bold text-white text-base mb-1.5 flex items-center gap-2">
              <span>AI Optical Scan</span>
              <Video className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              CCTV streams run continuous inference detecting waste bags, overflow piles, and water ponding with 90%+ confidence.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-[#0b1612]/95 border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/50 transition shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 font-mono font-bold">
              02
            </div>
            <h3 className="font-bold text-white text-base mb-1.5 flex items-center gap-2">
              <span>Operator Triage</span>
              <ShieldCheck className="w-4 h-4 text-teal-400" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Central Command operators review bounding boxes and confirm real environmental incidents with a single click.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-[#0b1612]/95 border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/50 transition shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-mono font-bold">
              03
            </div>
            <h3 className="font-bold text-white text-base mb-1.5 flex items-center gap-2">
              <span>Field Dispatch</span>
              <Smartphone className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mobile units (e.g. Rahim 01307726701) receive instant task assignments, GPS routes, and live camera snapshot context.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-[#0b1612]/95 border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/50 transition shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 font-mono font-bold">
              04
            </div>
            <h3 className="font-bold text-white text-base mb-1.5 flex items-center gap-2">
              <span>Cleaned Sync</span>
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Post-cleanup photo evidence is uploaded, supervisor approves, and CCTV dynamically confirms clean, washed pavement.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Feature 2: High-Impact Focus Modules */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono text-teal-400 uppercase tracking-widest font-bold">
            Targeted Environmental Challenges
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Built Specifically for Dhaka's Climate & Density
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Tailored algorithms addressing the capital's monsoon urban drainage crises and illegal roadside refuse accumulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Module 1: Monsoon Water Clogging */}
          <div className="group rounded-3xl bg-[#0b1612]/95 border border-slate-800 hover:border-emerald-500/50 overflow-hidden transition shadow-xl">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80" 
                alt="Urban Rain & Waterlogging"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1612] via-[#0b1612]/40 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-950/90 border border-blue-500/40 text-blue-300 text-xs font-mono flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span>MONSOON FLOOD TELEMETRY</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Water Ponding & Drainage Sump Sentry
              </h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Tracks rainfall accumulation, ponding depth (up to 31 cm), and telemetry across 3 municipal sump pump stations with an average clearance SLA of 22.4 minutes.
              </p>
              <button
                onClick={() => handleLaunchCommandCenter('ANALYTICS')}
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                <span>View Water Clogging Trends</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Module 2: Illegal Dumping & Littering */}
          <div className="group rounded-3xl bg-[#0b1612]/95 border border-slate-800 hover:border-emerald-500/50 overflow-hidden transition shadow-xl">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80" 
                alt="Waste Accumulation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1612] via-[#0b1612]/40 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-orange-950/90 border border-orange-500/40 text-orange-300 text-xs font-mono flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-orange-400" />
                <span>RAPID WASTE TRIAGE</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Illegal Dumping Hotspots & Waste Density
              </h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Optical density modeling categorizes waste material (polythene bags, PET bottles, organic refuse) and generates heatmap recurrence indices across UIU Gate 2.
              </p>
              <button
                onClick={() => handleLaunchCommandCenter('ANALYTICS')}
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                <span>Explore Dumping Analytics</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Module 3: Operational Green Score */}
          <div className="group rounded-3xl bg-[#0b1612]/95 border border-slate-800 hover:border-emerald-500/50 overflow-hidden transition shadow-xl">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80" 
                alt="Urban Green Canopy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1612] via-[#0b1612]/40 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>WARD GOVERNANCE KPI</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Operational Green Score (ESG Dashboard)
              </h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Dynamic composite municipal rating (88.4 / 100) aggregating cleanliness SLA compliance, active drainage uptime, and rapid responder resolution velocity.
              </p>
              <button
                onClick={() => handleLaunchCommandCenter('GREENSCORE')}
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                <span>Inspect Green Score Breakdown</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Module 4: Field Responder Mobile Terminal */}
          <div className="group rounded-3xl bg-[#0b1612]/95 border border-slate-800 hover:border-emerald-500/50 overflow-hidden transition shadow-xl">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" 
                alt="Mobile Operations & Field Responder"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1612] via-[#0b1612]/40 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-teal-950/90 border border-teal-500/40 text-teal-300 text-xs font-mono flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                <span>HANDHELD TERMINAL (RAHIM)</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Direct Responder Dispatch & Phone Buzzing
              </h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Direct integration with field teams. Operators can buzz Rahim's mobile (01307726701) via automated SMS and WhatsApp with full GPS coordinate routing.
              </p>
              <button
                onClick={() => setInterface('RESPONDER')}
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                <span>Open Responder Mobile View</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Bottom Launchpad Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#0b1612] to-emerald-950/40 border border-emerald-500/30 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold mb-4">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>OPERATIONAL READINESS: 100%</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Take Control of the Dhaka Urban Grid
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            Experience the complete live platform with real-time Leaflet GIS mapping, 8-channel CCTV optical simulation, and operator dispatch workflows.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary Command Center Action Button */}
            <button
              onClick={() => handleLaunchCommandCenter('OVERVIEW')}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 hover:scale-[1.03] active:scale-[0.98] transition cursor-pointer"
            >
              <LayoutDashboard className="w-5 h-5 text-slate-950" />
              <span>Launch Command Center Now</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>

            <button
              onClick={() => setInterface('OPERATIONS')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-base flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Activity className="w-5 h-5 text-teal-400" />
              <span>Enter Operations Room</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400 font-semibold">GreenVision Platform</span>
            <span>• United International University (UIU), Madani Ave, Dhaka</span>
          </div>
          <div>
            <span>Autonomous Optical AI Environmental Infrastructure © 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
