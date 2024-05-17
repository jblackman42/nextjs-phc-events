import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

const encodeUrlForm = (obj: any): string => Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const tokenData = await axios({
      method: "POST",
      url: "https://my.pureheart.org/ministryplatformapi/oauth/connect/token",
      data: encodeUrlForm({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        ...data
      })
    })
      .then(response => response.data);

    return NextResponse.json(tokenData);
  } catch (error: any) {
    return NextResponse.json(error.response.data ?? { error: "Internal server error" }, { status: error.response.status ?? 500 });
  }
}