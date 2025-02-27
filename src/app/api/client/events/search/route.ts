import { NextResponse, NextRequest } from "next/server";
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { keyword, targetDate } = data;

  if (!keyword || !targetDate) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const result = await db.queryFromPath('search', data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}