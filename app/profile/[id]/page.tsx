'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Heart, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/layout/BottomNav';
import { VibeScoreRing } from '@/components/ui/VibeScoreRing';
import { RadarChart } from '@/components/ui/RadarChart';
import { TraitBar } from '@/components/ui/TraitBar';
import { MOCK_EXPLORE_USERS, MOCK_VIBE_PROFILE, getVibeColor } from '@/lib/utils';

// Static params for demo - in production, fetch from Supabase
const DEMO_PROFILES: Record<string, (typeof MOCK_EXPLORE_USERS)[0]> = {
  'user-002': MOCK_EXPLORE_USERS[0],
  'user-003': MOCK_EXPLORE_USERS[1],
  'user-004': MOCK_EXPLORE_USERS[2],
  'user-005': MOCK_EXPLORE_USERS[3],
  'user-006': MOCK_EXPLORE_USERS[4],
  'user-007': MOCK_EXPLORE_USERS[5],
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const user = DEMO_PROFILES[params.id] || MOCK_EXPLORE_USERS[0];
  const vibeColor = getVibeColor(user.vibe_score);
  const matchColor = getVibeColor(user.match_percentage);
  const [isConnected, setIsConnected] = useState(false);

  const traits = {
    analytical: MOCK_VIBE_PROFILE.analytical,
    creative: MOCK_VIBE_PROFILE.creative + 5,
    empathetic: MOCK_VIBE_PROFILE.empathetic + 10,
    social: MOCK_VIBE_PROFILE.social + 10,
    ambitious: MOCK_VIBE_PROFILE.ambitious - 5,
    calm: MOCK_VIBE_PROFILE.calm - 5,
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${user.name}'s Vibe Profile`,
        text: `Check out ${user.name}'s VibeOS profile — ${user.vibe_score}% vibe score!`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-12 pb-4 bg-bg/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full glass flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-text-secondary" />
          </button>
          <h1 className="font-bold text-text-primary">Profile</h1>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full glass flex items-center justify-center"
          >
            <Share2 size={16} className="text-text-secondary" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Profile Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5 relative overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-15"
            style={{ background: vibeColor }}
          />
          <div className="relative z-10 flex items-start gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl border-2 border-border"
              />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-bg flex items-center justify-center text-[10px] font-black"
                style={{ background: vibeColor, color: '#0A0A0A' }}
              >
                {Math.floor(user.vibe_score / 10)}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-xl text-text-primary">{user.name}</h2>
              <p className="text-text-muted text-sm">{user.username}</p>
              {user.bio && (
                <p className="text-text-secondary text-sm mt-1.5 leading-relaxed">{user.bio}</p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {user.traits.map((trait) => (
                  <span
                    key={trait}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary-light border border-primary/20"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/40">
            {[
              { label: 'Vibe Score', value: `${user.vibe_score}%`, color: vibeColor },
              { label: 'Match', value: `${user.match_percentage}%`, color: matchColor },
              { label: 'Tribe', value: '142', color: '#06B6D4' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className="font-display font-bold text-xl" style={{ color }}>{value}</p>
                <p className="text-[11px] text-text-muted">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Compatibility with you */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 border border-primary/10"
        >
          <p className="text-xs font-semibold text-text-muted mb-3">Compatibility with You</p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <VibeScoreRing
                score={user.match_percentage}
                size={72}
                strokeWidth={5}
                showLabel={false}
                animated
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-sm" style={{ color: matchColor }}>
                  {user.match_percentage}%
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              {['Creative synergy', 'Emotional depth', 'Goal alignment'].map((r, i) => (
                <motion.div
                  key={r}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: `${matchColor}20`, color: matchColor }}>
                    <span className="text-[9px]">✓</span>
                  </div>
                  <span className="text-xs text-text-secondary">{r}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Personality Radar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-5"
        >
          <p className="text-sm font-semibold text-text-secondary mb-4">Personality Radar</p>
          <div className="flex justify-center">
            <RadarChart data={traits} size={210} animated />
          </div>
        </motion.div>

        {/* Trait bars */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4 space-y-3"
        >
          <p className="text-sm font-semibold text-text-secondary">Trait Breakdown</p>
          {Object.entries(traits).map(([key, val], i) => (
            <TraitBar
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={val}
              delay={0.3 + i * 0.08}
              animated
            />
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-3"
        >
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsConnected((v) => !v)}
            className="py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={isConnected ? {
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.3)',
              color: '#10B981',
            } : {
              background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
              boxShadow: '0 8px 25px rgba(124,58,237,0.35)',
              color: '#fff',
            }}
          >
            <Heart size={15} fill={isConnected ? 'currentColor' : 'none'} />
            {isConnected ? 'Connected' : 'Connect'}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push('/ai-twin')}
            className="py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 glass text-text-primary hover:border-accent/30 transition-all"
          >
            <MessageCircle size={15} className="text-accent" />
            Chat Twin
          </motion.button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
