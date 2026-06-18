import Anthropic from "@anthropic-ai/sdk";
import type { Brief, ScopeOutput } from "./types";

const MODEL = "claude-sonnet-4-6";

function client() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

function extractJSON(text: string): any {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fence ? fence[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no JSON in response");
  return JSON.parse(candidate.slice(start, end + 1));
}

const ANALYSIS_SYSTEM = `You are a senior solutions architect at Codal, a digital consultancy specializing in eCommerce, AI engineering, cloud infrastructure, and platform modernization. Codal's core capabilities are: Strategy & AI Strategy, Experience Design, Unified Commerce (Shopify/BigCommerce), Product Engineering (AI & Data, Cloud Infrastructure, Custom Development, QA).

You analyze prospect websites to identify commercial opportunities for Codal's services. You think like a VP of Engineering who also understands sales — your output becomes a BD brief that a sales rep uses to open a cold conversation with a CTO or VP Engineering.

Always return valid JSON only. No markdown, no explanation outside the JSON.`;

export async function analyzeStack(args: {
  url: string;
  industry?: string;
  size?: string;
  scrapedText: string;
  platformSignals: string[];
  title: string;
  metaDescription: string;
}): Promise<Omit<Brief, "url">> {
  const userPrompt = `Analyze this website as a Codal business development opportunity.

URL: ${args.url}
Industry hint: ${args.industry || "auto-detect"}
Company size: ${args.size || "unknown"}
Page title: ${args.title}
Meta description: ${args.metaDescription}

Page content (truncated):
${args.scrapedText || "(no content available — site may be JS-rendered or blocked external requests; reason from URL/domain knowledge)"}

Detected script/platform signals:
${args.platformSignals.join(", ") || "(none detected)"}

Return this exact JSON structure:
{
  "company_name": "string — extracted from page title or meta",
  "industry": "string — detected vertical",
  "platform": "string — detected tech stack (Shopify, BigCommerce, custom React, WordPress, etc.)",
  "platform_detail": "string — one sentence: what this platform means for their AI readiness and what Codal could do with it",
  "tech_stack_tags": ["string"],
  "ai_readiness_score": 0-100,
  "ai_readiness_rationale": "string — 1-2 sentences explaining the score",
  "llm_visibility_score": 0-100,
  "llm_visibility_narrative": "string — 2-3 sentences. Be specific and slightly provocative.",
  "friction_opportunities": [
    { "area": "string", "friction": "string", "ai_intervention": "string", "codal_capability": "AI & Data | Unified Commerce | Product Engineering | Experience Design | Strategy", "impact": "High | Medium | Low" }
  ],
  "competitive_gaps": ["string", "string", "string"],
  "opportunity_tier": "S | M | L",
  "opportunity_rationale": "string",
  "bd_opener": "string — 1-2 sentences, cold outreach to CTO/VP Eng. Reference something specific from their site. Do not be generic."
}`;

  const resp = await client().messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: ANALYSIS_SYSTEM,
    messages: [{ role: "user", content: userPrompt }],
  });
  const textBlock = resp.content.find((c) => c.type === "text") as any;
  return extractJSON(textBlock.text);
}

export async function llmVisibility(args: {
  companyName: string;
  industry: string;
  url: string;
}): Promise<{
  brand_known_to_llms: boolean;
  visibility_level: "Strong" | "Moderate" | "Weak" | "Unknown";
  visibility_score: number;
  assessment: string;
}> {
  const prompt = `You are assessing how visible a brand is in AI-generated search results.

Company: ${args.companyName}
Industry/category: ${args.industry}
URL: ${args.url}

Answer these questions based on your training knowledge:
1. If someone asks an AI assistant "who are the top vendors in [industry/category]?", does ${args.companyName} typically appear?
2. Is ${args.companyName} a well-known brand in its category, or relatively obscure?
3. What would a competitor with stronger LLM visibility have that ${args.companyName} may lack?

Return JSON only:
{
  "brand_known_to_llms": true | false,
  "visibility_level": "Strong | Moderate | Weak | Unknown",
  "visibility_score": 0-100,
  "assessment": "string — 2-3 sentences, specific and actionable"
}`;
  const resp = await client().messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });
  const textBlock = resp.content.find((c) => c.type === "text") as any;
  return extractJSON(textBlock.text);
}

export async function generateScope(args: {
  industry: string;
  size: string;
  challenges: string[];
  currentStack: string;
  timeline: string;
  budget: string;
  deliveryContext: string;
  flags: string[];
  hasInternalTeam: string;
}): Promise<ScopeOutput> {
  const prompt = `You are Codal's VP of Engineering advising on a new enterprise pursuit.

Codal operates three delivery hubs: Chicago US (architects, leads, client-facing), Lincoln UK (senior engineers, design), Ahmedabad India (engineering, QA, data). Target utilization is 75-85% for senior delivery roles. Codal's rate card tiers roughly: US leads ~$250/hr, UK senior engineers ~$175/hr, India engineers ~$95/hr.

Deal context:
- Industry: ${args.industry}
- Client size: ${args.size}
- Primary challenge: ${args.challenges.join(", ")}
- Current stack: ${args.currentStack}
- Timeline: ${args.timeline}
- Budget signal: ${args.budget}
- Delivery model: ${args.deliveryContext}
- Complexity flags: ${args.flags.join(", ") || "none"}
- Internal engineering team: ${args.hasInternalTeam}

Return JSON only:
{
  "architecture_recommendation": { "summary": "string", "key_components": ["string"] },
  "team_composition": [ { "role": "string", "hub": "Chicago (US) | Lincoln (UK) | Ahmedabad (India)", "count": number } ],
  "timeline_weeks": { "min": number, "max": number, "note": "string" },
  "estimated_engagement": "string — e.g. $1.2M–$1.8M",
  "risk_flags": [ { "risk": "string", "mitigation": "string" } ],
  "codal_capabilities": ["string"],
  "finalist_talking_points": ["string","string","string","string"]
}`;
  const resp = await client().messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });
  const textBlock = resp.content.find((c) => c.type === "text") as any;
  return extractJSON(textBlock.text);
}
