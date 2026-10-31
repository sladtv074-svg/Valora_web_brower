export type SidebarItem = 'home' | 'favorites' | 'history' | 'downloads' | 'extensions' | 'settings';

export type BrowserView = 'tab' | Exclude<SidebarItem, 'home'>;

export interface SavedPage {
  id: string;
  title: string;
  url: string;
}

export interface PageRef {
  title: string;
  url: string;
}

export interface HistoryEntry {
  id: string;
  title: string;
  url: string;
  visitedAt: string;
}

export interface BrowserTab {
  id: string;
  entries: (string | null)[];
  index: number;
  reloadKey: number;
}
