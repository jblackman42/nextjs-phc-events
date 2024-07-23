import { NextResponse, NextRequest } from "next/server";
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const startDate = request.nextUrl.searchParams.get('startDate');
  const endDate = request.nextUrl.searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
  }

  console.log(startDate, endDate);

  try {
    const result = await db.queryFromPath('events', { startDate, endDate });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}