import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, CheckCircle2, Building2, ShieldCheck, CreditCard, LogOut, Sparkles } from 'lucide-react';
import { NotificationItem } from '../atlasData.js';

interface AtlasNavbarProps {
  companyName: string;
  userEmail: string;
  notifications: NotificationItem[];
  onOpenKyb: () => void;
  onOpenPlan: () => void;
  onMarkNotificationRead: (id: string) => void;
}

export const AtlasNavbar: React.FC<AtlasNavbarProps> = ({
  companyName,
  userEmail,
  notifications,
  onOpenKyb,
  onOpenPlan,
  onMarkNotificationRead,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between transition-all">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span>Welcome, {companyName}</span>
        </h1>
      </div>

      {/* Action buttons on the right */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-11 h-11 rounded-full border border-slate-200/90 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-blue-600" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">Notifications</span>
                <span className="text-xs text-blue-600 font-medium">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onMarkNotificationRead(n.id)}
                    className={`px-4 py-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors flex items-start space-x-3 ${
                      !n.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 leading-snug">{n.title}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill Badge */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 border border-slate-200/90 hover:border-slate-300 rounded-full sm:rounded-2xl pl-2 pr-3 sm:pr-4 py-1.5 bg-white hover:bg-slate-50 transition-all text-left group"
          >
            {/* Small Avatar icon container */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 border border-amber-300 flex items-center justify-center text-slate-800 font-bold text-xs shadow-inner flex-shrink-0">
              <Building2 className="w-4 h-4 text-amber-900" />
            </div>

            {/* User details */}
            <div className="hidden sm:flex flex-col pr-1">
              <span className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                {companyName}
              </span>
              <span className="text-[11px] text-slate-400 leading-tight">
                {userEmail}
              </span>
            </div>

            {/* Chevron */}
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform" />
          </button>

          {/* Profile Popover Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{companyName}</p>
                <p className="text-[11px] text-slate-500">{userEmail}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60">
                  <Sparkles className="w-3 h-3 text-blue-600" /> Pro Contractor Plan
                </div>
              </div>

              <div className="py-1 text-xs text-slate-700">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenKyb();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> KYB Verification Center
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenPlan();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4 text-slate-500" /> Subscription & Limits
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
