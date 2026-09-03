import React, { useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polygon, 
  Circle,
  ZoomControl
} from 'react-leaflet';
import L from 'leaflet';
import { 
  ShieldAlert, 
  Video, 
  Layers, 
  Flame, 
  UserCheck, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2,
  Trash2,
  AlertOctagon,
  Eye,
  Check,
  X,
  PhoneCall,
  Send,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Map as MapIcon,
  Smartphone
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';
import { IncidentRecord, IncidentStatus } from '../../types';

// Custom Leaflet DivIcons with Legend-Synchronized Visual Tags (Resolves User Request 1)
const createIncidentIcon = (priority: string, status: IncidentStatus, id?: string) => {
  let color = '#DC2626'; // Red
  let pulseColor = 'rgba(220, 38, 38, 0.6)';
  let labelText = '!';
  let badgeText = `🔴 Critical Anomaly ${id ? `(${id})` : ''}`;
  let badgeStyle = 'background: #450a0a; color: #fca5a5; border: 1px solid #ef4444;';

  if (status === 'CLOSED') {
    color = '#10B981'; // Green
    pulseColor = 'rgba(16, 185, 129, 0.3)';
    labelText = '✓';
    badgeText = `🟢 Cleaned & Closed ${id ? `(${id})` : ''}`;
    badgeStyle = 'background: #064e3b; color: #6ee7b7; border: 1px solid #10b981;';
  } else if (status === 'PENDING_VERIFICATION' || status === 'PENDING_APPROVAL') {
    color = '#A855F7'; // Purple - Matches "Awaiting Verify" in Legend
    pulseColor = 'rgba(168, 85, 247, 0.5)';
    labelText = '⏳';
    badgeText = `🟣 Awaiting Verify ${id ? `(${id})` : ''}`;
    badgeStyle = 'background: #3b0764; color: #d8b4fe; border: 1px solid #a855f7;';
  } else if (status === 'IN_PROGRESS' || status === 'ACCEPTED' || status === 'ASSIGNED') {
    color = '#0284C7'; // Blue - Matches "Rahim En Route" in Legend
    pulseColor = 'rgba(2, 132, 199, 0.4)';
    labelText = '⚡';
    badgeText = `🔵 Rahim En Route ${id ? `(${id})` : ''}`;
    badgeStyle = 'background: #082f49; color: #7dd3fc; border: 1px solid #0284c7;';
  } else if (priority === 'CRITICAL' || status === 'ESCALATED') {
    color = '#DC2626'; // Bright Red - Matches "Critical Anomaly" in Legend
    pulseColor = 'rgba(220, 38, 38, 0.6)';
    labelText = '!';
    badgeText = `🔴 Critical Anomaly ${id ? `(${id})` : ''}`;
    badgeStyle = 'background: #450a0a; color: #fca5a5; border: 1px solid #ef4444;';
  } else if (priority === 'HIGH') {
    color = '#F97316'; // Orange
    pulseColor = 'rgba(249, 115, 22, 0.4)';
    badgeText = `🟠 High Priority ${id ? `(${id})` : ''}`;
    badgeStyle = 'background: #431407; color: #fdba74; border: 1px solid #f97316;';
  } else {
    color = '#F59E0B'; // Amber
    pulseColor = 'rgba(245, 158, 11, 0.4)';
    badgeText = `🟡 Alert ${id ? `(${id})` : ''}`;
    badgeStyle = 'background: #451a03; color: #fcd34d; border: 1px solid #f59e0b;';
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto; cursor: pointer; user-select: none;">
        <div style="font-family: ui-monospace, monospace; font-size: 9px; font-weight: 800; padding: 1.5px 6px; border-radius: 9999px; margin-bottom: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.6); white-space: nowrap; ${badgeStyle}">
          ${badgeText}
        </div>
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: ${pulseColor}; animation: pulse-ring 1.8s infinite;"></div>
          <div style="width: 22px; height: 22px; border-radius: 50%; background: ${color}; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 900;">
            ${labelText}
          </div>
        </div>
      </div>
    `,
    iconSize: [120, 52],
    iconAnchor: [60, 44],
    popupAnchor: [0, -44],
  });
};

const cameraIcon = L.divIcon({
  className: 'custom-camera-marker',
  html: `
    <div style="width: 26px; height: 26px; border-radius: 6px; background: #0F172A; border: 1.5px solid #10B981; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m22 8-6 4 6 4V8Z"/>
        <rect width="14" height="12" x="2" y="6" rx="2"/>
      </svg>
    </div>
  `,
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

const responderIcon = L.divIcon({
  className: 'custom-responder-marker',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto; cursor: pointer; user-select: none;">
      <div style="font-family: ui-monospace, monospace; font-size: 9px; font-weight: 800; padding: 1.5px 6px; border-radius: 9999px; margin-bottom: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.6); white-space: nowrap; background: #082f49; color: #7dd3fc; border: 1px solid #0284c7;">
        🔵 Rahim En Route (01307726701)
      </div>
      <div style="width: 28px; height: 28px; border-radius: 50%; background: #0284C7; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(2,132,199,0.7); animation: bounce 2s infinite;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [150, 52],
  iconAnchor: [75, 44],
  popupAnchor: [0, -44],
});

export const CommandMap: React.FC = () => {
  const cameras = useGreenVisionStore((s) => s.cameras);
  const zones = useGreenVisionStore((s) => s.zones);
  const incidents = useGreenVisionStore((s) => s.incidents);
  const responderCoordinates = useGreenVisionStore((s) => s.responderCoordinates);
  const selectedIncidentId = useGreenVisionStore((s) => s.selectedIncidentId);
  const setSelectedIncidentId = useGreenVisionStore((s) => s.setSelectedIncidentId);
  const setSelectedCameraId = useGreenVisionStore((s) => s.setSelectedCameraId);
  const confirmIncident = useGreenVisionStore((s) => s.confirmIncident);
  const assignIncident = useGreenVisionStore((s) => s.assignIncident);
  const reassignIncident = useGreenVisionStore((s) => s.reassignIncident);
  const escalateIncident = useGreenVisionStore((s) => s.escalateIncident);
  const deescalateIncident = useGreenVisionStore((s) => s.deescalateIncident);
  const approveResolution = useGreenVisionStore((s) => s.approveResolution);
  const openContactModal = useGreenVisionStore((s) => s.openContactModal);

  // Layer Toggles
  const [showCameras, setShowCameras] = useState(true);
  const [showWaste, setShowWaste] = useState(true);
  const [showWater, setShowWater] = useState(true);
  const [showTeams, setShowTeams] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Map Tile Style: OSM, CartoDB, or Satellite (PRD Section 19)
  const [mapStyle, setMapStyle] = useState<'CARTO' | 'OSM' | 'SATELLITE'>('OSM');

  const tileUrls = {
    CARTO: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    OSM: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    SATELLITE: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  };

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  const visibleIncidents = incidents.filter(i => {
    if (!showWaste && (i.category === 'WASTE_ACCUMULATION' || i.category === 'BIN_OVERFLOW' || i.category === 'ILLEGAL_DUMPING')) return false;
    if (!showWater && i.category === 'WATERLOGGING') return false;
    return true;
  });

  return (
    <div className="relative w-full h-[580px] rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-900">
      
      {/* Map Control / Layer Toggle HUD - Distinct Segments */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2 max-w-[calc(100%-32px)]">
        
        {/* Segment 1: Grid Identity Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/95 backdrop-blur-md rounded-xl border border-emerald-500/50 shadow-lg text-[11px] font-mono font-bold text-emerald-400">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>DHAKA GRID</span>
        </div>

        {/* Segment 2: Base Map Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/95 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-lg">
          <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 px-1.5">MAP</span>
          {(['OSM', 'CARTO', 'SATELLITE'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setMapStyle(style)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition ${
                mapStyle === style
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {style === 'OSM' ? 'OSM Streets' : style === 'CARTO' ? 'Voyager' : 'Satellite'}
            </button>
          ))}
        </div>

        {/* Segment 3: Environmental Layers (Individual Separate Toggles) */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950/95 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-lg">
          <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 px-1.5">LAYERS</span>
          
          <button
            onClick={() => setShowCameras(!showCameras)}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition ${
              showCameras 
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 font-bold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Cameras (16)
          </button>

          <button
            onClick={() => setShowWaste(!showWaste)}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition ${
              showWaste 
                ? 'bg-amber-950/80 text-amber-400 border border-amber-500/50 font-bold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Waste Events
          </button>

          <button
            onClick={() => setShowWater(!showWater)}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition ${
              showWater 
                ? 'bg-sky-950/80 text-sky-400 border border-sky-500/50 font-bold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Waterlogging
          </button>

          <button
            onClick={() => setShowTeams(!showTeams)}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition ${
              showTeams 
                ? 'bg-indigo-950/80 text-indigo-400 border border-indigo-500/50 font-bold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Field Teams
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition flex items-center gap-1 ${
              showHeatmap 
                ? 'bg-rose-950/80 text-rose-400 border border-rose-500/50 font-bold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span>Hotspots</span>
          </button>
        </div>

        {/* Segment 4: External GPS Link */}
        <a
          href="https://www.google.com/maps?q=23.798038,90.449842"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950/95 backdrop-blur-md text-sky-300 hover:bg-sky-950 border border-sky-600/50 text-[11px] font-medium shadow-lg transition"
          title="Open exact UIU campus coordinates on Google Maps"
        >
          <ExternalLink className="w-3 h-3 text-sky-400" />
          <span>Google Maps</span>
        </a>

      </div>

      {/* Map Legend - Compact 2-column card elevated to bottom-16 to guarantee zero overlap with bottom controls */}
      <div className="absolute bottom-16 left-4 z-[400] bg-slate-950/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[10px] text-slate-300 shadow-2xl w-fit">
        <div className="text-[9px] font-mono uppercase text-slate-400 font-bold mb-1.5 tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Status Legend</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-1.5 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0"></span>
            <span className="text-slate-200">Critical Anomaly</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
            <span className="text-slate-200">Rahim En Route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
            <span className="text-slate-200">Awaiting Verify</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="text-slate-200">Cleaned & Closed</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map: Centered at United International University (UIU), Madani Ave, Dhaka */}
      <MapContainer
        center={[23.7980, 90.4498]}
        zoom={17}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | United International University, Dhaka'
          url={tileUrls[mapStyle]}
          maxZoom={19}
        />

        {/* Hotspot Density Heat Circles around UIU Campus */}
        {showHeatmap && (
          <>
            <Circle
              center={[23.7988, 90.4506]} // UIU Gate 2 Hotspot
              radius={60}
              pathOptions={{ fillColor: '#EF4444', fillOpacity: 0.5, color: '#DC2626', weight: 2 }}
            />
            <Circle
              center={[23.7975, 90.4506]} // UIU Cafeteria
              radius={45}
              pathOptions={{ fillColor: '#F97316', fillOpacity: 0.4, color: '#EA580C', weight: 2 }}
            />
            <Circle
              center={[23.7967, 90.4492]} // UIU Parking South
              radius={40}
              pathOptions={{ fillColor: '#F59E0B', fillOpacity: 0.35, color: '#D97706', weight: 1.5 }}
            />
          </>
        )}

        {/* Campus Operational Zones Polygons */}
        {showZones && zones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.polygonBounds}
            pathOptions={{
              color: zone.riskLevel === 'CRITICAL' ? '#EF4444' : zone.riskLevel === 'HIGH' ? '#F97316' : '#10B981',
              weight: 2,
              dashArray: '4, 4',
              fillColor: zone.riskLevel === 'CRITICAL' ? '#EF4444' : '#10B981',
              fillOpacity: zone.riskLevel === 'CRITICAL' ? 0.15 : 0.06
            }}
          >
            <Popup>
              <div className="p-1 font-sans text-xs">
                <p className="font-bold text-slate-800">{zone.name}</p>
                <p className="text-[11px] text-slate-500">{zone.description}</p>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-emerald-700">{zone.cameraCount} CCTV Nodes</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold">{zone.riskLevel} RISK</span>
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* 16 CCTV Camera Markers */}
        {showCameras && cameras.map((cam) => (
          <Marker
            key={cam.id}
            position={cam.coordinates}
            icon={cameraIcon}
            eventHandlers={{
              click: () => setSelectedCameraId(cam.id),
            }}
          >
            <Popup>
              <div className="p-1 text-xs min-w-[200px]">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Video className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{cam.id}: {cam.name}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{cam.locationName}</p>
                <div className="mt-2 pt-1 border-t border-slate-200 flex items-center justify-between text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{cam.status}</span>
                  <button
                    onClick={() => setSelectedCameraId(cam.id)}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Open Live Feed
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Responding Field Worker Rahim Uddin (Dynamic Live GPS Tracking at UIU) */}
        {showTeams && (
          <Marker
            position={responderCoordinates["usr-resp-1"] || [23.7965, 90.4503]}
            icon={responderIcon}
          >
            <Popup>
              <div className="p-1 text-xs">
                <p className="font-bold text-sky-900">Rahim Uddin (Lead Responder)</p>
                <p className="text-[11px] text-slate-500">Cleaning Team B • Active Unit</p>
                <p className="text-[10px] text-sky-600 mt-1 font-mono font-semibold">📱 +880 1307-726701</p>
                <button
                  onClick={() => openContactModal("01307726701")}
                  className="mt-1 px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Buzz / Call Rahim</span>
                </button>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Incident Markers */}
        {visibleIncidents.map((inc) => (
          <Marker
            key={inc.id}
            position={inc.coordinates}
            icon={createIncidentIcon(inc.priority, inc.status, inc.id)}
            eventHandlers={{
              click: () => setSelectedIncidentId(inc.id),
            }}
          >
            <Popup>
              <div className="p-1 text-xs min-w-[190px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{inc.id}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    inc.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {inc.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-700 mt-1 text-[11px]">{inc.categoryLabel}</p>
                <p className="text-[10px] text-slate-500">{inc.locationName}</p>
                <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-slate-600">AI: {Math.round(inc.aiConfidence * 100)}%</span>
                  <button
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-0.5"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Slide-Over Incident Details Drawer (PRD Section 21) */}
      {selectedIncident && (
        <div className="fixed inset-0 z-[500] flex justify-end" onClick={() => setSelectedIncidentId(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm bg-slate-950/98 backdrop-blur-md border-l border-slate-800 text-white p-4 shadow-2xl flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-emerald-400">{selectedIncident.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  selectedIncident.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  selectedIncident.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {selectedIncident.priority} PRIORITY
                </span>
              </div>
              <button
                onClick={() => setSelectedIncidentId(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Location */}
            <div className="mt-3">
              <h4 className="font-bold text-slate-100 text-sm">{selectedIncident.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{selectedIncident.locationName} • {selectedIncident.cameraName}</p>
            </div>

            {/* Status & SLA Pill */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-mono">STATUS</span>
                <div className="font-bold text-emerald-400 mt-0.5">{selectedIncident.status}</div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-mono">AI INFERENCE</span>
                <div className="font-bold text-slate-200 mt-0.5">{Math.round(selectedIncident.aiConfidence * 100)}% Confidence</div>
              </div>
            </div>

            {/* Real Photographic Before / After Evidence (PRD Section 31) */}
            <div className="mt-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase mb-1.5 flex items-center justify-between">
                <span>Visual Photographic Evidence</span>
                <span className="text-emerald-400 text-[10px]">HIGH RESOLUTION</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 mb-1 font-semibold">BEFORE (DETECTION)</div>
                  <img
                    src={selectedIncident.beforeEvidenceUrl}
                    alt="Before Evidence"
                    className="w-full h-24 object-cover rounded-xl border border-red-500/40 shadow"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1 font-semibold">AFTER (CLEANED)</div>
                  {selectedIncident.afterEvidenceUrl ? (
                    <img
                      src={selectedIncident.afterEvidenceUrl}
                      alt="After Evidence"
                      className="w-full h-24 object-cover rounded-xl border border-emerald-500/40 shadow"
                    />
                  ) : (
                    <div className="w-full h-24 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 text-[10px] p-2 text-center">
                      <Clock className="w-4 h-4 text-slate-600 mb-1" />
                      <span>Pending resolution submission</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Assigned Personnel Info */}
            <div className="mt-4 bg-slate-900 p-3 rounded-2xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Assigned Unit:</span>
                <span className="font-semibold text-slate-200">{selectedIncident.assignedDepartment}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Lead Responder:</span>
                <span className="font-semibold text-emerald-400">{selectedIncident.assignedResponderName || "Unassigned"}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Contact Phone:</span>
                <span className="font-mono text-sky-400 font-bold">01307726701</span>
              </div>
            </div>
          </div>

          {/* Operational Action Buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            
            {/* Step 1 Actions */}
            {selectedIncident.status === 'PENDING_VERIFICATION' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => confirmIncident(selectedIncident.id)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Event</span>
                </button>
                <button
                  onClick={() => deescalateIncident(selectedIncident.id, 'Marked as false detection by operator')}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  Reject False
                </button>
              </div>
            )}

            {/* Step 2 Actions */}
            {selectedIncident.status === 'CONFIRMED' && (
              <button
                onClick={() => assignIncident(selectedIncident.id, "usr-resp-1", "usr-sup-1")}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Dispatch Rahim (01307726701)</span>
              </button>
            )}

            {/* Step 6 Actions */}
            {selectedIncident.status === 'PENDING_APPROVAL' && (
              <button
                onClick={() => approveResolution(selectedIncident.id)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Close</span>
              </button>
            )}

            {/* Contact, De-escalate & Escalate Actions */}
            {selectedIncident.status !== 'CLOSED' && (
              <div className="grid grid-cols-4 gap-1 text-[10px]">
                <button
                  onClick={() => deescalateIncident(selectedIncident.id, 'Hazard downgraded / Situation contained.')}
                  className="py-2 rounded-xl bg-amber-950/70 hover:bg-amber-900/70 text-amber-300 border border-amber-800/60 font-semibold transition"
                  title="De-escalate Incident (User Request 7)"
                >
                  De-escalate
                </button>
                <button
                  onClick={() => escalateIncident(selectedIncident.id, 'Urgent containment requested at UIU Gate 2.')}
                  className="py-2 rounded-xl bg-red-950/70 hover:bg-red-900/70 text-red-300 border border-red-800/60 font-semibold transition"
                  title="Escalate Priority"
                >
                  Escalate
                </button>
                <button
                  onClick={() => reassignIncident(selectedIncident.id, "usr-resp-2", "Workload rebalance")}
                  className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                  title="Reassign"
                >
                  Reassign
                </button>
                <button
                  onClick={() => openContactModal("01307726701")}
                  className="py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 font-bold transition flex items-center justify-center gap-1 shadow"
                  title="Call or SMS 01307726701"
                >
                  <PhoneCall className="w-3 h-3 text-emerald-400" />
                  <span>Buzz</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedCameraId(selectedIncident.cameraId)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect Live Feed ({selectedIncident.cameraId})</span>
            </button>
          </div>
        </div>
        </div>
      )}

    </div>
  );
};
