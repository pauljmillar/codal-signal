import * as cheerio from "cheerio";

export type ScrapeResult = {
  ok: boolean;
  title: string;
  metaDescription: string;
  text: string;
  scripts: string[];
  links: string[];
  platformSignals: string[];
  error?: string;
};

const PLATFORM_HINTS: { pattern: RegExp; label: string }[] = [
  { pattern: /cdn\.shopify\.com|myshopify/i, label: "Shopify" },
  { pattern: /bigcommerce/i, label: "BigCommerce" },
  { pattern: /wp-content|wp-includes/i, label: "WordPress" },
  { pattern: /salesforce|force\.com/i, label: "Salesforce" },
  { pattern: /hubspot/i, label: "HubSpot" },
  { pattern: /magento/i, label: "Magento" },
  { pattern: /next\/static|__NEXT_DATA__/i, label: "Next.js" },
  { pattern: /react/i, label: "React" },
  { pattern: /angular/i, label: "Angular" },
  { pattern: /vue/i, label: "Vue" },
  { pattern: /webflow/i, label: "Webflow" },
  { pattern: /squarespace/i, label: "Squarespace" },
  { pattern: /gatsby/i, label: "Gatsby" },
  { pattern: /contentful/i, label: "Contentful" },
  { pattern: /sanity/i, label: "Sanity" },
  { pattern: /algolia/i, label: "Algolia" },
  { pattern: /segment\.com|segment\.io/i, label: "Segment" },
  { pattern: /googletagmanager|gtm\.js/i, label: "GTM" },
  { pattern: /optimizely/i, label: "Optimizely" },
  { pattern: /klaviyo/i, label: "Klaviyo" },
  { pattern: /epic/i, label: "Epic" },
];

export async function scrape(url: string): Promise<ScrapeResult> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CodalSignalBot/1.0; +https://codal.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      return emptyResult(`HTTP ${res.status}`);
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $("title").first().text().trim();
    const metaDescription =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";
    $("script, style, noscript").remove();
    const text = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);
    const scripts: string[] = [];
    cheerio
      .load(html)("script[src]")
      .each((_, el) => {
        const src = $(el).attr("src");
        if (src) scripts.push(src);
      });
    const links: string[] = [];
    $('link[rel="stylesheet"], link[rel="preload"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href) links.push(href);
    });
    const signalsSet = new Set<string>();
    const blob = html.slice(0, 80000);
    for (const { pattern, label } of PLATFORM_HINTS) {
      if (pattern.test(blob)) signalsSet.add(label);
    }
    return {
      ok: true,
      title,
      metaDescription,
      text,
      scripts: scripts.slice(0, 30),
      links: links.slice(0, 30),
      platformSignals: Array.from(signalsSet),
    };
  } catch (e: any) {
    return emptyResult(e?.message || "fetch failed");
  }
}

function emptyResult(error: string): ScrapeResult {
  return {
    ok: false,
    title: "",
    metaDescription: "",
    text: "",
    scripts: [],
    links: [],
    platformSignals: [],
    error,
  };
}
