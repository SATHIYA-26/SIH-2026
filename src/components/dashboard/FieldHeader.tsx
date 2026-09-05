import React from 'react';
import { Field } from '../../types/field';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, GitCompare, Share2, PlusCircle, CheckCircle } from 'lucide-react';

interface FieldHeaderProps {
  field: Field;
}

export const FieldHeader: React.FC<FieldHeaderProps> = ({ field }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {field.name}
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
            {field.variety || 'Bt Hybrid'}
          </span>
        </div>
        <p className="text-sm text-slate-600 font-normal mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{field.crop}</span>
          <span className="text-slate-300">·</span>
          <span>{field.areaAcres} acres</span>
          <span className="text-slate-300">·</span>
          <span>Day {field.daysSincePlanting}</span>
          <span className="text-slate-300">·</span>
          <span className="text-emerald-700 font-medium">Last checked {field.lastCheckedDate.toLowerCase()}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500 text-xs flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {field.locationName}
          </span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/compare')}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <GitCompare className="w-3.5 h-3.5 text-slate-500" />
          <span>Compare</span>
        </button>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: field.name, text: `Field health update for ${field.name}` });
            } else {
              alert('Field advisory link copied to clipboard.');
            }
          }}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          title="Share advisory"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          onClick={() => navigate(`/check-field?fieldId=${field.id}`)}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm shadow-emerald-900/10 transition-all cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Check Field</span>
        </button>
      </div>
    </div>
  );
};
