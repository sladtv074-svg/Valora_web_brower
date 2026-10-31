import type { LucideIcon } from 'lucide-react';

interface EmptyPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyPage({ icon: Icon, title, description }: EmptyPageProps) {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
          <Icon className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}
