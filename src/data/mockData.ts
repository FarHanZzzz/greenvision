import { 
  OperationalZone, 
  CameraRecord, 
  UserProfile, 
  IncidentRecord, 
  ActivityEvent,
  NotificationItem
} from '../types';

// Realistic SVG Data URIs for Before & After evidence images
export const EVIDENCE_IMAGES = {
  wasteBefore: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23334155'/%3E%3Crect y='260' width='600' height='140' fill='%231e293b'/%3E%3Cpath d='M100 240 L160 210 L280 270 L120 310 Z' fill='%23475569'/%3E%3Cpath d='M220 280 Q250 210 290 270 Q340 220 370 290 Q300 320 220 280' fill='%231e3a8a'/%3E%3Ccircle cx='240' cy='260' r='35' fill='%230f172a' opacity='0.9'/%3E%3Ccircle cx='290' cy='250' r='40' fill='%231e293b' opacity='0.9'/%3E%3Ccircle cx='340' cy='270' r='30' fill='%230284c7' opacity='0.8'/%3E%3Cpath d='M180 300 L210 270 L250 310 Z' fill='%23e2e8f0' opacity='0.7'/%3E%3Cpath d='M320 290 L360 280 L350 320 Z' fill='%23fbbf24' opacity='0.8'/%3E%3Crect x='200' y='190' width='180' height='120' fill='none' stroke='%23ef4444' stroke-width='3' stroke-dasharray='6'/%3E%3Crect x='200' y='165' width='140' height='24' fill='%23ef4444' rx='3'/%3E%3Ctext x='206' y='181' fill='white' font-family='monospace' font-size='11' font-weight='bold'%3EAI: WASTE ACCUMULATION 94%25%3C/text%3E%3Ctext x='20' y='40' fill='%2394a3b8' font-family='monospace' font-size='14'%3ECCTV GV-CAM-004 [GATE 2 NORTH]%3C/text%3E%3C/svg%3E",
  wasteAfter: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23334155'/%3E%3Crect y='260' width='600' height='140' fill='%231e293b'/%3E%3Cpath d='M100 240 L160 210 L280 270 L120 310 Z' fill='%23475569'/%3E%3Crect x='240' y='210' width='50' height='70' rx='6' fill='%23059669'/%3E%3Cpath d='M235 210 L295 210 L285 200 L245 200 Z' fill='%23047857'/%3E%3Crect x='190' y='170' width='160' height='26' fill='%2310b981' rx='4'/%3E%3Ctext x='196' y='187' fill='white' font-family='monospace' font-size='11' font-weight='bold'%3ERESOLUTION VERIFIED%3C/text%3E%3Ctext x='20' y='40' fill='%2394a3b8' font-family='monospace' font-size='14'%3ECCTV GV-CAM-004 [AREA SANITIZED]%3C/text%3E%3C/svg%3E",
  binBefore: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%231e293b'/%3E%3Crect x='220' y='160' width='120' height='170' rx='8' fill='%23334155'/%3E%3Cpath d='M210 160 L350 160 L340 140 L220 140 Z' fill='%23475569'/%3E%3Ccircle cx='260' cy='135' r='25' fill='%23ef4444' opacity='0.8'/%3E%3Ccircle cx='300' cy='130' r='30' fill='%23f59e0b' opacity='0.8'/%3E%3Cpath d='M200 330 L360 330 L340 370 L180 370 Z' fill='%230f172a'/%3E%3Crect x='190' y='100' width='180' height='240' fill='none' stroke='%23f97316' stroke-width='3' stroke-dasharray='4'/%3E%3Ctext x='20' y='40' fill='%2394a3b8' font-family='monospace' font-size='14'%3ECCTV GV-CAM-006 [CAFETERIA EAST]%3C/text%3E%3C/svg%3E",
  binAfter: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%231e293b'/%3E%3Crect x='220' y='160' width='120' height='170' rx='8' fill='%23059669'/%3E%3Cpath d='M210 160 L350 160 L330 150 L230 150 Z' fill='%23047857'/%3E%3Crect x='200' y='100' width='160' height='26' fill='%2310b981' rx='4'/%3E%3Ctext x='206' y='117' fill='white' font-family='monospace' font-size='11' font-weight='bold'%3EBIN EMPTIED %26 CLEANED%3C/text%3E%3Ctext x='20' y='40' fill='%2394a3b8' font-family='monospace' font-size='14'%3ECCTV GV-CAM-006 [NORMAL STATUS]%3C/text%3E%3C/svg%3E",
  waterBefore: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%230f172a'/%3E%3Cellipse cx='300' cy='280' rx='220' ry='70' fill='%231e3a8a' opacity='0.7'/%3E%3Cellipse cx='280' cy='280' rx='160' ry='45' fill='%2338bdf8' opacity='0.4'/%3E%3Crect x='120' y='210' width='360' height='140' fill='none' stroke='%2338bdf8' stroke-width='2' stroke-dasharray='5'/%3E%3Ctext x='20' y='40' fill='%2394a3b8' font-family='monospace' font-size='14'%3ECCTV GV-CAM-009 [PARKING SOUTH DRAINAGE]%3C/text%3E%3C/svg%3E",
  waterAfter: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%230f172a'/%3E%3Crect y='220' width='600' height='180' fill='%231e293b'/%3E%3Ctext x='200' y='310' fill='%2310b981' font-family='sans-serif' font-size='16' font-weight='bold'%3EPUMP DRAINAGE COMPLETED%3C/text%3E%3Ctext x='20' y='40' fill='%2394a3b8' font-family='monospace' font-size='14'%3ECCTV GV-CAM-009 [CLEARED]%3C/text%3E%3C/svg%3E"
};

// 10 Campus Zones in Dhaka (Centroid around 23.8150, 90.4250)
export const CAMPUS_ZONES: OperationalZone[] = [
  {
    id: "zone-1",
    name: "Main Campus Gate (Zone 1)",
    code: "Z-MG",
    centerCoordinates: [23.8154, 90.4225],
    polygonBounds: [
      [23.8160, 90.4218],
      [23.8162, 90.4232],
      [23.8148, 90.4233],
      [23.8146, 90.4219]
    ],
    cameraCount: 2,
    activeIncidentCount: 0,
    riskLevel: "LOW",
    description: "Primary vehicular & pedestrian security checkpoint",
    recommendedAction: "Maintain standard security schedule"
  },
  {
    id: "zone-2",
    name: "Gate 2 & Perimeter (Zone 2)",
    code: "Z-G2",
    centerCoordinates: [23.8172, 90.4248],
    polygonBounds: [
      [23.8178, 90.4238],
      [23.8180, 90.4258],
      [23.8165, 90.4259],
      [23.8164, 90.4239]
    ],
    cameraCount: 2,
    activeIncidentCount: 1,
    riskLevel: "CRITICAL",
    description: "Secondary perimeter exit with heavy vendor traffic and evening waste buildup",
    recommendedAction: "Increase cleaning sweep frequency between 4:00 PM – 7:00 PM; add dual 240L bins"
  },
  {
    id: "zone-3",
    name: "Academic Block A (Engineering)",
    code: "Z-ABA",
    centerCoordinates: [23.8158, 90.4242],
    polygonBounds: [
      [23.8164, 90.4235],
      [23.8165, 90.4250],
      [23.8151, 90.4251],
      [23.8150, 90.4236]
    ],
    cameraCount: 2,
    activeIncidentCount: 0,
    riskLevel: "LOW",
    description: "Multistory classrooms, faculty offices, and front courtyard",
    recommendedAction: "Routine checks between class transitions"
  },
  {
    id: "zone-4",
    name: "Academic Block B (Business & Arts)",
    code: "Z-ABB",
    centerCoordinates: [23.8146, 90.4244],
    polygonBounds: [
      [23.8152, 90.4236],
      [23.8153, 90.4252],
      [23.8139, 90.4253],
      [23.8138, 90.4237]
    ],
    cameraCount: 2,
    activeIncidentCount: 0,
    riskLevel: "LOW",
    description: "Lecture halls, study lounges, and student advisory center",
    recommendedAction: "Monitor foyer bins post-lunch hours"
  },
  {
    id: "zone-5",
    name: "Central Cafeteria & Food Court",
    code: "Z-CAF",
    centerCoordinates: [23.8152, 90.4258],
    polygonBounds: [
      [23.8159, 90.4251],
      [23.8160, 90.4267],
      [23.8145, 90.4268],
      [23.8144, 90.4252]
    ],
    cameraCount: 2,
    activeIncidentCount: 1,
    riskLevel: "HIGH",
    description: "High foot-traffic dining area with frequent packaging waste",
    recommendedAction: "Continuous 30-min empty cycle during 12:30 PM – 3:00 PM lunch peak"
  },
  {
    id: "zone-6",
    name: "Parking North (Faculty)",
    code: "Z-PKN",
    centerCoordinates: [23.8168, 90.4265],
    polygonBounds: [
      [23.8175, 90.4257],
      [23.8176, 90.4273],
      [23.8161, 90.4274],
      [23.8160, 90.4258]
    ],
    cameraCount: 1,
    activeIncidentCount: 0,
    riskLevel: "LOW",
    description: "Covered car park and EV charging stalls",
    recommendedAction: "Check oil spots and pavement cleanliness weekly"
  },
  {
    id: "zone-7",
    name: "Parking South & Bus Bay",
    code: "Z-PKS",
    centerCoordinates: [23.8136, 90.4250],
    polygonBounds: [
      [23.8143, 90.4241],
      [23.8144, 90.4260],
      [23.8128, 90.4261],
      [23.8127, 90.4242]
    ],
    cameraCount: 2,
    activeIncidentCount: 0,
    riskLevel: "MEDIUM",
    description: "Student bus bay and motorcycle parking; susceptible to monsoon waterlogging",
    recommendedAction: "Inspect catch-basins and drainage pump prior to forecasted rain"
  },
  {
    id: "zone-8",
    name: "Central Waste Collection Hub",
    code: "Z-WST",
    centerCoordinates: [23.8170, 90.4226],
    polygonBounds: [
      [23.8176, 90.4219],
      [23.8177, 90.4233],
      [23.8163, 90.4234],
      [23.8162, 90.4220]
    ],
    cameraCount: 2,
    activeIncidentCount: 0,
    riskLevel: "MEDIUM",
    description: "Segregated dumpsters, organic composter, and municipal truck loading dock",
    recommendedAction: "Enforce nighttime compaction and odor bio-spray"
  },
  {
    id: "zone-9",
    name: "Service & Delivery Road",
    code: "Z-SVR",
    centerCoordinates: [23.8142, 90.4224],
    polygonBounds: [
      [23.8149, 90.4218],
      [23.8150, 90.4230],
      [23.8134, 90.4231],
      [23.8133, 90.4219]
    ],
    cameraCount: 1,
    activeIncidentCount: 0,
    riskLevel: "LOW",
    description: "Rear supply logistics route for canteen & maintenance supplies",
    recommendedAction: "Monitor unloading speeds to avoid blocking access"
  },
  {
    id: "zone-10",
    name: "Lakefront & Drainage Channel",
    code: "Z-DRN",
    centerCoordinates: [23.8148, 90.4272],
    polygonBounds: [
      [23.8156, 90.4265],
      [23.8158, 90.4280],
      [23.8140, 90.4281],
      [23.8138, 90.4266]
    ],
    cameraCount: 1,
    activeIncidentCount: 0,
    riskLevel: "LOW",
    description: "Rainwater retention pond and bio-filtration runoff channel",
    recommendedAction: "Bi-weekly debris netting and algae inspection"
  }
];

// 16 CCTV Cameras (GV-CAM-001 to GV-CAM-016)
export const CAMERAS: CameraRecord[] = [
  {
    id: "GV-CAM-001",
    name: "Main Gate West Entry",
    locationId: "zone-1",
    locationName: "Main Campus Gate",
    coordinates: [23.8156, 90.4222],
    status: "ONLINE",
    coverageCategory: "TRAFFIC_CONGESTION",
    lastEventTime: "10 mins ago",
    directionDeg: 110,
    feedResolution: "1080p 30fps (H.265)"
  },
  {
    id: "GV-CAM-002",
    name: "Main Gate Pedestrian Lane",
    locationId: "zone-1",
    locationName: "Main Campus Gate",
    coordinates: [23.8152, 90.4227],
    status: "ONLINE",
    coverageCategory: "WASTE_ACCUMULATION",
    lastEventTime: "45 mins ago",
    directionDeg: 270,
    feedResolution: "1080p 30fps (H.265)"
  },
  {
    id: "GV-CAM-003",
    name: "Gate 2 Boundary Wall",
    locationId: "zone-2",
    locationName: "Gate 2 & Perimeter",
    coordinates: [23.8170, 90.4244],
    status: "ONLINE",
    coverageCategory: "ILLEGAL_DUMPING",
    lastEventTime: "2 hrs ago",
    directionDeg: 45,
    feedResolution: "4K 25fps (IR Night)"
  },
  {
    id: "GV-CAM-004",
    name: "Gate 2 Waste Collection Point",
    locationId: "zone-2",
    locationName: "Gate 2 & Perimeter",
    coordinates: [23.8174, 90.4251],
    status: "ONLINE",
    coverageCategory: "WASTE_ACCUMULATION",
    lastEventTime: "3 mins ago",
    currentIncidentId: "GV-1042",
    directionDeg: 180,
    feedResolution: "4K 30fps (AI Optical)"
  },
  {
    id: "GV-CAM-005",
    name: "Cafeteria Terrace Bins",
    locationId: "zone-5",
    locationName: "Central Cafeteria",
    coordinates: [23.8155, 90.4255],
    status: "ONLINE",
    coverageCategory: "BIN_OVERFLOW",
    lastEventTime: "18 mins ago",
    currentIncidentId: "GV-1039",
    directionDeg: 210,
    feedResolution: "1080p 30fps"
  },
  {
    id: "GV-CAM-006",
    name: "Cafeteria Rear Waste Shute",
    locationId: "zone-5",
    locationName: "Central Cafeteria",
    coordinates: [23.8150, 90.4262],
    status: "ONLINE",
    coverageCategory: "BIN_OVERFLOW",
    lastEventTime: "1 hr ago",
    directionDeg: 315,
    feedResolution: "1080p 30fps"
  },
  {
    id: "GV-CAM-007",
    name: "Academic Block A Front Court",
    locationId: "zone-3",
    locationName: "Academic Block A",
    coordinates: [23.8160, 90.4240],
    status: "ONLINE",
    coverageCategory: "WASTE_ACCUMULATION",
    lastEventTime: "3 hrs ago",
    directionDeg: 90,
    feedResolution: "1080p 30fps"
  },
  {
    id: "GV-CAM-008",
    name: "Academic Block A North Corridor",
    locationId: "zone-3",
    locationName: "Academic Block A",
    coordinates: [23.8156, 90.4246],
    status: "ONLINE",
    coverageCategory: "SMOKE_EVENT",
    lastEventTime: "5 hrs ago",
    directionDeg: 350,
    feedResolution: "1080p 25fps"
  },
  {
    id: "GV-CAM-009",
    name: "Parking South Drainage Sump",
    locationId: "zone-7",
    locationName: "Parking South & Bus Bay",
    coordinates: [23.8138, 90.4248],
    status: "ONLINE",
    coverageCategory: "WATERLOGGING",
    lastEventTime: "4 hrs ago",
    directionDeg: 140,
    feedResolution: "1080p 30fps (Flood Alert)"
  },
  {
    id: "GV-CAM-010",
    name: "Parking South Bus Bay Turn",
    locationId: "zone-7",
    locationName: "Parking South & Bus Bay",
    coordinates: [23.8134, 90.4254],
    status: "ONLINE",
    coverageCategory: "TRAFFIC_CONGESTION",
    lastEventTime: "1 hr ago",
    directionDeg: 260,
    feedResolution: "1080p 30fps"
  },
  {
    id: "GV-CAM-011",
    name: "Academic Block B Plaza",
    locationId: "zone-4",
    locationName: "Academic Block B",
    coordinates: [23.8148, 90.4241],
    status: "ONLINE",
    coverageCategory: "WASTE_ACCUMULATION",
    lastEventTime: "30 mins ago",
    directionDeg: 80,
    feedResolution: "1080p 30fps"
  },
  {
    id: "GV-CAM-012",
    name: "Academic Block B East Lawn",
    locationId: "zone-4",
    locationName: "Academic Block B",
    coordinates: [23.8144, 90.4248],
    status: "ONLINE",
    coverageCategory: "ILLEGAL_DUMPING",
    lastEventTime: "6 hrs ago",
    directionDeg: 290,
    feedResolution: "1080p 25fps"
  },
  {
    id: "GV-CAM-013",
    name: "Parking North Ramp",
    locationId: "zone-6",
    locationName: "Parking North",
    coordinates: [23.8168, 90.4265],
    status: "ONLINE",
    coverageCategory: "TRAFFIC_CONGESTION",
    lastEventTime: "2 hrs ago",
    directionDeg: 120,
    feedResolution: "1080p 30fps"
  },
  {
    id: "GV-CAM-014",
    name: "Waste Collection Sorter Dock",
    locationId: "zone-8",
    locationName: "Central Waste Collection Hub",
    coordinates: [23.8169, 90.4223],
    status: "ONLINE",
    coverageCategory: "WASTE_ACCUMULATION",
    lastEventTime: "15 mins ago",
    directionDeg: 75,
    feedResolution: "4K 30fps"
  },
  {
    id: "GV-CAM-015",
    name: "Service Road West Depot",
    locationId: "zone-9",
    locationName: "Service & Delivery Road",
    coordinates: [23.8142, 90.4224],
    status: "ONLINE",
    coverageCategory: "ILLEGAL_DUMPING",
    lastEventTime: "7 hrs ago",
    directionDeg: 190,
    feedResolution: "1080p 25fps"
  },
  {
    id: "GV-CAM-016",
    name: "Lake Retention Weir",
    locationId: "zone-10",
    locationName: "Lakefront & Drainage Channel",
    coordinates: [23.8148, 90.4272],
    status: "ONLINE",
    coverageCategory: "WATERLOGGING",
    lastEventTime: "12 hrs ago",
    directionDeg: 225,
    feedResolution: "1080p 30fps"
  }
];

// Personnel Roster (Bangladeshi context)
export const USERS: UserProfile[] = [
  {
    id: "usr-admin-1",
    name: "Dr. Tariqul Islam",
    role: "ADMIN",
    roleTitle: "Director of Campus Facilities",
    department: "CLEANING",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1711-098234",
    email: "tariqul.islam@campus.edu.bd"
  },
  {
    id: "usr-op-1",
    name: "Tanvir Ahmed",
    role: "CONTROL_OPERATOR",
    roleTitle: "Senior Control Room Operator",
    department: "SECURITY",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1819-456712",
    email: "tanvir.ctrl@campus.edu.bd"
  },
  {
    id: "usr-op-2",
    name: "Nusrat Jahan",
    role: "CONTROL_OPERATOR",
    roleTitle: "Environmental AI Triage Specialist",
    department: "SECURITY",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1912-789012",
    email: "nusrat.ctrl@campus.edu.bd"
  },
  {
    id: "usr-sup-1",
    name: "Kamal Hossain",
    role: "SUPERVISOR",
    roleTitle: "Shift Supervisor (Waste & Sanitation)",
    department: "CLEANING",
    team: "Cleaning Team B",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1715-890123",
    email: "kamal.sup@campus.edu.bd"
  },
  {
    id: "usr-sup-2",
    name: "Engr. Shahriar Khan",
    role: "SUPERVISOR",
    roleTitle: "Facilities & Maintenance Supervisor",
    department: "MAINTENANCE",
    team: "Civil Works Unit",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1678-234567",
    email: "shahriar.maint@campus.edu.bd"
  },
  {
    id: "usr-resp-1",
    name: "Rahim Uddin",
    role: "FIELD_RESPONDER",
    roleTitle: "Lead Sanitarian Responder",
    department: "CLEANING",
    team: "Cleaning Team B",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1823-112233",
    email: "rahim.field@campus.edu.bd",
    status: "AVAILABLE",
    completedTasksToday: 4,
    avgResponseTimeMin: 6.4
  },
  {
    id: "usr-resp-2",
    name: "Faruk Mia",
    role: "FIELD_RESPONDER",
    roleTitle: "Rapid Cleanup Responder",
    department: "CLEANING",
    team: "Cleaning Team A",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1734-556677",
    email: "faruk.field@campus.edu.bd",
    status: "AVAILABLE",
    completedTasksToday: 3,
    avgResponseTimeMin: 7.1
  },
  {
    id: "usr-resp-3",
    name: "Abdul Alim",
    role: "FIELD_RESPONDER",
    roleTitle: "Drainage & Pump Technician",
    department: "MAINTENANCE",
    team: "Civil Works Unit",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1918-998877",
    email: "alim.maint@campus.edu.bd",
    status: "AVAILABLE",
    completedTasksToday: 2,
    avgResponseTimeMin: 12.0
  },
  {
    id: "usr-resp-4",
    name: "Sultana Begum",
    role: "FIELD_RESPONDER",
    roleTitle: "Campus Grounds Sanitation Officer",
    department: "CLEANING",
    team: "Cleaning Team A",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1729-334455",
    email: "sultana.field@campus.edu.bd",
    status: "AVAILABLE",
    completedTasksToday: 5,
    avgResponseTimeMin: 5.8
  },
  {
    id: "usr-sust-1",
    name: "Farhana Yasmin",
    role: "SUSTAINABILITY_MANAGER",
    roleTitle: "Chief Sustainability Officer",
    department: "SAFETY",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1712-990011",
    email: "farhana.sustainability@campus.edu.bd"
  }
];

// Helper to generate ISO timestamps relative to now
const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const daysAgo = (d: number, hourOffset: number = 0) => new Date(now.getTime() - (d * 24 + hourOffset) * 3600000).toISOString();

// Pre-seeded Realistic Incidents (70+ incidents for robust analytics)
export const INITIAL_INCIDENTS: IncidentRecord[] = [
  // Live Active Incident 1: The Gate 2 Showcase Incident
  {
    id: "GV-1042",
    title: "Heavy Waste Accumulation near Gate 2 Vendors",
    category: "WASTE_ACCUMULATION",
    categoryLabel: "Waste Accumulation",
    description: "AI vision detected large black plastic garbage bags and discarded food containers near Gate 2 perimeter boundary.",
    cameraId: "GV-CAM-004",
    cameraName: "Gate 2 Waste Collection Point",
    locationId: "zone-2",
    locationName: "Gate 2 & Perimeter",
    coordinates: [23.8174, 90.4251],
    priority: "HIGH",
    status: "PENDING_VERIFICATION",
    aiConfidence: 0.94,
    detectedAt: hoursAgo(0.1),
    slaMinutes: 30,
    slaDeadline: new Date(now.getTime() + 25 * 60000).toISOString(),
    assignedDepartment: "CLEANING",
    beforeEvidenceUrl: EVIDENCE_IMAGES.wasteBefore,
    operatorNotes: "Vendor crowd dispersed leaving heavy waste piles."
  },
  // Live Active Incident 2: Cafeteria Overflow
  {
    id: "GV-1039",
    title: "Post-Lunch Bin Overflowing at Terrace Area",
    category: "BIN_OVERFLOW",
    categoryLabel: "Bin Overflow",
    description: "Optical sensor triggers 100% capacity alarm with cups and beverage cartons spilling onto pavers.",
    cameraId: "GV-CAM-005",
    cameraName: "Cafeteria Terrace Bins",
    locationId: "zone-5",
    locationName: "Central Cafeteria",
    coordinates: [23.8155, 90.4255],
    priority: "MEDIUM",
    status: "ASSIGNED",
    aiConfidence: 0.89,
    detectedAt: hoursAgo(0.5),
    verifiedAt: hoursAgo(0.4),
    assignedAt: hoursAgo(0.3),
    slaMinutes: 45,
    slaDeadline: new Date(now.getTime() + 15 * 60000).toISOString(),
    assignedDepartment: "CLEANING",
    assignedSupervisorId: "usr-sup-1",
    assignedSupervisorName: "Kamal Hossain",
    assignedResponderId: "usr-resp-4",
    assignedResponderName: "Sultana Begum",
    beforeEvidenceUrl: EVIDENCE_IMAGES.binBefore
  },
  // Incident 3: Parking South Waterlogging (In Progress)
  {
    id: "GV-1035",
    title: "Rainwater Ponding across South Bus Ramp",
    category: "WATERLOGGING",
    categoryLabel: "Waterlogging",
    description: "Catch-basin blocked by leaf debris resulting in 15cm standing pool.",
    cameraId: "GV-CAM-009",
    cameraName: "Parking South Drainage Sump",
    locationId: "zone-7",
    locationName: "Parking South & Bus Bay",
    coordinates: [23.8138, 90.4248],
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    aiConfidence: 0.96,
    detectedAt: hoursAgo(1.5),
    verifiedAt: hoursAgo(1.4),
    assignedAt: hoursAgo(1.2),
    acceptedAt: hoursAgo(1.1),
    workStartedAt: hoursAgo(0.8),
    slaMinutes: 60,
    slaDeadline: new Date(now.getTime() + 5 * 60000).toISOString(),
    assignedDepartment: "MAINTENANCE",
    assignedSupervisorId: "usr-sup-2",
    assignedSupervisorName: "Engr. Shahriar Khan",
    assignedResponderId: "usr-resp-3",
    assignedResponderName: "Abdul Alim",
    beforeEvidenceUrl: EVIDENCE_IMAGES.waterBefore,
    responderNotes: "Submersible pump deployed; clearing drain mouth."
  },
  // Incident 4: Academic Block A resolved today
  {
    id: "GV-1031",
    title: "Cardboard Packaging Left on Courtyard Steps",
    category: "WASTE_ACCUMULATION",
    categoryLabel: "Waste Accumulation",
    description: "Lab delivery crates discarded outside robotics laboratory.",
    cameraId: "GV-CAM-007",
    cameraName: "Academic Block A Front Court",
    locationId: "zone-3",
    locationName: "Academic Block A",
    coordinates: [23.8160, 90.4240],
    priority: "LOW",
    status: "CLOSED",
    aiConfidence: 0.91,
    detectedAt: hoursAgo(4),
    verifiedAt: hoursAgo(3.8),
    assignedAt: hoursAgo(3.6),
    acceptedAt: hoursAgo(3.5),
    workStartedAt: hoursAgo(3.4),
    resolvedAt: hoursAgo(3.0),
    closedAt: hoursAgo(2.8),
    slaMinutes: 60,
    slaDeadline: hoursAgo(2.8),
    assignedDepartment: "CLEANING",
    assignedSupervisorId: "usr-sup-1",
    assignedSupervisorName: "Kamal Hossain",
    assignedResponderId: "usr-resp-1",
    assignedResponderName: "Rahim Uddin",
    beforeEvidenceUrl: EVIDENCE_IMAGES.wasteBefore,
    afterEvidenceUrl: EVIDENCE_IMAGES.wasteAfter,
    operatorNotes: "Verified via Camera 7.",
    responderNotes: "Boxes flattened and moved to Recycling Bay.",
    supervisorNotes: "Prompt response under 30 minutes. Approved."
  },
  // Incident 5: False Detection
  {
    id: "GV-1028",
    title: "Shadow Artifact Flagged as Spill",
    category: "WASTE_ACCUMULATION",
    categoryLabel: "Waste Accumulation",
    description: "Tree canopy shadow in twilight incorrectly triggered optical density threshold.",
    cameraId: "GV-CAM-012",
    cameraName: "Academic Block B East Lawn",
    locationId: "zone-4",
    locationName: "Academic Block B",
    coordinates: [23.8144, 90.4248],
    priority: "LOW",
    status: "FALSE_DETECTION",
    aiConfidence: 0.68,
    detectedAt: hoursAgo(8),
    verifiedAt: hoursAgo(7.9),
    slaMinutes: 30,
    slaDeadline: hoursAgo(7.5),
    assignedDepartment: "CLEANING",
    beforeEvidenceUrl: EVIDENCE_IMAGES.wasteBefore,
    operatorNotes: "Confirmed sun angle shadow. Closed as False Alarm."
  }
];

// Helper to seed 65 additional historical incidents for Recharts graphs
const CATEGORIES: { cat: any; label: string; dept: any; p: any }[] = [
  { cat: "WASTE_ACCUMULATION", label: "Waste Accumulation", dept: "CLEANING", p: "HIGH" },
  { cat: "BIN_OVERFLOW", label: "Bin Overflow", dept: "CLEANING", p: "MEDIUM" },
  { cat: "ILLEGAL_DUMPING", label: "Illegal Dumping", dept: "CLEANING", p: "CRITICAL" },
  { cat: "WATERLOGGING", label: "Waterlogging", dept: "MAINTENANCE", p: "HIGH" },
  { cat: "TRAFFIC_CONGESTION", label: "Traffic Congestion", dept: "SECURITY", p: "MEDIUM" },
  { cat: "SMOKE_EVENT", label: "Smoke Event", dept: "SAFETY", p: "CRITICAL" }
];

for (let i = 1; i <= 65; i++) {
  const dayOffset = Math.floor(i / 2.5); // Spread over past 25 days
  const catItem = CATEGORIES[i % CATEGORIES.length];
  const zoneIndex = (i * 3) % CAMPUS_ZONES.length;
  const zone = CAMPUS_ZONES[zoneIndex];
  const cam = CAMERAS[i % CAMERAS.length];
  const hour = 14 + (i % 8); // Spread mostly in 2 PM – 9 PM (peak 4 PM - 7 PM)
  
  const detected = daysAgo(dayOffset, -(hour - 12));
  const closed = daysAgo(dayOffset, -(hour - 11));

  INITIAL_INCIDENTS.push({
    id: `GV-${1000 - i}`,
    title: `${catItem.label} in ${zone.name}`,
    category: catItem.cat,
    categoryLabel: catItem.label,
    description: `Historical operational incident managed by GreenVision operational closed-loop.`,
    cameraId: cam.id,
    cameraName: cam.name,
    locationId: zone.id,
    locationName: zone.name,
    coordinates: zone.centerCoordinates,
    priority: catItem.p,
    status: "CLOSED",
    aiConfidence: 0.85 + (i % 15) * 0.01,
    detectedAt: detected,
    verifiedAt: detected,
    assignedAt: detected,
    acceptedAt: detected,
    workStartedAt: detected,
    resolvedAt: closed,
    closedAt: closed,
    slaMinutes: 45,
    slaDeadline: closed,
    assignedDepartment: catItem.dept,
    assignedSupervisorName: "Kamal Hossain",
    assignedResponderName: i % 2 === 0 ? "Rahim Uddin" : "Faruk Mia",
    beforeEvidenceUrl: EVIDENCE_IMAGES.wasteBefore,
    afterEvidenceUrl: EVIDENCE_IMAGES.wasteAfter,
    supervisorNotes: "Resolution verified against CCTV live feed."
  });
}

// Initial Activity Events (Section 22)
export const INITIAL_ACTIVITY_LOG: ActivityEvent[] = [
  {
    id: "act-1",
    timestamp: hoursAgo(0.1),
    timeFormatted: "18:41",
    incidentId: "GV-1042",
    type: "AI_DETECTION",
    actor: "AI Engine (GV-CAM-004)",
    actorRole: "Computer Vision Model",
    description: "AI detected waste accumulation at Gate 2 (Confidence: 94%)",
    severity: "warning"
  },
  {
    id: "act-2",
    timestamp: hoursAgo(0.4),
    timeFormatted: "18:25",
    incidentId: "GV-1039",
    type: "ASSIGNMENT",
    actor: "Kamal Hossain",
    actorRole: "Cleaning Supervisor",
    description: "Assigned Sultana Begum to Cafeteria Terrace Bin Overflow",
    severity: "info"
  },
  {
    id: "act-3",
    timestamp: hoursAgo(0.8),
    timeFormatted: "17:50",
    incidentId: "GV-1035",
    type: "WORK_STARTED",
    actor: "Abdul Alim",
    actorRole: "Field Responder",
    description: "Started pump clearing on Parking South waterlogging",
    severity: "info"
  },
  {
    id: "act-4",
    timestamp: hoursAgo(2.8),
    timeFormatted: "15:52",
    incidentId: "GV-1031",
    type: "INCIDENT_CLOSED",
    actor: "Kamal Hossain",
    actorRole: "Supervisor",
    description: "Approved resolution for Academic Block A (GV-1031 closed)",
    severity: "success"
  }
];

// Initial In-App Notifications (Section 39)
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    timestamp: hoursAgo(0.1),
    timeFormatted: "18:41",
    title: "New AI Detection Pending Verification",
    message: "High priority waste accumulation flagged at Gate 2 (GV-CAM-004)",
    type: "NEW_INCIDENT",
    incidentId: "GV-1042",
    read: false,
    priority: "HIGH"
  },
  {
    id: "notif-2",
    timestamp: hoursAgo(0.5),
    timeFormatted: "18:12",
    title: "Task Assigned",
    message: "Cafeteria Terrace Bin overflow assigned to Cleaning Team A",
    type: "TASK_ASSIGNED",
    incidentId: "GV-1039",
    read: true,
    priority: "MEDIUM"
  },
  {
    id: "notif-3",
    timestamp: hoursAgo(2.8),
    timeFormatted: "15:53",
    title: "Incident Verified & Closed",
    message: "GV-1031 verified and closed by Supervisor Kamal Hossain",
    type: "TASK_RESOLVED",
    incidentId: "GV-1031",
    read: true,
    priority: "LOW"
  }
];
