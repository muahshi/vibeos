// ===== DATABASE TYPES =====

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at: string;
}

export interface VibeProfile {
  id: string;
  user_id: string;
  analytical: number;    // 0-100
  creative: number;
  empathetic: number;
  social: number;
  ambitious: number;
  calm: number;
  vibe_score: number;
  vibe_label: string;   // "Very Positive", "Positive", etc.
  updated_at: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  mood: 'great' | 'good' | 'okay' | 'low' | 'bad';
  mood_score: number;    // 1-5
  vibe_score: number;
  insight: string;
  focus: number;
  energy: number;
  social: number;
  calm: number;
  created_at: string;
}

export interface Match {
  id: string;
  user_id: string;
  matched_user_id: string;
  score: number;
  status: 'pending' | 'connected' | 'declined';
  compatibility_reasons: string[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ===== COMPONENT PROPS =====

export interface VibeCardProps {
  user: User;
  profile: VibeProfile;
  latestMood?: MoodLog;
}

export interface MoodOption {
  label: string;
  emoji: string;
  value: 'great' | 'good' | 'okay' | 'low' | 'bad';
  score: number;
}

export interface PersonalityTrait {
  name: string;
  key: keyof Pick<VibeProfile, 'analytical' | 'creative' | 'empathetic' | 'social' | 'ambitious' | 'calm'>;
  value: number;
  color: string;
}

// ===== API RESPONSE TYPES =====

export interface AnalyzeResponse {
  vibe_score: number;
  vibe_label: string;
  insight: string;
  traits: {
    analytical: number;
    creative: number;
    empathetic: number;
    social: number;
    ambitious: number;
    calm: number;
  };
  focus: number;
  energy: number;
  social_score: number;
  calm_score: number;
  recommendation: string;
}

export interface ChatResponse {
  message: string;
  emotion: string;
}

export interface MatchScoreResponse {
  score: number;
  reasons: string[];
  compatibility_type: string;
}

// ===== UI STATE TYPES =====

export interface AppState {
  user: User | null;
  vibeProfile: VibeProfile | null;
  todaysMood: MoodLog | null;
  moodHistory: MoodLog[];
  matches: ExploreUser[];
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setVibeProfile: (profile: VibeProfile | null) => void;
  setTodaysMood: (mood: MoodLog | null) => void;
  setMoodHistory: (history: MoodLog[]) => void;
  setMatches: (matches: ExploreUser[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export interface ExploreUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  vibe_score: number;
  match_percentage: number;
  traits: string[];
  bio?: string;
}
