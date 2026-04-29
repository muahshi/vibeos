'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { VibeScoreRing } from '@/components/ui/VibeScoreRing';
import { RadarChart } from '@/components/ui/RadarChart';
import { TraitBar } from '@/components/ui/TraitBar';
import { VibeCard } from '@/components/cards/VibeCard';
import {
  MOCK_USER,
  MOCK_VIBE_PROFILE,
  MOCK_MOOD_TODAY,
  MOCK_MOOD_HISTORY,
  getVibeColor,
} from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const chartData = MOCK_MOOD_HISTORY.slice(-14).map((m, i) => ({
  day: i + 1,
  score: m.vibe_score,
  date: new Date(m.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
}));

const PERSONALITY_TABS = ['Overview', 'Traits', 'History', 'Share'];

const strengthsData = [
  { strength: 'Creative Problem Solving', score: 90, icon: '🎨' },
  { strength: 'Emotional Intelligence', score: 85, icon: '💡' },
  { strength: 'Strategic Thinking', score: 80, icon: '🧠' },
];

const growthAreas = [
  { area: 'Social Connections', current: 60, target: 80, icon: '🤝' },
  { area: 'Work-Life Balance', current: 65, target: 85, icon: '⚖️' },
];

export default function MyVibePage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const user = MOCK_USER;
  const profile = MOCK_VIBE_PROFILE;
  const vibeColor = getVibeColor(profile.vibe_score);

  const traits = {
    analytical: profile.analytical,
    creative: profile.creative,
    empathetic: profile.empathetic,
    social: profile.social,
    ambitious: profile.ambitious,
    calm: profile.calm,
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-12 pb-4 bg-bg/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl text-text-primary">My Vibe</h1>
          <button className="w-9 h-9 rounded-full glass flex items-center justify-center">
            <Settings size={16} className="text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 px-4 pt-4 overflow-x-auto scrollbar-hide">
        {PERSONALITY_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeTab === tab
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'glass text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-4 pt-4">
        {/* Overview Tab */}
        {activeTab === 'Overview' && (
          <>
            {/* Personality Radar Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5 relative overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-15"
                style={{ background: vibeColor }}
              />
              <p className="text-sm font-semibold text-text-secondary mb-1">Your Personality Radar</p>

              <div className="flex items-center justify-center py-4">
                <RadarChart data={traits} size={220} animated />
              </div>
            </motion.div>

            {/* Score + Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-4"
            >
              <div className="glass rounded-2xl p-4 flex-1 flex flex-col items-center justify-center">
                <VibeScoreRing score={profile.vibe_score} size={80} strokeWidth={6} showLabel={false} />
                <p className="text-xs text-text-muted mt-2">Vibe Score</p>
              </div>
              <div className="glass rounded-2xl p-4 flex-1 space-y-3">
                <div>
                  <p className="text-xs text-text-muted">Status</p>
                  <p className="font-bold text-sm" style={{ color: vibeColor }}>
                    {profile.vibe_label} ✦
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Streak</p>
                  <p className="font-bold text-sm text-text-primary">🔥 7 days</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Trend</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-accent-green" />
                    <p className="font-bold text-sm text-accent-green">+8% this week</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-4 space-y-3"
            >
              <p className="text-sm font-semibold text-text-secondary">Your Strengths</p>
              {strengthsData.map(({ strength, score, icon }, i) => (
                <motion.div
                  key={strength}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 bg-surface-2 rounded-xl p-3"
                >
                  <span className="text-xl">{icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{strength}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-surface-3 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-vibe"
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary-light">{score}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Growth Areas */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-4 space-y-3"
            >
              <p className="text-sm font-semibold text-text-secondary">Growth Areas</p>
              {growthAreas.map(({ area, current, target, icon }, i) => (
                <div key={area} className="bg-surface-2 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{icon}</span>
                      <span className="text-sm text-text-primary font-medium">{area}</span>
                    </div>
                    <span className="text-xs text-text-muted">Target: {target}%</span>
                  </div>
                  <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #F97316, #EF4444)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${current}%` }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-accent-orange font-medium">{current}% now</span>
                    <span className="text-xs text-text-muted">{target - current}% to go</span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* AI Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-4 border border-accent/10"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={14} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-accent mb-1">✦ AI Recommendation</p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Your creative energy is peaking. This is the perfect time to start that project you've been postponing. Focus on 2-hour deep work sessions this week.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Traits Tab */}
        {activeTab === 'Traits' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 space-y-4"
          >
            <p className="text-sm font-semibold text-text-secondary">Personality Traits Breakdown</p>
            {[
              { label: 'Creative', value: profile.creative },
              { label: 'Analytical', value: profile.analytical },
              { label: 'Empathetic', value: profile.empathetic },
              { label: 'Ambitious', value: profile.ambitious },
              { label: 'Social', value: profile.social },
              { label: 'Calm', value: profile.calm },
            ].map(({ label, value }, i) => (
              <TraitBar key={label} label={label} value={value} delay={i * 0.1} animated />
            ))}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'History' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass rounded-2xl p-4">
              <p className="text-sm font-semibold text-text-secondary mb-4">14-Day Vibe History</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#52525B' }}
                      interval={2}
                    />
                    <YAxis
                      domain={[50, 100]}
                      tick={{ fontSize: 10, fill: '#52525B' }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#1A1A1A',
                        border: '1px solid #2A2A2A',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(val: number) => [`${val}%`, 'Vibe Score']}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#7C3AED"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4, fill: '#7C3AED' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Avg Score', value: '79%', trend: '+5%', up: true },
                { label: 'Best Day', value: '92%', trend: 'Mon', up: true },
                { label: 'Streak', value: '7 days', trend: '🔥', up: true },
              ].map(({ label, value, trend, up }) => (
                <div key={label} className="glass rounded-xl p-3 text-center">
                  <p className="text-xs text-text-muted">{label}</p>
                  <p className="font-display font-bold text-lg text-text-primary mt-1">{value}</p>
                  <div className={`flex items-center justify-center gap-1 mt-1 ${up ? 'text-accent-green' : 'text-accent-pink'}`}>
                    {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    <span className="text-[10px] font-medium">{trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Share Tab */}
        {activeTab === 'Share' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <VibeCard
              user={user}
              profile={profile}
              latestMood={MOCK_MOOD_TODAY}
            />
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
