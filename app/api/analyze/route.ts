import { NextRequest, NextResponse } from "next/server";
import { scrape } from "@/lib/scraper";
import { analyzeStack, llmVisibility } from "@/lib/claude";
import { clampScore } from "@/lib/scoring";
import type { Brief } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

let lastRequestAt = 0;

export async function POST(req: NextRequest) {
  const now = Date.now();
  if (now - lastRequestAt < 5000) {
    return NextResponse.json(
      { error: "Please wait a few seconds between analyses." },
      { status: 429 }
    );
  }
  lastRequestAt = now;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { url, industry, size } = body || {};
  if (!url || typeof url !== "string" || !/^https?:\/\//.test(url)) {
    return NextResponse.json({ error: "Valid URL required" }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  try {
    const scraped = await scrape(url);
    const partial = scraped.ok
      ? null
      : `We couldn't fully scan this page (${scraped.error}). Analysis below is based on available signals.`;

    const stack = await analyzeStack({
      url,
      industry,
      size,
      scrapedText: scraped.text,
      platformSignals: scraped.platformSignals,
      title: scraped.title,
      metaDescription: scraped.metaDescription,
    });

    let visibility: any = null;
    try {
      visibility = await llmVisibility({
        companyName: stack.company_name,
        industry: stack.industry,
        url,
      });
    } catch {
      visibility = null;
    }

    const brief: Brief = {
      url,
      company_name: stack.company_name,
      industry: stack.industry,
      platform: stack.platform,
      platform_detail: stack.platform_detail,
      tech_stack_tags: stack.tech_stack_tags || [],
      ai_readiness_score: clampScore(stack.ai_readiness_score),
      ai_readiness_rationale: stack.ai_readiness_rationale,
      llm_visibility_score: clampScore(
        visibility?.visibility_score ?? stack.llm_visibility_score
      ),
      llm_visibility_narrative:
        visibility?.assessment || stack.llm_visibility_narrative,
      friction_opportunities: stack.friction_opportunities || [],
      competitive_gaps: stack.competitive_gaps || [],
      opportunity_tier: stack.opportunity_tier,
      opportunity_rationale: stack.opportunity_rationale,
      bd_opener: stack.bd_opener,
    };

    return NextResponse.json({ brief, partial });
  } catch (err: any) {
    console.error("analyze error:", err);
    return NextResponse.json(
      { error: "Analysis timed out. Try again or check that the URL is publicly accessible." },
      { status: 500 }
    );
  }
}
