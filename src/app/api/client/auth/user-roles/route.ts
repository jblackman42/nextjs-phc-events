import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const { sub } = await request.json();

  if (!sub) {
    return NextResponse.json({ error: "Missing required parameter: sub" }, { status: 400 });
  }

  try {
    const resultArr = await db.queryFromPath('user-roles', { sub });
    const result = resultArr.length ? resultArr[0] : {};
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}