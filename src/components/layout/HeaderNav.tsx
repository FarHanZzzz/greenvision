import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  SlidersHorizontal, 
  Smartphone, 
  Columns, 
  Bell, 
  Clock, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  Radio
} from 'lucide-react';
import { useGreenVisionStore, AppInterface } from '../../store/useGreenVisionStore';

export const HeaderNav: React.FC = () => {
  const currentInterface = useGreenVisionStore((s) => s.currentInterface);
  const setInterface = useGreenVisionStore((s) => s.setInterface);
  const activeUser = useGreenVisionStore((s) => s.activeUser);
  const setActiveUser = useGreenVisionStore((s) => s.setActiveUser);
  const users = useGreenVisionStore((s) => s.users);
  const notifications = useGreenVisionStore((s) => s.notifications);
  const markNotificationRead = useGreenVisionStore((s) => s.markNotificationRead);
  const setSelectedIncidentId = useGreenVisionStore((s) => s.setSelectedIncidentId);

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [dhakaTime, setDhakaTime] = useState('');

  // Live Dhaka Clock (GMT+6)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now);
      setDhakaTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const interfaces: { id: AppInterface; label: string; icon: any }[] = [
    { id: 'COMMAND_CENTER', label: 'Central Command', icon: LayoutDashboard },
    { id: 'OPERATIONS', label: 'Operations Room', icon: SlidersHorizontal },
    { id: 'RESPONDER', label: 'Responder Mobile', icon: Smartphone },
    { id: 'DUAL_DEMO', label: 'Split Demo View', icon: Columns },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md select-none">
      <div className="max-w-[1720px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-white bg-clip-text text-transparent">
                GREENVISION
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 tracking-wider">
                V1.0 PROTOTYPE
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">DHAKA CAMPUS — LIVE</span>
            </div>
          </div>
        </div>

        {/* Interface Switcher Navigation */}
        <nav className="hidden md:flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          {interfaces.map((item) => {
            const Icon = item.icon;
            const isActive = currentInterface === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setInterface(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Time, Notifications, Role Persona */}
        <div className="flex items-center gap-3">
          
          {/* Live Clock */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{dhakaTime || '6:41 PM'} <span className="text-slate-500">BST</span></span>
          </div>

          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
              }}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <span className="text-xs font-semibold text-slate-200">Campus Incident Alerts</span>
                  <span className="text-[10px] font-mono text-emerald-400">{unreadCount} Unread</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.incidentId) setSelectedIncidentId(n.incidentId);
                        setShowNotifMenu(false);
                      }}
                      className={`p-3 text-xs hover:bg-slate-800/80 cursor-pointer transition flex gap-2.5 ${
                        !n.read ? 'bg-slate-800/40' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.priority === 'CRITICAL' || n.priority === 'HIGH' ? (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-200 truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.timeFormatted}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Persona / Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 transition"
            >
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="w-7 h-7 rounded-full object-cover border border-emerald-500/50"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-200 leading-tight">{activeUser.name}</div>
                <div className="text-[10px] text-emerald-400 leading-none">{activeUser.roleTitle.split('(')[0]}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 uppercase font-mono">
                  Switch Operational Persona
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {users.map((u) => {
                    const isSelected = activeUser.id === u.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          setActiveUser(u.id);
                          setShowRoleMenu(false);
                          // Auto switch view to match role for intuitive presentation
                          if (u.role === 'FIELD_RESPONDER') setInterface('RESPONDER');
                          else if (u.role === 'CONTROL_OPERATOR' || u.role === 'SUPERVISOR') setInterface('OPERATIONS');
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center gap-3 transition ${
                          isSelected ? 'bg-emerald-950/60 border-l-2 border-emerald-400' : 'hover:bg-slate-800/80'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-200 truncate">{u.name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{u.roleTitle}</div>
                        </div>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
