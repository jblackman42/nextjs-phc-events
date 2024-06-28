import { NextResponse, NextRequest } from "next/server";
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get('keyword');
  const targetDate = request.nextUrl.searchParams.get('targetDate') ?? new Date();
  try {
    const result = await db.queryFromPath('search', { keyword, targetDate });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}