'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Users, Sparkles, MessageCircle, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/layout/BottomNav';
import { getAvatarUrl, formatRelativeTime } from '@/lib/utils';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'match',
    icon: Heart,
    color: '#EC4899',
    title: 'New Match!',
    message: 'Priya Sharma matches you at 92% compatibility.',
    time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    avatar: getAvatarUrl('Priya'),
    unread: true,
  },
  {
    id: '2',
    type: 'vibe',
    icon: Sparkles,
    color: '#7C3AED',
    title: 'Daily Vibe Check',
    message: "It's 9 AM — time to check in and set your vibe for the day.",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread: true,
  },
  {
    id: '3',
    type: 'tribe',
    icon: Users,
    color: '#06B6D4',
    title: 'Tribe Activity',
    message: 'Arjun Mehta viewed your profile. Your vibe is attracting people!',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    avatar: getAvatarUrl('Arjun'),
    unread: false,
  },
  {
    id: '4',
    type: 'insight',
    icon: TrendingUp,
    color: '#10B981',
    title: 'Weekly Vibe Report',
    message: 'Your vibe score increased by 8% this week. You\'re on a roll! 🔥',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
  },
  {
    id: '5',
    type: 'chat',
    icon: MessageCircle,
    color: '#F97316',
    title: 'AI Twin Message',
    message: "Your twin noticed something. 'You've been more creative lately — lean into it.'",
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
  },
  {
    id: '6',
    type: 'match',
    icon: Heart,
    color: '#EC4899',
    title: 'New Match!',
    message: 'Dev Patel matches you at 76% compatibility.',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    avatar: getAvatarUrl('Dev'),
    unread: false,
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="sticky top-0 z-40 px-4 pt-12 pb-4 bg-bg/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full glass flex items-center justify-center"
            >
              <ArrowLeft size={16} className="text-text-secondary" />
            </button>
            <h1 className="font-bold text-text-primary text-xl">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <span className="text-xs font-bold text-primary-light glass px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-2">
        {unreadCount > 0 && (
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest px-1 py-2">
            New
          </p>
        )}

        {NOTIFICATIONS.map((notif, i) => {
          const Icon = notif.icon;
          return (
            <motion.button
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`w-full glass rounded-2xl p-4 flex items-start gap-3 text-left transition-all active:scale-[0.99] ${
                notif.unread ? 'border border-primary/15' : ''
              }`}
            >
              {/* Icon / Avatar */}
              <div className="relative flex-shrink-0">
                {notif.avatar ? (
                  <img
                    src={notif.avatar}
                    alt=""
                    className="w-11 h-11 rounded-xl border border-border"
                  />
                ) : (
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${notif.color}15`, border: `1px solid ${notif.color}30` }}
                  >
                    <Icon size={18} style={{ color: notif.color }} />
                  </div>
                )}
                {notif.avatar && (
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-bg"
                    style={{ background: `${notif.color}30` }}
                  >
                    <Icon size={9} style={{ color: notif.color }} />
                  </div>
                )}
                {notif.unread && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary border border-bg" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-bold ${notif.unread ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-text-muted flex-shrink-0">
                    {formatRelativeTime(notif.time)}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1 leading-relaxed line-clamp-2">
                  {notif.message}
                </p>
              </div>
            </motion.button>
          );
        })}

        {/* Earlier divider */}
        <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest px-1 py-2 pt-4">
          Earlier
        </p>
        <div className="text-center py-6">
          <p className="text-text-muted text-sm">You're all caught up! ✨</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
