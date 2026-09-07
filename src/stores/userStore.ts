import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  role: string;
  department: string;
  location: string;
  phone: string;
  email: string;
  officerId: string;
  assignedParcelsCount: number;
  totalAcresMonitored: number;
  monitoredCrops: string;
}

interface UserState {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  name: 'Sathiya',
  role: 'Agricultural Officer / Lead Agronomist',
  department: 'Department of Agriculture & Farmer Welfare',
  location: 'Chennai, Tamil Nadu',
  phone: '+91 94440 12345',
  email: 'sathiya.agri@tn.gov.in',
  officerId: 'TN-AGRI-2026-CHE-04',
  assignedParcelsCount: 4,
  totalAcresMonitored: 13.5,
  monitoredCrops: 'Cotton (Bt RCH-659, DCH-32, Bunny, Suraj)',
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: defaultProfile,

      updateProfile: (updates) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
          },
        }));
      },

      resetProfile: () => {
        set({ profile: defaultProfile });
      },
    }),
    {
      name: 'apocalypse_ai_user_profile_v1',
    }
  )
);
