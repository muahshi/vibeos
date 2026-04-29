'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Lock, Eye, Moon, Zap, ChevronRight, LogOut, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/layout/BottomNav';
import { MOCK_USER } from '@/lib/utils';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
        enabled ? 'bg-primary' : 'bg-surface-3'
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
      />
    </button>
  );
}

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  toggle?: boolean;
  enabled?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  danger?: boolean;
}

function SettingRow({ icon, label, sublabel, toggle, enabled, onToggle, onPress, danger }: SettingRowProps) {
  return (
    <button
      onClick={onPress || onToggle}
      className="w-full flex items-center gap-3 py-3.5 px-1 text-left active:opacity-70 transition-opacity"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        danger ? 'bg-red-500/15' : 'bg-surface-3'
      }`}>
        <span className={danger ? 'text-red-400' : 'text-text-secondary'}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${danger ? 'text-red-400' : 'text-text-primary'}`}>
          {label}
        </p>
        {sublabel && <p className="text-xs text-text-muted mt-0.5">{sublabel}</p>}
      </div>
      {toggle ? (
        <Toggle enabled={!!enabled} onToggle={onToggle || (() => {})} />
      ) : (
        !danger && <ChevronRight size={14} className="text-text-muted flex-shrink-0" />
      )}
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const user = MOCK_USER;
  const [settings, setSettings] = useState({
    notifications: true,
    dailyReminder: true,
    matchAlerts: true,
    publicProfile: true,
    showMoodHistory: false,
    darkMode: true,
    haptics: true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  const sections = [
    {
      title: 'Notifications',
      items: [
        {
          icon: <Bell size={16} />, label: 'Push Notifications', sublabel: 'Get alerts on new matches & messages',
          toggle: true, key: 'notifications',
        },
        {
          icon: <Zap size={16} />, label: 'Daily Vibe Reminder', sublabel: 'Check-in every day at 9 AM',
          toggle: true, key: 'dailyReminder',
        },
        {
          icon: <Bell size={16} />, label: 'Match Alerts', sublabel: 'Know when someone matches you',
          toggle: true, key: 'matchAlerts',
        },
      ],
    },
    {
      title: 'Privacy',
      items: [
        {
          icon: <Eye size={16} />, label: 'Public Profile', sublabel: 'Others can discover you in Explore',
          toggle: true, key: 'publicProfile',
        },
        {
          icon: <Lock size={16} />, label: 'Show Mood History', sublabel: 'Share your vibe trends publicly',
          toggle: true, key: 'showMoodHistory',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Moon size={16} />, label: 'Dark Mode', sublabel: 'Always on for the best experience',
          toggle: true, key: 'darkMode',
        },
        {
          icon: <Zap size={16} />, label: 'Haptic Feedback', sublabel: 'Vibrate on interactions',
          toggle: true, key: 'haptics',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="sticky top-0 z-40 px-4 pt-12 pb-4 bg-bg/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full glass flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-text-secondary" />
          </button>
          <h1 className="font-bold text-text-primary text-xl">Settings</h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 flex items-center gap-4"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-2xl border border-border"
          />
          <div className="flex-1">
            <p className="font-bold text-text-primary">{user.name}</p>
            <p className="text-sm text-text-muted">{user.email}</p>
            <span className="text-xs font-semibold text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-full mt-1 inline-block">
              Free Plan
            </span>
          </div>
          <button className="text-xs font-semibold text-primary-light glass px-3 py-1.5 rounded-xl">
            Edit
          </button>
        </motion.div>

        {/* Upgrade banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a0a2e, #0a1628)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-accent-orange" />
              <span className="text-xs font-bold text-accent-orange">UPGRADE TO PRO</span>
            </div>
            <p className="text-white font-semibold text-sm mb-2">
              Unlock deep insights, AI Twin & compatibility reports
            </p>
            <button
              className="px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
            >
              Upgrade — ₹299/mo
            </button>
          </div>
        </motion.div>

        {/* Setting sections */}
        {sections.map(({ title, items }, si) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + si * 0.05 }}
            className="glass rounded-2xl px-4 divide-y divide-border/40"
          >
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest py-3">
              {title}
            </p>
            {items.map((item) => (
              <SettingRow
                key={item.key}
                icon={item.icon}
                label={item.label}
                sublabel={item.sublabel}
                toggle={item.toggle}
                enabled={settings[item.key as keyof typeof settings]}
                onToggle={() => toggle(item.key as keyof typeof settings)}
              />
            ))}
          </motion.div>
        ))}

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl px-4 divide-y divide-border/40"
        >
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest py-3">
            Account
          </p>
          <SettingRow
            icon={<LogOut size={16} />}
            label="Sign Out"
            sublabel="You'll need to sign in again"
            onPress={() => router.push('/onboarding')}
            danger
          />
          <SettingRow
            icon={<Trash2 size={16} />}
            label="Delete Account"
            sublabel="This action is permanent"
            danger
          />
        </motion.div>

        <p className="text-center text-text-muted text-xs pb-4">
          VibeOS v1.0.0 · Made with 💜
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
