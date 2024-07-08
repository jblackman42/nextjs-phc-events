import { NextResponse, NextRequest } from "next/server";
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing required parameter: id" }, { status: 400 });
  }

  try {
    const [result] = await db.queryFromPath('event', { Event_ID: id });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}