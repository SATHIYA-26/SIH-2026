// Central date utilities for AP0CALYPSE AI
// Real-time dynamic precision agriculture operational date

/**
 * Returns the current application operational date
 */
export function getAppCurrentDate(): Date {
  return new Date();
}

/**
 * Format date as "September 10, 2026" or "10 Sep 2026"
 */
export function formatCalendarDate(
  date: Date | string,
  style: 'long' | 'short' | 'display' = 'long'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return typeof date === 'string' ? date : 'Invalid Date';

  if (style === 'short') {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  if (style === 'display') {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Computes calendar target date from days offset from current app date
 * Example: 3 days offset from today -> "September 10, 2026"
 */
export function computeTargetDate(daysFromNow: number, baseDate?: Date | string): string {
  const base = baseDate ? (typeof baseDate === 'string' ? new Date(baseDate) : baseDate) : getAppCurrentDate();
  const target = addDays(base, daysFromNow);
  return formatCalendarDate(target, 'long');
}

/**
 * Compute days remaining between baseDate and targetDate
 */
export function computeDaysRemaining(targetDate: Date | string, baseDate?: Date | string): number {
  const t = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const b = baseDate ? (typeof baseDate === 'string' ? new Date(baseDate) : baseDate) : getAppCurrentDate();
  
  if (isNaN(t.getTime()) || isNaN(b.getTime())) return 4;

  const startOfT = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
  const startOfB = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();

  const diffMs = startOfT - startOfB;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Formats relative day text consistently
 * e.g. 0 -> "Today (Due Now)", 1 -> "Tomorrow (In 1 day)", 3 -> "In 3 days"
 */
export function formatRelativeDays(daysRemaining: number): string {
  if (daysRemaining === 0) return 'Today (Due Now)';
  if (daysRemaining === 1) return 'Tomorrow (In 1 day)';
  if (daysRemaining < 0) return `${Math.abs(daysRemaining)} days overdue`;
  return `In ${daysRemaining} days`;
}

/**
 * Calculates days elapsed since planting date from current app date
 */
export function calculateDaysSincePlanting(
  plantingDateStr: string,
  currentDate?: Date | string
): number {
  const planted = new Date(plantingDateStr);
  const now = currentDate ? (typeof currentDate === 'string' ? new Date(currentDate) : currentDate) : getAppCurrentDate();
  
  if (isNaN(planted.getTime())) return 70;

  const diffMs = now.getTime() - planted.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

