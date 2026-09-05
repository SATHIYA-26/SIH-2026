export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface FieldAlert {
  id: string;
  fieldId: string;
  fieldName: string;
  type: 'HIGH_RISK' | 'FOLLOWUP_DUE' | 'RISK_IMPROVING' | 'WEATHER_WARNING' | 'PEST_SURGE';
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  isRead: boolean;
  actionLabel: string;
  actionPath: string;
}
