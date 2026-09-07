import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
import {
  LayoutDashboard,
  Grid,
  HeartPulse,
  History as HistoryIcon,
  CheckSquare,
  CalendarCheck,
  Bell,
  TrendingUp,
  Activity,
  Bug,
  FileText,
  Settings,
  User,
  X,
  Sprout,
  LucideIcon,
} from 'lucide-react';

import { useUserStore } from '../../stores/userStore';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  alertCount?: number;
  isJudgeBadge?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, alerts } = useUIStore();
  const { profile } = useUserStore();
  const navigate = useNavigate();

  const unreadAlertCount = alerts.filter(a => !a.isRead).length;

  const navGroups: NavGroup[] = [
    {
      group: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'My Fields', path: '/fields', icon: Grid },
        { label: 'Field Health', path: '/field-health', icon: HeartPulse },
        { label: 'History', path: '/history', icon: HistoryIcon },
      ],
    },
    {
      group: 'MONITORING',
      items: [
        { label: 'Check Field', path: '/check-field', icon: CheckSquare, badge: 'Active' },
        { label: 'Follow-ups', path: '/followups', icon: CalendarCheck },
        { label: 'Alerts', path: '/alerts', icon: Bell, alertCount: unreadAlertCount },
      ],
    },
    {
      group: 'INSIGHTS',
      items: [
        { label: 'Risk Trends', path: '/insights/risk', icon: TrendingUp },
        { label: 'Disease Trends', path: '/insights/disease', icon: Activity },
        { label: 'Pest Trends', path: '/insights/pest', icon: Bug },
        { label: 'Reports', path: '/reports', icon: FileText },
      ],
    },
    {
      group: 'ACCOUNT',
      items: [
        { label: 'Settings', path: '/settings', icon: Settings },
        { label: 'Profile', path: '/profile', icon: User },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container: 240px wide */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo & Tagline */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white shadow-sm shadow-emerald-900/20">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1">
                APOCALYPSE <span className="text-emerald-700 font-extrabold">AI</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Precision Crop Health Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <div className="px-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                {grp.group}
              </div>
              <div className="space-y-0.5">
                {grp.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-900 font-semibold border-l-3 border-emerald-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 text-slate-500" />
                      <span>{item.label}</span>
                    </div>

                    {item.alertCount && item.alertCount > 0 ? (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-full">
                        {item.alertCount}
                      </span>
                    ) : null}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer User Info */}
        <div
          onClick={() => navigate('/profile')}
          className="p-3 border-t border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-semibold text-slate-900 leading-none truncate">{profile.name}</div>
                <div className="text-[11px] text-slate-500 leading-none mt-1 truncate">{profile.location}</div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-100/70 font-semibold px-1.5 py-0.5 rounded shrink-0">
              Officer
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
