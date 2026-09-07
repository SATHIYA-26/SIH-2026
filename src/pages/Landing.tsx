import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  Activity,
  CloudSun,
  Camera,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Layers,
  Leaf,
  ScanLine,
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3fc] via-[#f1f7fd] to-[#e6f1fb] text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-950 relative overflow-x-hidden">
      {/* Soft Ambient Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-sky-200/40 via-teal-100/20 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-emerald-100/30 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/75 border-b border-sky-100/80 px-4 sm:px-8 py-4 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-900/20 group-hover:scale-105 transition-transform">
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

          {/* Nav Links */}
          <nav className="hidden sm:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#about" className="hover:text-emerald-800 transition-colors">
              About
            </a>
            <a href="#how-it-works" className="hover:text-emerald-800 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-emerald-800 transition-colors">
              Features
            </a>
          </nav>

          {/* CTA */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold font-heading transition-all shadow-sm shadow-emerald-800/20 cursor-pointer"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 pb-20 px-4 sm:px-8 max-w-5xl mx-auto text-center space-y-8">
        {/* Simple Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-sky-200/80 text-slate-700 text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Next-Generation Precision Agriculture</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight font-heading max-w-4xl mx-auto">
          Early Detection and Outbreak Prevention for{' '}
          <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 bg-clip-text text-transparent">
            Healthier Crops.
          </span>
        </h1>

        {/* Clean Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          An intuitive early warning system that combines smart leaf photo diagnosis, real-time weather monitoring, and early risk predictions to protect your fields before diseases spread.
        </p>

        {/* Main CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm font-heading shadow-md shadow-emerald-800/20 transition-all hover:scale-105 cursor-pointer"
          >
            <span>Open Agronomist Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/check-field')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-sky-200 text-slate-800 font-bold text-sm font-heading shadow-xs transition-all hover:border-sky-300 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>Check a Field Now</span>
          </button>
        </div>
      </section>

      {/* How It Works (Simple 3-Step Flow) */}
      <section id="how-it-works" className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-heading">
            SIMPLE 3-STEP PROCESS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            How APOCALYPSE AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Fast, simple crop diagnosis in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-heading">
              STEP 1
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Take a Leaf Photo
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Capture or upload a clear photo of crop leaves directly from your mobile phone or tablet on the field.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto">
              <ScanLine className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-sky-800 uppercase tracking-wider font-heading">
              STEP 2
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Instant AI Diagnosis
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The AI automatically identifies leaf diseases and evaluates outbreak risks based on local weather and pest numbers.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-teal-800 uppercase tracking-wider font-heading">
              STEP 3
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Get Action Steps
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive simple, clear recommendations on what treatment to spray and when to schedule your next field check.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features (Pure & Simple) */}
      <section id="features" className="py-16 px-4 sm:px-8 max-w-5xl mx-auto border-t border-sky-100/90">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-heading">
            WHAT WE PROVIDE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Key Platform Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Designed for ease of use by agronomists, extension workers, and farmers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Smart Leaf Diagnosis
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant identification of common crop leaf diseases like Bacterial Blight, Leaf Curl Virus, and fungal leaf spots.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <CloudSun className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Weather & Moisture Tracking
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tracks local temperature, canopy humidity, and rainfall to detect when weather conditions favor disease spread.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                7-Day Early Risk Forecast
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Predicts future outbreak risk up to 7 days ahead so you can take preventative action before damage multiplies.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Follow-Up & Treatment History
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tracks past checks and treatments over time to verify that your crops are recovering and staying healthy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Call to Action Section */}
      <section id="about" className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-8 sm:p-12 text-center space-y-6 shadow-md">
          <h2 className="text-2xl sm:text-4xl font-bold font-heading max-w-2xl mx-auto">
            Ready to Monitor and Protect Your Fields?
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto">
            Get started with our precision agricultural dashboard to check crop health, track weather risks, and manage your field records.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-sm font-heading transition-all shadow-xs hover:scale-105 cursor-pointer"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/check-field')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 border border-emerald-600/60 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Perform Field Check
            </button>
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="border-t border-sky-100/90 py-8 px-4 sm:px-8 max-w-5xl mx-auto text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-700 flex items-center justify-center text-white text-[10px]">
            <Sprout className="w-3 h-3" />
          </div>
          <span className="font-bold text-slate-700">APOCALYPSE AI</span>
          <span>· Precision Agriculture Intelligence</span>
        </div>

        <div>
          Precision Crop Health Early Warning Platform · 2026
        </div>
      </footer>
    </div>
  );
};
