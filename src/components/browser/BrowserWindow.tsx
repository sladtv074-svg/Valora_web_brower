import { useState, type CSSProperties } from 'react';
import { Download, Puzzle } from 'lucide-react';
import { AuthScreen } from '@/components/AuthScreen';
import { AiPanel } from '@/components/browser/AiPanel';
import { EmptyPage } from '@/components/browser/EmptyPage';
import { FavoritesPage } from '@/components/browser/FavoritesPage';
import { HistoryPage } from '@/components/browser/HistoryPage';
import { HomePage } from '@/components/browser/HomePage';
import { PageView } from '@/components/browser/PageView';
import { SettingsPage } from '@/components/browser/SettingsPage';
import { Sidebar } from '@/components/browser/Sidebar';
import { TabBar } from '@/components/browser/TabBar';
import { Toolbar } from '@/components/browser/Toolbar';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useAvailableDownloads } from '@/hooks/useAvailableDownloads';
import { useBrowserData } from '@/hooks/useBrowserData';
import { signOut } from '@/lib/authActions';
import { getQuickLinks, getTitleFromUrl, toNavigableUrl } from '@/lib/urls';
import type { BrowserTab, BrowserView, SidebarItem } from '@/types/browser';

function createTab(): BrowserTab {
  return { id: crypto.randomUUID(), entries: [null], index: 0, reloadKey: 0 };
}

export function BrowserWindow() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const { activity, glassOpacity, setGlassOpacity } = useProfile(userId);
  const downloads = useAvailableDownloads();
  const {
    favorites,
    history,
    error: dataError,
    saveFavorite,
    deleteFavorite,
    recordVisit,
    clearHistory,
  } = useBrowserData(userId);

  const [tabs, setTabs] = useState<BrowserTab[]>(() => [createTab()]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [view, setView] = useState<BrowserView>('tab');
  const [aiOpen, setAiOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [performance, setPerformance] = useState(true);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const currentUrl = activeTab.entries[activeTab.index];
  const canGoBack = activeTab.index > 0;
  const canGoForward = activeTab.index < activeTab.entries.length - 1;
  const isFavorite = currentUrl !== null && favorites.some((favorite) => favorite.url === currentUrl);
  const activeSidebarItem: SidebarItem | null =
    view === 'tab' ? (currentUrl === null ? 'home' : null) : view;

  const updateActiveTab = (update: (tab: BrowserTab) => BrowserTab) => {
    setTabs((prev) => prev.map((tab) => (tab.id === activeTabId ? update(tab) : tab)));
  };

  const navigateTo = (target: string | null) => {
    updateActiveTab((tab) => ({
      ...tab,
      entries: [...tab.entries.slice(0, tab.index + 1), target],
      index: tab.index + 1,
    }));
    setView('tab');
    if (target) void recordVisit({ title: getTitleFromUrl(target), url: target });
  };

  const navigateToInput = (input: string) => navigateTo(toNavigableUrl(input));

  const goBack = () => updateActiveTab((tab) => ({ ...tab, index: Math.max(0, tab.index - 1) }));
  const goForward = () =>
    updateActiveTab((tab) => ({ ...tab, index: Math.min(tab.entries.length - 1, tab.index + 1) }));
  const reload = () => updateActiveTab((tab) => ({ ...tab, reloadKey: tab.reloadKey + 1 }));

  const selectTab = (id: string) => {
    setActiveTabId(id);
    setView('tab');
  };

  const openNewTab = () => {
    const tab = createTab();
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
    setView('tab');
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) {
      const fresh = createTab();
      setTabs([fresh]);
      setActiveTabId(fresh.id);
      return;
    }
    const index = tabs.findIndex((tab) => tab.id === id);
    const remaining = tabs.filter((tab) => tab.id !== id);
    if (id === activeTabId) setActiveTabId(remaining[Math.max(0, index - 1)].id);
    setTabs(remaining);
  };

  const addCurrentToFavorites = () => {
    if (currentUrl === null || isFavorite) return;
    void saveFavorite({ title: getTitleFromUrl(currentUrl), url: currentUrl });
  };

  const toggleFavorite = () => {
    if (currentUrl === null) return;
    const existing = favorites.find((favorite) => favorite.url === currentUrl);
    if (existing) {
      void deleteFavorite(existing.id);
    } else {
      addCurrentToFavorites();
    }
  };

  const handleSidebarSelect = (item: SidebarItem) => {
    if (item === 'home') {
      if (view !== 'tab' || currentUrl !== null) navigateTo(null);
      return;
    }
    setView(item);
  };

  const pageKey = `${activeTab.id}-${view}-${currentUrl ?? 'home'}`;

  const renderMain = () => {
    switch (view) {
      case 'tab':
        return currentUrl === null ? (
          <HomePage
            quickLinks={getQuickLinks(activity)}
            onNavigate={navigateToInput}
            onOpenFavorites={() => setView('favorites')}
            performance={performance}
            onTogglePerformance={setPerformance}
          />
        ) : (
          <PageView url={currentUrl} reloadKey={activeTab.reloadKey} />
        );
      case 'favorites':
        return (
          <FavoritesPage
            favorites={favorites}
            error={dataError}
            signedIn={user !== null}
            onOpen={navigateTo}
            onSave={saveFavorite}
            onDelete={deleteFavorite}
            onSignIn={() => setAuthOpen(true)}
          />
        );
      case 'history':
        return (
          <HistoryPage
            history={history}
            error={dataError}
            onOpen={navigateTo}
            onClear={() => void clearHistory()}
          />
        );
      case 'downloads':
        return (
          <EmptyPage
            icon={Download}
            title="Aucun téléchargement"
            description="Vos téléchargements récents s'afficheront dans cette liste."
          />
        );
      case 'extensions':
        return (
          <EmptyPage
            icon={Puzzle}
            title="Aucune extension installée"
            description="La boutique d'extensions Valora arrive bientôt."
          />
        );
      case 'settings':
        return (
          <SettingsPage
            signedIn={user !== null}
            email={user?.email ?? null}
            onSignIn={() => setAuthOpen(true)}
            onSignOut={() => void signOut()}
            dark={dark}
            onToggleDark={setDark}
            performance={performance}
            onTogglePerformance={setPerformance}
            glassOpacity={glassOpacity}
            onGlassOpacityChange={setGlassOpacity}
          />
        );
    }
  };

  return (
    <div
      className={`h-screen ${dark ? 'dark' : ''} ${performance ? 'valora-perf' : ''}`}
      style={{ '--glass-alpha': glassOpacity / 100 } as CSSProperties}
    >
      <div className="valora-wallpaper flex h-full flex-col text-slate-900 dark:text-slate-100">
        <TabBar
          tabs={tabs}
          activeTabId={activeTab.id}
          onSelect={selectTab}
          onClose={closeTab}
          onNew={openNewTab}
        />
        <Toolbar
          address={currentUrl ?? ''}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          hasPage={currentUrl !== null}
          isFavorite={isFavorite}
          aiOpen={aiOpen}
          signedIn={user !== null}
          onBack={goBack}
          onForward={goForward}
          onReload={reload}
          onHome={() => navigateTo(null)}
          onSubmitAddress={navigateToInput}
          onToggleFavorite={toggleFavorite}
          onToggleAi={() => setAiOpen((open) => !open)}
          onOpenDownloads={() => setView('downloads')}
          onOpenAccount={() => setAuthOpen(true)}
        />
        <div className="flex min-h-0 flex-1">
          <Sidebar
            activeItem={activeSidebarItem}
            onSelect={handleSidebarSelect}
            dark={dark}
            onToggleDark={() => setDark((value) => !value)}
            downloads={downloads}
          />
          <main className="relative min-w-0 flex-1 overflow-hidden">
            <div key={pageKey} className="valora-page-in h-full">
              {renderMain()}
            </div>
          </main>
          {aiOpen && (
            <AiPanel
              hasPage={currentUrl !== null}
              activity={activity}
              onClose={() => setAiOpen(false)}
              onNavigate={navigateToInput}
              onBookmark={addCurrentToFavorites}
            />
          )}
        </div>
      </div>

      {authOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <AuthScreen onDone={() => setAuthOpen(false)} />
        </div>
      )}
    </div>
  );
}
