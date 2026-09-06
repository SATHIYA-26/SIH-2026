import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFieldStore } from '../../stores/fieldStore';
import { useUIStore } from '../../stores/uiStore';
import {
  CloudRain,
  Thermometer,
  Droplets,
  Bell,
  Globe,
  PlusCircle,
  Menu,
  ChevronDown,
  User,
  CheckCircle,
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fields, selectedFieldId, setSelectedFieldId, getSelectedField } = useFieldStore();
  const {
    toggleSidebar,
    language,
    setLanguage,
    alerts,
    notificationsOpen,
    toggleNotifications,
    markAlertRead,
    markAllAlertsRead
  } = useUIStore();

  const selectedField = getSelectedField();
  const weather = selectedField?.latestAnalysis?.weather || {
    temperature: 29,
    humidity: 86,
    recentRainfall: 12,
  };

  const unreadAlerts = alerts.filter(a => !a.isRead);

  const handleFieldChange = (newFieldId: string) => {
    setSelectedFieldId(newFieldId);
    // If on check-field page, update URL search params immediately so the form and view reload
    if (location.pathname.startsWith('/check-field')) {
      navigate(`/check-field?fieldId=${newFieldId}`, { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 md:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Field Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Compact Field Selector Dropdown */}
          <div className="relative flex items-center">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:border-slate-300 transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-100" />
              <div>
                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedFieldId}
                    onChange={(e) => handleFieldChange(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer pr-4"
                  >
                    {fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {selectedField?.crop} · {selectedField?.areaAcres} acres
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Weather Summary (Compact & Informative) */}
        <div className="hidden xl:flex items-center gap-4 bg-slate-50/80 border border-slate-200/80 rounded-lg px-3.5 py-1.5 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-medium">
            <Thermometer className="w-4 h-4 text-amber-600" />
            <span>{weather.temperature}°C</span>
          </div>
          <div className="w-px h-3.5 bg-slate-200" />
          <div className="flex items-center gap-1.5 font-medium">
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>{weather.humidity}% RH</span>
          </div>
          <div className="w-px h-3.5 bg-slate-200" />
          <div className="flex items-center gap-1.5 font-medium">
            <CloudRain className="w-4 h-4 text-indigo-600" />
            <span>{weather.recentRainfall} mm rain</span>
          </div>
        </div>

        {/* Right Section: Language, Notifications, Primary Action */}
        <div className="flex items-center gap-2.5">

          {/* Language Dropdown */}
          <div className="relative hidden sm:flex items-center">
            <Globe className="w-4 h-4 text-slate-400 mr-1.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer border-none"
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Marathi">मराठी (Marathi)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadAlerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 animate-in fade-in-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">Field Alerts</span>
                    {unreadAlerts.length > 0 && (
                      <span className="text-[11px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-full">
                        {unreadAlerts.length} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllAlertsRead}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {alerts.map((alt) => (
                    <div
                      key={alt.id}
                      onClick={() => {
                        markAlertRead(alt.id);
                        navigate(alt.actionPath);
                      }}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                        alt.isRead ? 'bg-slate-50/50 border-slate-100' : 'bg-rose-50/40 border-rose-200'
                      } hover:bg-slate-100`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-900">{alt.title}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{alt.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{alt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button: CHECK FIELD */}
          <button
            onClick={() => navigate('/check-field')}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm shadow-emerald-900/10 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="uppercase tracking-wider">CHECK FIELD</span>
          </button>
        </div>
      </div>
    </header>
  );
};
