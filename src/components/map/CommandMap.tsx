import React, { useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polygon, 
  Circle 
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
  Sparkles
} from 'lucide-react';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';
import { IncidentRecord, IncidentStatus } from '../../types';

// Custom Leaflet DivIcons with all 6 PRD Section 20 States
const createIncidentIcon = (priority: string, status: IncidentStatus) => {
  let color = '#EF4444'; // Red for Critical
  let pulseColor = 'rgba(239, 68, 68, 0.4)';
  let labelText = '';

  if (status === 'CLOSED') {
    color = '#10B981'; // Green
    pulseColor = 'rgba(16, 185, 129, 0.3)';
    labelText = '✓';
  } else if (status === 'PENDING_APPROVAL') {
    color = '#A855F7'; // Purple - Awaiting Supervisor Verification
    pulseColor = 'rgba(168, 85, 247, 0.5)';
    labelText = '⏳';
  } else if (status === 'IN_PROGRESS' || status === 'ACCEPTED') {
    color = '#0284C7'; // Blue - Team Responding & Work underway
    pulseColor = 'rgba(2, 132, 199, 0.4)';
    labelText = '⚡';
  } else if (priority === 'CRITICAL' || status === 'ESCALATED') {
    color = '#DC2626'; // Bright Red - Critical Escalation
    pulseColor = 'rgba(220, 38, 38, 0.6)';
    labelText = '!';
  } else if (priority === 'HIGH') {
    color = '#F97316'; // Orange
    pulseColor = 'rgba(249, 115, 22, 0.4)';
  } else {
    color = '#F59E0B'; // Amber
    pulseColor = 'rgba(245, 158, 11, 0.4)';
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${pulseColor}; animation: pulse-ring 1.8s infinite;"></div>
        <div style="width: 24px; height: 24px; border-radius: 50%; background: ${color}; border: 2.5px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
          ${labelText}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
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
    <div style="width: 30px; height: 30px; border-radius: 50%; background: #0284C7; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(2,132,199,0.6); animation: bounce 2s infinite;">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
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
  const approveResolution = useGreenVisionStore((s) => s.approveResolution);

  // Layer Toggles (PRD Section 19)
  const [showCameras, setShowCameras] = useState(true);
  const [showWaste, setShowWaste] = useState(true);
  const [showWater, setShowWater] = useState(true);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showTeams, setShowTeams] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Contact modal state
  const [contactMessageSent, setContactMessageSent] = useState(false);

  // Selected incident details for drawer
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  // Filtered incidents based on active layer toggles
  const visibleIncidents = incidents.filter(i => {
    if (!showWaste && (i.category === 'WASTE_ACCUMULATION' || i.category === 'BIN_OVERFLOW' || i.category === 'ILLEGAL_DUMPING')) return false;
    if (!showWater && i.category === 'WATERLOGGING') return false;
    if (!showTraffic && i.category === 'TRAFFIC_CONGESTION') return false;
    return true;
  });

  return (
    <div className="relative w-full h-[640px] rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-900">
      
      {/* Map Control / Layer Toggle HUD */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-xs shadow-xl">
        <span className="text-[11px] font-mono font-semibold text-slate-400 px-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>LAYERS</span>
        </span>

        <button
          onClick={() => setShowCameras(!showCameras)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            showCameras ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Cameras (16)
        </button>
        <button
          onClick={() => setShowWaste(!showWaste)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            showWaste ? 'bg-slate-800 text-amber-400 border border-amber-500/40' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Waste Events
        </button>
        <button
          onClick={() => setShowWater(!showWater)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            showWater ? 'bg-slate-800 text-sky-400 border border-sky-500/40' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Waterlogging
        </button>
        <button
          onClick={() => setShowTeams(!showTeams)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            showTeams ? 'bg-slate-800 text-indigo-400 border border-indigo-500/40' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Field Teams
        </button>
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
            showHeatmap ? 'bg-red-950 text-red-400 border border-red-500/40 font-bold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Flame className="w-3 h-3" />
          <span>Hotspot Heatmap</span>
        </button>
      </div>

      {/* Map Legend (PRD Section 20) */}
      <div className="absolute bottom-4 left-4 z-[400] bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-3 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
          <span>Critical / Escalated</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Responding</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>Awaiting Approval</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Resolved</span>
        </div>
      </div>

      {/* Leaflet Map Component */}
      <MapContainer
        center={[23.8155, 90.4248]}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Hotspot Density Heat Circles (PRD Section 19 & 34) */}
        {showHeatmap && (
          <>
            <Circle
              center={[23.8172, 90.4248]} // Gate 2
              radius={70}
              pathOptions={{ fillColor: '#EF4444', fillOpacity: 0.45, color: '#DC2626', weight: 1.5 }}
            />
            <Circle
              center={[23.8152, 90.4258]} // Cafeteria
              radius={50}
              pathOptions={{ fillColor: '#F97316', fillOpacity: 0.35, color: '#EA580C', weight: 1.5 }}
            />
            <Circle
              center={[23.8136, 90.4250]} // Parking South
              radius={45}
              pathOptions={{ fillColor: '#F59E0B', fillOpacity: 0.3, color: '#D97706', weight: 1.5 }}
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
              weight: 1.5,
              dashArray: '4, 4',
              fillColor: zone.riskLevel === 'CRITICAL' ? '#EF4444' : '#10B981',
              fillOpacity: zone.riskLevel === 'CRITICAL' ? 0.12 : 0.05
            }}
          >
            <Popup>
              <div className="p-1 font-sans text-xs">
                <p className="font-bold text-slate-800">{zone.name}</p>
                <p className="text-[11px] text-slate-500">{zone.description}</p>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-emerald-700">{zone.cameraCount} Cameras</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold">{zone.riskLevel} RISK</span>
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* CCTV Camera Markers */}
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
              <div className="p-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Video className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{cam.id}: {cam.name}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{cam.locationName}</p>
                <div className="mt-2 pt-1 border-t border-slate-200 flex items-center justify-between text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{cam.status}</span>
                  <span className="text-slate-500 font-mono">{cam.feedResolution}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Responding Field Worker (Dynamic GPS Movement) */}
        {showTeams && (
          <Marker
            position={responderCoordinates["usr-resp-1"] || [23.8145, 90.4230]}
            icon={responderIcon}
          >
            <Popup>
              <div className="p-1 text-xs">
                <p className="font-bold text-sky-900">Rahim Uddin (Lead Responder)</p>
                <p className="text-[11px] text-slate-500">Cleaning Team B</p>
                <p className="text-[10px] text-sky-600 mt-1 font-semibold">Active GPS Tracking Position</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Incident Markers */}
        {visibleIncidents.map((inc) => (
          <Marker
            key={inc.id}
            position={inc.coordinates}
            icon={createIncidentIcon(inc.priority, inc.status)}
            eventHandlers={{
              click: () => setSelectedIncidentId(inc.id),
            }}
          >
            <Popup>
              <div className="p-1 text-xs min-w-[180px]">
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
                  <span className="font-mono text-slate-600">AI: {Math.round(inc.aiConfidence * 100)}% Conf</span>
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
        <div className="absolute top-0 right-0 bottom-0 w-96 z-[450] bg-slate-900/95 backdrop-blur-md border-l border-slate-800 text-white p-4 shadow-2xl flex flex-col justify-between overflow-y-auto">
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
                  {selectedIncident.priority}
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
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-mono">STATUS</span>
                <div className="font-bold text-emerald-400 mt-0.5">{selectedIncident.status}</div>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-mono">AI CONFIDENCE</span>
                <div className="font-bold text-slate-200 mt-0.5">{Math.round(selectedIncident.aiConfidence * 100)}% Verified</div>
              </div>
            </div>

            {/* Before / After Evidence Preview (PRD Section 31) */}
            <div className="mt-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase mb-1.5 flex items-center justify-between">
                <span>Visual Evidence</span>
                <span className="text-emerald-400 text-[10px]">CCTV SNAPSHOT</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 mb-1 font-semibold">BEFORE (DETECTION)</div>
                  <img
                    src={selectedIncident.beforeEvidenceUrl}
                    alt="Before Evidence"
                    className="w-full h-24 object-cover rounded-lg border border-red-500/40"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1 font-semibold">AFTER (RESOLVED)</div>
                  {selectedIncident.afterEvidenceUrl ? (
                    <img
                      src={selectedIncident.afterEvidenceUrl}
                      alt="After Evidence"
                      className="w-full h-24 object-cover rounded-lg border border-emerald-500/40"
                    />
                  ) : (
                    <div className="w-full h-24 rounded-lg border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 text-[10px] p-2 text-center">
                      <Clock className="w-4 h-4 text-slate-600 mb-1" />
                      <span>Pending resolution submission</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Assigned Personnel Info */}
            <div className="mt-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Assigned Unit:</span>
                <span className="font-semibold text-slate-200">{selectedIncident.assignedDepartment}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px] mt-1.5">
                <span>Lead Responder:</span>
                <span className="font-semibold text-emerald-400">{selectedIncident.assignedResponderName || "Unassigned"}</span>
              </div>
            </div>

            {/* Simulated Contact Drawer */}
            {contactMessageSent && (
              <div className="mt-3 p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Priority SMS dispatched to {selectedIncident.assignedResponderName || 'Cleaning Team B'}</span>
              </div>
            )}
          </div>

          {/* Full Operational Action Set (PRD Section 21) */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            
            {/* Step 1 Actions */}
            {selectedIncident.status === 'PENDING_VERIFICATION' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => confirmIncident(selectedIncident.id)}
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Event</span>
                </button>
                <button
                  onClick={() => confirmIncident(selectedIncident.id, 'HIGH', 'Flagged for quick triage')}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  Reject False
                </button>
              </div>
            )}

            {/* Step 2 Actions */}
            {selectedIncident.status === 'CONFIRMED' && (
              <button
                onClick={() => assignIncident(selectedIncident.id, "usr-resp-1", "usr-sup-1")}
                className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Dispatch Rahim (Team B)</span>
              </button>
            )}

            {/* Step 6 Actions */}
            {selectedIncident.status === 'PENDING_APPROVAL' && (
              <button
                onClick={() => approveResolution(selectedIncident.id)}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Close</span>
              </button>
            )}

            {/* Secondary Operational Actions (Escalate, Reassign, Contact) */}
            {selectedIncident.status !== 'CLOSED' && (
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  onClick={() => escalateIncident(selectedIncident.id, 'SLA warning - urgent attention requested.')}
                  className="py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/60 font-medium transition"
                  title="Escalate Priority"
                >
                  Escalate
                </button>
                <button
                  onClick={() => reassignIncident(selectedIncident.id, "usr-resp-2", "Workload rebalance")}
                  className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                  title="Reassign to Faruk Mia"
                >
                  Reassign
                </button>
                <button
                  onClick={() => {
                    setContactMessageSent(true);
                    setTimeout(() => setContactMessageSent(false), 3000);
                  }}
                  className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center justify-center gap-1"
                  title="Contact Team via SMS"
                >
                  <PhoneCall className="w-3 h-3 text-sky-400" />
                  <span>Contact</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedCameraId(selectedIncident.cameraId)}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect Camera Feed ({selectedIncident.cameraId})</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
