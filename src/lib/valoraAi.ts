import { supabase } from '@/lib/supabase';
import type { ActivityId } from '@/lib/profile';
import { toNavigableUrl } from '@/lib/urls';

export interface AiTurn {
  role: 'user' | 'assistant';
  content: string;
}

const OPEN_DIRECTIVE = /\[OUVRIR:\s*([^\]\s]+)\s*\]/i;

interface ValoraAiResult {
  text: string;
  openUrl: string | null;
}

function isReplyPayload(value: unknown): value is { reply: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { reply?: unknown }).reply === 'string'
  );
}

export async function askValoraAi(messages: AiTurn[], activity: ActivityId | null): Promise<ValoraAiResult> {
  const { data, error } = await supabase.functions.invoke<unknown>('valora-ai', {
    body: { messages, activity },
  });
  if (error || !isReplyPayload(data)) {
    throw new Error('Valora IA est indisponible pour le moment.');
  }

  const directive = data.reply.match(OPEN_DIRECTIVE);
  const text = data.reply.replace(OPEN_DIRECTIVE, '').trim();
  return {
    text,
    openUrl: directive ? toNavigableUrl(directive[1]) : null,
  };
}
