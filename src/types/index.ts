// GREENVISION — CORE TYPE DEFINITIONS

export type IncidentStatus = 
  | 'DETECTED'
  | 'PENDING_VERIFICATION'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'PENDING_APPROVAL'
  | 'CLOSED'
  | 'FALSE_DETECTION'
  | 'OVERDUE'
  | 'ESCALATED'
  | 'REOPENED'
  | 'CANCELLED';

export type IncidentPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type EnvironmentalCategory = 
  | 'WASTE_ACCUMULATION'
  | 'ILLEGAL_DUMPING'
  | 'BIN_OVERFLOW'
  | 'WATERLOGGING'
  | 'TRAFFIC_CONGESTION'
  | 'SMOKE_EVENT';

export type Department = 'CLEANING' | 'MAINTENANCE' | 'SECURITY' | 'SAFETY';

export type UserRole = 
  | 'ADMIN'
  | 'CONTROL_OPERATOR'
  | 'SUPERVISOR'
  | 'FIELD_RESPONDER'
  | 'SUSTAINABILITY_MANAGER';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department: Department;
  team?: string;
  avatar: string;
  phone: string;
  email: string;
  status?: 'AVAILABLE' | 'EN_ROUTE' | 'BUSY' | 'OFFLINE';
  activeTaskId?: string;
  completedTasksToday?: number;
  avgResponseTimeMin?: number;
}

export interface IncidentRecord {
  id: string; // e.g. "GV-1042"
  title: string;
  category: EnvironmentalCategory;
  categoryLabel: string;
  description: string;
  cameraId: string;
  cameraName: string;
  locationId: string;
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  priority: IncidentPriority;
  status: IncidentStatus;
  aiConfidence: number; // e.g. 0.94
  
  // Timestamps (ISO strings)
  detectedAt: string;
  verifiedAt?: string;
  assignedAt?: string;
  acceptedAt?: string;
  workStartedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  slaMinutes: number;
  slaDeadline: string;
  
  // Assigned Personnel
  assignedDepartment: Department;
  assignedSupervisorId?: string;
  assignedSupervisorName?: string;
  assignedResponderId?: string;
  assignedResponderName?: string;
  
  // Visual Evidence
  beforeEvidenceUrl: string;
  afterEvidenceUrl?: string;
  
  // Notes & Audit
  operatorNotes?: string;
  responderNotes?: string;
  supervisorNotes?: string;
  escalationReason?: string;
}

export interface CameraRecord {
  id: string; // "GV-CAM-001" to "GV-CAM-016"
  name: string;
  locationId: string;
  locationName: string;
  coordinates: [number, number];
  status: 'ONLINE' | 'OFFLINE' | 'WARNING' | 'MAINTENANCE';
  coverageCategory: EnvironmentalCategory;
  lastEventTime: string;
  currentIncidentId?: string;
  directionDeg: number;
  feedResolution: string;
}

export interface OperationalZone {
  id: string;
  name: string;
  code: string;
  centerCoordinates: [number, number];
  polygonBounds: [number, number][];
  cameraCount: number;
  activeIncidentCount: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendedAction?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  timeFormatted: string; // e.g. "18:42"
  incidentId: string;
  type: string;
  actor: string;
  actorRole: string;
  description: string;
  severity: 'info' | 'warning' | 'success' | 'danger';
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  timeFormatted: string;
  title: string;
  message: string;
  type: 'NEW_INCIDENT' | 'TASK_ASSIGNED' | 'TASK_RESOLVED' | 'APPROVAL_REQUIRED' | 'OVERDUE' | 'CAMERA_OFFLINE';
  incidentId?: string;
  read: boolean;
  priority: IncidentPriority;
}

export interface OperationalGreenScore {
  overallScore: number; // 0-100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL';
  lastCalculated: string;
  components: {
    incidentResolution: { score: number; weight: 0.30; label: 'Incident Resolution' };
    responseEfficiency: { score: number; weight: 0.20; label: 'Response Efficiency' };
    recurringReduction: { score: number; weight: 0.20; label: 'Hotspot & Repeat Reduction' };
    wastePerformance: { score: number; weight: 0.15; label: 'Waste Management Triage' };
    areaCleanliness: { score: number; weight: 0.15; label: 'Area Cleanliness Index' };
  };
  trendComparisonPct: number; // e.g. +4.2% from last week
}

export type DemoScenarioId = 
  | 'waste_dumping_gate2'
  | 'bin_overflow_cafeteria'
  | 'waterlogging_parking'
  | 'traffic_main_gate'
  | 'normal';

export interface DemoStep {
  stepIndex: number;
  label: string;
  detail: string;
  actor: string;
  durationMs: number;
  actionType: string;
}
