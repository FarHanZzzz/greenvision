import { create } from 'zustand';
import { 
  IncidentRecord, 
  IncidentStatus, 
  IncidentPriority, 
  CameraRecord, 
  OperationalZone, 
  UserProfile, 
  ActivityEvent, 
  NotificationItem, 
  OperationalGreenScore, 
  UserRole,
  DemoScenarioId
} from '../types';
import { 
  INITIAL_INCIDENTS, 
  CAMERAS, 
  CAMPUS_ZONES, 
  USERS, 
  INITIAL_ACTIVITY_LOG, 
  INITIAL_NOTIFICATIONS,
  EVIDENCE_IMAGES 
} from '../data/mockData';
import { calculateKPIs } from '../utils/analyticsCalculator';

export type AppInterface = 'COMMAND_CENTER' | 'OPERATIONS' | 'RESPONDER' | 'DUAL_DEMO';

interface GreenVisionState {
  // Navigation & Personas
  currentInterface: AppInterface;
  setInterface: (ui: AppInterface) => void;
  commandSubTab: 'OVERVIEW' | 'MAP' | 'INCIDENTS' | 'CCTV' | 'ANALYTICS' | 'GREENSCORE' | 'REPORTS' | 'CAMERAS' | 'TEAMS' | 'ZONES' | 'SETTINGS';
  setCommandSubTab: (tab: 'OVERVIEW' | 'MAP' | 'INCIDENTS' | 'CCTV' | 'ANALYTICS' | 'GREENSCORE' | 'REPORTS' | 'CAMERAS' | 'TEAMS' | 'ZONES' | 'SETTINGS') => void;
  activeUser: UserProfile;
  setActiveUser: (userId: string) => void;
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
  selectedCameraId: string | null;
  setSelectedCameraId: (id: string | null) => void;

  // Contact / SMS Modal State
  isContactModalOpen: boolean;
  contactRecipientNumber: string;
  openContactModal: (recipientNumber?: string) => void;
  closeContactModal: () => void;

  // System Guide Modal State
  isGuideModalOpen: boolean;
  openGuideModal: () => void;
  closeGuideModal: () => void;

  // Domain Entities
  incidents: IncidentRecord[];
  cameras: CameraRecord[];
  zones: OperationalZone[];
  users: UserProfile[];
  activityLog: ActivityEvent[];
  notifications: NotificationItem[];

  // Dynamic Responder Live Coordinates for Map Animation (UIU Campus)
  responderCoordinates: Record<string, [number, number]>;

  // Simulation Controls
  isSimulating: boolean;
  simSpeed: number; // 1, 2, 5
  simStep: number; // 0..6
  activeScenario: DemoScenarioId;
  setSimSpeed: (speed: number) => void;
  setSimulationRunning: (running: boolean) => void;
  setScenario: (sc: DemoScenarioId) => void;
  nextSimStep: () => void;
  resetDemoToBaseline: () => void;

  // Closed Loop Operational Actions
  confirmIncident: (id: string, priority?: IncidentPriority, notes?: string) => void;
  rejectIncident: (id: string, notes?: string) => void;
  assignIncident: (id: string, responderId: string, supervisorId?: string) => void;
  reassignIncident: (id: string, newResponderId: string, reason?: string) => void;
  escalateIncident: (id: string, reason: string) => void;
  deescalateIncident: (id: string, reason?: string) => void;
  acceptTask: (id: string) => void;
  startWork: (id: string) => void;
  resolveTask: (id: string, afterEvidenceUrl: string, notes?: string) => void;
  approveResolution: (id: string, supervisorNotes?: string) => void;
  reopenIncident: (id: string, reason: string) => void;
  markNotificationRead: (id: string) => void;
  triggerManualIncident: () => void;

  // Computed Values
  getGreenScore: () => OperationalGreenScore;
  getIncidentById: (id: string) => IncidentRecord | undefined;
}

export const useGreenVisionStore = create<GreenVisionState>((set, get) => ({
  currentInterface: 'COMMAND_CENTER',
  setInterface: (ui) => set({ currentInterface: ui }),
  
  commandSubTab: 'OVERVIEW',
  setCommandSubTab: (tab) => set({ commandSubTab: tab }),

  activeUser: USERS[0], // Default: Dr. Tariqul Islam (Admin)
  setActiveUser: (userId) => {
    const found = get().users.find(u => u.id === userId);
    if (found) set({ activeUser: found });
  },

  selectedIncidentId: "GV-1042",
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),

  // Null by default so no video opens automatically on site entry (Resolves user request 5)
  selectedCameraId: null,
  setSelectedCameraId: (id) => set({ selectedCameraId: id }),

  // Contact / SMS Modal State (User's phone 01307726701 by default)
  isContactModalOpen: false,
  contactRecipientNumber: "01307726701",
  openContactModal: (recipientNumber) => set({ 
    isContactModalOpen: true, 
    contactRecipientNumber: recipientNumber || "01307726701" 
  }),
  closeContactModal: () => set({ isContactModalOpen: false }),

  // System Guide Modal State
  isGuideModalOpen: false,
  openGuideModal: () => set({ isGuideModalOpen: true }),
  closeGuideModal: () => set({ isGuideModalOpen: false }),

  incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
  cameras: JSON.parse(JSON.stringify(CAMERAS)),
  zones: JSON.parse(JSON.stringify(CAMPUS_ZONES)),
  users: JSON.parse(JSON.stringify(USERS)),
  activityLog: JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOG)),
  notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),

  // Default positions: UIU Campus (Madani Avenue, Dhaka)
  responderCoordinates: {
    "usr-resp-1": [23.7965, 90.4503], // Rahim starts at UIU Central Depot
    "usr-resp-2": [23.7980, 90.4494], // Faruk at Academic Complex
    "usr-resp-3": [23.7968, 90.4493], // Alim at South Parking Drainage
    "usr-resp-4": [23.7976, 90.4504], // Sultana at Cafeteria Terrace
  },

  // Simulation
  isSimulating: false,
  simSpeed: 1,
  simStep: 0,
  activeScenario: 'waste_dumping_gate2',
  setSimSpeed: (simSpeed) => set({ simSpeed }),
  setSimulationRunning: (isSimulating) => set({ isSimulating }),
  setScenario: (sc) => {
    const targetId = sc === 'bin_overflow_cafeteria' ? 'GV-1039' : sc === 'waterlogging_parking' ? 'GV-1035' : 'GV-1042';
    const targetCam = sc === 'bin_overflow_cafeteria' ? 'GV-CAM-005' : sc === 'waterlogging_parking' ? 'GV-CAM-009' : 'GV-CAM-004';
    set({
      activeScenario: sc,
      simStep: 0,
      isSimulating: false,
      selectedIncidentId: targetId,
      selectedCameraId: targetCam,
      incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
      responderCoordinates: {
        "usr-resp-1": [23.7965, 90.4503],
        "usr-resp-2": [23.7980, 90.4494],
        "usr-resp-3": [23.7968, 90.4493],
        "usr-resp-4": [23.7976, 90.4504],
      }
    });
  },

  resetDemoToBaseline: () => {
    set({
      incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
      cameras: JSON.parse(JSON.stringify(CAMERAS)),
      zones: JSON.parse(JSON.stringify(CAMPUS_ZONES)),
      activityLog: JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOG)),
      notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
      selectedIncidentId: "GV-1042",
      selectedCameraId: "GV-CAM-004",
      isSimulating: false,
      simStep: 0,
      responderCoordinates: {
        "usr-resp-1": [23.7965, 90.4503],
        "usr-resp-2": [23.7980, 90.4494],
        "usr-resp-3": [23.7968, 90.4493],
        "usr-resp-4": [23.7976, 90.4504],
      }
    });
  },

  // 1. Operator Confirms Incident
  confirmIncident: (id, priority, notes) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    set((state) => {
      const updatedIncidents = state.incidents.map((inc) => {
        if (inc.id === id) {
          return {
            ...inc,
            status: 'CONFIRMED' as IncidentStatus,
            priority: priority || inc.priority,
            verifiedAt: nowIso,
            operatorNotes: notes || inc.operatorNotes || 'Verified by Control Room Operator'
          };
        }
        return inc;
      });

      const target = state.incidents.find(i => i.id === id);

      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        timestamp: nowIso,
        timeFormatted,
        incidentId: id,
        type: 'VERIFICATION',
        actor: state.activeUser.name,
        actorRole: state.activeUser.roleTitle,
        description: `Verified ${id} (${target?.categoryLabel}) at ${target?.locationName}`,
        severity: 'info'
      };

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        timestamp: nowIso,
        timeFormatted,
        title: `Incident ${id} Confirmed`,
        message: `Routed to Cleaning Operations Supervisor for immediate dispatch`,
        type: 'TASK_ASSIGNED',
        incidentId: id,
        read: false,
        priority: target?.priority || 'HIGH'
      };

      return {
        incidents: updatedIncidents,
        activityLog: [newActivity, ...state.activityLog],
        notifications: [newNotif, ...state.notifications]
      };
    });
  },

  // Reject False Detection
  rejectIncident: (id, notes) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    set((state) => ({
      incidents: state.incidents.map(inc => inc.id === id ? { ...inc, status: 'FALSE_DETECTION' as IncidentStatus, operatorNotes: notes } : inc),
      activityLog: [
        {
          id: `act-${Date.now()}`,
          timestamp: nowIso,
          timeFormatted,
          incidentId: id,
          type: 'FALSE_DETECTION',
          actor: state.activeUser.name,
          actorRole: state.activeUser.roleTitle,
          description: `Flagged ${id} as False Alarm: ${notes || 'Visual artifact'}`,
          severity: 'info'
        },
        ...state.activityLog
      ]
    }));
  },

  // 2. Supervisor Assigns Responder
  assignIncident: (id, responderId, supervisorId) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const responder = get().users.find(u => u.id === responderId);
    const supervisor = supervisorId ? get().users.find(u => u.id === supervisorId) : get().activeUser;

    set((state) => {
      const updatedIncidents = state.incidents.map((inc) => {
        if (inc.id === id) {
          return {
            ...inc,
            status: 'ASSIGNED' as IncidentStatus,
            assignedAt: nowIso,
            assignedSupervisorId: supervisor?.id,
            assignedSupervisorName: supervisor?.name,
            assignedResponderId: responder?.id,
            assignedResponderName: responder?.name
          };
        }
        return inc;
      });

      const updatedUsers = state.users.map(u => {
        if (u.id === responderId) {
          return { ...u, status: 'EN_ROUTE' as const, activeTaskId: id };
        }
        return u;
      });

      const target = state.incidents.find(i => i.id === id);

      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        timestamp: nowIso,
        timeFormatted,
        incidentId: id,
        type: 'ASSIGNMENT',
        actor: supervisor?.name || 'Supervisor',
        actorRole: supervisor?.roleTitle || 'Supervisor',
        description: `Assigned ${responder?.name || 'Responder'} (${responder?.team}) to ${id}`,
        severity: 'info'
      };

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        timestamp: nowIso,
        timeFormatted,
        title: `Task Dispatched: ${id}`,
        message: `${responder?.name} (${responder?.phone}) notified for ${target?.locationName}`,
        type: 'TASK_ASSIGNED',
        incidentId: id,
        read: false,
        priority: target?.priority || 'HIGH'
      };

      return {
        incidents: updatedIncidents,
        users: updatedUsers,
        activityLog: [newActivity, ...state.activityLog],
        notifications: [newNotif, ...state.notifications]
      };
    });
  },

  // Reassign Responder (PRD Section 21 & 25)
  reassignIncident: (id, newResponderId, reason) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const newResponder = get().users.find(u => u.id === newResponderId);

    set((state) => {
      const target = state.incidents.find(i => i.id === id);
      const oldResponderId = target?.assignedResponderId;

      return {
        incidents: state.incidents.map(inc => inc.id === id ? {
          ...inc,
          assignedResponderId: newResponder?.id,
          assignedResponderName: newResponder?.name,
          assignedAt: nowIso
        } : inc),
        users: state.users.map(u => {
          if (u.id === oldResponderId) return { ...u, status: 'AVAILABLE' as const, activeTaskId: undefined };
          if (u.id === newResponderId) return { ...u, status: 'EN_ROUTE' as const, activeTaskId: id };
          return u;
        }),
        activityLog: [
          {
            id: `act-${Date.now()}`,
            timestamp: nowIso,
            timeFormatted,
            incidentId: id,
            type: 'REASSIGNMENT',
            actor: state.activeUser.name,
            actorRole: 'Supervisor',
            description: `Reassigned ${id} to ${newResponder?.name}. Note: ${reason || 'Workload rebalance'}`,
            severity: 'info'
          },
          ...state.activityLog
        ]
      };
    });
  },

  // Escalate Incident (PRD Section 14, 15, 21, 25)
  escalateIncident: (id, reason) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    set((state) => {
      const target = state.incidents.find(i => i.id === id);
      return {
        incidents: state.incidents.map(inc => inc.id === id ? {
          ...inc,
          status: 'ESCALATED' as IncidentStatus,
          priority: 'CRITICAL' as IncidentPriority,
          escalationReason: reason || 'SLA threshold approaching. Rapid containment mobilized.'
        } : inc),
        activityLog: [
          {
            id: `act-${Date.now()}`,
            timestamp: nowIso,
            timeFormatted,
            incidentId: id,
            type: 'ESCALATION',
            actor: state.activeUser.name,
            actorRole: 'Operations',
            description: `ESCALATED ${id} to CRITICAL priority! ${reason || 'Immediate triage dispatched.'}`,
            severity: 'danger'
          },
          ...state.activityLog
        ],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            timestamp: nowIso,
            timeFormatted,
            title: `CRITICAL ESCALATION: ${id}`,
            message: `${target?.locationName}: ${reason || 'Emergency response mobilized.'}`,
            type: 'NEW_INCIDENT',
            incidentId: id,
            read: false,
            priority: 'CRITICAL'
          },
          ...state.notifications
        ]
      };
    });
  },

  // De-escalate Incident (PRD Section 14, 15, 21 - Resolves user request 7)
  deescalateIncident: (id, reason) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    set((state) => {
      const target = state.incidents.find(i => i.id === id);
      const isPending = target?.status === 'PENDING_VERIFICATION';
      const newStatus = isPending ? ('FALSE_DETECTION' as IncidentStatus) : (target?.status === 'ESCALATED' ? 'IN_PROGRESS' as IncidentStatus : target?.status || 'CLOSED');
      const newPriority: IncidentPriority = target?.priority === 'CRITICAL' ? 'MEDIUM' : 'LOW';

      return {
        incidents: state.incidents.map(inc => inc.id === id ? {
          ...inc,
          status: newStatus,
          priority: newPriority,
          operatorNotes: `De-escalated by Operator: ${reason || 'Hazard downgraded / Situation stabilized without emergency dispatch.'}`
        } : inc),
        activityLog: [
          {
            id: `act-${Date.now()}`,
            timestamp: nowIso,
            timeFormatted,
            incidentId: id,
            type: 'STATUS_CHANGE',
            actor: state.activeUser.name,
            actorRole: state.activeUser.roleTitle,
            description: `De-escalated ${id} to ${newPriority} priority. Note: ${reason || 'Contained without field escalation.'}`,
            severity: 'info'
          },
          ...state.activityLog
        ],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            timestamp: nowIso,
            timeFormatted,
            title: `De-escalated: ${id}`,
            message: `Priority reduced to ${newPriority} (${target?.locationName}).`,
            type: 'TASK_RESOLVED',
            incidentId: id,
            read: false,
            priority: newPriority
          },
          ...state.notifications
        ]
      };
    });
  },

  // 3. Responder Accepts Task (Coordinates begin transit along UIU campus road)
  acceptTask: (id) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    set((state) => {
      const target = state.incidents.find(i => i.id === id);
      const responderId = target?.assignedResponderId || 'usr-resp-1';

      return {
        incidents: state.incidents.map(inc => inc.id === id ? { ...inc, status: 'ACCEPTED' as IncidentStatus, acceptedAt: nowIso } : inc),
        // Move responder halfway towards UIU Gate 2
        responderCoordinates: {
          ...state.responderCoordinates,
          [responderId]: [23.7977, 90.4505] // UIU En route midpoint
        },
        activityLog: [
          {
            id: `act-${Date.now()}`,
            timestamp: nowIso,
            timeFormatted,
            incidentId: id,
            type: 'TASK_ACCEPTED',
            actor: target?.assignedResponderName || 'Rahim Uddin',
            actorRole: 'Field Responder',
            description: `${target?.assignedResponderName || 'Responder'} accepted task ${id} — traveling to UIU Gate 2`,
            severity: 'info'
          },
          ...state.activityLog
        ]
      };
    });
  },

  // 4. Responder Arrives & Starts Work (Coordinates reach UIU incident site)
  startWork: (id) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    set((state) => {
      const target = state.incidents.find(i => i.id === id);
      const responderId = target?.assignedResponderId || 'usr-resp-1';

      return {
        incidents: state.incidents.map(inc => inc.id === id ? { ...inc, status: 'IN_PROGRESS' as IncidentStatus, workStartedAt: nowIso } : inc),
        // Responder arrives at exact UIU Gate 2 coordinates
        responderCoordinates: {
          ...state.responderCoordinates,
          [responderId]: target?.coordinates || [23.7989, 90.4507]
        },
        activityLog: [
          {
            id: `act-${Date.now()}`,
            timestamp: nowIso,
            timeFormatted,
            incidentId: id,
            type: 'WORK_STARTED',
            actor: target?.assignedResponderName || 'Rahim Uddin',
            actorRole: 'Field Responder',
            description: `${target?.assignedResponderName || 'Responder'} arrived at ${target?.locationName} and started cleanup`,
            severity: 'info'
          },
          ...state.activityLog
        ]
      };
    });
  },

  // 5. Responder Resolves with Evidence
  resolveTask: (id, afterEvidenceUrl, notes) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    set((state) => {
      const target = state.incidents.find(i => i.id === id);
      return {
        incidents: state.incidents.map(inc => inc.id === id ? {
          ...inc,
          status: 'PENDING_APPROVAL' as IncidentStatus,
          resolvedAt: nowIso,
          afterEvidenceUrl: afterEvidenceUrl || EVIDENCE_IMAGES.wasteAfter,
          responderNotes: notes || 'Area cleared, bagged, and sanitized.'
        } : inc),
        activityLog: [
          {
            id: `act-${Date.now()}`,
            timestamp: nowIso,
            timeFormatted,
            incidentId: id,
            type: 'EVIDENCE_SUBMITTED',
            actor: target?.assignedResponderName || 'Rahim Uddin',
            actorRole: 'Field Responder',
            description: `Resolution evidence uploaded for ${id} — pending supervisor verification`,
            severity: 'warning'
          },
          ...state.activityLog
        ],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            timestamp: nowIso,
            timeFormatted,
            title: `Verification Requested: ${id}`,
            message: `${target?.assignedResponderName} completed work. Review Before/After evidence.`,
            type: 'APPROVAL_REQUIRED',
            incidentId: id,
            read: false,
            priority: 'HIGH'
          },
          ...state.notifications
        ]
      };
    });
  },

  // 6. Supervisor Approves & Closes Incident
  approveResolution: (id, supervisorNotes) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    set((state) => {
      const target = state.incidents.find(i => i.id === id);
      const responderId = target?.assignedResponderId;

      return {
        incidents: state.incidents.map(inc => inc.id === id ? {
          ...inc,
          status: 'CLOSED' as IncidentStatus,
          closedAt: nowIso,
          supervisorNotes: supervisorNotes || 'Resolution verified against CCTV live feed. Approved.'
        } : inc),
        users: state.users.map(u => {
          if (u.id === responderId) {
            return {
              ...u,
              status: 'AVAILABLE' as const,
              activeTaskId: undefined,
              completedTasksToday: (u.completedTasksToday || 0) + 1
            };
          }
          return u;
        }),
        activityLog: [
          {
            id: `act-${Date.now()}`,
            timestamp: nowIso,
            timeFormatted,
            incidentId: id,
            type: 'INCIDENT_CLOSED',
            actor: state.activeUser.name,
            actorRole: 'Supervisor',
            description: `Supervisor approved resolution for ${id} (${target?.locationName}). Incident closed!`,
            severity: 'success'
          },
          ...state.activityLog
        ],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            timestamp: nowIso,
            timeFormatted,
            title: `Incident ${id} Successfully Closed`,
            message: `Closed-loop completed in verified resolution. Green Score updated.`,
            type: 'TASK_RESOLVED',
            incidentId: id,
            read: false,
            priority: 'LOW'
          },
          ...state.notifications
        ]
      };
    });
  },

  // Reopen Incident
  reopenIncident: (id, reason) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    set((state) => ({
      incidents: state.incidents.map(inc => inc.id === id ? { ...inc, status: 'REOPENED' as IncidentStatus, supervisorNotes: reason } : inc),
      activityLog: [
        {
          id: `act-${Date.now()}`,
          timestamp: nowIso,
          timeFormatted,
          incidentId: id,
          type: 'INCIDENT_REOPENED',
          actor: state.activeUser.name,
          actorRole: 'Supervisor',
          description: `Resolution rejected for ${id}: ${reason}`,
          severity: 'danger'
        },
        ...state.activityLog
      ]
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  },

  triggerManualIncident: () => {
    const newId = `GV-${Math.floor(1050 + Math.random() * 50)}`;
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const newInc: IncidentRecord = {
      id: newId,
      title: "Waste Pile Flagged near UIU Cafeteria Terrace",
      category: "WASTE_ACCUMULATION",
      categoryLabel: "Waste Accumulation",
      description: "Optical inference detected discarded beverage containers and plastic bags at UIU Central Cafeteria terrace.",
      cameraId: "GV-CAM-005",
      cameraName: "UIU Cafeteria Terrace Bins",
      locationId: "zone-5",
      locationName: "UIU Student Cafeteria",
      coordinates: [23.7975, 90.4506],
      priority: "HIGH",
      status: "PENDING_VERIFICATION",
      aiConfidence: 0.93,
      detectedAt: nowIso,
      slaMinutes: 30,
      slaDeadline: new Date(Date.now() + 30 * 60000).toISOString(),
      assignedDepartment: "CLEANING",
      beforeEvidenceUrl: EVIDENCE_IMAGES.wasteBefore
    };

    set((state) => ({
      incidents: [newInc, ...state.incidents],
      selectedIncidentId: newId,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          timestamp: nowIso,
          timeFormatted,
          incidentId: newId,
          type: 'AI_DETECTION',
          actor: 'AI Engine (GV-CAM-005)',
          actorRole: 'Computer Vision Model',
          description: `AI detected waste accumulation at UIU Student Cafeteria (Confidence: 93%)`,
          severity: 'warning'
        },
        ...state.activityLog
      ],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          timestamp: nowIso,
          timeFormatted,
          title: `New Incident Detected: ${newId}`,
          message: `UIU Cafeteria terrace flagged by optical vision sensor.`,
          type: 'NEW_INCIDENT',
          incidentId: newId,
          read: false,
          priority: 'HIGH'
        },
        ...state.notifications
      ]
    }));
  },

  // Multi-Scenario Simulation Engine (UIU Campus)
  nextSimStep: () => {
    const current = get().simStep;
    const scenario = get().activeScenario;

    if (scenario === 'waste_dumping_gate2') {
      const targetId = "GV-1042";
      set({ selectedIncidentId: targetId, selectedCameraId: "GV-CAM-004" });
      if (current === 0) {
        get().confirmIncident(targetId, 'HIGH', 'Verified via UIU Gate 2 optical feed.');
        set({ simStep: 1 });
      } else if (current === 1) {
        get().assignIncident(targetId, "usr-resp-1", "usr-sup-1");
        set({ simStep: 2 });
      } else if (current === 2) {
        get().acceptTask(targetId);
        set({ simStep: 3 });
      } else if (current === 3) {
        get().startWork(targetId);
        set({ simStep: 4 });
      } else if (current === 4) {
        get().resolveTask(targetId, EVIDENCE_IMAGES.wasteAfter, "Debris removed and sidewalk disinfected.");
        set({ simStep: 5 });
      } else if (current === 5) {
        get().approveResolution(targetId, "CCTV confirmed UIU Gate 2 perimeter is spotless. Approved.");
        set({ simStep: 6, isSimulating: false });
      }
    } else if (scenario === 'bin_overflow_cafeteria') {
      const targetId = "GV-1039";
      set({ selectedIncidentId: targetId, selectedCameraId: "GV-CAM-005" });
      if (current === 0) {
        get().acceptTask(targetId);
        set({ simStep: 1 });
      } else if (current === 1) {
        get().startWork(targetId);
        set({ simStep: 2 });
      } else if (current === 2) {
        get().resolveTask(targetId, EVIDENCE_IMAGES.binAfter, "Bin emptied, double-lined, and terrace washed.");
        set({ simStep: 3 });
      } else if (current === 3) {
        get().approveResolution(targetId, "Verified via Camera 5. Terrace restored.");
        set({ simStep: 4, isSimulating: false });
      }
    } else if (scenario === 'waterlogging_parking') {
      const targetId = "GV-1035";
      set({ selectedIncidentId: targetId, selectedCameraId: "GV-CAM-009" });
      if (current === 0) {
        get().startWork(targetId);
        set({ simStep: 1 });
      } else if (current === 1) {
        get().resolveTask(targetId, EVIDENCE_IMAGES.waterAfter, "Catch-basin unblocked; auxiliary pump cleared standing water.");
        set({ simStep: 2 });
      } else if (current === 2) {
        get().approveResolution(targetId, "Drainage confirmed flowing. Ramp reopened.");
        set({ simStep: 3, isSimulating: false });
      }
    }
  },

  // Dynamic Operational Green Score Engine
  getGreenScore: () => {
    const incidents = get().incidents;
    const kpis = calculateKPIs(incidents);

    const resolutionScore = Math.min(100, Math.max(0, kpis.resolutionRatePct));
    const responseEfficiency = Math.max(50, Math.min(100, Math.round(100 - (kpis.avgResponseTimeMin - 5) * 4)));
    const recurringScore = Math.max(60, Math.min(100, Math.round(100 - kpis.repeatIncidentRatePct * 1.5)));

    const wasteIncidents = incidents.filter(i => 
      i.category === 'WASTE_ACCUMULATION' || i.category === 'BIN_OVERFLOW' || i.category === 'ILLEGAL_DUMPING'
    );
    const wasteClosed = wasteIncidents.filter(i => i.status === 'CLOSED');
    const wasteScore = Math.round((wasteClosed.length / (wasteIncidents.length || 1)) * 100);
    const cleanlinessScore = Math.max(40, 100 - kpis.criticalCount * 12);

    const overall = Math.round(
      resolutionScore * 0.30 +
      responseEfficiency * 0.20 +
      recurringScore * 0.20 +
      wasteScore * 0.15 +
      cleanlinessScore * 0.15
    );

    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
    let status: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL' = 'GOOD';
    if (overall >= 90) { grade = 'A+'; status = 'EXCELLENT'; }
    else if (overall >= 80) { grade = 'A'; status = 'EXCELLENT'; }
    else if (overall >= 70) { grade = 'B'; status = 'GOOD'; }
    else if (overall >= 60) { grade = 'C'; status = 'NEEDS_ATTENTION'; }
    else { grade = 'D'; status = 'CRITICAL'; }

    return {
      overallScore: overall,
      grade,
      status,
      lastCalculated: 'Just now',
      components: {
        incidentResolution: { score: resolutionScore, weight: 0.30, label: 'Incident Resolution' },
        responseEfficiency: { score: responseEfficiency, weight: 0.20, label: 'Response Efficiency' },
        recurringReduction: { score: recurringScore, weight: 0.20, label: 'Hotspot & Repeat Reduction' },
        wastePerformance: { score: wasteScore, weight: 0.15, label: 'Waste Management Triage' },
        areaCleanliness: { score: cleanlinessScore, weight: 0.15, label: 'Area Cleanliness Index' }
      },
      trendComparisonPct: Math.round(((overall - 78) / 78) * 100 * 10) / 10
    };
  },

  getIncidentById: (id) => get().incidents.find(i => i.id === id)
}));
