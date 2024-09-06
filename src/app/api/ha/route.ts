import { NextResponse, NextRequest } from "next/server";
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const year = request.nextUrl.searchParams.get('year') ?? '';
  const month = request.nextUrl.searchParams.get('month') ?? '';
  const congregation = request.nextUrl.searchParams.get('congregation') ?? '';

  if (isNaN(parseInt(year))) {
    return NextResponse.json({ error: "Missing or invalid parameter: year" }, { status: 400 });
  } else if (isNaN(parseInt(month))) {
    return NextResponse.json({ error: "Missing or invalid parameter: month" }, { status: 400 });
  } else if (isNaN(parseInt(congregation))) {
    return NextResponse.json({ error: "Missing or invalid parameter: congregation" }, { status: 400 });
  }

  try {
    const result = await db.queryFromPath('ha', { Year: year, Month: month, CongregationID: congregation });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}