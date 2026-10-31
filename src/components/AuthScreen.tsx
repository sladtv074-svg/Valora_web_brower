import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { WallpaperBackdrop } from '@/components/ui/WallpaperBackdrop';
import { signIn, signUp } from '@/lib/authActions';

type AuthMode = 'signin' | 'signup';

interface AuthScreenProps {
  onDone: () => void;
}

const INPUT_CLASS =
  'w-full rounded-xl border border-white/15 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-400/20';

export function AuthScreen({ onDone }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isSignUp = mode === 'signup';

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);
    const trimmedEmail = email.trim();

    if (isSignUp) {
      const result = await signUp(trimmedEmail, password);
      setSubmitting(false);
      if (result.error) {
        setError(result.error);
      } else if (result.hasSession) {
        onDone();
      } else {
        setNotice('Compte cr\u00e9\u00e9. Connectez-vous avec vos identifiants.');
        setPassword('');
        setMode('signin');
      }
      return;
    }

    const errorMessage = await signIn(trimmedEmail, password);
    setSubmitting(false);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      onDone();
    }
  };

  return (
    <WallpaperBackdrop>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="valora-fade-up w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <Logo className="h-16 w-16" />
            <h1 className="mt-5 text-2xl font-semibold text-white">
              {isSignUp ? 'Cr\u00e9ez votre compte' : 'Bon retour sur Valora'}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Facultatif. Un compte synchronise vos favoris et votre historique entre vos appareils.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-1 rounded-xl bg-white/5 p-1">
            {(['signin', 'signup'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => switchMode(option)}
                aria-pressed={mode === option}
                className={`rounded-lg py-2 text-sm font-medium transition ${
                  mode === option ? 'bg-sky-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                {option === 'signin' ? 'Connexion' : 'Cr\u00e9er un compte'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="text-sm font-medium text-slate-200">
                Adresse e-mail
              </label>
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="vous@exemple.fr"
                className={INPUT_CLASS}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="auth-password" className="text-sm font-medium text-slate-200">
                Mot de passe
              </label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="6 caract\u00e8res minimum"
                className={INPUT_CLASS}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-200">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-sky-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignUp ? 'Cr\u00e9er mon compte' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>

      <div className="flex justify-center pb-10">
        <button
          type="button"
          onClick={onDone}
          className="rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-medium text-slate-200 backdrop-blur transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/30"
        >
          Ignorer
        </button>
      </div>
    </WallpaperBackdrop>
  );
}
