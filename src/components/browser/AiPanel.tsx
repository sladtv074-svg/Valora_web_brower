import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Loader2, Send, Sparkles, X } from 'lucide-react';
import { getAssistantReply } from '@/lib/assistant';
import type { ActivityId } from '@/lib/profile';
import { askValoraAi, type AiTurn } from '@/lib/valoraAi';

interface AiPanelProps {
  hasPage: boolean;
  activity: ActivityId | null;
  onClose: () => void;
  onNavigate: (input: string) => void;
  onBookmark: () => void;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTIONS = [
  'Quelle heure est-il ?',
  'Ouvre YouTube',
  'Explique-moi ce qu\u2019est un VPN',
  'Ajoute cette page aux favoris',
];

const INTRO_ID = 0;
const HISTORY_LENGTH = 10;
const UNAVAILABLE_TEXT =
  'Valora IA est indisponible pour le moment. Vous pouvez toujours me demander d\u2019ouvrir un site ou de faire un calcul.';

const INTRO_MESSAGE: ChatMessage = {
  id: INTRO_ID,
  role: 'assistant',
  text: 'Bonjour ! Je suis Valora IA. Posez-moi une question, demandez-moi d\u2019ouvrir un site ou de lancer une recherche.',
};

export function AiPanel({ hasPage, activity, onClose, onNavigate, onBookmark }: AiPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const nextId = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, pending]);

  const appendMessages = (...items: ChatMessage[]) => setMessages((prev) => [...prev, ...items]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || pending) return;

    const userMessage: ChatMessage = { id: nextId.current++, role: 'user', text: message };
    setInput('');

    const localReply = getAssistantReply(message, { hasPage });
    if (!localReply.unmatched) {
      appendMessages(userMessage, { id: nextId.current++, role: 'assistant', text: localReply.text });
      if (localReply.action?.type === 'navigate') onNavigate(localReply.action.input);
      if (localReply.action?.type === 'bookmark') onBookmark();
      return;
    }

    const history: AiTurn[] = [...messages, userMessage]
      .filter((item) => item.id !== INTRO_ID)
      .slice(-HISTORY_LENGTH)
      .map((item) => ({ role: item.role, content: item.text }));
    appendMessages(userMessage);
    setPending(true);

    try {
      const result = await askValoraAi(history, activity);
      appendMessages({ id: nextId.current++, role: 'assistant', text: result.text || 'Voici ce que je vous propose.' });
      if (result.openUrl) onNavigate(result.openUrl);
    } catch {
      appendMessages({ id: nextId.current++, role: 'assistant', text: UNAVAILABLE_TEXT });
    } finally {
      setPending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send(input);
  };

  return (
    <aside className="absolute inset-y-0 right-0 z-20 flex w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl shadow-slate-900/10 sm:static sm:z-auto sm:w-80 sm:shadow-none dark:border-white/10 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Valora IA</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Mode IA actif</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le mode IA"
          className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'rounded-br-md bg-sky-600 text-white'
                  : 'rounded-bl-md bg-slate-100 text-slate-900 dark:bg-white/[0.07] dark:text-slate-100'
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}
        {pending && (
          <div className="flex justify-start" role="status">
            <p className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2.5 text-sm text-slate-600 dark:bg-white/[0.07] dark:text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              Valora IA réfléchit...
            </p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void send(suggestion)}
              className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800 transition hover:bg-sky-100 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 p-3 dark:border-white/10">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Posez une question"
          aria-label="Message pour Valora IA"
          disabled={pending}
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/15 disabled:opacity-60 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <button
          type="submit"
          aria-label="Envoyer"
          disabled={!input.trim() || pending}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </aside>
  );
}
