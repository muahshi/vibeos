'use client';

import { useState, useCallback } from 'react';
import type { AnalyzeResponse, MoodOption } from '@/types';

interface UseVibeAnalysisReturn {
  analysis: AnalyzeResponse | null;
  isLoading: boolean;
  error: string | null;
  analyze: (mood: MoodOption, userName: string, moodHistory?: unknown[]) => Promise<void>;
  reset: () => void;
}

const DEFAULT_FALLBACK: Record<string, AnalyzeResponse> = {
  great: {
    vibe_score: 88, vibe_label: 'Very Positive',
    insight: "You're radiating incredible energy! Creativity and focus are at their peak. This is your moment to build, connect, and create.",
    recommendation: 'Channel this energy into your most ambitious project today.',
    traits: { analytical: 82, creative: 92, empathetic: 80, social: 70, ambitious: 88, calm: 75 },
    focus: 88, energy: 92, social_score: 72, calm_score: 76,
  },
  good: {
    vibe_score: 76, vibe_label: 'Positive',
    insight: "Solid energy today. Your mind is sharp and you're in a good flow state. Perfect for meaningful work and connections.",
    recommendation: 'Focus on 2-3 key priorities and enjoy the steady momentum.',
    traits: { analytical: 78, creative: 75, empathetic: 76, social: 68, ambitious: 74, calm: 72 },
    focus: 78, energy: 76, social_score: 68, calm_score: 74,
  },
  okay: {
    vibe_score: 62, vibe_label: 'Balanced',
    insight: "You're in a neutral, observant state. This can be a great time for reflection and planning rather than heavy execution.",
    recommendation: 'Take a mindful break, then tackle one meaningful task at a time.',
    traits: { analytical: 68, creative: 65, empathetic: 72, social: 58, ambitious: 60, calm: 70 },
    focus: 65, energy: 62, social_score: 58, calm_score: 70,
  },
  low: {
    vibe_score: 45, vibe_label: 'Low',
    insight: "Your energy is quiet today. This is natural — your body and mind may need rest. Honor that and be gentle with yourself.",
    recommendation: 'Prioritize rest, hydration, and one small win today.',
    traits: { analytical: 55, creative: 52, empathetic: 68, social: 48, ambitious: 50, calm: 60 },
    focus: 48, energy: 44, social_score: 46, calm_score: 62,
  },
  bad: {
    vibe_score: 30, vibe_label: 'Needs Care',
    insight: "Tough day — and that's okay. Even low moments carry valuable information about what you need. You're not alone in this.",
    recommendation: 'Reach out to someone you trust. Small acts of self-care make a difference.',
    traits: { analytical: 45, creative: 40, empathetic: 70, social: 38, ambitious: 42, calm: 50 },
    focus: 35, energy: 30, social_score: 36, calm_score: 52,
  },
};

export function useVibeAnalysis(): UseVibeAnalysisReturn {
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (
    mood: MoodOption,
    userName: string,
    moodHistory: unknown[] = []
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: mood.value,
          mood_history: moodHistory,
          user_name: userName,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data: AnalyzeResponse = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Analysis error:', err);
      // Use fallback data so app still works
      setAnalysis(DEFAULT_FALLBACK[mood.value] || DEFAULT_FALLBACK.okay);
      setError('Using cached analysis');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { analysis, isLoading, error, analyze, reset };
}
