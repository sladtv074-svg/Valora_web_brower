import { useState, type FormEvent } from 'react';
import { ArrowRight, Plus, Search, ShieldCheck, X, Zap } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Toggle } from '@/components/ui/Toggle';
import type { QuickLink } from '@/lib/urls';

interface HomePageProps {
  quickLinks: QuickLink[];
  onNavigate: (input: string) => void;
  onOpenFavorites: () => void;
  performance: boolean;
  onTogglePerformance: (value: boolean) => void;
}

export function HomePage({
  quickLinks,
  onNavigate,
  onOpenFavorites,
  performance,
  onTogglePerformance,
}: HomePageProps) {
  const [query, setQuery] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    onNavigate(value);
    setQuery('');
  };

  return (
    <div className="relative flex h-full flex-col overflow-y-auto">
      <div className="valora-glow pointer-events-none absolute -top-48 left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl dark:bg-sky-500/25" />
      <div className="valora-glow pointer-events-none absolute -bottom-40 -right-20 h-[420px] w-[520px] rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative z-10 flex justify-end px-4 pt-5 sm:px-8">
        <div className="flex max-w-xs items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/5">
          <ShieldCheck className="h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Navigation sécurisée</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Votre vie privée est protégée</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-10">
        <Logo className="h-24 w-24 drop-shadow-[0_0_28px_rgba(56,189,248,0.35)] sm:h-28 sm:w-28" />
        <h1 className="mt-3 text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">Valora</h1>
        <p className="mt-2 text-base text-sky-700 dark:text-sky-300">Explorez. Découvrez. Profitez.</p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex w-full max-w-2xl items-center gap-3 rounded-full border border-slate-200 bg-white py-2 pl-6 pr-2 shadow-lg shadow-sky-900/5 transition focus-within:ring-4 focus-within:ring-sky-500/20 dark:border-sky-400/40 dark:bg-slate-900/60 dark:shadow-[0_0_28px_-6px_rgba(56,189,248,0.55)] dark:backdrop-blur-xl"
        >
          <Search className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher sur le web"
            aria-label="Rechercher sur le web"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
          <button
            type="submit"
            aria-label="Lancer la recherche"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white shadow-md shadow-sky-500/30 transition hover:bg-sky-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-8">
          {quickLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => onNavigate(link.url)}
              className="valora-stretch group flex w-20 flex-col items-center gap-2.5 focus:outline-none"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl font-semibold text-slate-800 shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:border-sky-400/60 group-hover:shadow-lg group-focus-visible:ring-4 group-focus-visible:ring-sky-500/30 dark:border-white/10 dark:bg-white/[0.07] dark:text-slate-100">
                {link.label.charAt(0)}
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{link.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onOpenFavorites}
            className="group flex w-20 flex-col items-center gap-2.5 focus:outline-none"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition duration-200 group-hover:-translate-y-1 group-hover:border-sky-400 group-hover:text-sky-600 group-focus-visible:ring-4 group-focus-visible:ring-sky-500/30 dark:border-white/20 dark:bg-white/[0.03] dark:text-slate-400 dark:group-hover:text-sky-300">
              <Plus className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Ajouter</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-col-reverse gap-4 px-4 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        {showWelcome ? (
          <div className="valora-fade-up flex max-w-sm items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 py-3 pl-4 pr-2 shadow-sm dark:border-white/10 dark:bg-white/5">
            <Zap className="h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Bienvenue sur Valora !</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Un navigateur rapide, moderne et sécurisé.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowWelcome(false)}
              aria-label="Masquer le message de bienvenue"
              className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3 self-end rounded-2xl border border-slate-200 bg-white/90 py-2.5 pl-4 pr-3 shadow-sm dark:border-white/10 dark:bg-white/5">
          <Zap className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Mode performance</span>
          <Toggle checked={performance} onChange={onTogglePerformance} label="Mode performance" />
        </div>
      </div>
    </div>
  );
}
