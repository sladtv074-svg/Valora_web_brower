import { Download, History, Home, Moon, Puzzle, Settings, Star, Sun, type LucideIcon } from 'lucide-react';
import type { DownloadOption } from '@/lib/downloads';
import type { SidebarItem } from '@/types/browser';

interface SidebarProps {
  activeItem: SidebarItem | null;
  onSelect: (item: SidebarItem) => void;
  dark: boolean;
  onToggleDark: () => void;
  downloads: DownloadOption[];
}

interface NavItem {
  id: SidebarItem;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'favorites', label: 'Favoris', icon: Star },
  { id: 'history', label: 'Historique', icon: History },
  { id: 'downloads', label: 'Téléchargements', icon: Download },
  { id: 'extensions', label: 'Extensions', icon: Puzzle },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

export function Sidebar({ activeItem, onSelect, dark, onToggleDark, downloads }: SidebarProps) {
  return (
    <aside className="valora-glass m-2 mr-0 flex w-16 shrink-0 flex-col justify-between rounded-2xl px-2 py-4 text-slate-900 md:w-56 md:px-3 dark:text-slate-100">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeItem === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              title={label}
              className={`valora-stretch flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors md:justify-start ${
                active
                  ? 'bg-sky-500/20 text-sky-800 shadow-sm dark:bg-sky-400/20 dark:text-sky-200'
                  : 'text-slate-700 hover:bg-white/40 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="hidden md:inline">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-2">
        {downloads.map((option) => (
          <a
            key={option.file}
            href={option.file}
            download
            aria-label={`Télécharger Valora : ${option.label}`}
            title={`Télécharger Valora : ${option.label}`}
            className="valora-stretch flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-2 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-500/30 transition-colors hover:bg-sky-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/40 md:px-3"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span className="hidden truncate md:inline">{option.label}</span>
          </a>
        ))}
        <button
          type="button"
          onClick={onToggleDark}
          aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          title={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          className="valora-stretch mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-slate-700 transition-colors hover:bg-white/70 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
        >
          {dark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </button>
      </div>
    </aside>
  );
}
