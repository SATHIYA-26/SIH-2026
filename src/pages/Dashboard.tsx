import React from 'react';
import { useFieldStore } from '../stores/fieldStore';
import { FieldHeader } from '../components/dashboard/FieldHeader';
import { PrimaryStatusArea } from '../components/dashboard/PrimaryStatusArea';
import { FieldContextStrip } from '../components/dashboard/FieldContextStrip';
import { FieldOverviewMap } from '../components/map/FieldOverviewMap';
import { DiagnosisPanel } from '../components/diagnosis/DiagnosisPanel';
import { RiskDriversPanel } from '../components/dashboard/RiskDriversPanel';
import { RecommendedActionsPanel } from '../components/dashboard/RecommendedActionsPanel';
import { NextCheckPanel } from '../components/dashboard/NextCheckPanel';
import { RiskTrendChart } from '../components/charts/RiskTrendChart';
import { CropTimeline } from '../components/common/CropTimeline';
import { ComparisonView } from '../components/followup/ComparisonView';

export const Dashboard: React.FC = () => {
  const { getSelectedField } = useFieldStore();
  const field = getSelectedField();
  const latestAnalysis = field.latestAnalysis;

  return (
    <div className="space-y-6">
      {/* 1. FIELD HEADER */}
      <FieldHeader field={field} />

      {/* 2. PRIMARY STATUS (CURRENT CONDITION vs 7-DAY RISK) */}
      <PrimaryStatusArea
        condition={latestAnalysis.condition}
        risk={latestAnalysis.risk}
      />

      {/* 3. COMPACT FIELD CONTEXT STRIP */}
      <FieldContextStrip field={field} />

      {/* 4. OPTIONAL RECHECK COMPARISON BANNER (if recent recheck performed or simulated) */}
      {field.previousAnalysis && (
        <ComparisonView
          previous={field.previousAnalysis}
          current={latestAnalysis}
          status={latestAnalysis.comparisonStatus || 'IMPROVING'}
        />
      )}

      {/* 5. FIELD OVERVIEW MAP (Spatial Analysis) */}
      <FieldOverviewMap field={field} />

      {/* 6. CURRENT VISUAL DIAGNOSIS (Leaf Photo & Probabilities) */}
      <DiagnosisPanel condition={latestAnalysis.condition} />

      {/* 7. WHY IS THE RISK HIGH? (Risk Drivers) */}
      <RiskDriversPanel risk={latestAnalysis.risk} />

      {/* 8. WHAT SHOULD I DO? + NEXT FIELD CHECK (2-column grid on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecommendedActionsPanel
          actions={latestAnalysis.actions}
          fieldId={field.id}
        />
        <NextCheckPanel
          followup={latestAnalysis.followup}
          riskLevel={latestAnalysis.risk.level}
          fieldId={field.id}
        />
      </div>

      {/* 9. CROP GROWTH LIFECYCLE TIMELINE */}
      <CropTimeline
        stageInfo={latestAnalysis.cropStage}
        daysSincePlanting={field.daysSincePlanting}
        plantingDate={field.plantingDate}
      />

      {/* 10. RISK TREND (Clean Line Chart) */}
      <RiskTrendChart />
    </div>
  );
};
