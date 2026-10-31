import { supabase } from '@/lib/supabase';

const GENERIC_AUTH_ERROR = 'Une erreur est survenue. R\u00e9essayez.';

function describeAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'Email ou mot de passe incorrect.';
  if (/already registered|already exists/i.test(message)) return 'Un compte existe d\u00e9j\u00e0 avec cet email.';
  if (/password/i.test(message) && /least|character|short/i.test(message)) {
    return 'Le mot de passe doit contenir au moins 6 caract\u00e8res.';
  }
  if (/fetch|network/i.test(message)) return 'Connexion impossible. V\u00e9rifiez votre r\u00e9seau.';
  return GENERIC_AUTH_ERROR;
}

export async function signIn(email: string, password: string): Promise<string | null> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? describeAuthError(error.message) : null;
}

export async function signUp(
  email: string,
  password: string,
): Promise<{ error: string | null; hasSession: boolean }> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: describeAuthError(error.message), hasSession: false };
  return { error: null, hasSession: data.session !== null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
