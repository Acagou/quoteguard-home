export type SensitiveRepair = "water" | "electrical" | "gas" | "roof" | "mold" | "structural";

export type QuoteContext = {
  repairType: string;
  location: string;
  urgency: string;
  sensitiveItems: SensitiveRepair[];
};

export type ScoreLine = {
  label: string;
  max: number;
  earned: number;
};

export type QuoteReport = {
  score: number;
  scoreLabel: string;
  scoreLines: ScoreLine[];
  safetyBadges: string[];
  summary: string;
  redFlags: string[];
  questions: string[];
  message: string;
  note: string;
  usedAi?: boolean;
};

const SCORING_RULES = [
  { key: "work", label: "Work to be performed is clear", max: 20 },
  { key: "materials", label: "Materials or parts are identified", max: 15 },
  { key: "labor", label: "Labor and service details are clear", max: 15 },
  { key: "price", label: "Price and payment terms are clear", max: 15 },
  { key: "timeline", label: "Timeline, cleanup, and completion expectations are clear", max: 15 },
  { key: "warranty", label: "Warranty, exclusions, and extra-charge terms are clear", max: 20 }
] as const;

export const sampleQuote =
  "Repair drywall damage in hallway. Patch damaged area as needed. Sand and prep. Materials included. Labor included. Total: $425. Additional work extra if needed.";

export const scoreExplanation =
  "How this score is calculated: QuoteGuard checks whether the quote clearly explains the work, materials, labor, price, timeline, cleanup, warranty, exclusions, and possible extra charges. A low score does not mean the contractor is bad. It means the quote needs more detail before you approve it.";

export const importantNote =
  "Important note: This report does not judge the contractor or diagnose the repair. It only reviews how clearly the quote explains the proposed work so you can ask better questions before approving it.";

export function createReport(quoteText: string, context: QuoteContext): QuoteReport {
  const quote = quoteText.toLowerCase();
  const scoreLines = SCORING_RULES.map((rule) => ({
    label: rule.label,
    max: rule.max,
    earned: scoreRule(rule.key, quote, rule.max)
  }));

  const score = scoreLines.reduce((sum, item) => sum + item.earned, 0);
  const safetyBadges = context.sensitiveItems.map((item) => safetyLabels[item]);
  const redFlags = buildRedFlags(quote, context);
  const questions = buildQuestions(context);
  const summary = buildSummary(score, context);

  return {
    score,
    scoreLabel: getScoreLabel(score),
    scoreLines,
    safetyBadges,
    summary,
    redFlags,
    questions,
    message: buildContractorMessage(context, questions),
    note: importantNote,
    usedAi: false
  };
}

export function createSampleReport(): QuoteReport {
  return {
    ...createReport(sampleQuote, {
      repairType: "Drywall repair",
      location: "Not provided",
      urgency: "Not urgent",
      sensitiveItems: []
    }),
    score: 52,
    scoreLabel: "Needs clarification",
    scoreLines: [
      { label: "Work to be performed is clear", max: 20, earned: 11 },
      { label: "Materials or parts are identified", max: 15, earned: 7 },
      { label: "Labor and service details are clear", max: 15, earned: 9 },
      { label: "Price and payment terms are clear", max: 15, earned: 10 },
      { label: "Timeline, cleanup, and completion expectations are clear", max: 15, earned: 2 },
      { label: "Warranty, exclusions, and extra-charge terms are clear", max: 20, earned: 13 }
    ],
    redFlags: [
      "\"Patch damaged area as needed\" does not define the repair area or what counts as complete.",
      "Materials are included, but the quote does not name the material type, finish level, primer, or paint responsibility.",
      "\"Additional work extra if needed\" could lead to extra charges unless the approval process is confirmed first.",
      "Timeline, cleanup, and completion expectations are not clearly stated."
    ],
    questions: [
      "What exact area of the hallway is included in the $425 price?",
      "Does the price include texture matching, primer, paint, and cleanup?",
      "What conditions would count as additional work, and will you get written approval before adding charges?",
      "When will the work start, how long should it take, and what does finished mean?"
    ]
  };
}

function scoreRule(key: (typeof SCORING_RULES)[number]["key"], quote: string, max: number) {
  const tests: Record<typeof key, string[]> = {
    work: ["repair", "replace", "install", "patch", "remove", "prep", "sand"],
    materials: ["material", "parts", "included", "drywall", "paint", "fixture", "pipe", "shingle"],
    labor: ["labor", "service", "prep", "sand", "install", "haul"],
    price: ["total", "$", "deposit", "payment", "due"],
    timeline: ["timeline", "start", "complete", "completion", "cleanup", "clean up", "days"],
    warranty: ["warranty", "guarantee", "exclude", "exclusion", "extra", "change order", "additional"]
  };
  const hits = tests[key].filter((word) => quote.includes(word)).length;
  if (hits === 0) return key === "timeline" ? 0 : Math.round(max * 0.25);
  if (hits === 1) return Math.round(max * 0.55);
  return Math.min(max, Math.round(max * 0.8));
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Clear with minor checks";
  if (score >= 60) return "Some details missing";
  return "Needs clarification";
}

const safetyLabels: Record<SensitiveRepair, string> = {
  water: "Water damage",
  electrical: "Electrical",
  gas: "Gas",
  roof: "Roof",
  mold: "Mold",
  structural: "Structural"
};

function buildRedFlags(quote: string, context: QuoteContext) {
  const flags = [
    "Confirm exactly what work is included before approving the quote.",
    "Ask what could lead to extra charges and whether written approval is required first.",
    "Confirm cleanup, timeline, and what the contractor considers complete."
  ];

  if (!quote.includes("warranty") && !quote.includes("guarantee")) {
    flags.push("Warranty or workmanship coverage is not clearly stated.");
  }
  if (!quote.includes("cleanup") && !quote.includes("clean up")) {
    flags.push("Cleanup and debris removal are not clearly included.");
  }
  if (context.sensitiveItems.length > 0) {
    flags.unshift(
      "Safety-sensitive repair selected: ask whether permits, licensed trades, inspection, or remediation standards apply. Do not rely on unclear verbal assumptions."
    );
  }

  return flags;
}

function buildQuestions(context: QuoteContext) {
  const questions = [
    "Can you confirm the exact work included in this price?",
    "What materials, parts, brands, or finish level are included?",
    "What is excluded, and what would require an added charge?",
    "Will I receive written approval before any extra work is started?",
    "What is the expected start date, completion point, cleanup responsibility, and warranty?"
  ];

  if (context.sensitiveItems.length > 0) {
    questions.unshift(
      "Because this may involve " +
        context.sensitiveItems.map((item) => safetyLabels[item].toLowerCase()).join(", ") +
        ", should a licensed professional, permit, inspection, or specialist be involved?"
    );
  }

  return questions;
}

function buildSummary(score: number, context: QuoteContext) {
  const repair = context.repairType || "repair";
  const base =
    score < 60
      ? "Based on the quote text, several important details are not clearly included."
      : "Based on the quote text, some helpful details are included, but there are still items to confirm.";
  const safety =
    context.sensitiveItems.length > 0
      ? " Because this may involve a safety-sensitive repair, ask whether a licensed professional, permit, inspection, or specialist is needed."
      : "";
  return `${base} Before approving this ${repair.toLowerCase()} quote, ask the contractor to confirm scope, exclusions, timeline, cleanup, and added-charge rules in writing.${safety}`;
}

function buildContractorMessage(context: QuoteContext, questions: string[]) {
  return `Hi, thanks for the quote. Before I approve it, can you please confirm a few details in writing?\n\n${questions
    .slice(0, 5)
    .map((question) => `- ${question}`)
    .join("\n")}\n\nI am not questioning the quality of your work. I just want to make sure I understand what is included before moving forward.`;
}
