import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    return NextResponse.json({ success: true, slug, timestamp: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to log view" }, { status: 500 });
  }
}
