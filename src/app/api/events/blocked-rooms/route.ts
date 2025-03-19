import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const LocationID = Number(searchParams.get('LocationID'));
  const PatternString = searchParams.get('PatternString');
  const EventLengthMinutes = Number(searchParams.get('EventLengthMinutes'));
  const SetupTime = Number(searchParams.get('SetupTime'));
  const CleanupTime = Number(searchParams.get('CleanupTime'));

  if (!PatternString || 
      EventLengthMinutes === null || EventLengthMinutes === undefined || 
      SetupTime === null || SetupTime === undefined || 
      CleanupTime === null || CleanupTime === undefined) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const result = await db.queryFromPath('blocked-rooms', { LocationID, PatternString, EventLengthMinutes, SetupTime, CleanupTime });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}