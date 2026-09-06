import React, { useState } from 'react';
import { DiseaseCondition } from '../../types/analysis';
import { COTTON_LEAF_BACTERIAL_IMAGE, COTTON_LEAF_HEALTHY_IMAGE } from '../../data/mockData';
import { Sparkles, Camera, Image as ImageIcon, ZoomIn, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DiagnosisPanelProps {
  condition: DiseaseCondition;
  onRetakePhoto?: () => void;
}

export const DiagnosisPanel: React.FC<DiagnosisPanelProps> = ({ condition, onRetakePhoto }) => {
  const [showFullImage, setShowFullImage] = useState(false);

  const probs = condition.probabilities || {
    healthy: 0.021,
    bacterial: 0.913,
    curl_virus: 0.041,
    fusarium: 0.025,
  };

  const conditionList = [
    { key: 'healthy', label: 'Healthy Foliage', prob: probs.healthy, color: 'bg-emerald-600' },
    { key: 'bacterial', label: 'Bacterial Blight', prob: probs.bacterial, color: 'bg-rose-600' },
    { key: 'curl_virus', label: 'Leaf Curl Virus', prob: probs.curl_virus, color: 'bg-amber-600' },
    { key: 'fusarium', label: 'Fusarium Wilt', prob: probs.fusarium, color: 'bg-indigo-600' },
  ].sort((a, b) => b.prob - a.prob);

  const isHealthy = condition.topClass === 'healthy';
  const defaultFallbackImage = isHealthy ? COTTON_LEAF_HEALTHY_IMAGE : COTTON_LEAF_BACTERIAL_IMAGE;
  const imageSource = condition.leafImageUrl || defaultFallbackImage;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-tight font-mono">
            CURRENT VISUAL DIAGNOSIS & EVIDENCE
          </h3>
          <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
            Computer Vision Analysis
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Confidence:</span>
          <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
            {(condition.confidence * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-4 items-center">
        {/* Left: Leaf Image Viewport with Zoom capability */}
        <div className="md:col-span-4 relative group">
          <div
            onClick={() => setShowFullImage(!showFullImage)}
            className="w-full h-44 sm:h-48 rounded-lg overflow-hidden bg-slate-950 border border-slate-200 relative shadow-2xs cursor-pointer"
          >
            <img
              src={imageSource}
              alt="Inspected leaf condition"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== defaultFallbackImage) {
                  target.src = defaultFallbackImage;
                }
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block"
            />
            <div className="absolute top-2 left-2 bg-slate-950/85 text-white text-[9px] font-mono px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
              FIELD SPECIMEN
            </div>
            <div className="absolute bottom-2 right-2 bg-slate-950/80 text-white p-1 rounded backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Right: Diagnosis finding + Probabilities */}
        <div className="md:col-span-8 space-y-3.5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-400">
                Identified Pathogen Condition
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  condition.needsAttention
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-emerald-100 text-emerald-900'
                }`}
              >
                {condition.needsAttention ? 'Pathogen Active' : 'Normal'}
              </span>
            </div>

            <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {condition.status}
            </div>

            <p className="text-xs text-slate-600 mt-0.5 leading-snug">
              {isHealthy
                ? 'Healthy lamina cells with uniform green chloroplast density across field samples.'
                : 'Angular necrotic spots localized along vein margins with typical water-soaking symptoms.'}
            </p>
          </div>

          {/* Clean Probability Bars */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              CONDITION PROBABILITIES:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {conditionList.map((item) => {
                const percent = (item.prob * 100).toFixed(1);
                const isTop = item.key === condition.topClass;

                return (
                  <div key={item.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`text-[11px] font-medium ${isTop ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                        {item.label}
                      </span>
                      <span className={`font-mono text-[11px] ${isTop ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                        {percent}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
