import { NextResponse } from "next/server";
import {
  assignPhoneNumber,
  convertAuditTarget,
  createAuditTarget,
  createBusiness,
  crawlAuditTarget,
  generateAudit,
  getAuditTargetPayload,
  getBusinessPayload,
  getLeadPayload,
  getPublicAudit,
  listAuditTargets,
  listBusinesses,
  listLeads,
  sendLeadReply,
  updateBusiness,
  updateLead
} from "../../../../lib/demoDataStore";
import { proxyToExternalApi } from "../../../../lib/serverApiProxy";
import { getWebSession } from "../../../../lib/webAuth";

type RouteContext = { params: { path: string[] } };

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function GET(request: Request, context: RouteContext) {
  const proxied = await proxyToExternalApi(request, `/api/rescue/${context.params.path.join("/")}`);
  if (proxied) {
    return proxied;
  }

  const [resource, section, id, action] = context.params.path;
  const query = new URL(request.url).searchParams;
  const isPublicAudit = resource === "audits" && section === "public" && Boolean(id);
  const session = isPublicAudit ? null : getWebSession(request);

  if (!isPublicAudit && !session) {
    return jsonError("Unauthorized", 401);
  }

  try {
    if (resource === "businesses" && !section) {
      return NextResponse.json({ businesses: listBusinesses(session!) });
    }

    if (resource === "businesses" && section) {
      return NextResponse.json(getBusinessPayload(session!, section));
    }

    if (resource === "leads" && !section) {
      return NextResponse.json({
        leads: listLeads(session!, {
          businessId: query.get("businessId") || undefined,
          status: query.get("status") || undefined,
          source: query.get("source") || undefined
        })
      });
    }

    if (resource === "leads" && section) {
      return NextResponse.json(getLeadPayload(session!, section));
    }

    if (resource === "audits" && section === "targets" && !id) {
      return NextResponse.json({ targets: listAuditTargets(session!) });
    }

    if (resource === "audits" && section === "targets" && id) {
      return NextResponse.json(getAuditTargetPayload(session!, id));
    }

    if (resource === "audits" && section === "public" && id) {
      const payload = getPublicAudit(id);
      return payload ? NextResponse.json(payload) : jsonError("Audit not found", 404);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return jsonError(message, message.includes("not found") ? 404 : 400);
  }

  return jsonError("Not found", 404);
}

export async function POST(request: Request, context: RouteContext) {
  const proxied = await proxyToExternalApi(request, `/api/rescue/${context.params.path.join("/")}`);
  if (proxied) {
    return proxied;
  }

  const [resource, section, id, action] = context.params.path;
  const body = await readJson(request);
  const session = getWebSession(request);

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  try {
    if (resource === "businesses" && !section) {
      return NextResponse.json({ business: createBusiness(session, body as never) }, { status: 201 });
    }

    if (resource === "businesses" && section && id === "phone-number") {
      return NextResponse.json({ business: assignPhoneNumber(session, section, body as never) });
    }

    if (resource === "leads" && section && id === "reply") {
      const payload = body as { body?: string; to?: string };
      if (!payload?.body?.trim()) {
        return jsonError("Invalid reply payload");
      }
      return NextResponse.json(sendLeadReply(session, section, payload.body, payload.to), { status: 201 });
    }

    if (resource === "audits" && section === "targets" && !id) {
      if (session.role !== "admin") {
        return jsonError("Forbidden", 403);
      }
      return NextResponse.json({ target: createAuditTarget(session, body as never) }, { status: 201 });
    }

    if (resource === "audits" && section === "targets" && id && action === "crawl") {
      if (session.role !== "admin") {
        return jsonError("Forbidden", 403);
      }
      return NextResponse.json({ target: crawlAuditTarget(session, id) });
    }

    if (resource === "audits" && section === "targets" && id && action === "generate") {
      if (session.role !== "admin") {
        return jsonError("Forbidden", 403);
      }
      return NextResponse.json({ audit: generateAudit(session, id) }, { status: 201 });
    }

    if (resource === "audits" && section === "targets" && id && action === "convert") {
      if (session.role !== "admin") {
        return jsonError("Forbidden", 403);
      }
      return NextResponse.json({ business: convertAuditTarget(session, id) });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return jsonError(message, message.includes("not found") ? 404 : 400);
  }

  return jsonError("Not found", 404);
}

export async function PATCH(request: Request, context: RouteContext) {
  const proxied = await proxyToExternalApi(request, `/api/rescue/${context.params.path.join("/")}`);
  if (proxied) {
    return proxied;
  }

  const [resource, section] = context.params.path;
  const body = await readJson(request);
  const session = getWebSession(request);

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  try {
    if (resource === "businesses" && section) {
      return NextResponse.json({ business: updateBusiness(session, section, body as never) });
    }

    if (resource === "leads" && section) {
      return NextResponse.json({ lead: updateLead(session, section, body as never) });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return jsonError(message, message.includes("not found") ? 404 : 400);
  }

  return jsonError("Not found", 404);
}
