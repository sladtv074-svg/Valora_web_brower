import { supabase } from '@/lib/supabase';
import type { HistoryEntry, PageRef, SavedPage } from '@/types/browser';

const FAVORITES_KEY = 'valora.favorites';
const HISTORY_KEY = 'valora.history';
export const HISTORY_LIMIT = 200;

export interface BrowserData {
  favorites: SavedPage[];
  history: HistoryEntry[];
}

function readLocal<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeLocal<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

interface FavoriteRow {
  id: string;
  title: string;
  url: string;
}

interface HistoryRow {
  id: string;
  title: string;
  url: string;
  visited_at: string;
}

function toFavorite(row: FavoriteRow): SavedPage {
  return { id: row.id, title: row.title, url: row.url };
}

function toHistoryEntry(row: HistoryRow): HistoryEntry {
  return { id: row.id, title: row.title, url: row.url, visitedAt: row.visited_at };
}

export async function fetchBrowserData(userId: string | null): Promise<BrowserData> {
  if (!userId) {
    return {
      favorites: readLocal<SavedPage>(FAVORITES_KEY),
      history: readLocal<HistoryEntry>(HISTORY_KEY),
    };
  }

  const [favoritesResult, historyResult] = await Promise.all([
    supabase
      .from('valora_favorites')
      .select('id, title, url')
      .order('created_at', { ascending: false }),
    supabase
      .from('valora_history')
      .select('id, title, url, visited_at')
      .order('visited_at', { ascending: false })
      .limit(HISTORY_LIMIT),
  ]);

  if (favoritesResult.error) throw favoritesResult.error;
  if (historyResult.error) throw historyResult.error;

  return {
    favorites: ((favoritesResult.data ?? []) as FavoriteRow[]).map(toFavorite),
    history: ((historyResult.data ?? []) as HistoryRow[]).map(toHistoryEntry),
  };
}

export async function createFavorite(userId: string | null, page: PageRef): Promise<SavedPage> {
  if (!userId) {
    const item: SavedPage = { id: crypto.randomUUID(), ...page };
    writeLocal(FAVORITES_KEY, [item, ...readLocal<SavedPage>(FAVORITES_KEY)]);
    return item;
  }

  const { data, error } = await supabase
    .from('valora_favorites')
    .insert({ title: page.title, url: page.url })
    .select('id, title, url')
    .single();

  if (error) throw error;
  return toFavorite(data as FavoriteRow);
}

export async function removeFavorite(userId: string | null, id: string): Promise<void> {
  if (!userId) {
    writeLocal(
      FAVORITES_KEY,
      readLocal<SavedPage>(FAVORITES_KEY).filter((item) => item.id !== id),
    );
    return;
  }

  const { error } = await supabase.from('valora_favorites').delete().eq('id', id);
  if (error) throw error;
}

export async function createHistoryEntry(userId: string | null, page: PageRef): Promise<HistoryEntry> {
  if (!userId) {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      ...page,
      visitedAt: new Date().toISOString(),
    };
    const next = [entry, ...readLocal<HistoryEntry>(HISTORY_KEY)].slice(0, HISTORY_LIMIT);
    writeLocal(HISTORY_KEY, next);
    return entry;
  }

  const { data, error } = await supabase
    .from('valora_history')
    .insert({ title: page.title, url: page.url })
    .select('id, title, url, visited_at')
    .single();

  if (error) throw error;
  return toHistoryEntry(data as HistoryRow);
}

export async function removeAllHistory(userId: string | null): Promise<void> {
  if (!userId) {
    writeLocal<HistoryEntry>(HISTORY_KEY, []);
    return;
  }

  const { error } = await supabase.from('valora_history').delete().eq('user_id', userId);
  if (error) throw error;
}
