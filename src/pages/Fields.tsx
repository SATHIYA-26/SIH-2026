import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFieldStore } from '../stores/fieldStore';
import { StatusBadge } from '../components/common/StatusBadge';
import { PlusCircle, Search, Filter, MapPin, ArrowRight, Eye, Grid, CheckSquare } from 'lucide-react';

export const Fields: React.FC = () => {
  const navigate = useNavigate();
  const { fields, setSelectedFieldId } = useFieldStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');

  const filteredFields = fields.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = filterRisk === 'ALL' || f.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Monitored Fields
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Active parcels under precision early-warning health tracking ({fields.length} parcels)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/check-field')}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>NEW FIELD CHECK</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search field name, crop, or plot..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-slate-500 font-medium">Filter Risk:</span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {(['ALL', 'HIGH', 'MODERATE', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterRisk(lvl)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  filterRisk === lvl
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Data Table */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Field Name</th>
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Crop Age</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">7-Day Risk</th>
                <th className="py-3 px-4">Last Checked</th>
                <th className="py-3 px-4">Next Check</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFields.map((f) => {
                const riskPercent = Math.round(f.riskProbability * 100);

                return (
                  <tr
                    key={f.id}
                    onClick={() => {
                      setSelectedFieldId(f.id);
                      navigate('/');
                    }}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{f.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {f.locationName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{f.crop}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{f.areaAcres} ac</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900">Day {f.daysSincePlanting}</span>
                      <div className="text-[10px] text-slate-400 truncate max-w-32">{f.estimatedGrowthStage}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{f.currentConditionStatus}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold font-mono text-sm ${
                            f.riskLevel === 'HIGH'
                              ? 'text-rose-700'
                              : f.riskLevel === 'MODERATE'
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {riskPercent}%
                        </span>
                        <StatusBadge type="risk" riskLevel={f.riskLevel} size="sm" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{f.lastCheckedDate}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900">In {f.nextCheckDays} days</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedFieldId(f.id);
                            navigate('/');
                          }}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                          title="Open Field Dashboard"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/check-field?fieldId=${f.id}`)}
                          className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-[11px]"
                        >
                          Check
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {filteredFields.map((f) => (
          <div
            key={f.id}
            onClick={() => {
              setSelectedFieldId(f.id);
              navigate('/');
            }}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{f.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {f.crop} · {f.areaAcres} acres · Day {f.daysSincePlanting}
                </p>
              </div>
              <StatusBadge type="risk" riskLevel={f.riskLevel} size="sm" />
            </div>

            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Condition:</span>
                <span className="font-semibold text-slate-900">{f.currentConditionStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">7-Day Risk:</span>
                <span className="font-bold font-mono text-slate-900">{Math.round(f.riskProbability * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Next Check:</span>
                <span className="font-semibold text-emerald-800">In {f.nextCheckDays} days</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-400">Checked: {f.lastCheckedDate}</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
