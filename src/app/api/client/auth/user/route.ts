import { decrypt } from '@/lib/encryption';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { session } = await req.json();
    const sessionData = await decrypt(session);
    const { access_token, token_type } = JSON.parse(sessionData);

    const user = await axios({
      method: "GET",
      url: `https://my.pureheart.org/ministryplatformapi/oauth/connect/userinfo`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token_type} ${access_token}`
      }
    }).then(response => response.data);

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(null);
  }
}