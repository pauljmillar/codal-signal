export type Friction = {
  area: string;
  friction: string;
  ai_intervention: string;
  codal_capability: string;
  impact: "High" | "Medium" | "Low";
};

export type Brief = {
  company_name: string;
  url: string;
  industry: string;
  platform: string;
  platform_detail: string;
  tech_stack_tags: string[];
  ai_readiness_score: number;
  ai_readiness_rationale: string;
  llm_visibility_score: number;
  llm_visibility_narrative: string;
  friction_opportunities: Friction[];
  competitive_gaps: string[];
  opportunity_tier: "S" | "M" | "L";
  opportunity_rationale: string;
  bd_opener: string;
};

export type ScopeOutput = {
  architecture_recommendation: {
    summary: string;
    key_components: string[];
  };
  team_composition: { role: string; hub: string; count: number }[];
  timeline_weeks: { min: number; max: number; note: string };
  estimated_engagement: string;
  risk_flags: { risk: string; mitigation: string }[];
  codal_capabilities: string[];
  finalist_talking_points: string[];
};
