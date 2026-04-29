'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { VibeScoreRing } from '@/components/ui/VibeScoreRing';
import { MOCK_EXPLORE_USERS, MOCK_USER, MOCK_VIBE_PROFILE, getVibeColor, cn } from '@/lib/utils';

const TOP_MATCH = {
  ...MOCK_EXPLORE_USERS[0],
  compatibility_type: 'Creative Alliance',
  reasons: [
    'Similar values & goals',
    'Great communication potential',
    'Emotional compatibility',
    'Shared interests',
  ],
};

const MATCH_TABS = ['Top Matches', 'Your Matches'];

function CompatibilityRing({ score }: { score: number }) {
  const color = getVibeColor(score);
  return (
    <div className="relative flex items-center justify-center">
      <VibeScoreRing score={score} size={120} strokeWidth={6} showLabel={false} animated />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-black text-3xl" style={{ color }}>
          {score}%
        </span>
        <span className="text-[10px] text-text-muted font-medium">Match</span>
      </div>
    </div>
  );
}

export default function MatchPage() {
  const [activeTab, setActiveTab] = useState('Top Matches');
  const [selectedMatch, setSelectedMatch] = useState(TOP_MATCH);
  const [isCalculating, setIsCalculating] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

  const topMatches = MOCK_EXPLORE_USERS.slice(0, 4);

  const handleCalculateMatch = async (targetUser: typeof MOCK_EXPLORE_USERS[0]) => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_profile: MOCK_VIBE_PROFILE,
          target_profile: {
            analytical: 75, creative: 90, empathetic: 85,
            social: 70, ambitious: 80, calm: 65,
            vibe_score: targetUser.vibe_score,
          },
          user_name: MOCK_USER.name,
          target_name: targetUser.name,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedMatch({
          ...targetUser,
          match_percentage: data.score,
          compatibility_type: data.compatibility_type,
          reasons: data.reasons,
        });
      } else {
        setSelectedMatch({ ...targetUser, compatibility_type: 'Growth Partners', reasons: TOP_MATCH.reasons });
      }
    } catch {
      setSelectedMatch({ ...targetUser, compatibility_type: 'Growth Partners', reasons: TOP_MATCH.reasons });
    } finally {
      setIsCalculating(false);
    }
  };

  const matchColor = getVibeColor(selectedMatch.match_percentage);

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-12 pb-4 bg-bg/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl text-text-primary">Match</h1>
          <button className="w-9 h-9 rounded-full glass flex items-center justify-center">
            <Heart size={16} className="text-accent-pink" fill="rgba(236,72,153,0.4)" />
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 px-4 pt-4">
        {MATCH_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
              activeTab === tab
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'glass text-text-secondary'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 space-y-4">
        {activeTab === 'Top Matches' && (
          <>
            {/* Featured Match Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMatch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass rounded-2xl overflow-hidden"
              >
                {/* Match header with avatars */}
                <div className="p-5 relative" style={{
                  background: 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)'
                }}>
                  <div className="flex items-center justify-center gap-0 mb-4">
                    <div className="relative">
                      <img
                        src={MOCK_USER.avatar}
                        alt="You"
                        className="w-16 h-16 rounded-full border-3 border-bg shadow-xl"
                        style={{ borderWidth: '3px', borderColor: '#0A0A0A' }}
                      />
                    </div>
                    {/* Heart connector */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-10 h-10 rounded-full bg-accent-pink/20 border border-accent-pink/30 flex items-center justify-center z-10 mx-[-8px]"
                    >
                      <Heart size={16} className="text-accent-pink" fill="rgba(236,72,153,0.6)" />
                    </motion.div>
                    <div className="relative">
                      <img
                        src={selectedMatch.avatar}
                        alt={selectedMatch.name}
                        className="w-16 h-16 rounded-full border-3 border-bg shadow-xl"
                        style={{ borderWidth: '3px', borderColor: '#0A0A0A' }}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-text-muted text-sm">
                      You & {selectedMatch.name.split(' ')[0]}
                    </p>

                    {isCalculating ? (
                      <div className="flex flex-col items-center py-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkles size={24} className="text-primary-light" />
                        </motion.div>
                        <p className="text-text-muted text-sm mt-2">Calculating compatibility...</p>
                      </div>
                    ) : (
                      <>
                        <motion.div
                          key={selectedMatch.match_percentage}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="font-display font-black text-5xl mt-1"
                          style={{ color: matchColor }}
                        >
                          {selectedMatch.match_percentage}%
                        </motion.div>
                        <span
                          className="text-sm font-bold"
                          style={{ color: matchColor }}
                        >
                          {selectedMatch.compatibility_type || 'Exceptional Match'}
                        </span>

                        {/* Match bar */}
                        <div className="mt-3 h-2 bg-surface-3 rounded-full overflow-hidden mx-4">
                          <motion.div
                            key={selectedMatch.match_percentage}
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${matchColor}80, ${matchColor})`,
                              boxShadow: `0 0 10px ${matchColor}60`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedMatch.match_percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Why you match */}
                {!isCalculating && (
                  <div className="px-5 pb-4">
                    <p className="text-xs font-semibold text-text-muted mb-3">Why you match:</p>
                    <div className="space-y-2">
                      {selectedMatch.reasons.map((reason, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0"
                            style={{ background: `${matchColor}20`, color: matchColor }}
                          >
                            ✓
                          </div>
                          <span className="text-sm text-text-secondary">{reason}</span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setConversationStarted(true)}
                      className={cn(
                        'w-full mt-4 py-3.5 rounded-xl font-bold text-sm transition-all',
                        conversationStarted
                          ? 'bg-accent-green/15 text-accent-green border border-accent-green/30'
                          : 'text-white shadow-xl'
                      )}
                      style={!conversationStarted ? {
                        background: `linear-gradient(135deg, ${matchColor}, ${matchColor}cc)`,
                        boxShadow: `0 8px 25px ${matchColor}40`,
                      } : {}}
                    >
                      {conversationStarted ? '✓ Conversation Started!' : 'Start Conversation'}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Other Top Matches */}
            <div>
              <p className="text-sm font-semibold text-text-secondary mb-3">Other Great Matches</p>
              <div className="space-y-3">
                {topMatches.map((user, i) => {
                  const color = getVibeColor(user.match_percentage);
                  const isSelected = selectedMatch.id === user.id;

                  return (
                    <motion.button
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleCalculateMatch(user)}
                      className={cn(
                        'w-full glass rounded-2xl p-3 flex items-center gap-3 text-left transition-all',
                        isSelected && 'border border-primary/30'
                      )}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-xl border border-border flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-primary text-sm">{user.name}</p>
                        <p className="text-xs text-text-muted">{user.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 bg-surface-3 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${user.match_percentage}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                            />
                          </div>
                          <span className="text-xs font-bold flex-shrink-0" style={{ color }}>
                            {user.match_percentage}%
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-text-muted flex-shrink-0" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'Your Matches' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="text-center py-12">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-accent-pink/15 border border-accent-pink/30 flex items-center justify-center mx-auto mb-4"
              >
                <Heart size={24} className="text-accent-pink" />
              </motion.div>
              <p className="font-bold text-text-primary">No matches yet</p>
              <p className="text-text-muted text-sm mt-1">
                Connect with people in Explore to start building your tribe
              </p>
              <button
                className="mt-4 px-6 py-2.5 bg-primary rounded-xl text-white font-semibold text-sm"
                onClick={() => setActiveTab('Top Matches')}
              >
                View Top Matches
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
