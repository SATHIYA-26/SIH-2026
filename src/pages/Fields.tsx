import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFieldStore } from '../stores/fieldStore';
import { StatusBadge } from '../components/common/StatusBadge';
import { PlusCircle, Search, MapPin, ArrowRight, Eye, X, Sprout } from 'lucide-react';
import { Field } from '../types/field';
import { COTTON_LEAF_HEALTHY_IMAGE } from '../data/mockData';
import { calculateDaysSincePlanting } from '../utils/dateUtils';

export const Fields: React.FC = () => {
  const navigate = useNavigate();
  const { fields, setSelectedFieldId, addField } = useFieldStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New field form state
  const [newFieldName, setNewFieldName] = useState('');
  const [newCrop, setNewCrop] = useState('Cotton');
  const [newVariety, setNewVariety] = useState('Bt Cotton RCH-659');
  const [newAcreage, setNewAcreage] = useState('3.0');
  const [newPlantingDate, setNewPlantingDate] = useState('2026-07-01');
  const [newLocation, setNewLocation] = useState('Ambattur Sector 2, Chennai, Tamil Nadu');

  const filteredFields = fields.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.locationName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = filterRisk === 'ALL' || f.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName) return;

    const diffDays = calculateDaysSincePlanting(newPlantingDate);

    const newField: Field = {
      id: `field-${Date.now()}`,
      name: newFieldName,
      crop: newCrop,
      variety: newVariety,
      areaAcres: parseFloat(newAcreage) || 2.5,
      plantingDate: newPlantingDate,
      daysSincePlanting: diffDays,
      estimatedGrowthStage: diffDays > 60 ? 'Flowering & Boll Development' : 'Vegetative Growth',
      currentConditionStatus: 'Awaiting Initial Field Check',
      riskProbability: 0.20,
      riskLevel: 'LOW',
      pestPressureSummary: 'Uninspected (New Field)',
      lastCheckedDate: 'Never',
      nextCheckDays: 1,
      followUpCount: 0,
      followUpHistory: [],
      locationName: newLocation,
      polygon: {
        center: [13.0827, 80.2707],
        bounds: [
          [13.0850, 80.2680],
          [13.0860, 80.2740],
          [13.0800, 80.2730],
          [13.0795, 80.2675]
        ]
      },
      inspectionPoints: [],
      latestAnalysis: {
        id: `ana-${Date.now()}`,
        fieldId: `field-${Date.now()}`,
        timestamp: new Date().toISOString(),
        condition: {
          status: 'Awaiting Initial Field Check',
          confidence: 0.95,
          topClass: 'healthy',
          probabilities: { healthy: 0.95, bacterial: 0.02, curl_virus: 0.02, fusarium: 0.01 },
          needsAttention: false,
          leafImageUrl: COTTON_LEAF_HEALTHY_IMAGE
        },
        pest: { pestType: 'Cotton Aphid', currentCount: 0, pestPressure: 'Low' },
        weather: {
          temperature: 29,
          humidity: 78,
          recentRainfall: 0,
          rainfallTrend: '0 mm',
          daysSinceRain: 4,
          conditionDescription: 'Sunny coastal weather',
          forecast: []
        },
        cropStage: {
          cropName: newCrop,
          plantingDate: newPlantingDate,
          daysSincePlanting: diffDays,
          stageName: diffDays > 60 ? 'Flowering & Boll Development' : 'Vegetative Growth',
          stageProgressPercent: 50,
          totalCycleDays: 160,
          stages: []
        },
        risk: {
          probability: 0.20,
          level: 'LOW',
          horizonDays: 7,
          summary: 'Baseline healthy parcel. Initial scouting required.',
          trendDirection: 'stable',
          drivers: []
        },
        actions: [
          {
            id: 'act-new-1',
            stepNumber: 1,
            action: 'Perform first-time baseline field check',
            detail: 'Capture a representative leaf photo and count pests along the center row transect.',
            type: 'inspection'
          }
        ],
        followup: {
          daysRemaining: 1,
          recommendedIntervalDays: 3,
          targetDate: 'Immediate Check Recommended',
          status: 'pending',
          reason: 'Newly registered parcel requires initial baseline check'
        }
      }
    };

    addField(newField);
    setIsAddModalOpen(false);
    navigate(`/check-field?fieldId=${newField.id}&mode=initial`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Monitored Fields
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Your registered fields and their current crop health status ({fields.length} fields)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>REGISTER NEW FIELD</span>
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
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${filterRisk === lvl
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
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
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
                      navigate('/dashboard');
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
                    <td className="py-3.5 px-4 font-heading font-medium text-slate-700">{f.areaAcres} ac</td>
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
                          className={`font-bold font-heading text-sm ${f.riskLevel === 'HIGH'
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
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <div>{f.lastCheckedDate}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {f.followUpCount ? `${f.followUpCount} Follow-up${f.followUpCount > 1 ? 's' : ''}` : 'Baseline only'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900">In {f.nextCheckDays} days</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedFieldId(f.id);
                            navigate('/dashboard');
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/check-field?fieldId=${f.id}`)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
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

      {/* Mobile Card Grid */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {filteredFields.map((f) => (
          <div
            key={f.id}
            onClick={() => {
              setSelectedFieldId(f.id);
              navigate('/dashboard');
            }}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900">{f.name}</h3>
                <div className="text-xs text-slate-500">{f.crop} · {f.areaAcres} acres</div>
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
                <span className="font-bold font-heading text-slate-900">{Math.round(f.riskProbability * 100)}%</span>
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

      {/* Real-World Register New Field Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-900">Register New Agricultural Field</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateField} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Field / Plot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Redhills Cotton Farm Zone 1"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Crop Type</label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                  >
                    <option value="Cotton">Cotton (Kharif)</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Groundnut">Groundnut</option>
                    <option value="Chilli">Chilli / Pepper</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Variety / Hybrid</label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={newAcreage}
                    onChange={(e) => setNewAcreage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Planting Date</label>
                  <input
                    type="date"
                    required
                    value={newPlantingDate}
                    onChange={(e) => setNewPlantingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location / Village (Chennai Territory)</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Save & Start Initial Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
