import { 
  OperationalZone, 
  CameraRecord, 
  UserProfile, 
  IncidentRecord, 
  ActivityEvent, 
  NotificationItem 
} from '../types';

// Realistic High-Resolution Photographic Evidence Images (Resolves Image 4 / PRD Section 31)
export const EVIDENCE_IMAGES = {
  wasteBefore: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80", // Real waste pile on pavement
  wasteAfter: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80", // Clean sanitized pavement
  binBefore: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80", // Overflowing trash bin
  binAfter: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80", // Clean emptied bins
  waterBefore: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80", // Rain waterlogged street
  waterAfter: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80" // Dry clean road
};

// 10 Campus Zones: United International University (UIU), Madani Avenue, Badda, Dhaka 1212
// Coordinates Centroid: 23.7980, 90.4498
export const CAMPUS_ZONES: OperationalZone[] = [
  {
    id: "zone-1",
    name: "UIU Main Gate (Madani Avenue)",
    code: "UIU-Z1",
    centerCoordinates: [23.7984, 90.4492],
    polygonBounds: [
      [23.7988, 90.4488],
      [23.7989, 90.4497],
      [23.7979, 90.4498],
      [23.7978, 90.4489]
    ],
    cameraCount: 2,
    activeIncidentCount: 0,
    riskLevel: "LOW",
    description: "Primary entrance from 100-ft Madani Avenue with security guardhouse & vehicle gates",
    recommendedAction: "Maintain standard security schedule & traffic monitoring"
  },
  {
    id: "zone-2",
    name: "Gate 2 & North Perimeter (Vendor Hotspot)",
    code: "UIU-Z2",
    centerCoordinates: [23.7988, 90.4506],
    polygonBounds: [
      [23.7993, 90.4500],
      [23.7994, 90.4513],
      [23.7983, 90.4514],
      [23.7982, 90.4501]
    ],
    cameraCount: 2,
    activeIncidentCount: 1,
    riskLevel: "CRITICAL",
    description: "Perimeter boundary along Madani Ave with high evening street food vendor traffic & waste spillage",
    recommendedAction: "Increase cleaning sweep frequency between 4:00 PM – 7:00 PM; deploy dual 240L wheelie bins"
  },
  {
    id: "zone-3",
    name: "UIU Academic Complex (Engineering)",
    code: "UIU-Z3",
    centerCoordinates: [23.7978, 90.4493],
    polygonBounds: [
      [23.7982, 90.4489],
      [23.7983, 90.4498],
      [23.7973, 90.4499],
      [23.7972, 90.4490]
    ],
    cameraCount: 2,
    activeIncidentCount: 0,
    riskLevel: "LOW",
    description: "CSE, EEE, and Civil Engineering faculty blocks, front courtyard, and central atrium",
    recommendedAction: "Routine checks during 15-minute inter-class transitions"
  },
  {
    id: "zone-4",
    name: "UIU Academic Complex (Business & Humanities)",
    code: "UIU-Z4",
    centerCoordinates: [23.7974, 90.4498],
    polygonBounds: [
      [23.7977, 90.4493],
      [23.7978, 90.4503],
      [23.7969, 90.4504],
      [23.7968, 90.4494]
    ],
    cameraCount: 2,
    activeIncidentCount: 0,
    riskLevel: "LOW",
    description: "School of Business, library entrance, auditorium foyer, and student career center",
    recommendedAction: "Monitor foyer recycling receptacles post-lecture periods"
  },
  {
    id: "zone-5",
    name: "UIU Student Cafeteria & Food Court",
    code: "UIU-Z5",
    centerCoordinates: [23.7975, 90.4506],
    polygonBounds: [
      [23.7979, 90.4502],
      [23.7980, 90.4511],
      [23.7970, 90.4512],
      [23.7969, 90.4503]
    ],
    cameraCount: 2,
    activeIncidentCount: 1,
    riskLevel: "HIGH",
    description: "High-density student dining terrace, tea stalls, and fast-food kiosks",
    recommendedAction: "Continuous 30-min bin empty cycle during 12:30 PM – 3:00 PM peak lunch rush"
  },
  {
    id: "zone-6",
    name: "UIU Sports Arena & Playground",
    code: "UIU-Z6",
    centerCoordinates: [23.7985, 90.4512],
    polygonBounds: [
      [23.7990, 90.4507],
      [23.7991, 90.4520],
      [23.7980, 90.4521],
      [23.7979, 90.4508]
    ],
    cameraCount: 1,
    activeIncidentCount: 0,
    riskLevel: "LOW",
    description: "Football turf, cricket nets, outdoor volleyball court, and spectator bleachers",
    recommendedAction: "Post-match grounds cleanup sweeps on tournament afternoons"
  },
  {
    id: "zone-7",
    name: "Parking South & Student Bus Bay",
    code: "UIU-Z7",
    centerCoordinates: [23.7967, 90.4492],
    polygonBounds: [
      [23.7971, 90.4486],
      [23.7972, 90.4497],
      [23.7962, 90.4498],
      [23.7961, 90.4487]
    ],
    cameraCount: 2,
    activeIncidentCount: 0,
    riskLevel: "MEDIUM",
    description: "Campus shuttle bus loop, motorcycle parking, and low-lying ramp susceptible to monsoon ponding",
    recommendedAction: "Inspect catch-basins and sump pump prior to forecasted monsoon downpours"
  },
  {
    id: "zone-8",
    name: "Central Waste & Recycling Depot",
    code: "UIU-Z8",
    centerCoordinates: [23.7966, 90.4504],
    polygonBounds: [
      [23.7970, 90.4499],
      [23.7971, 90.4509],
      [23.7961, 90.4510],
      [23.7960, 90.4500]
    ],
    cameraCount: 2,
    activeIncidentCount: 0,
    riskLevel: "MEDIUM",
    description: "Segregated composter, sorting yard, and DNCC municipal waste truck collection ramp",
    recommendedAction: "Enforce evening compaction and odor-neutralizing bio-spraying"
  },
  {
    id: "zone-9",
    name: "Campus Logistics & Service Road",
    code: "UIU-Z9",
    centerCoordinates: [23.7971, 90.4488],
    polygonBounds: [
      [23.7975, 90.4483],
      [23.7976, 90.4492],
      [23.7966, 90.4493],
      [23.7965, 90.4484]
    ],
    cameraCount: 1,
    activeIncidentCount: 0,
    riskLevel: "LOW",
    description: "Rear supply logistics lane for cafeteria provisions and maintenance equipment",
    recommendedAction: "Monitor unloading speeds to maintain clear fire lanes"
  },
  {
    id: "zone-10",
    name: "United City Retention Lake & Sump",
    code: "UIU-Z10",
    centerCoordinates: [23.7963, 90.4512],
    polygonBounds: [
      [23.7968, 90.4507],
      [23.7969, 90.4520],
      [23.7958, 90.4521],
      [23.7957, 90.4508]
    ],
    cameraCount: 1,
    activeIncidentCount: 0,
    riskLevel: "LOW",
    description: "Rainwater overflow catchment basin and bio-filtration runoff channel",
    recommendedAction: "Bi-weekly debris netting and algae inspection"
  }
];

// 16 CCTV Cameras installed around United International University (UIU)
export const CAMERAS: CameraRecord[] = [
  {
    id: "GV-CAM-001",
    name: "UIU Main Gate North Entry",
    locationId: "zone-1",
    locationName: "UIU Main Gate (Madani Ave)",
    coordinates: [23.7985, 90.4491],
    status: "ONLINE",
    coverageCategory: "TRAFFIC_CONGESTION",
    lastEventTime: "10 mins ago",
    directionDeg: 110,
    feedResolution: "1080p 30fps (H.265)"
  },
  {
    id: "GV-CAM-002",
    name: "UIU Main Gate Pedestrian Concourse",
    locationId: "zone-1",
    locationName: "UIU Main Gate (Madani Ave)",
    coordinates: [23.7982, 90.4494],
    status: "ONLINE",
    coverageCategory: "WASTE_ACCUMULATION",
    lastEventTime: "45 mins ago",
    directionDeg: 270,
    feedResolution: "1080p 30fps (H.265)"
  },
  {
    id: "GV-CAM-003",
    name: "Gate 2 Madani Ave Perimeter Wall",
    locationId: "zone-2",
    locationName: "Gate 2 & North Perimeter",
    coordinates: [23.7986, 90.4503],
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
    locationName: "Gate 2 & North Perimeter",
    coordinates: [23.7989, 90.4507],
    status: "ONLINE",
    coverageCategory: "WASTE_ACCUMULATION",
    lastEventTime: "3 mins ago",
    currentIncidentId: "GV-1042",
    directionDeg: 180,
    feedResolution: "4K 30fps (AI Optical)"
  },
  {
    id: "GV-CAM-005",
    name: "UIU Cafeteria Terrace Bins",
    locationId: "zone-5",
    locationName: "UIU Student Cafeteria",
    coordinates: [23.7976, 90.4504],
    status: "ONLINE",
    coverageCategory: "BIN_OVERFLOW",
    lastEventTime: "18 mins ago",
    currentIncidentId: "GV-1039",
    directionDeg: 210,
    feedResolution: "1080p 30fps"
  },
  {
    id: "GV-CAM-006",
    name: "UIU Cafeteria Food Court Service Shute",
    locationId: "zone-5",
    locationName: "UIU Student Cafeteria",
    coordinates: [23.7973, 90.4508],
    status: "ONLINE",
    coverageCategory: "BIN_OVERFLOW",
    lastEventTime: "1 hr ago",
    directionDeg: 315,
    feedResolution: "1080p 30fps"
  },
  {
    id: "GV-CAM-007",
    name: "UIU Academic Complex Front Courtyard",
    locationId: "zone-3",
    locationName: "UIU Academic Complex (Eng)",
    coordinates: [23.7980, 90.4494],
    status: "ONLINE",
    coverageCategory: "WASTE_ACCUMULATION",
    lastEventTime: "3 hrs ago",
    directionDeg: 90,
    feedResolution: "1080p 30fps"
  },
  {
    id: "GV-CAM-008",
    name: "Academic Block Engineering Concourse",
    locationId: "zone-3",
    locationName: "UIU Academic Complex (Eng)",
    coordinates: [23.7977, 90.4496],
    status: "ONLINE",
    coverageCategory: "SMOKE_EVENT",
    lastEventTime: "5 hrs ago",
    directionDeg: 350,
    feedResolution: "1080p 25fps"
  },
  {
    id: "GV-CAM-009",
    name: "South Parking Drainage Sump",
    locationId: "zone-7",
    locationName: "Parking South & Bus Bay",
    coordinates: [23.7968, 90.4493],
    status: "ONLINE",
    coverageCategory: "WATERLOGGING",
    lastEventTime: "4 hrs ago",
    directionDeg: 140,
    feedResolution: "1080p 30fps (Flood Alert)"
  },
  {
    id: "GV-CAM-010",
    name: "Student Bus Loop Turn",
    locationId: "zone-7",
    locationName: "Parking South & Bus Bay",
    coordinates: [23.7966, 90.4496],
    status: "ONLINE",
    coverageCategory: "TRAFFIC_CONGESTION",
    lastEventTime: "1 hr ago",
    directionDeg: 260,
    feedResolution: "1080p 30fps"
  },
  {
    id: "GV-CAM-011",
    name: "UIU Plaza & Central Fountain",
    locationId: "zone-4",
    locationName: "UIU Academic Complex (Business)",
    coordinates: [23.7976, 90.4499],
    status: "ONLINE",
    coverageCategory: "WASTE_ACCUMULATION",
    lastEventTime: "30 mins ago",
    directionDeg: 80,
    feedResolution: "1080p 30fps"
  },
  {
    id: "GV-CAM-012",
    name: "UIU Library East Walkway",
    locationId: "zone-4",
    locationName: "UIU Academic Complex (Business)",
    coordinates: [23.7973, 90.4501],
    status: "ONLINE",
    coverageCategory: "ILLEGAL_DUMPING",
    lastEventTime: "6 hrs ago",
    directionDeg: 290,
    feedResolution: "1080p 25fps"
  },
  {
    id: "GV-CAM-013",
    name: "UIU Sports Field Spectator Stand",
    locationId: "zone-6",
    locationName: "UIU Sports Arena",
    coordinates: [23.7984, 90.4514],
    status: "ONLINE",
    coverageCategory: "TRAFFIC_CONGESTION",
    lastEventTime: "2 hrs ago",
    directionDeg: 120,
    feedResolution: "1080p 30fps"
  },
  {
    id: "GV-CAM-014",
    name: "Central Waste Hub Sorter Platform",
    locationId: "zone-8",
    locationName: "Central Waste Depot",
    coordinates: [23.7965, 90.4503],
    status: "ONLINE",
    coverageCategory: "WASTE_ACCUMULATION",
    lastEventTime: "15 mins ago",
    directionDeg: 75,
    feedResolution: "4K 30fps"
  },
  {
    id: "GV-CAM-015",
    name: "Service Road Logistics Gate",
    locationId: "zone-9",
    locationName: "Logistics & Service Road",
    coordinates: [23.7970, 90.4487],
    status: "ONLINE",
    coverageCategory: "ILLEGAL_DUMPING",
    lastEventTime: "7 hrs ago",
    directionDeg: 190,
    feedResolution: "1080p 25fps"
  },
  {
    id: "GV-CAM-016",
    name: "Retention Lake Overflow Weir",
    locationId: "zone-10",
    locationName: "Retention Lake & Sump",
    coordinates: [23.7962, 90.4513],
    status: "ONLINE",
    coverageCategory: "WATERLOGGING",
    lastEventTime: "12 hrs ago",
    directionDeg: 225,
    feedResolution: "1080p 30fps"
  }
];

// Personnel Roster (Bangladeshi context)
// Rahim Uddin is assigned the user's phone number 01307726701!
export const USERS: UserProfile[] = [
  {
    id: "usr-admin-1",
    name: "Dr. Tariqul Islam",
    role: "ADMIN",
    roleTitle: "Director of Campus Facilities",
    department: "CLEANING",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1711-098234",
    email: "tariqul.islam@uiu.ac.bd"
  },
  {
    id: "usr-op-1",
    name: "Tanvir Ahmed",
    role: "CONTROL_OPERATOR",
    roleTitle: "Senior Control Room Operator",
    department: "SECURITY",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1819-456712",
    email: "tanvir.ctrl@uiu.ac.bd"
  },
  {
    id: "usr-op-2",
    name: "Nusrat Jahan",
    role: "CONTROL_OPERATOR",
    roleTitle: "Environmental AI Triage Specialist",
    department: "SECURITY",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1912-789012",
    email: "nusrat.ctrl@uiu.ac.bd"
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
    email: "kamal.sup@uiu.ac.bd"
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
    email: "shahriar.maint@uiu.ac.bd"
  },
  {
    id: "usr-resp-1",
    name: "Rahim Uddin",
    role: "FIELD_RESPONDER",
    roleTitle: "Lead Sanitarian Responder",
    department: "CLEANING",
    team: "Cleaning Team B",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    phone: "+880 1307-726701", // The user's active mobile number!
    email: "rahim.field@uiu.ac.bd",
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
    email: "faruk.field@uiu.ac.bd",
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
    email: "alim.maint@uiu.ac.bd",
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
    email: "sultana.field@uiu.ac.bd",
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
    email: "farhana.sustainability@uiu.ac.bd"
  }
];

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const daysAgo = (d: number, hourOffset: number = 0) => new Date(now.getTime() - (d * 24 + hourOffset) * 3600000).toISOString();

// Pre-seeded Realistic Incidents at UIU Campus
export const INITIAL_INCIDENTS: IncidentRecord[] = [
  // Live Active Incident 1: The Gate 2 Showcase Incident
  {
    id: "GV-1042",
    title: "Heavy Waste Accumulation near UIU Gate 2 Vendors",
    category: "WASTE_ACCUMULATION",
    categoryLabel: "Waste Accumulation",
    description: "AI vision detected large black plastic garbage bags and discarded food containers near UIU Gate 2 perimeter boundary along Madani Avenue.",
    cameraId: "GV-CAM-004",
    cameraName: "Gate 2 Waste Collection Point",
    locationId: "zone-2",
    locationName: "Gate 2 & North Perimeter (UIU)",
    coordinates: [23.7989, 90.4507],
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
    title: "Post-Lunch Bin Overflowing at UIU Cafeteria Terrace",
    category: "BIN_OVERFLOW",
    categoryLabel: "Bin Overflow",
    description: "Optical sensor triggers 100% capacity alarm with cups and beverage cartons spilling onto pavers.",
    cameraId: "GV-CAM-005",
    cameraName: "UIU Cafeteria Terrace Bins",
    locationId: "zone-5",
    locationName: "UIU Student Cafeteria",
    coordinates: [23.7976, 90.4504],
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
    title: "Rainwater Ponding across UIU South Bus Ramp",
    category: "WATERLOGGING",
    categoryLabel: "Waterlogging",
    description: "Catch-basin blocked by leaf debris resulting in 15cm standing pool.",
    cameraId: "GV-CAM-009",
    cameraName: "South Parking Drainage Sump",
    locationId: "zone-7",
    locationName: "Parking South & Bus Bay (UIU)",
    coordinates: [23.7968, 90.4493],
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
    cameraName: "UIU Academic Front Courtyard",
    locationId: "zone-3",
    locationName: "UIU Academic Complex (Eng)",
    coordinates: [23.7980, 90.4494],
    priority: "LOW",
    status: "CLOSED",
    aiConfidence: 0.91,
    detectedAt: hoursAgo(4),
    verifiedAt: hoursAgo(3.8),
    assignedAt: hoursAgo(3.6),
    acceptedAt: hoursAgo(3.5),
    workStartedAt: hoursAgo(3.4),
    resolvedAt: hoursAgo(3.0),
    closedAt: hoursAgo(2.9),
    slaMinutes: 60,
    slaDeadline: hoursAgo(3),
    assignedDepartment: "CLEANING",
    assignedResponderId: "usr-resp-1",
    assignedResponderName: "Rahim Uddin",
    beforeEvidenceUrl: EVIDENCE_IMAGES.wasteBefore,
    afterEvidenceUrl: EVIDENCE_IMAGES.wasteAfter,
    responderNotes: "Boxes flattened and transferred to recycling hub.",
    supervisorNotes: "Verified via CCTV 7. Good quick response."
  },
  // Pre-seeded historical incidents (70+ records for Recharts analytics)
  ...Array.from({ length: 72 }).map((_, idx) => {
    const idNum = 1030 - idx;
    const daysPrior = Math.floor(idx / 10);
    const hourPrior = (idx % 10) * 2;
    const catList = ['WASTE_ACCUMULATION', 'BIN_OVERFLOW', 'ILLEGAL_DUMPING', 'WATERLOGGING', 'TRAFFIC_CONGESTION'];
    const catLabels = ['Waste Accumulation', 'Bin Overflow', 'Illegal Dumping', 'Waterlogging', 'Traffic Congestion'];
    const catIndex = idx % 5;
    const zonesList = [
      { id: 'zone-2', name: 'Gate 2 & North Perimeter (UIU)', cam: 'GV-CAM-004', coords: [23.7989, 90.4507] },
      { id: 'zone-5', name: 'UIU Student Cafeteria', cam: 'GV-CAM-005', coords: [23.7976, 90.4504] },
      { id: 'zone-7', name: 'Parking South & Bus Bay (UIU)', cam: 'GV-CAM-009', coords: [23.7968, 90.4493] },
      { id: 'zone-1', name: 'UIU Main Gate (Madani Ave)', cam: 'GV-CAM-001', coords: [23.7985, 90.4491] },
      { id: 'zone-3', name: 'UIU Academic Complex (Eng)', cam: 'GV-CAM-007', coords: [23.7980, 90.4494] }
    ];
    // Heavily weight Gate 2 for realistic hotspot analysis
    const chosenZone = idx % 3 === 0 ? zonesList[0] : zonesList[idx % zonesList.length];

    return {
      id: `GV-${idNum}`,
      title: `${catLabels[catIndex]} Incident at ${chosenZone.name}`,
      category: catList[catIndex] as any,
      categoryLabel: catLabels[catIndex],
      description: `Historical closed-loop incident logged by CCTV AI optical detection.`,
      cameraId: chosenZone.cam,
      cameraName: `${chosenZone.name} Optical Sensor`,
      locationId: chosenZone.id,
      locationName: chosenZone.name,
      coordinates: [chosenZone.coords[0], chosenZone.coords[1]] as [number, number],
      priority: (idx % 7 === 0 ? 'CRITICAL' : idx % 3 === 0 ? 'HIGH' : 'MEDIUM') as any,
      status: 'CLOSED' as const,
      aiConfidence: 0.85 + (idx % 12) * 0.01,
      detectedAt: daysAgo(daysPrior, hourPrior),
      verifiedAt: daysAgo(daysPrior, hourPrior - 0.1),
      assignedAt: daysAgo(daysPrior, hourPrior - 0.2),
      acceptedAt: daysAgo(daysPrior, hourPrior - 0.3),
      workStartedAt: daysAgo(daysPrior, hourPrior - 0.4),
      resolvedAt: daysAgo(daysPrior, hourPrior - 0.7),
      closedAt: daysAgo(daysPrior, hourPrior - 0.8),
      slaMinutes: 45,
      slaDeadline: daysAgo(daysPrior, hourPrior - 0.7),
      assignedDepartment: (catList[catIndex] === 'WATERLOGGING' ? 'MAINTENANCE' : 'CLEANING') as any,
      assignedResponderId: 'usr-resp-1',
      assignedResponderName: 'Rahim Uddin',
      beforeEvidenceUrl: EVIDENCE_IMAGES.wasteBefore,
      afterEvidenceUrl: EVIDENCE_IMAGES.wasteAfter,
      supervisorNotes: "Resolution verified against live CCTV feed. Approved."
    };
  })
];

export const INITIAL_ACTIVITY_LOG: ActivityEvent[] = [
  {
    id: "act-1",
    timestamp: hoursAgo(0.1),
    timeFormatted: "18:41",
    incidentId: "GV-1042",
    type: "AI_DETECTION",
    actor: "AI Vision (GV-CAM-004)",
    actorRole: "Optical Inference",
    description: "AI detected waste accumulation near UIU Gate 2 perimeter (Confidence: 94%)",
    severity: "warning"
  },
  {
    id: "act-2",
    timestamp: hoursAgo(0.5),
    timeFormatted: "18:15",
    incidentId: "GV-1039",
    type: "ASSIGNMENT",
    actor: "Kamal Hossain",
    actorRole: "Supervisor",
    description: "Dispatched Sultana Begum to UIU Cafeteria Terrace Bin Overflow",
    severity: "info"
  },
  {
    id: "act-3",
    timestamp: hoursAgo(0.8),
    timeFormatted: "17:55",
    incidentId: "GV-1035",
    type: "WORK_STARTED",
    actor: "Abdul Alim",
    actorRole: "Field Responder",
    description: "Abdul Alim arrived at UIU South Parking Ramp; submersible pump activated",
    severity: "info"
  },
  {
    id: "act-4",
    timestamp: hoursAgo(2.9),
    timeFormatted: "15:48",
    incidentId: "GV-1031",
    type: "INCIDENT_CLOSED",
    actor: "Kamal Hossain",
    actorRole: "Supervisor",
    description: "Approved resolution for GV-1031. Closed loop complete; Green Score incremented.",
    severity: "success"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    timestamp: hoursAgo(0.1),
    timeFormatted: "18:41",
    title: "AI Detection Alert: GV-1042",
    message: "Optical inference triggered at UIU Gate 2. Triage verification required.",
    type: "NEW_INCIDENT",
    incidentId: "GV-1042",
    read: false,
    priority: "HIGH"
  },
  {
    id: "notif-2",
    timestamp: hoursAgo(0.8),
    timeFormatted: "17:55",
    title: "SLA Warning: GV-1035",
    message: "UIU South Parking waterlogging task approaching 45-minute mark.",
    type: "OVERDUE",
    incidentId: "GV-1035",
    read: false,
    priority: "CRITICAL"
  }
];
