import type { ReactNode } from 'react';
import { Layers, LogIn, LogOut, Moon, Settings, Sun, User, Zap } from 'lucide-react';
import { Toggle } from '@/components/ui/Toggle';
import { GLASS_OPACITY_MAX, GLASS_OPACITY_MIN } from '@/lib/profile';

interface SettingsPageProps {
  signedIn: boolean;
  email: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
  dark: boolean;
  onToggleDark: (value: boolean) => void;
  performance: boolean;
  onTogglePerformance: (value: boolean) => void;
  glassOpacity: number;
  onGlassOpacityChange: (value: number) => void;
}

interface SettingRowProps {
  icon: ReactNode;
  title: string;
  description: string;
  control: ReactNode;
}

function SettingRow({ icon, title, description, control }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="font-medium text-slate-900 dark:text-slate-100">{title}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
      </div>
      {control}
    </div>
  );
}

export function SettingsPage({
  signedIn,
  email,
  onSignIn,
  onSignOut,
  dark,
  onToggleDark,
  performance,
  onTogglePerformance,
  glassOpacity,
  onGlassOpacityChange,
}: SettingsPageProps) {
  return (
    <div className="h-full overflow-y-auto px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            <Settings className="h-7 w-7 text-sky-600 dark:text-sky-300" />
            Paramètres
          </h1>
        </header>

        <section className="space-y-3">
          <h2 className="px-1 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Compte</h2>
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.04]">
            <SettingRow
              icon={<User className="h-4 w-4" />}
              title={signedIn ? 'Connecté' : 'Mode invité'}
              description={signedIn && email ? email : 'Vos favoris restent sur cet appareil.'}
              control={
                signedIn ? (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                  >
                    <LogIn className="h-4 w-4" />
                    Se connecter
                  </button>
                )
              }
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="px-1 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Apparence et performance</h2>
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.04]">
            <SettingRow
              icon={dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              title="Thème sombre"
              description="Affiche Valora avec des couleurs sombres."
              control={<Toggle checked={dark} onChange={onToggleDark} label="Thème sombre" />}
            />
            <SettingRow
              icon={<Layers className="h-4 w-4" />}
              title="Opacité du liquid glass"
              description="Contrôle la transparence des onglets et de la barre latérale."
              control={
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={GLASS_OPACITY_MIN}
                    max={GLASS_OPACITY_MAX}
                    step={5}
                    value={glassOpacity}
                    onChange={(event) => onGlassOpacityChange(Number(event.target.value))}
                    aria-label="Opacité du liquid glass"
                    className="w-32 accent-sky-500"
                  />
                  <span className="w-10 text-right text-sm tabular-nums text-slate-600 dark:text-slate-300">
                    {glassOpacity}%
                  </span>
                </div>
              }
            />
            <SettingRow
              icon={<Zap className="h-4 w-4" />}
              title="Mode performance"
              description="Désactive les animations et les effets lumineux."
              control={<Toggle checked={performance} onChange={onTogglePerformance} label="Mode performance" />}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
