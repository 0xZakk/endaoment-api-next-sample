import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { refreshToken } from '@/utils/endaoment/utils'

const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/forgot-password/check-email',
  '/auth/callback',
]
const ENDAOMENT_CONNECTION_PATHS = [
  '/dev/token',
  '/auth/endaoment',
  '/api/auth/init-login',
  '/api/auth/verify-login',
]

/*
 * Auth Redirect Middleware
 *
 * There are three conditions under which we want to redirect the user:
 *
 * 1. If they're visiting a public path, then we want to allow them to continue
 *    forward, whether or not they are logged in.
 *
 * 2. If they are visiting a gated, internal path, then we want to check that
 *    they are logged in first. If they are signed in to the app, then we move
 *    on to the next check. If they are not signed in, then we redirect them
 *    into the authentication flow for this app.
 *
 * 3. If they're visiting a private, internal route and are signed in but have
 *    not connected their Endaoment account, then we want to redirect them to
 *    the onboarding flow. That will connect their Endaoment account to their
 *    account in this application. If they are signed in and have connected
 *    their Endaoment account, then we let them through to the route.
 *
 * All that is to say, to visit a private route, a user must be both signed in
 * and have connected their Endaoment account. 
 *
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(`Middleware: ${pathname}`)

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('User:', user?.id, user?.email)

  // 1. If the user is visiting a public path, then we want to allow them to
  //    continue.
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // 2. If the user is visiting a gated path, then we want to first check that
  //    they are signed in.
  if (
    !user
  ) {
    // no user, redirect the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // 3. If the user is signed in but has not connected their Endaoment account,
  //   then we want to redirect them to the flow to connect their Endaoment
  // Get the user's Endaoment account data:
  const { data, error } = await supabase
    .from('endaoment_tokens')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error("Error fetching token data:", error);
  }

  // If the user has not connected their Endaoment account, then redirect them
  // to connect their Endaoment account.
  if (!(ENDAOMENT_CONNECTION_PATHS.includes(pathname)) && data && data.length === 0) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/endaoment'
    return NextResponse.redirect(url)
  }

  // If their Endaoment token has expired, then refresh it
  // Only attempt refresh if we're not on an Endaoment connection path
  if (!ENDAOMENT_CONNECTION_PATHS.includes(pathname) && data && data.length > 0) {
    const token = data[0];
    const tokenExpirationTime = new Date(token.inserted_at).getTime() + (token.expires_in * 1000);
    const currentTime = new Date().getTime();

    if (currentTime >= tokenExpirationTime) {
      console.log('Token expired, refreshing...');
      const { error: refreshError } = await refreshToken();
      
      if (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // If we can't refresh the token, redirect to re-authenticate
        const url = request.nextUrl.clone()
        url.pathname = '/auth/endaoment'
        return NextResponse.redirect(url)
      }
    }
  }

  // TODO: figure out what this means
  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
