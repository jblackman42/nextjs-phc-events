import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { encrypt } from "@/lib/encryption";

export async function POST(req: NextRequest) {
  const sessionData = await req.text();
  const encryptedSessionData = await encrypt(sessionData);

  const cookie = serialize('session', encryptedSessionData, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/'
  })

  const response = new NextResponse(JSON.stringify({ message: 'Successfully set cookie!' }), { status: 200 });
  response.headers.set('Set-Cookie', cookie);

  return response;
}