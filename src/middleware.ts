import { NextRequest, NextResponse } from 'next/server';
import { encrypt, decrypt } from './lib/encryption';
import axios from 'axios';
import { AuthData, SessionData } from './lib/types';
import { PROTECTED_ROUTES } from './lib/constants';
import { serialize } from 'cookie';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname.startsWith('/api')) {
    return handleApiRequests(request);
  } else {
    return handleOtherRequests(request);
  }
}

async function handleApiRequests(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

async function handleOtherRequests(request: NextRequest) {
  const response = NextResponse.next();
  const sessionCookie = request.cookies.get('session')?.value;
  const url = request.nextUrl;

  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => url.pathname.startsWith(route));

  // If no session and trying to access protected route, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If session exists, validate it
  if (sessionCookie) {
    try {
      const sessionData = await decrypt(sessionCookie);
      const { access_token, expires_in, expiry_date, refresh_token, session_state }: SessionData = JSON.parse(sessionData);

      if (!access_token || !expires_in) {
        if (isProtectedRoute) {
          return NextResponse.redirect(new URL('/login', request.url));
        }
        return response;
      }

      const expires_in_value = new Date(expiry_date);
      if (new Date() > expires_in_value && refresh_token) {
        return await refreshSessionToken(refresh_token, session_state);
      }
    } catch (error) {
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return response;
    }
  }

  return response;
}

async function refreshSessionToken(refresh_token: string, session_state: string) {
  try {
    // using fetch here because axios can't run in the Edge Runtime
    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/client/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refresh_token
      })
    });
    if (!authResponse.ok) {
      throw new Error('Failed to fetch auth status');
    }

    const auth: AuthData = await authResponse.json();

    const token_expire_date = new Date();
    token_expire_date.setSeconds(token_expire_date.getSeconds() + auth.expires_in);
    const newSessionData = {
      ...auth,
      expiry_date: token_expire_date.toISOString(),
      session_state: session_state,
    };

    const encryptedSessionData = await encrypt(JSON.stringify(newSessionData));
    const cookie = serialize('session', encryptedSessionData, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    });

    const response = NextResponse.next();
    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error) {
    console.error('Failed to refresh session token:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Protected routes
    '/create/:path*',
    // Existing matchers
    '/((?!_next/static|_next/image|.*\\.png$|callback$|api/client.*).*)'
  ],
};