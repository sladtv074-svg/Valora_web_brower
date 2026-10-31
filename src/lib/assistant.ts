import { QUICK_LINKS } from '@/lib/urls';

export type AssistantAction = { type: 'navigate'; input: string } | { type: 'bookmark' };

export interface AssistantReply {
  text: string;
  action?: AssistantAction;
  unmatched?: true;
}

interface AssistantContext {
  hasPage: boolean;
}

const GREETING_PATTERN = /^(bonjour|bonsoir|salut|hello|coucou|hey)\b/;
const HELP_PATTERN = /\b(aide|aider|help|que peux tu faire|fonctionnalites)\b/;
const THANKS_PATTERN = /^(merci|thanks)\b/;
const OPEN_PATTERN = /^(?:ouvre|ouvrir|va sur|aller sur|lance|lancer)\s+(.+)$/;
const SEARCH_PATTERN = /^(?:recherche|rechercher|cherche|chercher|trouve|trouver)\s+(.+)$/;
const CALCULATION_PATTERN = /^(?:combien (?:fait |font )?)?(-?\d+(?:[.,]\d+)?)\s*([+\-x*/])\s*(-?\d+(?:[.,]\d+)?)\s*\??$/;
const TIME_PATTERN = /\bheure\b/;
const DATE_PATTERN = /\b(date|jour)\b/;
const BOOKMARK_PATTERN = /\b(favori|favoris|marque page|ajoute)\b/;

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveTarget(name: string): string {
  const match = QUICK_LINKS.find((link) => normalize(link.label) === name);
  return match ? match.url : name;
}

function calculate(left: string, operator: string, right: string): number | null {
  const a = Number(left.replace(',', '.'));
  const b = Number(right.replace(',', '.'));
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case 'x':
    case '*':
      return a * b;
    case '/':
      return b === 0 ? null : a / b;
    default:
      return null;
  }
}

export function getAssistantReply(message: string, context: AssistantContext): AssistantReply {
  const text = normalize(message);
  if (!text) {
    return { text: 'Posez-moi une question ou demandez-moi d\u2019ouvrir un site.' };
  }

  if (GREETING_PATTERN.test(text)) {
    return { text: 'Bonjour ! Comment puis-je vous aider aujourd\u2019hui ?' };
  }

  if (HELP_PATTERN.test(text)) {
    return {
      text: 'Je peux ouvrir un site (\u00ab ouvre YouTube \u00bb), lancer une recherche (\u00ab recherche recettes de cuisine \u00bb), faire un petit calcul (\u00ab 12 x 4 \u00bb), donner l\u2019heure ou la date et ajouter la page actuelle \u00e0 vos favoris.',
    };
  }

  if (THANKS_PATTERN.test(text)) {
    return { text: 'Avec plaisir !' };
  }

  const open = text.match(OPEN_PATTERN);
  if (open) {
    return {
      text: `J\u2019ouvre ${open[1]} pour vous.`,
      action: { type: 'navigate', input: resolveTarget(open[1]) },
    };
  }

  const search = text.match(SEARCH_PATTERN);
  if (search) {
    return {
      text: `Je lance une recherche pour \u00ab ${search[1]} \u00bb.`,
      action: { type: 'navigate', input: resolveTarget(search[1]) },
    };
  }

  const calculation = text.match(CALCULATION_PATTERN);
  if (calculation) {
    const result = calculate(calculation[1], calculation[2], calculation[3]);
    if (result === null || !Number.isFinite(result)) {
      return { text: 'Je ne peux pas faire ce calcul.' };
    }
    const formatted = Number(result.toFixed(6)).toLocaleString('fr-FR');
    return { text: `Le r\u00e9sultat est ${formatted}.` };
  }

  if (TIME_PATTERN.test(text)) {
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return { text: `Il est ${time}.` };
  }

  if (DATE_PATTERN.test(text)) {
    const date = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return { text: `Nous sommes le ${date}.` };
  }

  if (BOOKMARK_PATTERN.test(text)) {
    if (!context.hasPage) {
      return { text: 'Ouvrez d\u2019abord une page pour pouvoir l\u2019ajouter \u00e0 vos favoris.' };
    }
    return { text: 'C\u2019est fait, la page actuelle est dans vos favoris.', action: { type: 'bookmark' } };
  }

  return { text: '', unmatched: true };
}
