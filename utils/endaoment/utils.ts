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
  api: 'https://api.dev.endaoment.org/v1',
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

export async function refreshToken() {
  const supabase = await createClient();

  // get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: userError || new Error('User not authenticated')
    };
  }

  // get the user's Endaoment token
  const { data: tokenData, error: tokenError } = await supabase
    .from('endaoment_tokens')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (tokenError) {
    return {
      data: null,
      error: tokenError
    };
  }

  // package token data in search params
  const formData = new URLSearchParams();
  formData.append('grant_type', 'refresh_token');
  formData.append('refresh_token', tokenData.refresh_token);
  formData.append('scope', tokenData.scope);

  // request a new token from `/token`
  const response = await fetch(`${staticEndaomentURLs.auth}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.ENDAOMENT_CLIENT_ID}:${process.env.ENDAOMENT_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    console.error('Error refreshing token:', response.statusText);
    return {
      data: null,
      error: new Error('Failed to refresh token')
    };
  }

  // save the new token to the database
  const newTokenData = await response.json();
  const { access_token, token_type, refresh_token, expires_in, id_token, scope } = newTokenData;

  const { data: updatedTokenData, error: updateError } = await supabase
    .from('endaoment_tokens')
    .update({
      access_token,
      token_type,
      refresh_token,
      expires_in,
      id_token,
      scope,
    })
    .eq('user_id', user.id)
    .select()
    .single();

  if (updateError) {
    return {
      data: null,
      error: updateError
    };
  }

  return {
    data: updatedTokenData,
    error: null
  };
}
