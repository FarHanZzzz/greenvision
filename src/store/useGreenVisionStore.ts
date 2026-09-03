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

export type AppInterface = 'COMMAND_CENTER' | 'OPERATIONS' | 'RESPONDER' | 'DUAL_DEMO';

interface GreenVisionState {
  // Navigation & Personas
  currentInterface: AppInterface;
  setInterface: (ui: AppInterface) => void;
  activeUser: UserProfile;
  setActiveUser: (userId: string) => void;
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
  selectedCameraId: string | null;
  setSelectedCameraId: (id: string | null) => void;

  // Domain Entities
  incidents: IncidentRecord[];
  cameras: CameraRecord[];
  zones: OperationalZone[];
  users: UserProfile[];
  activityLog: ActivityEvent[];
  notifications: NotificationItem[];

  // Simulation Controls
  isSimulating: boolean;
  simSpeed: number; // 1, 2, 5
  simStep: number; // 0..10
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
  
  activeUser: USERS[0], // Default: Dr. Tariqul Islam (Admin)
  setActiveUser: (userId) => {
    const found = get().users.find(u => u.id === userId);
    if (found) set({ activeUser: found });
  },

  selectedIncidentId: "GV-1042",
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),

  selectedCameraId: "GV-CAM-004",
  setSelectedCameraId: (id) => set({ selectedCameraId: id }),

  incidents: JSON.parse(JSON.stringify(INITIAL_INCIDENTS)),
  cameras: JSON.parse(JSON.stringify(CAMERAS)),
  zones: JSON.parse(JSON.stringify(CAMPUS_ZONES)),
  users: JSON.parse(JSON.stringify(USERS)),
  activityLog: JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOG)),
  notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),

  // Simulation
  isSimulating: false,
  simSpeed: 1,
  simStep: 0,
  activeScenario: 'waste_dumping_gate2',
  setSimSpeed: (simSpeed) => set({ simSpeed }),
  setSimulationRunning: (isSimulating) => set({ isSimulating }),
  setScenario: (sc) => set({ activeScenario: sc, simStep: 0, isSimulating: false }),

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
      simStep: 0
    });
  },

  // Operational Loop Step 1: Human Operator Confirms Incident
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

  // Operational Loop Step 2: Supervisor Assigns Responder
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
        message: `${responder?.name} notified for ${target?.locationName}`,
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

  // Operational Loop Step 3: Responder Accepts Task
  acceptTask: (id) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    set((state) => {
      const target = state.incidents.find(i => i.id === id);
      return {
        incidents: state.incidents.map(inc => inc.id === id ? { ...inc, status: 'ACCEPTED' as IncidentStatus, acceptedAt: nowIso } : inc),
        activityLog: [
          {
            id: `act-${Date.now()}`,
            timestamp: nowIso,
            timeFormatted,
            incidentId: id,
            type: 'TASK_ACCEPTED',
            actor: target?.assignedResponderName || 'Rahim Uddin',
            actorRole: 'Field Responder',
            description: `${target?.assignedResponderName || 'Responder'} accepted task ${id} — traveling to site`,
            severity: 'info'
          },
          ...state.activityLog
        ]
      };
    });
  },

  // Operational Loop Step 4: Responder Starts Work
  startWork: (id) => {
    const nowIso = new Date().toISOString();
    const timeFormatted = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    set((state) => {
      const target = state.incidents.find(i => i.id === id);
      return {
        incidents: state.incidents.map(inc => inc.id === id ? { ...inc, status: 'IN_PROGRESS' as IncidentStatus, workStartedAt: nowIso } : inc),
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

  // Operational Loop Step 5: Responder Resolves with Evidence
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

  // Operational Loop Step 6: Supervisor Approves & Closes Incident
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
      title: "Waste Pile Detected near Main Cafeteria Lawn",
      category: "WASTE_ACCUMULATION",
      categoryLabel: "Waste Accumulation",
      description: "AI vision triggered detection for discarded food bags and cups.",
      cameraId: "GV-CAM-006",
      cameraName: "Cafeteria Rear Waste Shute",
      locationId: "zone-5",
      locationName: "Central Cafeteria",
      coordinates: [23.8150, 90.4262],
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
          actor: 'AI Engine (GV-CAM-006)',
          actorRole: 'Computer Vision Model',
          description: `AI detected waste accumulation at Central Cafeteria (Confidence: 93%)`,
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
          message: `Cafeteria rear zone flagged by CCTV vision.`,
          type: 'NEW_INCIDENT',
          incidentId: newId,
          read: false,
          priority: 'HIGH'
        },
        ...state.notifications
      ]
    }));
  },

  // Step-by-step Demo Advancement
  nextSimStep: () => {
    const current = get().simStep;
    const targetId = "GV-1042";

    if (current === 0) {
      // Step 1: Human operator verifies
      get().confirmIncident(targetId, 'HIGH', 'Verified via Gate 2 optical feed.');
      set({ simStep: 1 });
    } else if (current === 1) {
      // Step 2: Supervisor dispatches to Rahim (Cleaning Team B)
      get().assignIncident(targetId, "usr-resp-1", "usr-sup-1");
      set({ simStep: 2 });
    } else if (current === 2) {
      // Step 3: Rahim accepts
      get().acceptTask(targetId);
      set({ simStep: 3 });
    } else if (current === 3) {
      // Step 4: Rahim starts work
      get().startWork(targetId);
      set({ simStep: 4 });
    } else if (current === 4) {
      // Step 5: Rahim resolves with photo
      get().resolveTask(targetId, EVIDENCE_IMAGES.wasteAfter, "Debris removed and bin area disinfected.");
      set({ simStep: 5 });
    } else if (current === 5) {
      // Step 6: Supervisor approves and closes
      get().approveResolution(targetId, "CCTV confirmed area is spotless. Excellent response.");
      set({ simStep: 6, isSimulating: false });
    }
  },

  // Dynamic Operational Green Score Computation (Section 35)
  getGreenScore: () => {
    const incidents = get().incidents;
    const closed = incidents.filter(i => i.status === 'CLOSED');
    const total = incidents.length || 1;

    // 1. Resolution Rate (30% weight) -> closed / total
    const resRate = (closed.length / total) * 100;
    const resolutionScore = Math.min(100, Math.max(0, resRate));

    // 2. Response Efficiency (20% weight) -> response under 15 mins
    const responseScore = 88; // Derived benchmark

    // 3. Hotspot & Repeat Reduction (20% weight)
    const recurringScore = 76;

    // 4. Waste Management Triage (15% weight)
    const wasteIncidents = incidents.filter(i => i.category === 'WASTE_ACCUMULATION' || i.category === 'BIN_OVERFLOW' || i.category === 'ILLEGAL_DUMPING');
    const wasteClosed = wasteIncidents.filter(i => i.status === 'CLOSED');
    const wasteScore = (wasteClosed.length / (wasteIncidents.length || 1)) * 100;

    // 5. Area Cleanliness Index (15% weight)
    const activeCritical = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'CLOSED').length;
    const cleanlinessScore = Math.max(50, 100 - activeCritical * 15);

    // Weighted composite
    const overall = Math.round(
      resolutionScore * 0.30 +
      responseScore * 0.20 +
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
        incidentResolution: { score: Math.round(resolutionScore), weight: 0.30, label: 'Incident Resolution' },
        responseEfficiency: { score: Math.round(responseScore), weight: 0.20, label: 'Response Efficiency' },
        recurringReduction: { score: Math.round(recurringScore), weight: 0.20, label: 'Hotspot & Repeat Reduction' },
        wastePerformance: { score: Math.round(wasteScore), weight: 0.15, label: 'Waste Management Triage' },
        areaCleanliness: { score: Math.round(cleanlinessScore), weight: 0.15, label: 'Area Cleanliness Index' }
      },
      trendComparisonPct: 3.8
    };
  },

  getIncidentById: (id) => get().incidents.find(i => i.id === id)
}));
