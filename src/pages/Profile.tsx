import React from 'react';
import { User, MapPin, Phone, Mail, Award, Sprout } from 'lucide-react';

export const Profile: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          User Profile
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Registered farm operator and precision agriculture scout details
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xl font-bold">
            RK
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ramesh Kumar</h2>
            <p className="text-xs text-slate-500">Lead Farm Operator · Wardha Valley Agricultural Zone</p>
            <div className="flex items-center gap-1 text-xs text-emerald-800 font-semibold mt-1">
              <Sprout className="w-3.5 h-3.5" />
              <span>4 Monitored Parcels (15.5 Total Acres)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block">Phone / SMS:</span>
            <strong className="text-slate-900">+91 98234 56789</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block">Location / Village:</span>
            <strong className="text-slate-900">Plot 4B, Wardha District, Maharashtra</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block">Primary Crop:</span>
            <strong className="text-slate-900">Bt Cotton (Kharif Season)</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block">Scout Protocol:</span>
            <strong className="text-slate-900">AgroPulse Precision AI v1.0</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
