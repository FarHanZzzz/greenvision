import React, { useRef, useEffect } from 'react';
import { CameraRecord } from '../../types';
import { useGreenVisionStore } from '../../store/useGreenVisionStore';

interface CCTVCanvasFeedProps {
  camera: CameraRecord;
  hasIncident?: boolean;
  forceCleanView?: boolean;
  className?: string;
  showDetails?: boolean;
}

export const CCTVCanvasFeed: React.FC<CCTVCanvasFeedProps> = ({
  camera,
  hasIncident = false,
  forceCleanView = false,
  className = "w-full h-full",
  showDetails = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const incidents = useGreenVisionStore((s) => s.incidents);
  const relatedIncident = incidents.find(i => i.cameraId === camera.id || i.id === camera.currentIncidentId);
  const isResolved = forceCleanView || (relatedIncident ? (
    relatedIncident.status === 'PENDING_APPROVAL' || relatedIncident.status === 'CLOSED'
  ) : false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    // Simulated people walking
    const people = [
      { x: 30, y: 140, speed: 0.8, color: '#38bdf8', dir: 1, label: 'Person 88%' },
      { x: 260, y: 155, speed: 0.6, color: '#f43f5e', dir: -1, label: 'Person 91%' },
      { x: 120, y: 130, speed: 0.5, color: '#e2e8f0', dir: 1, label: 'Person 85%' }
    ];

    // Simulated vehicle for gate/road cameras
    let vehicleX = -60;
    const isRoadCam = camera.id === 'GV-CAM-001' || camera.id === 'GV-CAM-003' || camera.id === 'GV-CAM-010' || camera.id === 'GV-CAM-013';

    const render = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      // 2. Draw Simulated Dhaka Campus Architectural Environment
      // Pavement & Road
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, h * 0.55, w, h * 0.45);

      // Sidewalk curb
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, h * 0.52, w, h * 0.05);

      // Background buildings / campus perimeter fence
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(20, h * 0.18, 90, h * 0.35);
      ctx.fillRect(130, h * 0.12, 110, h * 0.41);
      ctx.fillRect(260, h * 0.22, 100, h * 0.31);

      // Windows with subtle lighting
      ctx.fillStyle = '#fbbf24';
      ctx.globalAlpha = 0.25;
      for (let bx = 30; bx < 100; bx += 18) {
        for (let by = h * 0.22; by < h * 0.48; by += 18) {
          ctx.fillRect(bx, by, 8, 10);
        }
      }
      for (let bx = 145; bx < 230; bx += 22) {
        for (let by = h * 0.16; by < h * 0.5; by += 20) {
          ctx.fillRect(bx, by, 10, 12);
        }
      }
      ctx.globalAlpha = 1.0;

      // Streetlamp / post
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.75, h * 0.53);
      ctx.lineTo(w * 0.75, h * 0.22);
      ctx.lineTo(w * 0.78, h * 0.2);
      ctx.stroke();

      // Streetlamp glow
      const lampGrad = ctx.createRadialGradient(w * 0.78, h * 0.2, 2, w * 0.78, h * 0.2, 45);
      lampGrad.addColorStop(0, 'rgba(253, 224, 71, 0.4)');
      lampGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = lampGrad;
      ctx.beginPath();
      ctx.arc(w * 0.78, h * 0.2, 45, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Moving Vehicle on Road (e.g. CNG auto-rickshaw or car)
      if (isRoadCam) {
        vehicleX += 1.8;
        if (vehicleX > w + 80) vehicleX = -80;

        // Auto-rickshaw silhouette
        ctx.fillStyle = '#15803d'; // Green CNG
        ctx.fillRect(vehicleX, h * 0.62, 50, 26);
        ctx.fillStyle = '#facc15'; // Yellow roof
        ctx.fillRect(vehicleX + 6, h * 0.55, 38, 10);
        // Wheels
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(vehicleX + 12, h * 0.76, 7, 0, Math.PI * 2);
        ctx.arc(vehicleX + 40, h * 0.76, 7, 0, Math.PI * 2);
        ctx.fill();

        // AI Bounding box around moving vehicle
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(vehicleX - 4, h * 0.53, 58, 33);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(vehicleX - 4, h * 0.46, 70, 11);
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px monospace';
        ctx.fillText('Auto-Rickshaw 92%', vehicleX - 2, h * 0.53);
      }

      // 4. Draw Moving Pedestrians (Dhaka campus students)
      people.forEach((p, idx) => {
        p.x += p.speed * p.dir;
        if (p.x > w - 20) p.dir = -1;
        if (p.x < 20) p.dir = 1;

        const py = h * 0.54 + idx * 8;

        // Head
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(p.x, py - 20, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Body / shirt
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 4, py - 15, 8, 12);

        // Legs (walking oscillation)
        const legSwing = Math.sin(tick * 0.15 + idx) * 4;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x - 2, py - 3);
        ctx.lineTo(p.x - 2 + legSwing, py + 8);
        ctx.moveTo(p.x + 2, py - 3);
        ctx.lineTo(p.x + 2 - legSwing, py + 8);
        ctx.stroke();

        // AI Bounding Box around person
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x - 9, py - 26, 18, 36);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';
        ctx.fillRect(p.x - 9, py - 34, 48, 8);
        ctx.fillStyle = '#ffffff';
        ctx.font = '7px monospace';
        ctx.fillText(p.label, p.x - 7, py - 28);
      });

      // 5. Special Environmental Incidents (Waste Pile, Bin Overflow, Waterlogging) - Resolves User Request 2
      if (hasIncident || camera.id === 'GV-CAM-004' || relatedIncident) {
        const wx = w * 0.38;
        const wy = h * 0.65;

        if (!isResolved) {
          // ================= BEFORE CLEANUP: UNRESOLVED GARBAGE ACCUMULATION =================
          // Black trash bags
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(wx, wy, 16, 0, Math.PI * 2);
          ctx.arc(wx + 18, wy + 2, 14, 0, Math.PI * 2);
          ctx.arc(wx - 14, wy + 4, 12, 0, Math.PI * 2);
          ctx.fill();

          // Scattered plastic cups/cartons
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(wx + 8, wy - 8, 6, 8);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(wx - 10, wy + 6, 8, 6);
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(wx + 22, wy + 8, 7, 7);

          // Pulsing RED AI Bounding Box
          const pulse = Math.sin(tick * 0.1) * 0.3 + 0.7;
          ctx.strokeStyle = `rgba(239, 68, 68, ${pulse})`;
          ctx.lineWidth = 2.5;
          ctx.setLineDash([5, 3]);
          ctx.strokeRect(wx - 28, wy - 22, 68, 42);
          ctx.setLineDash([]);

          // AI Inference Tag
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(wx - 28, wy - 33, 140, 12);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('AI: WASTE ACCUMULATION (94%)', wx - 25, wy - 24);

          // Warning Header
          ctx.fillStyle = 'rgba(153, 27, 27, 0.85)';
          ctx.fillRect(10, 26, 230, 16);
          ctx.fillStyle = '#fca5a5';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('⚠️ UNRESOLVED ANOMALY: CLEANUP REQUIRED', 16, 37);
        } else {
          // ================= AFTER CLEANUP: SPOTLESS SANITIZED PAVEMENT (RESOLVED) =================
          // Clean, washed sidewalk pavers
          ctx.fillStyle = '#334155';
          ctx.fillRect(wx - 32, wy - 20, 84, 46);

          // Paver division lines
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          for (let px = wx - 32; px < wx + 52; px += 18) {
            ctx.beginPath();
            ctx.moveTo(px, wy - 20);
            ctx.lineTo(px, wy + 26);
            ctx.stroke();
          }

          // Sanitized wet sheen reflection
          ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
          ctx.fillRect(wx - 30, wy - 10, 80, 32);

          // Upright, clean green municipal recycling bin
          ctx.fillStyle = '#059669';
          ctx.fillRect(wx + 22, wy - 20, 18, 28);
          ctx.fillStyle = '#047857';
          ctx.fillRect(wx + 20, wy - 24, 22, 5);

          // Recycling check on bin
          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('✓', wx + 26, wy - 5);

          // Pulsing GREEN AI Verification Bounding Box
          const pulse = Math.sin(tick * 0.08) * 0.2 + 0.8;
          ctx.strokeStyle = `rgba(16, 185, 129, ${pulse})`;
          ctx.lineWidth = 2;
          ctx.strokeRect(wx - 34, wy - 24, 88, 52);

          // AI Verified Tag
          ctx.fillStyle = '#059669';
          ctx.fillRect(wx - 34, wy - 35, 160, 12);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('✓ AI: CLEAN PAVEMENT (99% CLEAR)', wx - 31, wy - 26);

          // Live Post-Cleanup Notification banner at top of camera
          ctx.fillStyle = 'rgba(6, 78, 59, 0.9)';
          ctx.fillRect(10, 26, 280, 16);
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1;
          ctx.strokeRect(10, 26, 280, 16);
          ctx.fillStyle = '#6ee7b7';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('● VERIFIED CLEANED BY RESPONDER (01307726701)', 16, 37);
        }
      } else if (camera.id === 'GV-CAM-005') {
        // Cafeteria terrace bin
        const bx = w * 0.45;
        const by = h * 0.60;
        ctx.fillStyle = '#059669';
        ctx.fillRect(bx, by - 24, 18, 30);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(bx - 4, by - 30, 26, 7);
      }

      // 6. Camera Lens Vignette & Scanlines
      const vigGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.65);
      vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vigGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);

      // Fine horizontal scanline
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }

      // 7. Live Digital Timestamp (Dhaka GMT+6 BST)
      const now = new Date();
      const timeStr = now.toISOString().slice(0, 10) + ' ' +
        now.toLocaleTimeString('en-GB', { hour12: false }) + '.' +
        String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0') + ' BST';

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(timeStr, w - 170, 16);

      // 8. Camera Watermark & Live REC
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`${camera.id} • ${camera.locationName}`, 12, 16);

      // Blinking red recording dot
      if (Math.floor(tick / 25) % 2 === 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(12, h - 14, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('LIVE STREAM • 30.0 FPS', 20, h - 11);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('LIVE STREAM • 30.0 FPS', 20, h - 11);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [camera, hasIncident]);

  return (
    <canvas
      ref={canvasRef}
      width={380}
      height={220}
      className={`${className} object-cover rounded-lg`}
    />
  );
};
