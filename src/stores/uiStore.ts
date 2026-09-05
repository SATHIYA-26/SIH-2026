import { create } from 'zustand';
import { MOCK_ALERTS } from '../data/mockData';
import { FieldAlert } from '../types/alert';

interface UIState {
  sidebarOpen: boolean;
  language: 'English' | 'Hindi' | 'Marathi' | 'Telugu';
  alerts: FieldAlert[];
  notificationsOpen: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLanguage: (lang: 'English' | 'Hindi' | 'Marathi' | 'Telugu') => void;
  toggleNotifications: () => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  language: 'English',
  alerts: MOCK_ALERTS,
  notificationsOpen: false,

  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setLanguage: (lang) => set({ language: lang }),
  toggleNotifications: () => set(state => ({ notificationsOpen: !state.notificationsOpen })),
  markAlertRead: (id) => set(state => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, isRead: true } : a)
  })),
  markAllAlertsRead: () => set(state => ({
    alerts: state.alerts.map(a => ({ ...a, isRead: true }))
  }))
}));
