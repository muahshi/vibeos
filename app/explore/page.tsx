'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Sparkles, Users, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { MOCK_EXPLORE_USERS, getVibeColor, getAvatarUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';

const FILTER_TABS = ['For You', 'Trending', 'Nearby', 'New'];

const TraitBadge = ({ trait }: { trait: string }) => (
  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary-light border border-primary/20">
    {trait}
  </span>
);

const MatchBar = ({ percentage, color }: { percentage: number; color: string }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
    <span className="text-xs font-bold" style={{ color }}>
      {percentage}%
    </span>
  </div>
);

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

  const filteredUsers = useMemo(() => {
    let users = [...MOCK_EXPLORE_USERS];
    if (searchQuery) {
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.traits.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (activeFilter === 'Trending') {
      users = users.sort((a, b) => b.vibe_score - a.vibe_score);
    } else if (activeFilter === 'For You') {
      users = users.sort((a, b) => b.match_percentage - a.match_percentage);
    } else if (activeFilter === 'New') {
      users = users.reverse();
    }
    return users;
  }, [activeFilter, searchQuery]);

  const handleConnect = async (userId: string) => {
    if (connectedIds.has(userId)) return;
    setConnectingId(userId);
    await new Promise((r) => setTimeout(r, 800));
    setConnectedIds((prev) => new Set([...prev, userId]));
    setConnectingId(null);
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-12 pb-3 bg-bg/80 backdrop-blur-xl border-b border-border/30 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl text-text-primary">Explore</h1>
          <button className="w-9 h-9 rounded-full glass flex items-center justify-center">
            <Filter size={16} className="text-text-secondary" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search vibes, traits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={cn(
                'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200',
                activeFilter === tab
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'glass text-text-secondary'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Find Your People Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-4"
          style={{ background: 'linear-gradient(135deg, #1a0a2e, #0a1628)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px]" />
          <div className="absolute bottom-0 left-16 w-24 h-24 bg-accent/15 rounded-full blur-[30px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Users size={14} className="text-primary-light" />
              <span className="text-xs font-semibold text-primary-light">Find Your People</span>
            </div>
            <p className="text-white font-semibold text-sm">
              Connect with amazing people who match your vibe
            </p>
            <div className="flex -space-x-2 mt-2">
              {['Priya', 'Arjun', 'Kavya'].map((name) => (
                <img
                  key={name}
                  src={getAvatarUrl(name)}
                  alt={name}
                  className="w-7 h-7 rounded-full border-2 border-[#1a0a2e]"
                />
              ))}
              <div className="w-7 h-7 rounded-full border-2 border-[#1a0a2e] bg-primary/40 flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">+12</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Cards */}
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((user, i) => {
            const vibeColor = getVibeColor(user.vibe_score);
            const matchColor = getVibeColor(user.match_percentage);
            const isConnecting = connectingId === user.id;
            const isConnected = connectedIds.has(user.id);

            return (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-4 relative overflow-hidden"
              >
                {/* Subtle bg glow based on vibe */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-10"
                  style={{ background: vibeColor }}
                />

                <div className="relative z-10">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-14 h-14 rounded-2xl border border-border"
                      />
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-bg flex items-center justify-center text-[9px] font-bold"
                        style={{ background: vibeColor, color: '#0A0A0A' }}
                      >
                        {user.vibe_score}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-text-primary text-base leading-tight">
                            {user.name}
                          </h3>
                          <p className="text-xs text-text-muted">{user.username}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div
                            className="text-xs font-bold"
                            style={{ color: matchColor }}
                          >
                            {user.match_percentage}% Match
                          </div>
                        </div>
                      </div>

                      {user.bio && (
                        <p className="text-xs text-text-secondary mt-1 leading-relaxed line-clamp-1">
                          {user.bio}
                        </p>
                      )}

                      {/* Match bar */}
                      <div className="mt-2">
                        <MatchBar percentage={user.match_percentage} color={matchColor} />
                      </div>

                      {/* Traits */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {user.traits.map((trait) => (
                          <TraitBadge key={trait} trait={trait} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Connect button */}
                  <motion.button
                    onClick={() => handleConnect(user.id)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'w-full mt-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300',
                      isConnected
                        ? 'bg-accent-green/15 text-accent-green border border-accent-green/30'
                        : 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-light'
                    )}
                  >
                    {isConnecting ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkles size={14} />
                        </motion.div>
                        Connecting...
                      </div>
                    ) : isConnected ? (
                      '✓ Connected'
                    ) : (
                      'Connect'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-text-secondary font-medium">No results found</p>
            <p className="text-text-muted text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
