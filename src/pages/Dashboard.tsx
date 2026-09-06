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
    <div className="space-y-5 pb-8">
      {/* 1. FIELD HEADER & COMMAND ACTIONS */}
      <FieldHeader field={field} />

      {/* 2. FIELD SPECIFICATION & LIVE TELEMETRY STRIP */}
      <FieldContextStrip field={field} />

      {/* 3. STEP 1 & 2: WHAT IS HAPPENING? + HOW SERIOUS IS IT? */}
      <PrimaryStatusArea
        condition={latestAnalysis.condition}
        risk={latestAnalysis.risk}
        zoneName={field.inspectionPoints?.[0]?.label || 'Zone NE-2 (Hotspot)'}
      />

      {/* 4. STEP 3: WHAT CHANGED? (BEFORE VS AFTER COMPARISON TELEMETRY) */}
      {field.previousAnalysis && (
        <ComparisonView
          previous={field.previousAnalysis}
          current={latestAnalysis}
          status={latestAnalysis.comparisonStatus}
        />
      )}

      {/* 5. SPATIAL HOTSPOTS & FIELD OVERVIEW MAP */}
      <div id="field-map-section">
        <FieldOverviewMap field={field} />
      </div>

      {/* 6. CURRENT VISUAL DIAGNOSIS & EVIDENCE */}
      <DiagnosisPanel condition={latestAnalysis.condition} />

      {/* 7. STEP 4: WHY DID IT HAPPEN? (ROOT-CAUSE DRIVERS) */}
      <RiskDriversPanel risk={latestAnalysis.risk} />

      {/* 8. STEP 5: WHAT SHOULD I DO NEXT? (OPERATIONAL ACTIONS + NEXT RECHECK) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

      {/* 9. TEMPORAL TRENDS (RISK, DISEASE, PEST) */}
      <RiskTrendChart />

      {/* 10. CROP GROWTH LIFECYCLE PROGRESSION */}
      <CropTimeline
        stageInfo={latestAnalysis.cropStage}
        daysSincePlanting={field.daysSincePlanting}
        plantingDate={field.plantingDate}
      />
    </div>
  );
};
