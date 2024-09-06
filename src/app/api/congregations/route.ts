import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.queryFromPath('congregations');
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}