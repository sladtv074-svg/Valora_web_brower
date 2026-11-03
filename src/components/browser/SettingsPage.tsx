import type { ReactNode } from 'react';
import { Layers, LogIn, LogOut, Moon, Settings, Sun, User } from 'lucide-react';
import { Toggle } from '@/components/ui/Toggle';
import { GLASS_OPACITY_MAX, GLASS_OPACITY_MIN } from '@/lib/profile';

interface SettingsPageProps {
  signedIn: boolean;
  email: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
  dark: boolean;
  onToggleDark: (value: boolean) => void;
  glassOpacity: number;
  onGlassOpacityChange: (value: number) => void;
}

interface SettingRowProps {
  icon: ReactNode;
  title: string;
  description: string;
  control: ReactNode;
}

interface SettingSectionProps {
  title: string;
  children: ReactNode;
}

function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="px-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 dark:text-slate-300">{title}</h2>
      <div className="valora-glass-card divide-y divide-white/30 rounded-3xl border border-white/40 dark:divide-white/10 dark:border-white/10">
        {children}
      </div>
    </section>
  );
}

function SettingRow({ icon, title, description, control }: SettingRowProps) {
  return (
    <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-sky-700 shadow-inner shadow-white/50 dark:bg-white/10 dark:text-sky-300 dark:shadow-none">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="font-medium text-slate-900 dark:text-slate-100">{title}</p>
          <p className="text-sm text-slate-700 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{control}</div>
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
  glassOpacity,
  onGlassOpacityChange,
}: SettingsPageProps) {
  return (
    <div className="h-full overflow-y-auto px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="valora-glass-card flex items-center gap-4 rounded-3xl border border-white/40 px-6 py-5 dark:border-white/10">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/30">
            <Settings className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Paramètres</h1>
            <p className="text-sm text-slate-700 dark:text-slate-400">Personnalisez Valora selon vos préférences.</p>
          </div>
        </header>

        <SettingSection title="Compte">
          <SettingRow
            icon={<User className="h-4 w-4" />}
            title={signedIn ? 'Connecté' : 'Mode invité'}
            description={signedIn && email ? email : 'Vos favoris restent sur cet appareil.'}
            control={
              signedIn ? (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex items-center gap-2 rounded-full border border-slate-400/60 bg-white/50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white/80 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSignIn}
                  className="flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-sky-600/30 transition hover:bg-sky-700"
                >
                  <LogIn className="h-4 w-4" />
                  Se connecter
                </button>
              )
            }
          />
        </SettingSection>

        <SettingSection title="Apparence">
          <SettingRow
            icon={dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            title="Thème sombre"
            description="Affiche Valora avec des couleurs sombres."
            control={<Toggle checked={dark} onChange={onToggleDark} label="Thème sombre" />}
          />
          <SettingRow
            icon={<Layers className="h-4 w-4" />}
            title="Opacité du liquid glass"
            description="Contrôle la transparence des panneaux et de la barre latérale."
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
                  className="w-36 accent-sky-500"
                />
                <span className="w-12 text-right text-sm font-medium tabular-nums text-slate-800 dark:text-slate-300">
                  {glassOpacity}%
                </span>
              </div>
            }
          />
        </SettingSection>
      </div>
    </div>
  );
}
