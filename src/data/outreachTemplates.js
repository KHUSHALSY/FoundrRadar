/**
 * High-conversion outreach templates for Executives, Founders,
 * Conference Directors, BD Leaders, and Community Managers.
 */

export const OUTREACH_TEMPLATES = [
  {
    id: "linkedin-connect",
    name: "LinkedIn Connection Note (<300 chars)",
    badge: "Strictly <300 Chars",
    category: "LinkedIn",
    description: "Ultra-crisp, personalized note designed for >65% acceptance rates without sales fluff.",
    generate: (vars) => {
      const founderFirstName = vars.founderName ? vars.founderName.split(" ")[0] : "there";
      const org = vars.organizationName || "our organization";
      const topic = vars.topic || "AI & Tech Growth";
      const initiative = vars.initiativeName || "Global Tech Summit";

      const text = `Hi ${founderFirstName}, love your work scaling ${vars.company || "your venture"}. Reaching out from ${org} regarding our upcoming ${initiative} focused on ${topic}. Would love to share details & connect!`;

      if (text.length > 298) {
        return `Hi ${founderFirstName}, impressed by what you're building at ${vars.company || "your startup"} in ${topic}. Reaching out regarding an executive initiative with ${org}. Would love to connect!`;
      }
      return text;
    }
  },
  {
    id: "formal-speaker-email",
    name: "Keynote / Conference Speaker Invitation",
    badge: "Executive Invitation",
    category: "Email",
    description: "Polished formal invitation for annual summits, flagship conferences, and executive panels.",
    generate: (vars) => {
      const founderFirstName = vars.founderName ? vars.founderName.split(" ")[0] : "Sir/Ma'am";
      const org = vars.organizationName || "The Tech Leaders Network";
      const initiative = vars.initiativeName || "Global Innovation Conclave 2026";
      const topic = vars.topic || "Scaling Enterprise Technology & AI";
      const date = vars.eventDate || "October 22, 2026";
      const mode = vars.eventMode || "In-person (Grand Hall) & Live Executive Broadcast";
      const reach = vars.reach || "1,800+ attendees including 350+ founders and senior executives";

      return {
        subject: `[Keynote Invitation] Speaking on ${topic} @ ${initiative}`,
        body: `Dear ${vars.founderName || "Founder"},

I hope this email finds you well.

On behalf of the leadership and organizing committee at ${org}, I would like to formally invite you as a distinguished Keynote Speaker for our upcoming flagship event, "${initiative}".

• Event Date: ${date}
• Format & Venue: ${mode}
• Target Audience: ${reach}
• Proposed Session Focus: "${topic}: Architecting the Next Decade"
• Time Commitment: 30-minute keynote followed by a 15-minute moderated discussion

Why Your Voice Matters to Our Audience:
We have been closely following your leadership journey with ${vars.company || "your company"}. Your practical perspectives on navigating market headwinds, building high-performing teams, and driving sustainable innovation in ${topic} would provide immense strategic clarity to our delegates.

Logistics & Speaker Experience:
Our team will coordinate end-to-end travel, VIP logistics, and dedicated green room accommodations. Additionally, our media team will provide high-definition multi-cam recordings and edited highlight assets for your personal distribution.

Could you let us know if your calendar permits a session on ${date}? We are delighted to coordinate with your executive office to accommodate your schedule.

I have attached the event prospectus for your reference. We look forward to the possibility of hosting you.

Warm regards,

${vars.senderName || "[Your Name]"}
${vars.senderTitle || "Head of Speaker Relations"} | ${org}
Direct: ${vars.senderPhone || "+1 (555) 019-2834"} | Email: ${vars.senderEmail || "speaker-relations@organization.com"}
Website: ${vars.website || "https://organization.com"}`
      };
    }
  },
  {
    id: "partnership-email",
    name: "Strategic Partnership & B2B Intro",
    badge: "High Commercial Value",
    category: "Partnership",
    description: "Crisp B2B collaboration email highlighting clear mutual upside and zero fluff.",
    generate: (vars) => {
      const founderFirstName = vars.founderName ? vars.founderName.split(" ")[0] : "there";
      const org = vars.organizationName || "Our Team";
      const topic = vars.topic || "Market Expansion";

      return {
        subject: `Strategic Collaboration: ${org} x ${vars.company || "Your Company"}`,
        body: `Hi ${founderFirstName},

Hope you are having a productive week.

I have been tracking ${vars.company || "your team's"} recent progress in ${topic}—phenomenal execution on recent product launches.

I am reaching out from ${org}. We specialize in accelerating distribution and high-intent customer acquisition for leading platforms in your vertical.

Given our shared audience profile, we see an immediate opportunity to collaborate on:
1. Joint co-marketing and reciprocal ecosystem distribution.
2. Integrating our partner network with ${vars.company || "your product"} to drive qualified pipeline.

Could we schedule a concise 10-minute introductory call next Tuesday or Thursday to explore if an alliance makes strategic sense right now?

Best regards,

${vars.senderName || "[Your Name]"}
${vars.senderTitle || "VP of Strategic Alliances"} | ${org}
Phone: ${vars.senderPhone || "+1 (555) 019-2834"}`
      };
    }
  },
  {
    id: "investor-pitch-teaser",
    name: "Investor / Angel Pitch Teaser",
    badge: "Fast 30-sec Read",
    category: "Fundraising",
    description: "Hook-first, metric-driven angel and venture capital introductory note.",
    generate: (vars) => {
      const founderFirstName = vars.founderName ? vars.founderName.split(" ")[0] : "Investor";
      const org = vars.organizationName || "Our Startup";
      const topic = vars.topic || "Enterprise AI";

      return {
        subject: `[Seed / Series A] ${org} - 3.8x MoM Growth in ${topic}`,
        body: `Hi ${founderFirstName},

I have been following your investments in the ${topic} space and admire your thesis around category-defining infrastructure.

I am the founder of ${org}. We are building a high-efficiency solution that solves key bottlenecks for enterprise operators.

Quick Highlights:
• Traction: Growing 28% MoM with $45k MRR and strong net revenue retention.
• Customers: 14 paying enterprise logos in production.
• Team: Technical founding team ex-Google and Stanford AI Lab.

We are currently opening our seed round ($1.5M, 60% committed) and would love to include your strategic backing.

Would you be open to reviewing our 10-slide deck or taking a brief 15-minute introductory call this week?

Warmly,

${vars.senderName || "[Your Name]"}
Founder & CEO | ${org}
Pitch Deck Link: ${vars.website || "https://deck.ourcompany.com"}`
      };
    }
  },
  {
    id: "podcast-invite",
    name: "Podcast / Thought Leadership Guest",
    badge: "High Acceptance",
    category: "Media",
    description: "Inviting founders to premier podcasts, interview series, or fireside chats.",
    generate: (vars) => {
      const founderFirstName = vars.founderName ? vars.founderName.split(" ")[0] : "there";
      const org = vars.organizationName || "The Operator Insights Show";
      const topic = vars.topic || "Building Moats in AI";

      return {
        subject: `Guest Invitation: Discussing "${topic}" on ${org}`,
        body: `Hi ${founderFirstName},

Big admirer of the perspective you shared recently regarding ${topic}.

I host "${org}", an executive interview series with over 45,000+ monthly listeners comprising tech founders, venture capitalists, and product executives.

We would be thrilled to feature you as a guest for a candid 35-minute conversation covering:
• The counter-intuitive lessons learned scaling ${vars.company || "your company"}.
• Your architectural and strategic playbook in ${topic}.
• Where you see the industry heading over the next 3-5 years.

Recording is frictionless (done remotely via Riverside.fm), and our production team handles all post-production, audiograms, and promotional clipping.

Are you open to joining us for an episode in the coming weeks?

Best regards,

${vars.senderName || "[Your Name]"}
Host & Executive Producer | ${org}`
      };
    }
  },
  {
    id: "twitter-dm",
    name: "𝕏 (Twitter) / Direct Message",
    badge: "Direct & Casual",
    category: "Twitter / X",
    description: "Concise, friendly hook designed to stand out in crowded direct messages.",
    generate: (vars) => {
      const founderFirstName = vars.founderName ? vars.founderName.split(" ")[0] : "Hey";
      const org = vars.organizationName || "our team";
      const topic = vars.topic || "AI & Tech";

      return `Hey ${founderFirstName}! 👋 Big fan of your recent insights on ${topic} and what you're building with ${vars.company || "your team"}.

Reaching out from ${org}—we're organizing an executive initiative around ${topic} and would love to collaborate or feature your journey.

Sent a detailed brief to your inbox as well. Would love to drop a 1-page overview here if your DMs are open. Cheers! 🚀`;
    }
  },
  {
    id: "followup-email",
    name: "Polite Executive Follow-Up (Day 3 or 4)",
    badge: "Essential",
    category: "Follow-up",
    description: "Zero-guilt, respectful follow-up that captures over 40% of missed replies.",
    generate: (vars) => {
      const founderFirstName = vars.founderName ? vars.founderName.split(" ")[0] : "there";
      const org = vars.organizationName || "Our Organization";
      const initiative = vars.initiativeName || "our upcoming initiative";

      return {
        subject: `Re: Following up regarding ${initiative} | ${org}`,
        body: `Hi ${founderFirstName},

Hope you are having a wonderful week!

I know your calendar is consistently packed, so I wanted to gently bump our earlier message regarding ${initiative}.

Our executive committee is finalizing the schedule this week and we would be thrilled to explore having you involved. Even a brief conversation to align would be fantastic.

Please let me know if you would like me to liaise with your executive assistant or team directly.

Warm regards,

${vars.senderName || "[Your Name]"}
${org}
Direct: ${vars.senderPhone || "+1 (555) 019-2834"}`
      };
    }
  },
  {
    id: "ea-routing",
    name: "Executive Assistant / Chief of Staff Note",
    badge: "Gatekeeper Bypass",
    category: "Email",
    description: "Professional routing request sent directly to an EA, Chief of Staff, or PR lead.",
    generate: (vars) => {
      const founderName = vars.founderName || "your CEO";
      const org = vars.organizationName || "our organization";
      const initiative = vars.initiativeName || "our flagship leadership summit";

      return {
        subject: `Routing Request: Executive Invitation for ${founderName} | ${org}`,
        body: `Dear Executive Office Team,

I hope you are well.

I am reaching out from ${org}. We recently sent a formal invitation to ${founderName} regarding a speaking and leadership opportunity at ${initiative}.

Given ${founderName}'s intense schedule, I wanted to share this brief directly with your office to ensure it reaches the right calendar review.

Summary Details:
• Opportunity: Keynote Address / Executive Session on ${vars.topic || "Industry Innovation"}
• Event Date: ${vars.eventDate || "Upcoming Date"}
• Host: ${org}

Could you kindly advise on the preferred protocol for submitting this proposal for ${founderName}'s consideration?

Thank you sincerely for your assistance.

Warm regards,

${vars.senderName || "[Your Name]"}
${org}
Contact: ${vars.senderPhone || "+1 (555) 019-2834"}`
      };
    }
  }
];
