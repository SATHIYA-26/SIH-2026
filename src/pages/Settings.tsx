import React from 'react';
import { useUIStore } from '../stores/uiStore';
import { Settings as SettingsIcon, Globe, Bell, Shield, Sliders, Smartphone } from 'lucide-react';

export const Settings: React.FC = () => {
  const { language, setLanguage } = useUIStore();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Application Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage localization, notification thresholds, and scouting alert preferences
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
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
            onChange={(e) => setLanguage(e.target.value as any)}
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
              <p className="text-xs text-slate-500">Receive instant high-risk early warning notifications</p>
            </div>
          </div>
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600 cursor-pointer"
          />
        </div>

        {/* Weather station sync */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Sliders className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Automatic Weather Sync</h3>
              <p className="text-xs text-slate-500">Update rainfall and canopy relative humidity hourly</p>
            </div>
          </div>
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
