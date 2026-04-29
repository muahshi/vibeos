'use client';

import { create } from 'zustand';
import type { AppState, User, VibeProfile, MoodLog, ExploreUser } from '@/types';

export const useAppStore = create<AppState>((set) => ({
  user: null,
  vibeProfile: null,
  todaysMood: null,
  moodHistory: [],
  matches: [],
  isLoading: false,
  setUser: (user: User | null) => set({ user }),
  setVibeProfile: (vibeProfile: VibeProfile | null) => set({ vibeProfile }),
  setTodaysMood: (todaysMood: MoodLog | null) => set({ todaysMood }),
  setMoodHistory: (moodHistory: MoodLog[]) => set({ moodHistory }),
  setMatches: (matches: ExploreUser[]) => set({ matches }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
