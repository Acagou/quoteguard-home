import OpenAI from "openai";
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
  const body = (await request.json()) as { quoteText?: string; context?: QuoteContext };
  const quoteText = body.quoteText?.trim() ?? "";
  const context = normalizeContext(body.context);

  if (quoteText.length < 20) {
    return NextResponse.json({ error: "Quote text is required." }, { status: 400 });
  }

  const fallbackReport = createReport(quoteText, context);

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(fallbackReport);
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      instructions: `You are QuoteGuard Home. Return only valid JSON matching this TypeScript type: QuoteReport = { score:number; scoreLabel:string; scoreLines:{label:string;max:number;earned:number;}[]; safetyBadges:string[]; summary:string; redFlags:string[]; questions:string[]; message:string; note:string; usedAi:boolean; }. Apply this exact scoring rubric totaling 100 points: Work clear 20, Materials or parts identified 15, Labor and service details clear 15, Price and payment terms clear 15, Timeline cleanup completion clear 15, Warranty exclusions extra-charge terms clear 20. ${safeLanguageRules}`,
      input: JSON.stringify({
        quoteText,
        context,
        baselineReport: fallbackReport
      })
    });

    const parsed = JSON.parse(response.output_text) as QuoteReport;
    return NextResponse.json({
      ...fallbackReport,
      ...parsed,
      scoreLines: parsed.scoreLines?.length ? parsed.scoreLines : fallbackReport.scoreLines,
      safetyBadges: context.sensitiveItems.length > 0 ? parsed.safetyBadges?.length ? parsed.safetyBadges : fallbackReport.safetyBadges : [],
      usedAi: true
    });
  } catch {
    return NextResponse.json(fallbackReport);
  }
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
