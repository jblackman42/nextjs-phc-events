import { NextResponse, NextRequest } from "next/server";
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {

  try {
    const result = await db.queryFromPath('equipment');
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}