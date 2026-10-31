import { ExternalLink, History, Trash2 } from 'lucide-react';
import type { HistoryEntry } from '@/types/browser';

interface HistoryPageProps {
  history: HistoryEntry[];
  error: string | null;
  onOpen: (url: string) => void;
  onClear: () => void;
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
};

export function HistoryPage({ history, error, onOpen, onClear }: HistoryPageProps) {
  const handleClear = () => {
    if (window.confirm('Effacer tout votre historique de navigation ?')) onClear();
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Historique</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {history.length} {history.length > 1 ? 'pages visitées' : 'page visitée'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            disabled={history.length === 0}
            className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-300 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:bg-transparent dark:text-slate-200 dark:hover:border-rose-400/50 dark:hover:text-rose-300"
          >
            <Trash2 className="h-4 w-4" />
            Effacer l'historique
          </button>
        </header>

        {error && (
          <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </p>
        )}

        {history.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-white/15">
            <History className="h-8 w-8 text-slate-400" />
            <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">Aucune page visitée</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Les sites que vous ouvrez apparaîtront ici.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300/60 dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900 dark:text-slate-100">{entry.title}</p>
                  <p className="truncate text-sm text-slate-600 dark:text-slate-400">{entry.url}</p>
                </div>
                <time className="hidden shrink-0 text-xs text-slate-500 sm:block dark:text-slate-400" dateTime={entry.visitedAt}>
                  {new Date(entry.visitedAt).toLocaleString('fr-FR', DATE_FORMAT)}
                </time>
                <button
                  type="button"
                  onClick={() => onOpen(entry.url)}
                  aria-label={`Ouvrir ${entry.title}`}
                  className="shrink-0 rounded-full p-2 text-sky-600 transition hover:bg-sky-500/10 dark:text-sky-300"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
