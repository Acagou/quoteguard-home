import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createReport, QuoteContext, QuoteReport } from "@/lib/report";

export const runtime = "nodejs";

const safeLanguageRules = [
  "Do not diagnose the repair.",
  "Do not say the contractor is overcharging, scamming, definitely bad, or that a repair definitely costs a specific amount.",
  "Do not say the homeowner does not need a professional.",
  "Use language like: may need clarification, this item is vague, this could lead to extra charges, ask the contractor to confirm, this may require a licensed professional, and based on the quote text this is not clearly included.",
  "Do not provide dangerous DIY instructions."
].join(" ");

export async function POST(request: Request) {
  const body = (await request.json()) as {
    quoteText?: string;
    context?: QuoteContext;
    aiProvider?: "openai" | "claude" | "fallback";
    apiKey?: string;
    model?: string;
  };
  const quoteText = body.quoteText?.trim() ?? "";
  const context = normalizeContext(body.context);
  const aiProvider = body.aiProvider ?? "fallback";
  const userApiKey = body.apiKey?.trim();

  if (quoteText.length < 20) {
    return NextResponse.json({ error: "Quote text is required." }, { status: 400 });
  }

  const fallbackReport = createReport(quoteText, context);

  if (aiProvider === "fallback") {
    return NextResponse.json(fallbackReport);
  }

  try {
    const parsed = aiProvider === "claude"
      ? await createClaudeReport({ quoteText, context, fallbackReport, apiKey: userApiKey, model: body.model })
      : await createOpenAiReport({ quoteText, context, fallbackReport, apiKey: userApiKey, model: body.model });

    return NextResponse.json(normalizeAiReport(parsed, fallbackReport, context));
  } catch {
    return NextResponse.json(fallbackReport);
  }
}

async function createOpenAiReport({
  quoteText,
  context,
  fallbackReport,
  apiKey,
  model
}: {
  quoteText: string;
  context: QuoteContext;
  fallbackReport: QuoteReport;
  apiKey?: string;
  model?: string;
}) {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) return fallbackReport;

  const client = new OpenAI({ apiKey: key });
  const response = await client.responses.create({
    model: model?.trim() || process.env.OPENAI_MODEL || "gpt-4.1-mini",
    instructions: buildInstructions(),
    input: JSON.stringify({
      quoteText,
      context,
      baselineReport: fallbackReport
    })
  });

  return JSON.parse(response.output_text) as QuoteReport;
}

async function createClaudeReport({
  quoteText,
  context,
  fallbackReport,
  apiKey,
  model
}: {
  quoteText: string;
  context: QuoteContext;
  fallbackReport: QuoteReport;
  apiKey?: string;
  model?: string;
}) {
  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!key) return fallbackReport;

  const client = new Anthropic({ apiKey: key });
  const response = await client.messages.create({
    model: model?.trim() || process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
    max_tokens: 1800,
    system: buildInstructions(),
    messages: [
      {
        role: "user",
        content: JSON.stringify({
          quoteText,
          context,
          baselineReport: fallbackReport
        })
      }
    ]
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return JSON.parse(extractJson(text)) as QuoteReport;
}

function buildInstructions() {
  return `You are QuoteGuard Home. Return only valid JSON matching this TypeScript type: QuoteReport = { score:number; scoreLabel:string; scoreLines:{label:string;max:number;earned:number;}[]; safetyBadges:string[]; summary:string; redFlags:string[]; questions:string[]; message:string; note:string; usedAi:boolean; }. Apply this exact scoring rubric totaling 100 points: Work clear 20, Materials or parts identified 15, Labor and service details clear 15, Price and payment terms clear 15, Timeline cleanup completion clear 15, Warranty exclusions extra-charge terms clear 20. ${safeLanguageRules}`;
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) return trimmed;
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in model response.");
  return match[0];
}

function normalizeAiReport(parsed: QuoteReport, fallbackReport: QuoteReport, context: QuoteContext): QuoteReport {
  return {
    ...fallbackReport,
    ...parsed,
    scoreLines: parsed.scoreLines?.length ? parsed.scoreLines : fallbackReport.scoreLines,
    safetyBadges: context.sensitiveItems.length > 0 ? parsed.safetyBadges?.length ? parsed.safetyBadges : fallbackReport.safetyBadges : [],
    usedAi: true
  };
}

function normalizeContext(context?: QuoteContext): QuoteContext {
  const allowed = new Set(["water", "electrical", "gas", "roof", "mold", "structural"]);
  return {
    repairType: context?.repairType?.trim() || "Home repair",
    location: context?.location?.trim() || "Not provided",
    urgency: context?.urgency?.trim() || "Not provided",
    sensitiveItems: (context?.sensitiveItems ?? []).filter((item) => allowed.has(item))
  };
}
