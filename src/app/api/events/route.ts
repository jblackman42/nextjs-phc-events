import { NextResponse, NextRequest } from "next/server";
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { startDate, endDate } = data;
  // const startDate = request.nextUrl.searchParams.get('startDate');
  // const endDate = request.nextUrl.searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
  }

  try {
    const result = await db.queryFromPath('events', data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}