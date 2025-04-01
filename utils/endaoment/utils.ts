import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto';

interface OAuthState {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
}

interface OAuthStateRecord {
  id: string;
  user_id: string;
  code_verifier: string;
  code_challenge: string;
  state: string;
  created_at: string;
}

interface SaveOAuthStateResult {
  data: OAuthStateRecord | null;
  error: Error | null;
}

interface GetOAuthStateResult {
  data: OAuthStateRecord | null;
  error: Error | null;
}

export const staticEndaomentURLs = {
    auth: 'https://auth.dev.endaoment.org',
    api: 'https://api.dev.endaoment.org',
    verify: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-login`,
    // redirect: process.env.NEXT_PUBLIC_APP_URL
    redirect: "http://localhost:5454/dev/token"
  };

export function toUrlSafe(base64: string) {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function generateCodeVerifier() {
  const randomBytes = crypto.randomBytes(32);
  crypto.getRandomValues(randomBytes);
  return toUrlSafe(Buffer.from(randomBytes).toString('base64'));
}

export async function generateCodeChallenge(codeVerifier: string) {
  const hash = crypto.createHash('sha256');
  hash.update(codeVerifier);
  return toUrlSafe(hash.digest('base64'));
}

export async function saveOAuthState({ codeVerifier, codeChallenge, state }: OAuthState): Promise<SaveOAuthStateResult> {
  const supabase = await createClient();
  
  // Get the current user's ID
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return {
      data: null,
      error: userError || new Error('User not authenticated')
    };
  }

  // Store the OAuth state in the oauth_states table
  const { data, error: insertError } = await supabase
    .from('oauth_states')
    .insert({
      user_id: user.id,
      code_verifier: codeVerifier,
      code_challenge: codeChallenge,
      state: state
    })
    .select()
    .single();

  if (insertError) {
    return {
      data: null,
      error: insertError
    };
  }

  return {
    data,
    error: null
  };
}

export async function getOAuthState(stateFromUrl: string): Promise<GetOAuthStateResult> {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: userError || new Error('User not authenticated')
    };
  }  

  // Fetch the OAuth state from the database
  const { data, error: queryError } = await supabase
    .from('oauth_states')
    .select('*')
    .eq('user_id', user.id)
    .eq('state', stateFromUrl)
    .single();

  if (queryError) {
    return {
      data: null,
      error: queryError
    };
  }

  return {
    data,
    error: null
  };
}
