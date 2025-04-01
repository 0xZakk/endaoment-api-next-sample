/* 
 * This endpoint will initiate the login process and return a URL to redirect the user to the Endaoment OAuth page
 */

import { NextResponse } from "next/server"
import { saveOAuthState, generateCodeVerifier, generateCodeChallenge, staticEndaomentURLs } from "@/utils/endaoment/utils"
import crypto from 'crypto';

export async function POST(request: Request) {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString('hex');

  const { data, error } = await saveOAuthState({ codeVerifier, codeChallenge, state });

  if (error) {
    console.error('Error saving OAuth state:', error);
    return NextResponse.json({ error: 'Failed to save OAuth state' }, { status: 500 });
  }

  const urlParams = new URLSearchParams()
  urlParams.append('response_type', 'code');
  urlParams.append('prompt', 'consent');
  urlParams.append(
    'scope',
    'openid offline_access accounts transactions profile'
  );
  urlParams.append('client_id', process.env.ENDAOMENT_CLIENT_ID as string);
  urlParams.append('redirect_uri', staticEndaomentURLs.redirect);
  urlParams.append('code_challenge', codeChallenge);
  urlParams.append('code_challenge_method', 'S256');
  urlParams.append('state', state);

  const urlToRedirect = `${staticEndaomentURLs.auth}/auth?${urlParams
    .toString()
    .replace(/\+/g, '%20')}`;

  return NextResponse.json({ url: urlToRedirect });
}
