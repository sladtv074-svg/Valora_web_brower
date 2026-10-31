import { ExternalLink } from 'lucide-react';
import { getTitleFromUrl } from '@/lib/urls';

interface PageViewProps {
  url: string;
  reloadKey: number;
}

export function PageView({ url, reloadKey }: PageViewProps) {
  const title = getTitleFromUrl(url);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2 dark:border-white/10 dark:bg-slate-900">
        <p className="min-w-0 truncate text-sm text-slate-600 dark:text-slate-300">
          <span className="font-medium text-slate-900 dark:text-slate-100">{title}</span>
          <span className="hidden sm:inline"> · Certains sites ne s’affichent pas dans Valora : utilisez le bouton à droite.</span>
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-500/20 dark:text-sky-300"
        >
          Ouvrir dans un nouvel onglet
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <iframe
        key={reloadKey}
        src={url}
        title={title}
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        className="min-h-0 w-full flex-1 bg-white"
      />
    </div>
  );
}
