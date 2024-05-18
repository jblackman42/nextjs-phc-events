import { NextResponse, NextRequest } from "next/server";
import { db } from '@/lib/db';
import axios from "axios";

export async function GET(request: NextRequest, { params }: { params: { guid: string } }) {
  try {
    const { guid } = params;
    const [{ Unique_Name }] = await db.query(`SELECT TOP 1 Unique_Name FROM dp_Files WHERE Table_Name ='Contacts' AND Record_ID = (SELECT TOP 1 Contact_ID FROM Contacts WHERE Contact_GUID = '${guid}')`);

    const response = await axios.get(`https://my.pureheart.org/ministryplatformapi/files/${Unique_Name}`, {
      responseType: 'arraybuffer' // Ensure the response is treated as binary data
    });

    const imageBuffer = response.data;
    const headers = new Headers();
    headers.set('Content-Type', 'image/jpeg');

    return new NextResponse(imageBuffer, {
      headers,
    });
  } catch (error: any) {
    return NextResponse.json(error);
  }
}