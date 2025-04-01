/* This endpoint will verify the login and exchange the code for an authentication token. */

// This may need to become a route instead of an endpoint
// - User gets navigated to here from Endaoment
// - This is where we verify the state and code of their login
//   at which point we can save their Endaomend OAuth token and
//   render a success page for them .

import { createClient } from '@/utils/supabase/server'
import { NextResponse } from "next/server"
import { getOAuthState, staticEndaomentURLs } from "@/utils/endaoment/utils"

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") as string;
  const state = searchParams.get("state") as string;

  const { data, error } = await getOAuthState(state);

  if (error) {
    console.error('Error fetching OAuth state:', error);
    return NextResponse.json({ error: 'Failed to fetch OAuth state' }, { status: 500 });
  }

  const staticURL = `${staticEndaomentURLs.auth}/token`

  const formData = new URLSearchParams();
  formData.append('grant_type', 'authorization_code');
  formData.append('code', code);
  formData.append('code_verifier', data?.code_verifier as string);
  formData.append('redirect_uri', staticEndaomentURLs.redirect);

  const tokenResponse = await fetch(staticURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.ENDAOMENT_CLIENT_ID}:${process.env.ENDAOMENT_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: formData
  })

  if (!tokenResponse.ok) {
    console.error('Error fetching token:', tokenResponse.statusText);
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }

  const tokenData = await tokenResponse.json();
  console.log("tokenData", tokenData);

  // Save the token data to your database or session
  const { access_token, token_type, refresh_token, expires_in, id_token, scope } = tokenData;

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { data: tokenRecord, error: updateError } = await supabase
    .from('endaoment_tokens')
    .insert({
      user_id: user.id,
      access_token,
      token_type,
      refresh_token,
      expires_in,
      id_token,
      scope,
    })
    .select()
    .single();

  if (updateError) {
    console.error('Error saving token data:', updateError);
    return NextResponse.json({ error: 'Failed to save token data' }, { status: 500 });
  }

  console.log("Token record saved:", tokenRecord);

  // Redirect to dashboard after successful token save
  return NextResponse.redirect(new URL('/dashboard', request.url));
}

