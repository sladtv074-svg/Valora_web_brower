import type { ActivityId } from '@/lib/profile';

export interface QuickLink {
  label: string;
  url: string;
}

const SITES = {
  google: { label: 'Google', url: 'https://www.google.com' },
  youtube: { label: 'YouTube', url: 'https://www.youtube.com' },
  discord: { label: 'Discord', url: 'https://discord.com' },
  wikipedia: { label: 'Wikipedia', url: 'https://fr.wikipedia.org' },
  reddit: { label: 'Reddit', url: 'https://www.reddit.com' },
  twitch: { label: 'Twitch', url: 'https://www.twitch.tv' },
  linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com' },
} satisfies Record<string, QuickLink>;

export const QUICK_LINKS: QuickLink[] = [
  SITES.google,
  SITES.youtube,
  SITES.discord,
  SITES.wikipedia,
  SITES.reddit,
  SITES.twitch,
];

const ACTIVITY_QUICK_LINKS: Record<ActivityId, QuickLink[]> = {
  gamer: [SITES.twitch, SITES.discord, SITES.youtube, SITES.reddit, SITES.google, SITES.wikipedia],
  streamer: [SITES.twitch, SITES.youtube, SITES.discord, SITES.reddit, SITES.google, SITES.wikipedia],
  professionnel: [SITES.google, SITES.linkedin, SITES.wikipedia, SITES.youtube, SITES.reddit, SITES.discord],
  loisir: [SITES.youtube, SITES.reddit, SITES.wikipedia, SITES.twitch, SITES.google, SITES.discord],
};

export function getQuickLinks(activity: ActivityId | null): QuickLink[] {
  return activity ? ACTIVITY_QUICK_LINKS[activity] : QUICK_LINKS;
}

const DOMAIN_PATTERN = /^[^\s/]+\.[^\s]+$/;

export function toNavigableUrl(input: string): string {
  const value = input.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (DOMAIN_PATTERN.test(value)) return `https://${value}`;
  return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
}

export function toFavoriteUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(candidate);
    return parsed.hostname.includes('.') ? parsed.href : null;
  } catch {
    return null;
  }
}

export function getTitleFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
