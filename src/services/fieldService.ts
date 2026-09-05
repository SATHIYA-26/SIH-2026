import { Field } from '../types/field';
import { ALL_FIELDS } from '../data/mockData';
import { apiClient } from './api';

export const fieldService = {
  async getFields(): Promise<Field[]> {
    try {
      const res = await apiClient.get<Field[]>('/fields');
      return res.data;
    } catch {
      return ALL_FIELDS;
    }
  },

  async getFieldById(id: string): Promise<Field | undefined> {
    try {
      const res = await apiClient.get<Field>(`/fields/${id}`);
      return res.data;
    } catch {
      return ALL_FIELDS.find(f => f.id === id) || ALL_FIELDS[0];
    }
  }
};
