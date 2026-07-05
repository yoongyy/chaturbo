import { NextResponse } from "next/server";
import { getDemoOverview } from "../../../../lib/demoOverview";

export async function GET() {
  return NextResponse.json(getDemoOverview());
}
