import { useRef, useState } from 'react';
import { Globe, Plus, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { getTitleFromUrl } from '@/lib/urls';
import type { BrowserTab } from '@/types/browser';

interface TabBarProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNew: () => void;
}

const CLOSE_ANIMATION_MS = 200;

function getTabTitle(tab: BrowserTab): string {
  const url = tab.entries[tab.index];
  return url ? getTitleFromUrl(url) : 'Valora';
}

export function TabBar({ tabs, activeTabId, onSelect, onClose, onNew }: TabBarProps) {
  const [closingIds, setClosingIds] = useState<ReadonlySet<string>>(() => new Set());
  const timers = useRef(new Map<string, number>());

  const requestClose = (id: string) => {
    if (timers.current.has(id)) return;
    setClosingIds((prev) => new Set(prev).add(id));
    const timer = window.setTimeout(() => {
      timers.current.delete(id);
      setClosingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      onClose(id);
    }, CLOSE_ANIMATION_MS);
    timers.current.set(id, timer);
  };

  return (
    <div className="valora-glass mx-2 mt-2 flex items-end gap-1 overflow-x-auto rounded-2xl px-3 pt-2 text-slate-900 dark:text-slate-100">
      <div className="mb-1.5 mr-2 flex h-7 w-7 shrink-0 items-center justify-center">
        <Logo className="h-6 w-6" />
      </div>

      {tabs.map((tab) => {
        const active = tab.id === activeTabId;
        const closing = closingIds.has(tab.id);
        const title = getTabTitle(tab);
        return (
          <div
            key={tab.id}
            className={`valora-stretch group flex h-9 min-w-0 max-w-56 flex-1 items-center rounded-t-xl pl-3 pr-1 text-sm transition-colors valora-tab-enter ${
              closing ? 'valora-tab-leave' : ''
            } ${
              active
                ? 'bg-white/80 text-slate-900 shadow-[0_-1px_0_rgba(15,23,42,0.06)] dark:bg-white/15 dark:text-slate-100'
                : 'text-slate-700 hover:bg-white/40 dark:text-slate-300 dark:hover:bg-white/10'
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(tab.id)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left focus:outline-none"
            >
              <Globe className="h-4 w-4 shrink-0 text-sky-500" />
              <span className="truncate">{title}</span>
            </button>
            <button
              type="button"
              onClick={() => requestClose(tab.id)}
              aria-label={`Fermer l'onglet ${title}`}
              className="ml-1 rounded-md p-1 opacity-60 transition hover:bg-slate-900/10 hover:opacity-100 dark:hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onNew}
        aria-label="Nouvel onglet"
        className="valora-stretch mb-1 ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-700 transition hover:bg-white/40 dark:text-slate-300 dark:hover:bg-white/10"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
