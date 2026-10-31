import { useState, type FormEvent } from 'react';
import { ExternalLink, Globe, LogIn, Star, Trash2 } from 'lucide-react';
import { getTitleFromUrl, toFavoriteUrl } from '@/lib/urls';
import type { PageRef, SavedPage } from '@/types/browser';

interface FavoritesPageProps {
  favorites: SavedPage[];
  error: string | null;
  signedIn: boolean;
  onOpen: (url: string) => void;
  onSave: (page: PageRef) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSignIn: () => void;
}

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/15 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500';

export function FavoritesPage({
  favorites,
  error,
  signedIn,
  onOpen,
  onSave,
  onDelete,
  onSignIn,
}: FavoritesPageProps) {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = toFavoriteUrl(address);
    if (!url) {
      setFormError('Saisissez une adresse valide, par exemple youtube.com.');
      return;
    }
    setFormError(null);
    setSaving(true);
    await onSave({ title: title.trim() || getTitleFromUrl(url), url });
    setSaving(false);
    setTitle('');
    setAddress('');
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Favoris</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {favorites.length} {favorites.length > 1 ? 'pages enregistrées' : 'page enregistrée'}
            </p>
          </div>
        </header>

        {!signedIn && (
          <div className="flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sky-400/20 dark:bg-sky-500/10">
            <p className="text-sm leading-relaxed text-sky-900 dark:text-sky-100">
              Vos favoris sont gardés sur cet appareil. Connectez-vous pour les retrouver partout.
            </p>
            <button
              type="button"
              onClick={onSignIn}
              className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
            >
              <LogIn className="h-4 w-4" />
              Se connecter
            </button>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_1.4fr_auto] sm:items-start dark:border-white/10 dark:bg-white/[0.04]"
        >
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Nom (facultatif)"
            aria-label="Nom du favori"
            className={INPUT_CLASS}
          />
          <div className="space-y-1.5">
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Adresse, par exemple youtube.com"
              aria-label="Adresse du favori"
              required
              className={INPUT_CLASS}
            />
            {formError && <p className="text-xs text-rose-600 dark:text-rose-300">{formError}</p>}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 disabled:opacity-60"
          >
            <Star className="h-4 w-4" />
            Ajouter
          </button>
        </form>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-white/15">
            <Star className="h-8 w-8 text-slate-400" />
            <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">Aucun favori pour le moment</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Utilisez l'étoile dans la barre d'adresse ou le formulaire ci-dessus.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {favorites.map((favorite) => (
              <li
                key={favorite.id}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300/60 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                  <Globe className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900 dark:text-slate-100">{favorite.title}</p>
                  <p className="truncate text-sm text-slate-600 dark:text-slate-400">{favorite.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpen(favorite.url)}
                  aria-label={`Ouvrir ${favorite.title}`}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ouvrir
                </button>
                <button
                  type="button"
                  onClick={() => void onDelete(favorite.id)}
                  aria-label={`Supprimer ${favorite.title}`}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
