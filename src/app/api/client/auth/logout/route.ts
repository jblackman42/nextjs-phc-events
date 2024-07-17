import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/encryption";
import { SessionData } from "@/lib/type";
import axios from "axios";
import qs from "qs";

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({ message: "User Already Logged Out" });
  }

  try {
    const sessionData = await decrypt(sessionCookie);
    const { access_token }: SessionData = JSON.parse(sessionData);

    await axios({
      method: "POST",
      url: `https://my.pureheart.org/ministryplatformapi/oauth/connect/revocation`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic ZGV2X3Rlc3Rpbmc6THptVms2c2VSOFhOVXo5NFRLa0dRSE1EUzdFZGhnVUVydG1Ya2Vyd3Y5UjhOOFJLbg=="
      },
      data: qs.stringify({
        token: access_token,
        token_type_hint: "access_token"
      })
    });

    const response = NextResponse.json({ messago: "logout successful" });
    response.headers.set("Set-Cookie", "session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict");
    return response;
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json({ error: "unknown session" }, { status: 400 });
  }
}