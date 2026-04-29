import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key';

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (with service role for admin operations)
export const createServerClient = () => {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

// Database helper functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getVibeProfile(userId: string) {
  const { data, error } = await supabase
    .from('vibe_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getTodaysMood(userId: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00`)
    .lt('created_at', `${today}T23:59:59`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getMoodHistory(userId: string, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function saveMoodLog(moodData: {
  user_id: string;
  mood: string;
  mood_score: number;
  vibe_score: number;
  insight: string;
  focus: number;
  energy: number;
  social: number;
  calm: number;
}) {
  const { data, error } = await supabase
    .from('mood_logs')
    .insert([moodData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function upsertVibeProfile(profileData: {
  user_id: string;
  analytical: number;
  creative: number;
  empathetic: number;
  social: number;
  ambitious: number;
  calm: number;
  vibe_score: number;
  vibe_label: string;
}) {
  const { data, error } = await supabase
    .from('vibe_profiles')
    .upsert([{ ...profileData, updated_at: new Date().toISOString() }], {
      onConflict: 'user_id',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getExploreUsers(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      name,
      avatar,
      vibe_profiles (
        vibe_score,
        analytical,
        creative,
        empathetic,
        social,
        ambitious,
        calm
      )
    `)
    .neq('id', userId)
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getUserMatches(userId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      matched_user:users!matches_matched_user_id_fkey (
        id, name, avatar
      )
    `)
    .eq('user_id', userId)
    .order('score', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function saveMatch(matchData: {
  user_id: string;
  matched_user_id: string;
  score: number;
  compatibility_reasons: string[];
}) {
  const { data, error } = await supabase
    .from('matches')
    .upsert([{ ...matchData, status: 'pending' }], {
      onConflict: 'user_id,matched_user_id',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
