import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Grid, Plus, Bell, User } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const { alerts } = useUIStore();
  const unreadAlertCount = alerts.filter(a => !a.isRead).length;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-md">
      {/* Home */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 text-[11px] font-medium transition-colors ${
            isActive ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </NavLink>

      {/* Fields */}
      <NavLink
        to="/fields"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 text-[11px] font-medium transition-colors ${
            isActive ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Grid className="w-5 h-5 mb-0.5" />
        <span>Fields</span>
      </NavLink>

      {/* CHECK (Center Prominent Action) */}
      <button
        onClick={() => navigate('/check-field')}
        className="flex flex-col items-center -mt-4 bg-emerald-700 active:bg-emerald-900 text-white rounded-full p-2.5 shadow-lg shadow-emerald-800/30 border-2 border-white cursor-pointer"
        aria-label="Check field"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Alerts */}
      <NavLink
        to="/alerts"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 text-[11px] font-medium relative transition-colors ${
            isActive ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Bell className="w-5 h-5 mb-0.5" />
        <span>Alerts</span>
        {unreadAlertCount > 0 && (
          <span className="absolute top-1 right-3 w-2 h-2 bg-rose-500 rounded-full" />
        )}
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 text-[11px] font-medium transition-colors ${
            isActive ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <User className="w-5 h-5 mb-0.5" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};
