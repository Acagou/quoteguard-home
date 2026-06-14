export type Article = {
  slug: string;
  title: string;
  description: string;
  exampleQuote: string;
  explanation: string;
  redFlags: string[];
  questions: string[];
};

export const articles: Article[] = [
  {
    slug: "what-should-a-home-repair-quote-include",
    title: "What Should a Home Repair Quote Include?",
    description: "A plain-English checklist for reviewing a home repair quote before approving the work.",
    exampleQuote: "Replace damaged bathroom vanity faucet. Labor and basic parts included. Total: $375.",
    explanation:
      "A useful quote should explain the work, materials, labor, price, timeline, cleanup, warranty, exclusions, and how extra work is approved. The goal is not to challenge the contractor. The goal is to understand what you are agreeing to.",
    redFlags: [
      "The quote says materials are included but does not identify them.",
      "The quote does not explain cleanup, warranty, or exclusions.",
      "Extra charges are mentioned without an approval process."
    ],
    questions: [
      "What exact materials or parts are included?",
      "What is not included in this price?",
      "Will extra work require written approval first?"
    ]
  },
  {
    slug: "contractor-quote-red-flags",
    title: "Contractor Quote Red Flags",
    description: "Vague terms that may need clarification before you say yes.",
    exampleQuote: "Repair issue as needed. Materials included. Additional work billed separately.",
    explanation:
      "A red flag does not mean a contractor is bad. It means the quote may leave room for misunderstandings. Vague scope, undefined materials, unclear payment terms, and open-ended extra charges are worth clarifying.",
    redFlags: [
      "\"As needed\" without a clear limit.",
      "\"Additional work extra\" without saying what triggers it.",
      "No timeline, cleanup, warranty, or completion standard."
    ],
    questions: [
      "What conditions would make the price change?",
      "Can you define what is included in the quoted scope?",
      "Can you send any exclusions in writing?"
    ]
  },
  {
    slug: "drywall-repair-quote-checklist",
    title: "Drywall Repair Quote Checklist",
    description: "What to look for in a drywall repair quote.",
    exampleQuote:
      "Repair drywall damage in hallway. Patch damaged area as needed. Sand and prep. Materials included. Labor included. Total: $425.",
    explanation:
      "Drywall quotes are easier to approve when they state the repair area, patch size, texture matching, sanding, primer, paint, cleanup, and whether hidden damage could change the price.",
    redFlags: [
      "Patch size or repair area is not defined.",
      "Texture, primer, paint, or cleanup are unclear.",
      "Hidden damage or extra work rules are not explained."
    ],
    questions: [
      "Does this include texture matching, primer, paint, and cleanup?",
      "What exact wall area is included?",
      "What happens if hidden damage is found?"
    ]
  },
  {
    slug: "questions-to-ask-before-hiring-a-handyman",
    title: "Questions to Ask Before Hiring a Handyman",
    description: "Simple questions that help homeowners understand the quote before approving it.",
    exampleQuote: "Complete small repairs around kitchen. Labor included. Materials extra.",
    explanation:
      "Before hiring, ask practical questions about scope, materials, price, timeline, cleanup, warranty, and whether any part of the job requires a licensed trade. For safety-sensitive work, a licensed professional may be needed.",
    redFlags: [
      "Multiple tasks are grouped together without itemized details.",
      "Materials are extra but no estimate or approval process is given.",
      "The work may involve electrical, gas, roof, mold, water, or structural issues."
    ],
    questions: [
      "Can you itemize what is included?",
      "How will materials be selected and approved?",
      "Does any part of this require a licensed professional, permit, or inspection?"
    ]
  }
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
