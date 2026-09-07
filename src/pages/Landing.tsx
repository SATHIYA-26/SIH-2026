import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFieldStore } from '../stores/fieldStore';
import {
  COTTON_LEAF_BACTERIAL_IMAGE,
  COTTON_LEAF_HEALTHY_IMAGE,
} from '../data/mockData';
import {
  Sprout,
  ShieldCheck,
  Activity,
  TrendingUp,
  Bug,
  CloudSun,
  Camera,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Sparkles,
  Clock,
  FileText,
  BarChart3,
  Layers,
  ChevronRight,
  ShieldAlert,
  Droplets,
  Thermometer,
  Eye,
  Check,
  AlertTriangle,
  GitCompare,
  Zap,
  Leaf,
  ScanLine,
  CalendarCheck,
  TrendingDown,
  Shield,
  ArrowUpRight,
} from 'lucide-react';

interface SimulationScenario {
  id: string;
  label: string;
  tag: string;
  badgeColor: string;
  image: string;
  diseaseName: string;
  confidence: number;
  riskPercent: number;
  riskLevel: 'HIGH' | 'MODERATE' | 'LOW';
  pestCount: number;
  pestName: string;
  temp: number;
  humidity: number;
  rainfall: number;
  actionText: string;
  actionDetail: string;
  recheckDays: number;
}

const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'bacterial_blight',
    label: 'Bacterial Blight',
    tag: 'High Risk Outbreak',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    image: COTTON_LEAF_BACTERIAL_IMAGE,
    diseaseName: 'Cotton Leaf Bacterial Blight (Xanthomonas)',
    confidence: 91.3,
    riskPercent: 68,
    riskLevel: 'HIGH',
    pestCount: 18,
    pestName: 'Cotton Aphid',
    temp: 29,
    humidity: 86,
    rainfall: 12,
    actionText: 'Apply Copper Oxychloride 50 WP (2.5g/L)',
    actionDetail: 'Spray infected leaves and 5m buffer quadrant. Stop waterlogging.',
    recheckDays: 3,
  },
  {
    id: 'leaf_curl',
    label: 'Leaf Curl Virus',
    tag: 'Moderate Risk',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    image: COTTON_LEAF_BACTERIAL_IMAGE,
    diseaseName: 'Cotton Leaf Curl Virus (CLCuV Vector)',
    confidence: 89.4,
    riskPercent: 48,
    riskLevel: 'MODERATE',
    pestCount: 14,
    pestName: 'Whitefly (Vector)',
    temp: 31,
    humidity: 74,
    rainfall: 0,
    actionText: 'Apply Neem Oil Extract + Vector Traps',
    actionDetail: 'Install yellow sticky traps to capture whitefly carriers.',
    recheckDays: 5,
  },
  {
    id: 'healthy_crop',
    label: 'Healthy Canopy',
    tag: 'Optimal / Stable',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    image: COTTON_LEAF_HEALTHY_IMAGE,
    diseaseName: 'Healthy Cotton Foliage (Normal Growth)',
    confidence: 95.8,
    riskPercent: 12,
    riskLevel: 'LOW',
    pestCount: 2,
    pestName: 'Aphids (Below Threshold)',
    temp: 28,
    humidity: 68,
    rainfall: 4,
    actionText: 'Continue Regular Crop Monitoring',
    actionDetail: 'Foliage is clean and green. Maintain standard irrigation schedule.',
    recheckDays: 10,
  },
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { fields, setSelectedFieldId } = useFieldStore();
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>(
    SIMULATION_SCENARIOS[0]
  );

  const totalAcres = fields.reduce((acc, f) => acc + (f.areaAcres || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eaf4fd] via-[#f1f7fd] to-[#e4f1fc] text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-950 relative overflow-hidden">
      {/* Soft Ambient Radial Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-sky-200/50 via-teal-100/30 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-0 w-[600px] h-[600px] bg-blue-200/30 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[700px] h-[500px] bg-emerald-100/40 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-sky-100/90 px-4 sm:px-8 py-3.5 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-800/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1 font-heading">
                APOCALYPSE <span className="text-emerald-700 font-extrabold">AI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none">
                Precision Crop Health Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#simulator" className="hover:text-emerald-800 transition-colors">
              AI Vision Simulator
            </a>
            <a href="#capabilities" className="hover:text-emerald-800 transition-colors">
              Core Capabilities
            </a>
            <a href="#workflow" className="hover:text-emerald-800 transition-colors">
              How It Works
            </a>
            <a href="#parcels" className="hover:text-emerald-800 transition-colors">
              Monitored Fields ({fields.length})
            </a>
          </nav>

          {/* Top CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold font-heading transition-all shadow-sm shadow-emerald-800/20 hover:shadow-emerald-800/30 cursor-pointer"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-sky-200/80 text-slate-700 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tamil Nadu Precision Agritech Early Warning System · Version 2.0</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight font-heading">
            Predict & Prevent Foliar Outbreaks{' '}
            <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 bg-clip-text text-transparent">
              7 Days Before
            </span>{' '}
            They Spread.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Multi-modal precision agriculture combining on-device leaf computer vision, microclimate telemetry, and 7-day probabilistic disease forecasting for professional agronomists and farmers.
          </p>

          {/* Hero Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm font-heading shadow-md shadow-emerald-800/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Enter Agronomist Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/check-field')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-sky-200 text-slate-800 font-bold text-sm font-heading shadow-xs transition-all hover:border-sky-300 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>Run Live Leaf Check</span>
            </button>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-left">
            <div className="bg-white/90 border border-sky-100 rounded-xl p-3.5 shadow-xs">
              <div className="text-2xl font-extrabold text-slate-900 font-heading">94.2%</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">Model Accuracy</div>
            </div>
            <div className="bg-white/90 border border-sky-100 rounded-xl p-3.5 shadow-xs">
              <div className="text-2xl font-extrabold text-emerald-700 font-heading">7 Days</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">Early Risk Horizon</div>
            </div>
            <div className="bg-white/90 border border-sky-100 rounded-xl p-3.5 shadow-xs">
              <div className="text-2xl font-extrabold text-slate-900 font-heading">{fields.length} Fields</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">{totalAcres.toFixed(1)} Monitored Acres</div>
            </div>
            <div className="bg-white/90 border border-sky-100 rounded-xl p-3.5 shadow-xs">
              <div className="text-2xl font-extrabold text-sky-700 font-heading">Real-Time</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">Chennai Weather Sync</div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE AI DIAGNOSIS SIMULATOR WIDGET */}
        <div id="simulator" className="mt-14 max-w-5xl mx-auto rounded-2xl bg-white border border-sky-200/90 p-5 sm:p-7 shadow-lg">
          {/* Simulator Header & Tab Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                  Interactive AI Vision & Risk Simulator
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Click a scenario below to see how Apocalypse AI processes leaf vision, sensor telemetry, and outbreak probability in real time:
              </p>
            </div>

            {/* Scenario Switcher Tabs */}
            <div className="flex items-center bg-sky-50/80 p-1 rounded-lg border border-sky-100 self-start sm:self-auto">
              {SIMULATION_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenario(sc)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeScenario.id === sc.id
                      ? 'bg-white text-emerald-950 shadow-2xs border border-sky-200/60'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Simulator Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
            {/* Left: Interactive Leaf Viewport with AI Bounding Box */}
            <div className="lg:col-span-5 relative group">
              <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 relative shadow-inner">
                <img
                  src={activeScenario.image}
                  alt={activeScenario.diseaseName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* AI HUD Overlay Elements */}
                <div className="absolute top-3 left-3 bg-slate-900/85 text-white text-[10px] px-2.5 py-1 rounded backdrop-blur-xs font-semibold flex items-center gap-1.5">
                  <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AI SCAN ACTIVE</span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${activeScenario.badgeColor}`}>
                    {activeScenario.tag}
                  </span>
                </div>

                {/* AI Bounding Box Indicator */}
                {activeScenario.riskLevel !== 'LOW' && (
                  <div className="absolute inset-8 border-2 border-dashed border-rose-400/80 rounded-lg animate-pulse flex items-start justify-end p-1.5 pointer-events-none">
                    <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Infection Vector
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 text-white p-2.5 rounded-lg backdrop-blur-md text-xs flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">Confidence Score:</span>
                  <span className="font-bold text-emerald-400 font-heading text-sm">
                    {activeScenario.confidence}% Match
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Real-time Multi-Modal Intelligence Telemetry */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Detected Diagnosis
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 font-heading">
                  {activeScenario.diseaseName}
                </h3>
              </div>

              {/* 3 Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 7-Day Outbreak Risk */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>7-Day Risk</span>
                    <Activity className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div
                    className={`text-2xl font-extrabold font-heading ${
                      activeScenario.riskLevel === 'HIGH'
                        ? 'text-rose-700'
                        : activeScenario.riskLevel === 'MODERATE'
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {activeScenario.riskPercent}%
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {activeScenario.riskLevel === 'HIGH'
                      ? 'Elevated spore spread'
                      : activeScenario.riskLevel === 'MODERATE'
                      ? 'Watch vector numbers'
                      : 'Safe baseline'}
                  </div>
                </div>

                {/* Pest Vector Density */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Pest Count</span>
                    <Bug className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-heading">
                    {activeScenario.pestCount}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate" title={activeScenario.pestName}>
                    {activeScenario.pestName}
                  </div>
                </div>

                {/* Weather Telemetry */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Microclimate</span>
                    <CloudSun className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 font-heading pt-1">
                    {activeScenario.temp}°C · {activeScenario.humidity}% RH
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {activeScenario.rainfall} mm recent rain
                  </div>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Agronomic Advisory: {activeScenario.actionText}</span>
                  </div>
                  <span className="text-[10.5px] font-bold text-emerald-800 bg-white border border-emerald-200 px-2 py-0.5 rounded shadow-2xs">
                    Recheck: In {activeScenario.recheckDays} Days
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed pl-5">
                  {activeScenario.actionDetail}
                </p>
              </div>

              {/* CTA Jump to Dashboard */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ready to test with your own crop photos?
                </span>
                <button
                  onClick={() => navigate('/check-field')}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
                >
                  <span>Open Scanner Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Scouting vs APOCALYPSE AI Comparison */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-heading">
            PARADIGM SHIFT IN CROP PROTECTION
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Why Traditional Scouting Fails vs. Early Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Catch infections in the incubation window rather than reacting after 40% of the field is already infected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Problem: Traditional */}
          <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-800">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base font-heading">
                Traditional Manual Scouting
              </h3>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ✗
                </span>
                <span><strong>Late Detection:</strong> Farmers notice blight 4 to 6 days after invisible microscopic spore infection.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ✗
                </span>
                <span><strong>Over-Spraying Chemicals:</strong> Blanket spraying toxic pesticides without knowing true vector density.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ✗
                </span>
                <span><strong>No Verification:</strong> Zero data tracking whether applied sprays actually stopped outbreak recurrence.</span>
              </li>
            </ul>
          </div>

          {/* Solution: Apocalypse AI */}
          <div className="bg-white border border-emerald-300 rounded-2xl p-6 shadow-sm ring-1 ring-emerald-200 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-base font-heading">
                APOCALYPSE AI Precision Intelligence
              </h3>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span><strong>7-Day Predictive Horizon:</strong> Multi-factor machine learning forecasts outbreaks before visible canopy damage.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span><strong>Targeted Microclimate Advisories:</strong> Exact dosage protocols (e.g. Copper Oxychloride 2.5g/L) targeted to weather triggers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span><strong>Closed-Loop Follow-Up Audit:</strong> Scheduled recheck countdowns to confirm recovery and prevent pesticide resistance.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="capabilities" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-sky-100">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-heading">
            FOUR INTELLIGENCE PILLARS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Engineered for Precision Crop Protection
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A comprehensive, multi-modal system that unifies computer vision with localized microclimate telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              1. Leaf Vision Diagnosis
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant mobile leaf classification for Bacterial Blight, Leaf Curl Virus, and spots with statistical match ratings.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              2. Weather Telemetry
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time Chennai weather sync tracking canopy heat, relative humidity ({'>'}85% spore threshold), and rainfall.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              3. 7-Day Outbreak Model
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Probabilistic disease forecasting model combining insect vector density with microclimate incubation indices.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              4. Follow-Up Audit Log
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Structured before/after comparison records verifying whether applied sprays successfully cured foliar infection.
            </p>
          </div>
        </div>
      </section>

      {/* Monitored Parcels Showcase */}
      <section id="parcels" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-sky-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-heading">
              LIVE MONITORED NETWORK
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-0.5">
              Registered Cotton Plots & Health Status
            </h2>
          </div>

          <button
            onClick={() => navigate('/fields')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto shadow-2xs cursor-pointer"
          >
            <span>View All Fields</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fields.map((f) => (
            <div
              key={f.id}
              onClick={() => {
                setSelectedFieldId(f.id);
                navigate('/dashboard');
              }}
              className="bg-white border border-sky-100 hover:border-emerald-300 rounded-xl p-4 transition-all hover:shadow-md cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-heading">{f.name}</h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{f.locationName}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      f.riskLevel === 'HIGH'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : f.riskLevel === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {f.riskLevel}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-xs space-y-1 mt-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Condition:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[130px]">{f.currentConditionStatus}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>7-Day Risk:</span>
                    <span className="font-bold font-heading text-slate-900">{Math.round(f.riskProbability * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Area:</span>
                    <span className="font-semibold text-slate-800">{f.areaAcres} acres</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-800 pt-2 border-t border-slate-100 font-bold">
                <span>Open in Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Card */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-bold font-heading max-w-2xl mx-auto">
            Ready to Protect Your Crops with Precision Intelligence?
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto">
            Access live field health metrics, run instant leaf scans, and generate printable agronomic evaluation dossiers.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-sm font-heading transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              Launch Dashboard Now
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 border border-emerald-600/50 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              View Sample Dossier Report
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sky-100 py-10 px-4 sm:px-8 max-w-7xl mx-auto text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-700 flex items-center justify-center text-white text-[10px]">
            <Sprout className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-700">APOCALYPSE AI</span>
          <span>· Precision Agriculture Early Warning System</span>
        </div>

        <div>
          Tamil Nadu Agritech Intelligence Platform · Version 2.0 (2026)
        </div>
      </footer>
    </div>
  );
};
