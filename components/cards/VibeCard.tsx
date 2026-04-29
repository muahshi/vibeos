'use client';

import { motion } from 'framer-motion';
import { Share2, Download } from 'lucide-react';
import { getVibeColor, getVibeLabel } from '@/lib/utils';
import type { User, VibeProfile, MoodLog } from '@/types';

interface VibeCardProps {
  user: User;
  profile: VibeProfile;
  latestMood?: MoodLog;
  onShare?: () => void;
  compact?: boolean;
}

export function VibeCard({ user, profile, latestMood, onShare, compact = false }: VibeCardProps) {
  const color = getVibeColor(profile.vibe_score);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.name}'s Vibe Card`,
          text: `My VibeOS score is ${profile.vibe_score}% — ${profile.vibe_label}! Check out my vibe.`,
          url: `${window.location.origin}/profile/${user.id}`,
        });
      } catch (e) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(
        `My VibeOS score is ${profile.vibe_score}% — ${profile.vibe_label}! vibeos.app`
      );
    }
    onShare?.();
  };

  if (compact) {
    return (
      <div
        id="vibe-card"
        className="relative overflow-hidden rounded-2xl p-5"
        style={{
          background: `linear-gradient(135deg, #1A0A2E, #0A1628, #0A0A1A)`,
        }}
      >
        {/* Animated bg blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] opacity-40"
          style={{ background: color }} />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-[30px] opacity-20"
          style={{ background: '#06B6D4' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full border-2 border-white/20"
            />
            <div>
              <p className="font-display font-bold text-white text-sm">VibeOS</p>
              <p className="text-white/60 text-xs">{user.name}</p>
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-white/60 text-xs font-medium mb-1">My Vibe Score</p>
            <div className="font-display font-black text-5xl" style={{ color }}>
              {profile.vibe_score}%
            </div>
            <div className="font-semibold text-sm mt-1" style={{ color }}>
              {profile.vibe_label}
            </div>
            {latestMood?.insight && (
              <p className="text-white/50 text-xs mt-2 leading-relaxed">
                {latestMood.insight.slice(0, 80)}...
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Focus', value: latestMood?.focus || profile.analytical },
              { label: 'Energy', value: latestMood?.energy || profile.ambitious },
              { label: 'Social', value: latestMood?.social || profile.social },
              { label: 'Calm', value: latestMood?.calm || profile.calm },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-white font-bold text-sm">{value}%</div>
                <div className="text-white/40 text-[10px]">{label}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-white/30 text-[10px] mt-3">
            Discover your vibe at vibeos.app
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <VibeCard user={user} profile={profile} latestMood={latestMood} compact={true} />

      <div className="flex gap-3">
        <motion.button
          onClick={handleShare}
          whileTap={{ scale: 0.95 }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
          style={{
            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
            border: `1px solid ${color}40`,
            color,
          }}
        >
          <Share2 size={16} />
          Share Your Vibe Card
        </motion.button>
      </div>
    </motion.div>
  );
}
