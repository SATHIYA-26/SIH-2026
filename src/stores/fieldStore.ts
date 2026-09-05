import { create } from 'zustand';
import { Field } from '../types/field';
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
  addField: (field: Field) => void;
}

export const useFieldStore = create<FieldState>((set, get) => ({
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

  addField: (field: Field) => {
    set(state => ({
      fields: [field, ...state.fields],
      selectedFieldId: field.id
    }));
  }
}));
