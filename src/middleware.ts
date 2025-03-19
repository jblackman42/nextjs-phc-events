import { NextRequest, NextResponse } from 'next/server';
import { encrypt, decrypt, verifyJWT, parseJWT } from '@/lib/encryption';
import { AuthData, SessionData, userRoles } from '@/lib/types';
import { PROTECTED_ROUTES } from '@/lib/constants';
import { serialize } from 'cookie';


async function refreshAccessToken(refresh_token: string): Promise<AuthData> {
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
  
  const response: AuthData = auth;

  return response;
}

async function checkSession(sessionValue: string, request: NextRequest): Promise<boolean> {
  const url = request.nextUrl;
  const isProtectedRoute = PROTECTED_ROUTES.some(route => url.pathname.startsWith(route.path));

  if (!isProtectedRoute) {
    return true;
  }

  try {
    const sessionData = await decrypt(sessionValue);
    const { access_token, expiry_date, refresh_token, session_state }: SessionData = JSON.parse(sessionData);
    let currentToken = access_token;

    // if refresh token exists & access token is expired
    if (refresh_token && new Date() > new Date(expiry_date)) {
      console.log('refreshing access token');
      const newAuth: AuthData = await refreshAccessToken(refresh_token);
      currentToken = newAuth.access_token;
      
      const newSessionData = {
        ...newAuth,
        expiry_date: new Date(new Date().getTime() + newAuth.expires_in * 1000).toISOString(),
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
      request.headers.set('Set-Cookie', cookie);
    }

    const isTokenValid = await verifyJWT(currentToken);
    if (!isTokenValid) {
      return false;
    }
    
    const { sub } = parseJWT(currentToken);
    const userRolesResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/client/auth/user-roles`, {
      method: "POST",
      body: JSON.stringify({ sub })
    });
    if (!userRolesResponse.ok) {
      throw new Error('Failed to fetch user roles');
    }

    const userRolesData: userRoles = await userRolesResponse.json();

    const userRoles = userRolesData.Roles.map(role => role.Role_ID);
    const userGroups = userRolesData.User_Groups.map(group => group.User_Group_ID);

    const isUserInRequiredRole = userRoles.some(role => PROTECTED_ROUTES.some(route => route.requiredRoleID.includes(role)));
    const isUserInRequiredGroup = userGroups.some(group => PROTECTED_ROUTES.some(route => route.requiredGroupID.includes(group)));

    if (isUserInRequiredRole || isUserInRequiredGroup) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to check session:', error);
    return false;
  }
}

async function handleApiRequests(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const isSessionValid = !!sessionCookie && await checkSession(sessionCookie, request);
  // console.log('isSessionValid:', isSessionValid);

  const apiKey = request.headers.get('x-api-key');
  const isApiKeyValid = !!apiKey && apiKey === process.env.API_KEY;
  // console.log('isApiKeyValid:', isApiKeyValid);
  
  if (isApiKeyValid || isSessionValid) {
    return NextResponse.next();
  } else {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

async function handleOtherRequests(request: NextRequest) {
  const url = request.nextUrl;
  const isProtectedRoute = PROTECTED_ROUTES.some(route => url.pathname.startsWith(route.path));

  const sessionCookie = request.cookies.get('session')?.value;
  const isSessionValid = !!sessionCookie && await checkSession(sessionCookie, request);
  
  if (!isSessionValid && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  } else {
    return NextResponse.next();
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname.startsWith('/api')) {
    return handleApiRequests(request);
  } else {
    return handleOtherRequests(request);
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