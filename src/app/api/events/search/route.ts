import { NextResponse, NextRequest } from "next/server";
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get('keyword');
  // const startDate = request.nextUrl.searchParams.get('startDate');
  // const endDate = request.nextUrl.searchParams.get('endDate');

  // if (!startDate || !endDate) {
  //   return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
  // }

  try {
    // const result = await db.queryFromPath('search', { startDate, endDate });
    const result = await db.queryFromPath('search', { keyword });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}