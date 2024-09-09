import { NextResponse, NextRequest } from "next/server";
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const QuestionID = request.nextUrl.searchParams.get('id') ?? '';

  if (isNaN(parseInt(QuestionID))) {
    return NextResponse.json({ error: "Missing or invalid parameter: id" }, { status: 400 });
  }

  try {
    const resultArr = await db.queryFromPath('question', { QuestionID: QuestionID });
    const result = resultArr.length ? resultArr[0] : {};
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}