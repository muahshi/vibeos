'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Users, Brain, Bell } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { VibeScoreRing } from '@/components/ui/VibeScoreRing';
import { MoodPicker } from '@/components/ui/MoodPicker';
import { TraitBar } from '@/components/ui/TraitBar';
import {
  MOCK_USER,
  MOCK_VIBE_PROFILE,
  MOCK_MOOD_TODAY,
  MOCK_MOOD_HISTORY,
  getGreeting,
  getVibeColor,
} from '@/lib/utils';
import type { MoodOption } from '@/types';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const chartData = MOCK_MOOD_HISTORY.slice(-14).map((m) => ({
  date: new Date(m.created_at).toLocaleDateString('en', { weekday: 'short' }),
  score: m.vibe_score,
}));

export default function HomePage() {
  const [moodSelected, setMoodSelected] = useState<string | null>(MOCK_MOOD_TODAY.mood);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(MOCK_MOOD_TODAY);
  const [showInsight, setShowInsight] = useState(true);
  const user = MOCK_USER;
  const profile = MOCK_VIBE_PROFILE;
  const vibeColor = getVibeColor(analysis.vibe_score);

  const handleMoodSelect = useCallback(async (mood: MoodOption) => {
    if (moodSelected === mood.value) return;
    setMoodSelected(mood.value);
    setIsAnalyzing(true);
    setShowInsight(false);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: mood.value,
          mood_history: MOCK_MOOD_HISTORY.slice(-7),
          user_name: user.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis({
          ...MOCK_MOOD_TODAY,
          mood: mood.value as 'great' | 'good' | 'okay' | 'low' | 'bad',
          vibe_score: data.vibe_score,
          insight: data.insight,
          focus: data.focus,
          energy: data.energy,
          social: data.social_score,
          calm: data.calm_score,
        });
      }
    } catch {
      // Keep existing data on error
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setShowInsight(true), 100);
    }
  }, [moodSelected, user.name]);

  const focusMetrics = [
    { label: 'Focus', value: analysis.focus, icon: '🎯', color: '#7C3AED' },
    { label: 'Energy', value: analysis.energy, icon: '⚡', color: '#F97316' },
    { label: 'Social', value: analysis.social, icon: '🤝', color: '#06B6D4' },
    { label: 'Calm', value: analysis.calm, icon: '🧘', color: '#10B981' },
  ];

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-12 pb-4 bg-bg/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-vibe flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg gradient-text">VibeOS</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full glass flex items-center justify-center relative">
              <Bell size={16} className="text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-pink" />
            </button>
            <button>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full border-2 border-primary/30"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4 pt-4">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display font-bold text-2xl text-text-primary">
            {getGreeting()}, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-text-muted text-sm mt-0.5">How are you feeling today?</p>
        </motion.div>

        {/* Mood Picker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 space-y-3"
        >
          <MoodPicker selected={moodSelected || undefined} onSelect={handleMoodSelect} />
        </motion.div>

        {/* Vibe Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5 relative overflow-hidden"
        >
          {/* Background glow */}
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] opacity-20"
            style={{ background: vibeColor }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-text-secondary text-sm font-medium">Your Vibe Score</p>
                {isAnalyzing ? (
                  <div className="h-10 w-24 skeleton mt-1" />
                ) : (
                  <motion.div
                    key={analysis.vibe_score}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display font-black text-4xl"
                    style={{ color: vibeColor }}
                  >
                    {analysis.vibe_score}%
                  </motion.div>
                )}
                <span className="text-sm font-medium mt-0.5 block" style={{ color: vibeColor }}>
                  {isAnalyzing ? '...' : getVibeColor(analysis.vibe_score) === vibeColor ? profile.vibe_label : ''}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={12} className="text-accent-green" />
                  <span className="text-accent-green text-xs font-medium">+12% vs yesterday</span>
                </div>
              </div>

              <VibeScoreRing
                score={isAnalyzing ? 0 : analysis.vibe_score}
                size={100}
                strokeWidth={7}
                showLabel={false}
                animated={true}
              />
            </div>

            {/* Mini chart */}
            <div className="h-16 -mx-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="vibeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={vibeColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={vibeColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      background: '#1A1A1A',
                      border: '1px solid #2A2A2A',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: number) => [`${val}%`, 'Vibe']}
                    labelStyle={{ color: '#A1A1AA' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={vibeColor}
                    strokeWidth={2}
                    fill="url(#vibeGradient)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* AI Insight */}
        <AnimatePresence mode="wait">
          {showInsight && !isAnalyzing && (
            <motion.div
              key="insight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-4 border border-primary/10"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Brain size={14} className="text-primary-light" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-primary-light mb-1">✦ AI Insight</p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {analysis.insight}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-4"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={14} className="text-primary-light" />
                </motion.div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 skeleton w-3/4" />
                  <div className="h-3 skeleton w-full" />
                  <div className="h-3 skeleton w-1/2" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Today's Focus Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-4 space-y-3"
        >
          <p className="text-sm font-semibold text-text-secondary">Today's Focus</p>
          <div className="grid grid-cols-4 gap-3">
            {focusMetrics.map(({ label, value, icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  {icon}
                </div>
                <span className="text-xs font-bold text-text-primary">
                  {isAnalyzing ? '--' : `${value}%`}
                </span>
                <span className="text-[10px] text-text-muted">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Personality Quick View */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-secondary">Personality Traits</p>
            <span className="text-xs text-primary-light font-medium">View all →</span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Creative', value: profile.creative },
              { label: 'Empathetic', value: profile.empathetic },
              { label: 'Analytical', value: profile.analytical },
            ].map(({ label, value }, i) => (
              <TraitBar key={label} label={label} value={value} delay={0.5 + i * 0.1} />
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3"
        >
          <button className="glass rounded-2xl p-4 text-left hover:border-primary/20 transition-all active:scale-95">
            <Users size={20} className="text-accent mb-2" />
            <p className="text-sm font-semibold text-text-primary">Find Your Tribe</p>
            <p className="text-xs text-text-muted mt-0.5">4 new matches today</p>
          </button>
          <button className="glass rounded-2xl p-4 text-left hover:border-accent-pink/20 transition-all active:scale-95">
            <Zap size={20} className="text-accent-orange mb-2" />
            <p className="text-sm font-semibold text-text-primary">AI Twin Chat</p>
            <p className="text-xs text-text-muted mt-0.5">Your AI is ready</p>
          </button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
