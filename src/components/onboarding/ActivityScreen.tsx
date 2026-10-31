import { useState } from 'react';
import { ArrowRight, Briefcase, Gamepad2, Radio, Sofa, type LucideIcon } from 'lucide-react';
import { WallpaperBackdrop } from '@/components/ui/WallpaperBackdrop';
import type { ActivityId } from '@/lib/profile';

interface ActivityOption {
  id: ActivityId;
  label: string;
  description: string;
  icon: LucideIcon;
}

const OPTIONS: ActivityOption[] = [
  { id: 'gamer', label: 'Gamer', description: 'Jeux, clans et tournois', icon: Gamepad2 },
  { id: 'streamer', label: 'Streamer', description: 'Diffusion en direct et communauté', icon: Radio },
  { id: 'professionnel', label: 'Professionnel', description: 'Travail, veille et outils', icon: Briefcase },
  { id: 'loisir', label: 'Loisir', description: 'Vidéos, lectures et découvertes', icon: Sofa },
];

interface ActivityScreenProps {
  onContinue: (activity: ActivityId) => void;
}

export function ActivityScreen({ onContinue }: ActivityScreenProps) {
  const [selected, setSelected] = useState<ActivityId | null>(null);

  return (
    <WallpaperBackdrop>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="valora-fade-up w-full max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">Personnalisation</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Quelle est votre activité sur internet ?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slate-300">
            Valora adapte vos raccourcis et vos suggestions à votre usage.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {OPTIONS.map(({ id, label, description, icon: Icon }) => {
              const active = selected === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelected(id)}
                  aria-pressed={active}
                  className={`group flex items-center gap-4 rounded-2xl border p-5 text-left backdrop-blur-md transition duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/40 ${
                    active
                      ? 'border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-500/20'
                      : 'border-white/10 bg-slate-900/60 hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-slate-900/80'
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${
                      active ? 'bg-sky-400 text-slate-950' : 'bg-white/10 text-sky-300 group-hover:bg-white/15'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold text-white">{label}</span>
                    <span className="mt-0.5 block text-sm text-slate-300">{description}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => selected && onContinue(selected)}
            disabled={!selected}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-sky-400 px-8 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/50 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-40"
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </WallpaperBackdrop>
  );
}
