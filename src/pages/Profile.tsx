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
          Registered farm operator and precision agriculture agronomist details
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xl font-bold">
            S
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Sathiya</h2>
            <p className="text-xs text-slate-500">Lead Agronomist · Chennai Agro Division, Tamil Nadu</p>
            <div className="flex items-center gap-1 text-xs text-emerald-800 font-semibold mt-1">
              <Sprout className="w-3.5 h-3.5" />
              <span>4 Monitored Cotton Parcels (13.5 Total Acres)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block">Phone / SMS:</span>
            <strong className="text-slate-900">+91 94440 12345</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block">Location / Territory:</span>
            <strong className="text-slate-900">Chennai, Tamil Nadu, India</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block">Monitored Crops:</span>
            <strong className="text-slate-900">Cotton (Bt RCH-659, DCH-32, Bunny, Suraj)</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block">System Protocol:</span>
            <strong className="text-slate-900">Apocalypse Precision AI v2.0</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
