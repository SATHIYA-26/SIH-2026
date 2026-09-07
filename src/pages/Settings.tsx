import React, { useState } from 'react';
import { useUIStore } from '../stores/uiStore';
import { useUserStore } from '../stores/userStore';
import { useFieldStore } from '../stores/fieldStore';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Globe,
  Bell,
  Shield,
  Sliders,
  Smartphone,
  User,
  RotateCcw,
  CheckCircle2,
  Save
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { language, setLanguage } = useUIStore();
  const { profile, resetProfile } = useUserStore();
  const { resetToDefaults } = useFieldStore();
  const navigate = useNavigate();

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [weatherSync, setWeatherSync] = useState(true);
  const [highRiskSound, setHighRiskSound] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const handleSavePreferences = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all field records and officer profile to factory defaults?')) {
      resetToDefaults();
      resetProfile();
      alert('Data reset to default baseline successfully.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Application Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage localization, notification thresholds, officer profile, and data preferences
        </p>
      </div>

      {saveToast && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Settings and preferences saved successfully!</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        {/* Officer Profile Summary & Edit Shortcut */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Officer Profile & Credentials</h3>
              <p className="text-xs text-slate-500">
                Active officer: <strong>{profile.name}</strong> ({profile.location})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            Manage Profile
          </button>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Interface Language</h3>
              <p className="text-xs text-slate-500">Select language for farmer advisory microcopy</p>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value as any);
              handleSavePreferences();
            }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="Marathi">मराठी (Marathi)</option>
            <option value="Telugu">తెలుగు (Telugu)</option>
          </select>
        </div>

        {/* SMS / WhatsApp Notification Preferences */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">SMS & WhatsApp Alerts</h3>
              <p className="text-xs text-slate-500">
                Receive instant high-risk early warning notifications to {profile.phone}
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={smsAlerts}
            onChange={(e) => {
              setSmsAlerts(e.target.checked);
              handleSavePreferences();
            }}
            className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600 cursor-pointer"
          />
        </div>

        {/* Weather station sync */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <Sliders className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Automatic Weather Sync</h3>
              <p className="text-xs text-slate-500">Update rainfall and canopy relative humidity hourly</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={weatherSync}
            onChange={(e) => {
              setWeatherSync(e.target.checked);
              handleSavePreferences();
            }}
            className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600 cursor-pointer"
          />
        </div>

        {/* Critical Risk Auditory Alert */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">High Risk Priority Alerts</h3>
              <p className="text-xs text-slate-500">Flash urgent alerts on dashboard for &gt;60% outbreak risk</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={highRiskSound}
            onChange={(e) => {
              setHighRiskSound(e.target.checked);
              handleSavePreferences();
            }}
            className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600 cursor-pointer"
          />
        </div>

        {/* System Reset Button */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Reset Demo Data</h3>
            <p className="text-xs text-slate-500">Clear stored field follow-ups and restore default scenario</p>
          </div>
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
