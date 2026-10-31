import { ArrowRight, Globe, MessageSquare, Sparkles, type LucideIcon } from 'lucide-react';
import { WallpaperBackdrop } from '@/components/ui/WallpaperBackdrop';

interface AiFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: AiFeature[] = [
  {
    icon: MessageSquare,
    title: 'Une seule conversation',
    description: 'Posez votre question. Valora IA consulte les meilleurs modèles d\u2019IA et vous répond sous le nom Valora.',
  },
  {
    icon: Globe,
    title: 'Ouverture de sites',
    description: 'Demandez-lui d\u2019ouvrir n\u2019importe quel site ou de lancer une recherche, elle s\u2019en charge.',
  },
  {
    icon: Sparkles,
    title: 'Adaptée à vous',
    description: 'Les réponses tiennent compte de votre activité choisie pour aller droit au but.',
  },
];

interface AiIntroScreenProps {
  onContinue: () => void;
}

export function AiIntroScreen({ onContinue }: AiIntroScreenProps) {
  return (
    <WallpaperBackdrop>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="valora-fade-up w-full max-w-xl text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/30">
            <Sparkles className="h-7 w-7" />
          </span>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Découvrez Valora IA</h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slate-300">
            Un assistant intégré à votre navigateur, pensé pour aller plus vite.
          </p>

          <ul className="mt-10 space-y-3 text-left">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-white">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-300">{description}</span>
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onContinue}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-sky-400 px-8 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/50"
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </WallpaperBackdrop>
  );
}
