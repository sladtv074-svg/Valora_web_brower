import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  House,
  Lock,
  RotateCw,
  Sparkles,
  Star,
  User,
  type LucideIcon,
} from 'lucide-react';

interface ToolbarProps {
  address: string;
  canGoBack: boolean;
  canGoForward: boolean;
  hasPage: boolean;
  isFavorite: boolean;
  aiOpen: boolean;
  signedIn: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onSubmitAddress: (input: string) => void;
  onToggleFavorite: () => void;
  onToggleAi: () => void;
  onOpenDownloads: () => void;
  onOpenAccount: () => void;
}

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function IconButton({ icon: Icon, label, onClick, disabled = false }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-white/10"
    >
      <Icon className="h-[18px] w-[18px]" />
    </button>
  );
}

export function Toolbar({
  address,
  canGoBack,
  canGoForward,
  hasPage,
  isFavorite,
  aiOpen,
  signedIn,
  onBack,
  onForward,
  onReload,
  onHome,
  onSubmitAddress,
  onToggleFavorite,
  onToggleAi,
  onOpenDownloads,
  onOpenAccount,
}: ToolbarProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = (draft ?? address).trim();
    setDraft(null);
    if (value) onSubmitAddress(value);
  };

  return (
    <header className="flex items-center gap-1.5 border-b border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-900">
      <IconButton icon={ArrowLeft} label="Page précédente" onClick={onBack} disabled={!canGoBack} />
      <IconButton icon={ArrowRight} label="Page suivante" onClick={onForward} disabled={!canGoForward} />
      <IconButton icon={RotateCw} label="Actualiser" onClick={onReload} disabled={!hasPage} />
      <IconButton icon={House} label="Accueil" onClick={onHome} />

      <form
        onSubmit={handleSubmit}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-slate-100 py-1.5 pl-4 pr-1.5 ring-sky-500/40 transition focus-within:bg-white focus-within:ring-2 dark:bg-white/5 dark:focus-within:bg-slate-800"
      >
        <Lock className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
        <input
          type="text"
          value={draft ?? address}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => setDraft(null)}
          placeholder="Rechercher ou saisir une adresse"
          aria-label="Barre d'adresse"
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={onToggleFavorite}
          disabled={!hasPage}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/10 ${
            isFavorite ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Star className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </form>

      <IconButton icon={Download} label="Téléchargements" onClick={onOpenDownloads} />

      <button
        type="button"
        onClick={onToggleAi}
        aria-pressed={aiOpen}
        className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-sm font-medium transition focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/30 ${
          aiOpen
            ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
            : 'bg-sky-500/10 text-sky-700 hover:bg-sky-500/20 dark:text-sky-300'
        }`}
      >
        <Sparkles className="h-4 w-4" />
        <span className="hidden sm:inline">Mode IA</span>
      </button>

      <button
        type="button"
        onClick={onOpenAccount}
        aria-label={signedIn ? 'Mon compte' : 'Se connecter'}
        title={signedIn ? 'Mon compte' : 'Se connecter'}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition hover:bg-slate-300 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
      >
        <User className="h-4 w-4" />
      </button>
    </header>
  );
}
