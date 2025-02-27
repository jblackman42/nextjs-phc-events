import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (isNaN(parseInt(id))) {
    return NextResponse.json({ error: "Missing required parameter: id" }, { status: 400 });
  }

  try {
    const resultArr = await db.queryFromPath('event', { Event_ID: id });
    const result = resultArr.length ? resultArr[0] : {};
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}