import { NextResponse, NextRequest } from "next/server";
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const result = await db.query(`SELECT TOP 10 * FROM dp_Users`);
  return NextResponse.json(result, { status: 200 });
}