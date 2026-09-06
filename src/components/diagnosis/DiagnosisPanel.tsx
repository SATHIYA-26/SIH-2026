import React from 'react';
import { DiseaseCondition } from '../../types/analysis';
import { Sparkles, Camera, Image as ImageIcon } from 'lucide-react';

interface DiagnosisPanelProps {
  condition: DiseaseCondition;
  onRetakePhoto?: () => void;
}

export const DiagnosisPanel: React.FC<DiagnosisPanelProps> = ({ condition, onRetakePhoto }) => {
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

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">CURRENT VISUAL DIAGNOSIS</h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated image-based plant health classification</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
          Confidence {(condition.confidence * 100).toFixed(1)}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4 items-center">
        {/* Left: Leaf Image Viewport */}
        <div className="md:col-span-5 relative group">
          <div className="w-full h-52 sm:h-56 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 relative">
            <img
              src={condition.leafImageUrl || '/src/assets/cotton_bacterial_blight.jpg'}
              alt="Leaf condition observation"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
              INSPECTED LEAF
            </div>
          </div>
        </div>

        {/* Right: Diagnosis & Clean Horizontal Probability Distribution Bars */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <div className="text-xs text-slate-500 font-medium">Primary Identified Condition</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {condition.status}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Angular water-soaked leaf spots consistent with early bacterial infection.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
              POSSIBLE CONDITIONS
            </div>

            <div className="space-y-2">
              {conditionList.map((item) => {
                const percent = (item.prob * 100).toFixed(1);
                const isTop = item.key === condition.topClass;

                return (
                  <div key={item.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${isTop ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                        {item.label}
                      </span>
                      <span className={`font-mono text-xs ${isTop ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                        {percent}%
                      </span>
                    </div>

                    {/* Clean Horizontal Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
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
