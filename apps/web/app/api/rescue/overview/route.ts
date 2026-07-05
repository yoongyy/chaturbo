import { NextResponse } from "next/server";
import { getDemoOverview } from "../../../../lib/demoOverview";
import { proxyToExternalApi } from "../../../../lib/serverApiProxy";
import { getWebSession } from "../../../../lib/webAuth";

export async function GET(request: Request) {
  const proxied = await proxyToExternalApi(request, "/api/rescue/overview");
  if (proxied) {
    return proxied;
  }

  const session = getWebSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(getDemoOverview(session));
}
