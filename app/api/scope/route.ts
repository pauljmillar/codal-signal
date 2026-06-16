import { NextRequest, NextResponse } from "next/server";
import { generateScope } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Server is missing ANTHROPIC_API_KEY." }, { status: 500 });
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const scope = await generateScope({
      industry: body.industry || "Unknown",
      size: body.size || "Unknown",
      challenges: Array.isArray(body.challenges) ? body.challenges : [],
      currentStack: body.currentStack || "",
      timeline: body.timeline || "Unknown",
      budget: body.budget || "Unknown",
      deliveryContext: body.deliveryContext || "Unknown",
      flags: Array.isArray(body.flags) ? body.flags : [],
      hasInternalTeam: body.hasInternalTeam || "Unknown",
    });
    return NextResponse.json({ scope });
  } catch (err: any) {
    console.error("scope error:", err);
    return NextResponse.json({ error: "Generation failed. Try again." }, { status: 500 });
  }
}
