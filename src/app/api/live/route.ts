// src/app/api/live/route.ts
import { getLiveVideo } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function GET() {
  const live = await getLiveVideo();
  return NextResponse.json(live || { message: "not live" });
}