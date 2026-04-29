import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getVibeLabel(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Very Positive';
  if (score >= 70) return 'Positive';
  if (score >= 60) return 'Balanced';
  if (score >= 50) return 'Neutral';
  if (score >= 40) return 'Low';
  return 'Needs Care';
}

export function getVibeColor(score: number): string {
  if (score >= 80) return '#10B981';
  if (score >= 65) return '#06B6D4';
  if (score >= 50) return '#7C3AED';
  if (score >= 35) return '#F97316';
  return '#EF4444';
}

export function getMoodEmoji(mood: string): string {
  const map: Record<string, string> = {
    great: '😄',
    good: '😊',
    okay: '😐',
    low: '😔',
    bad: '😞',
  };
  return map[mood] || '😐';
}

export function getMoodScore(mood: string): number {
  const map: Record<string, number> = {
    great: 5,
    good: 4,
    okay: 3,
    low: 2,
    bad: 1,
  };
  return map[mood] || 3;
}

export function formatRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
}

export function calculateVibeScore(traits: {
  analytical: number;
  creative: number;
  empathetic: number;
  social: number;
  ambitious: number;
  calm: number;
}): number {
  const weights = {
    analytical: 0.15,
    creative: 0.2,
    empathetic: 0.2,
    social: 0.15,
    ambitious: 0.15,
    calm: 0.15,
  };

  return Math.round(
    Object.entries(traits).reduce((sum, [key, value]) => {
      return sum + value * weights[key as keyof typeof weights];
    }, 0)
  );
}

export function getAvatarUrl(name: string, seed?: string): string {
  const s = seed || name.replace(/\s+/g, '').toLowerCase();
  return `https://api.dicebear.com/8.x/avataaars/svg?seed=${s}&backgroundColor=6d28d9,4c1d95,7c3aed`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
}

export const MOCK_USER = {
  id: 'demo-user-001',
  name: 'Aditya Kumar',
  email: 'aditya@vibeos.app',
  avatar: getAvatarUrl('Aditya'),
  created_at: new Date().toISOString(),
};

export const MOCK_VIBE_PROFILE = {
  id: 'profile-001',
  user_id: 'demo-user-001',
  analytical: 85,
  creative: 90,
  empathetic: 75,
  social: 60,
  ambitious: 80,
  calm: 70,
  vibe_score: 82,
  vibe_label: 'Very Positive',
  updated_at: new Date().toISOString(),
};

export const MOCK_MOOD_TODAY = {
  id: 'mood-001',
  user_id: 'demo-user-001',
  mood: 'great' as const,
  mood_score: 5,
  vibe_score: 82,
  insight: "You're radiating positive energy! Creativity and focus are at their peak today. Perfect time to build and connect.",
  focus: 85,
  energy: 90,
  social: 70,
  calm: 80,
  created_at: new Date().toISOString(),
};

export const MOCK_EXPLORE_USERS = [
  {
    id: 'user-002',
    name: 'Priya Sharma',
    username: '@priya.vibes',
    avatar: getAvatarUrl('Priya'),
    vibe_score: 88,
    match_percentage: 92,
    traits: ['Creative', 'Empathetic', 'Ambitious'],
    bio: 'Designer & dreamer. Building things that matter.',
  },
  {
    id: 'user-003',
    name: 'Arjun Mehta',
    username: '@arjun.vibes',
    avatar: getAvatarUrl('Arjun'),
    vibe_score: 79,
    match_percentage: 88,
    traits: ['Analytical', 'Calm', 'Social'],
    bio: 'Engineer by day, philosopher by night.',
  },
  {
    id: 'user-004',
    name: 'Ananya Singh',
    username: '@ananya.vibes',
    avatar: getAvatarUrl('Ananya'),
    vibe_score: 91,
    match_percentage: 85,
    traits: ['Social', 'Creative', 'Empathetic'],
    bio: 'Product lead at a stealth startup. Vibing hard.',
  },
  {
    id: 'user-005',
    name: 'Rohit Verma',
    username: '@rohit.vibes',
    avatar: getAvatarUrl('Rohit'),
    vibe_score: 74,
    match_percentage: 82,
    traits: ['Ambitious', 'Analytical', 'Calm'],
    bio: 'Founder. 0→1 guy. Building in public.',
  },
  {
    id: 'user-006',
    name: 'Kavya Nair',
    username: '@kavya.vibes',
    avatar: getAvatarUrl('Kavya'),
    vibe_score: 86,
    match_percentage: 79,
    traits: ['Empathetic', 'Creative', 'Social'],
    bio: 'Writer & storyteller. Coffee addict.',
  },
  {
    id: 'user-007',
    name: 'Dev Patel',
    username: '@dev.vibes',
    avatar: getAvatarUrl('Dev'),
    vibe_score: 83,
    match_percentage: 76,
    traits: ['Analytical', 'Ambitious', 'Creative'],
    bio: 'VC-backed founder. Obsessed with AI.',
  },
];

export const MOCK_MOOD_HISTORY = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const scores = [65, 70, 68, 75, 80, 78, 82, 85, 79, 72, 68, 74, 80, 83, 88, 85, 82, 79, 84, 87, 82, 78, 80, 85, 88, 82, 79, 84, 86, 82];
  return {
    id: `mood-history-${i}`,
    user_id: 'demo-user-001',
    mood: scores[i] >= 80 ? 'great' : scores[i] >= 70 ? 'good' : 'okay',
    mood_score: scores[i] >= 80 ? 5 : scores[i] >= 70 ? 4 : 3,
    vibe_score: scores[i],
    insight: '',
    focus: 80,
    energy: 85,
    social: 70,
    calm: 75,
    created_at: date.toISOString(),
  };
});
