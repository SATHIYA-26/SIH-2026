import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Field, FollowUpRecord } from '../types/field';
import { FullFieldAnalysis } from '../types/analysis';
import {
  ALL_FIELDS,
  DEMO_SCENARIO_HIGH_RISK,
  DEMO_SCENARIO_IMPROVING,
  DEMO_SCENARIO_LOW_RISK,
  DEMO_SCENARIO_WORSENING
} from '../data/mockData';

export type DemoScenarioKey = 'HIGH_RISK' | 'IMPROVING' | 'LOW_RISK' | 'WORSENING' | 'MODERATE_RISK';

interface FieldState {
  fields: Field[];
  selectedFieldId: string;
  activeScenario: DemoScenarioKey;
  timeFilter: 'Today' | '7 Days' | '30 Days';
  mapLayer: 'All' | 'Disease' | 'Pest' | 'Risk';

  // Actions
  setSelectedFieldId: (id: string) => void;
  getSelectedField: () => Field;
  setScenario: (scenario: DemoScenarioKey) => void;
  setTimeFilter: (filter: 'Today' | '7 Days' | '30 Days') => void;
  setMapLayer: (layer: 'All' | 'Disease' | 'Pest' | 'Risk') => void;
  updateFieldAnalysis: (fieldId: string, updatedField: Field) => void;
  recordFieldFollowUp: (fieldId: string, followUp: FollowUpRecord, newAnalysis: FullFieldAnalysis) => void;
  addField: (field: Field) => void;
  resetToDefaults: () => void;
}

export const useFieldStore = create<FieldState>()(
  persist(
    (set, get) => ({
      fields: ALL_FIELDS,
      selectedFieldId: 'field-cotton-a',
      activeScenario: 'HIGH_RISK',
      timeFilter: 'Today',
      mapLayer: 'All',

      setSelectedFieldId: (id: string) => {
        set({ selectedFieldId: id });
      },

      getSelectedField: () => {
        const { fields, selectedFieldId } = get();
        return fields.find(f => f.id === selectedFieldId) || fields[0] || DEMO_SCENARIO_HIGH_RISK;
      },

      setScenario: (scenario: DemoScenarioKey) => {
        let scenarioField: Field;
        switch (scenario) {
          case 'IMPROVING':
            scenarioField = DEMO_SCENARIO_IMPROVING;
            break;
          case 'LOW_RISK':
            scenarioField = DEMO_SCENARIO_LOW_RISK;
            break;
          case 'WORSENING':
            scenarioField = DEMO_SCENARIO_WORSENING;
            break;
          case 'MODERATE_RISK':
            scenarioField = ALL_FIELDS.find(f => f.id === 'field-cotton-c') || DEMO_SCENARIO_HIGH_RISK;
            break;
          case 'HIGH_RISK':
          default:
            scenarioField = DEMO_SCENARIO_HIGH_RISK;
            break;
        }

        set(state => ({
          activeScenario: scenario,
          selectedFieldId: scenarioField.id,
          fields: state.fields.map(f => f.id === scenarioField.id ? scenarioField : f)
        }));
      },

      setTimeFilter: (filter) => set({ timeFilter: filter }),
      setMapLayer: (layer) => set({ mapLayer: layer }),

      updateFieldAnalysis: (fieldId: string, updatedField: Field) => {
        set(state => ({
          fields: state.fields.map(f => f.id === fieldId ? updatedField : f)
        }));
      },

      recordFieldFollowUp: (fieldId: string, followUp: FollowUpRecord, newAnalysis: FullFieldAnalysis) => {
        set(state => ({
          fields: state.fields.map(f => {
            if (f.id !== fieldId) return f;

            const updatedHistory = [followUp, ...(f.followUpHistory || [])];
            const newCount = (f.followUpCount || 0) + 1;

            return {
              ...f,
              latestAnalysis: newAnalysis,
              previousAnalysis: f.latestAnalysis,
              riskProbability: newAnalysis.risk.probability,
              riskLevel: newAnalysis.risk.level,
              currentConditionStatus: newAnalysis.condition.status,
              nextCheckDays: newAnalysis.followup.daysRemaining,
              pestPressureSummary: `${newAnalysis.pest.currentCount} ${newAnalysis.pest.pestType} (${newAnalysis.pest.pestPressure})`,
              lastCheckedDate: 'Today',
              followUpCount: newCount,
              followUpHistory: updatedHistory
            };
          })
        }));
      },

      addField: (field: Field) => {
        set(state => ({
          fields: [field, ...state.fields],
          selectedFieldId: field.id
        }));
      },

      resetToDefaults: () => {
        set({
          fields: ALL_FIELDS,
          selectedFieldId: 'field-cotton-a',
          activeScenario: 'HIGH_RISK',
          timeFilter: 'Today',
          mapLayer: 'All'
        });
      }
    }),
    {
      name: 'apocalypse_ai_field_storage_v2',
    }
  )
);
