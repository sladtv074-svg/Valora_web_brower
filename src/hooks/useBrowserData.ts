import { useCallback, useEffect, useState } from 'react';
import {
  createFavorite,
  createHistoryEntry,
  fetchBrowserData,
  removeAllHistory,
  removeFavorite,
  type BrowserData,
  HISTORY_LIMIT,
} from '@/lib/browserData';
import type { PageRef } from '@/types/browser';

const EMPTY_DATA: BrowserData = { favorites: [], history: [] };
const LOAD_ERROR = 'Impossible de charger vos donn\u00e9es. R\u00e9essayez.';
const ACTION_ERROR = 'Cette action n\u2019a pas pu \u00eatre enregistr\u00e9e. R\u00e9essayez.';

export function useBrowserData(userId: string | null) {
  const [data, setData] = useState<BrowserData>(EMPTY_DATA);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setData(EMPTY_DATA);
    setError(null);
    fetchBrowserData(userId)
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) setError(LOAD_ERROR);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const saveFavorite = useCallback(
    async (page: PageRef) => {
      if (data.favorites.some((favorite) => favorite.url === page.url)) return;
      try {
        const saved = await createFavorite(userId, page);
        setData((prev) => ({ ...prev, favorites: [saved, ...prev.favorites] }));
      } catch {
        setError(ACTION_ERROR);
      }
    },
    [data.favorites, userId],
  );

  const deleteFavorite = useCallback(
    async (id: string) => {
      try {
        await removeFavorite(userId, id);
        setData((prev) => ({
          ...prev,
          favorites: prev.favorites.filter((favorite) => favorite.id !== id),
        }));
      } catch {
        setError(ACTION_ERROR);
      }
    },
    [userId],
  );

  const recordVisit = useCallback(
    async (page: PageRef) => {
      try {
        const entry = await createHistoryEntry(userId, page);
        setData((prev) => ({
          ...prev,
          history: [entry, ...prev.history].slice(0, HISTORY_LIMIT),
        }));
      } catch {
        setError(ACTION_ERROR);
      }
    },
    [userId],
  );

  const clearHistory = useCallback(async () => {
    try {
      await removeAllHistory(userId);
      setData((prev) => ({ ...prev, history: [] }));
    } catch {
      setError(ACTION_ERROR);
    }
  }, [userId]);

  return {
    favorites: data.favorites,
    history: data.history,
    error,
    saveFavorite,
    deleteFavorite,
    recordVisit,
    clearHistory,
  };
}
