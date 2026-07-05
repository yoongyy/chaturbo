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
  const [resource, section, id, action] = context.params.path;
  const query = new URL(request.url).searchParams;

  try {
    if (resource === "businesses" && !section) {
      return NextResponse.json({ businesses: listBusinesses() });
    }

    if (resource === "businesses" && section) {
      return NextResponse.json(getBusinessPayload(section));
    }

    if (resource === "leads" && !section) {
      return NextResponse.json({
        leads: listLeads({
          businessId: query.get("businessId") || undefined,
          status: query.get("status") || undefined,
          source: query.get("source") || undefined
        })
      });
    }

    if (resource === "leads" && section) {
      return NextResponse.json(getLeadPayload(section));
    }

    if (resource === "audits" && section === "targets" && !id) {
      return NextResponse.json({ targets: listAuditTargets() });
    }

    if (resource === "audits" && section === "targets" && id) {
      return NextResponse.json(getAuditTargetPayload(id));
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
  const [resource, section, id, action] = context.params.path;
  const body = await readJson(request);

  try {
    if (resource === "businesses" && !section) {
      return NextResponse.json({ business: createBusiness(body as never) }, { status: 201 });
    }

    if (resource === "businesses" && section && id === "phone-number") {
      return NextResponse.json({ business: assignPhoneNumber(section, body as never) });
    }

    if (resource === "leads" && section && id === "reply") {
      const payload = body as { body?: string; to?: string };
      if (!payload?.body?.trim()) {
        return jsonError("Invalid reply payload");
      }
      return NextResponse.json(sendLeadReply(section, payload.body, payload.to), { status: 201 });
    }

    if (resource === "audits" && section === "targets" && !id) {
      return NextResponse.json({ target: createAuditTarget(body as never) }, { status: 201 });
    }

    if (resource === "audits" && section === "targets" && id && action === "crawl") {
      return NextResponse.json({ target: crawlAuditTarget(id) });
    }

    if (resource === "audits" && section === "targets" && id && action === "generate") {
      return NextResponse.json({ audit: generateAudit(id) }, { status: 201 });
    }

    if (resource === "audits" && section === "targets" && id && action === "convert") {
      return NextResponse.json({ business: convertAuditTarget(id) });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return jsonError(message, message.includes("not found") ? 404 : 400);
  }

  return jsonError("Not found", 404);
}

export async function PATCH(request: Request, context: RouteContext) {
  const [resource, section] = context.params.path;
  const body = await readJson(request);

  try {
    if (resource === "businesses" && section) {
      return NextResponse.json({ business: updateBusiness(section, body as never) });
    }

    if (resource === "leads" && section) {
      return NextResponse.json({ lead: updateLead(section, body as never) });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return jsonError(message, message.includes("not found") ? 404 : 400);
  }

  return jsonError("Not found", 404);
}
