import { supabase } from '@/lib/supabase';

export const ACTIVITY_IDS = ['gamer', 'streamer', 'professionnel', 'loisir'] as const;

export type ActivityId = (typeof ACTIVITY_IDS)[number];

export const GLASS_OPACITY_MIN = 20;
export const GLASS_OPACITY_MAX = 100;
export const DEFAULT_GLASS_OPACITY = 60;

export interface Profile {
  activity: ActivityId | null;
  glassOpacity: number;
}

const STORAGE_KEY = 'valora.profile';

function isActivityId(value: unknown): value is ActivityId {
  return typeof value === 'string' && (ACTIVITY_IDS as readonly string[]).includes(value);
}

function isGlassOpacity(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= GLASS_OPACITY_MIN &&
    value <= GLASS_OPACITY_MAX
  );
}

export function readStoredProfile(): Profile {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = (raw ? JSON.parse(raw) : {}) as Partial<Record<keyof Profile, unknown>>;
    return {
      activity: isActivityId(parsed.activity) ? parsed.activity : null,
      glassOpacity: isGlassOpacity(parsed.glassOpacity) ? parsed.glassOpacity : DEFAULT_GLASS_OPACITY,
    };
  } catch {
    return { activity: null, glassOpacity: DEFAULT_GLASS_OPACITY };
  }
}

export function writeStoredProfile(patch: Partial<Profile>): Profile {
  const next = { ...readStoredProfile(), ...patch };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    return next;
  }
  return next;
}

export async function fetchRemoteProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('valora_profiles')
    .select('activity, glass_opacity')
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    activity: isActivityId(data.activity) ? data.activity : null,
    glassOpacity: isGlassOpacity(data.glass_opacity) ? data.glass_opacity : DEFAULT_GLASS_OPACITY,
  };
}

export async function saveRemoteProfile(patch: Partial<Profile>): Promise<void> {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.activity !== undefined) row.activity = patch.activity;
  if (patch.glassOpacity !== undefined) row.glass_opacity = patch.glassOpacity;
  const { error } = await supabase.from('valora_profiles').upsert(row, { onConflict: 'user_id' });
  if (error) throw new Error(error.message);
}
