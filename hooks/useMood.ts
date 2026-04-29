'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MoodLog } from '@/types';
import { MOCK_MOOD_HISTORY } from '@/lib/utils';

const STORAGE_KEY = 'vibeos_mood_history';
const TODAY_KEY = 'vibeos_today_mood';

function getTodayDateStr() {
  return new Date().toISOString().split('T')[0];
}

interface UseMoodReturn {
  todaysMood: MoodLog | null;
  moodHistory: MoodLog[];
  saveMood: (mood: MoodLog) => void;
  hasMoodToday: boolean;
}

export function useMood(): UseMoodReturn {
  const [todaysMood, setTodaysMood] = useState<MoodLog | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodLog[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const today = getTodayDateStr();
      const storedToday = localStorage.getItem(`${TODAY_KEY}_${today}`);
      if (storedToday) {
        setTodaysMood(JSON.parse(storedToday));
      }

      const storedHistory = localStorage.getItem(STORAGE_KEY);
      if (storedHistory) {
        setMoodHistory(JSON.parse(storedHistory));
      } else {
        // Use mock data as initial history
        setMoodHistory(MOCK_MOOD_HISTORY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MOOD_HISTORY));
      }
    } catch {
      setMoodHistory(MOCK_MOOD_HISTORY);
    }
  }, []);

  const saveMood = useCallback((mood: MoodLog) => {
    const today = getTodayDateStr();
    setTodaysMood(mood);

    try {
      localStorage.setItem(`${TODAY_KEY}_${today}`, JSON.stringify(mood));
      setMoodHistory((prev) => {
        const updated = [...prev.filter((m) => !m.created_at.startsWith(today)), mood];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {
      // localStorage might be full or unavailable
    }
  }, []);

  const hasMoodToday = todaysMood !== null;

  return { todaysMood, moodHistory, saveMood, hasMoodToday };
}
