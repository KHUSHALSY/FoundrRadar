/**
 * Generates precision search dorks, deep-links, and contact discovery queries
 * for Founders, Growth Leads, Event Organizers, Recruiters, and Operators.
 */

export function generateDorkQueries({
  topic = "AI & Autonomous Agents",
  roleQuery = '("Founder" OR "Co-Founder" OR "CEO")',
  geographyQuery = "",
  backgroundQuery = "",
  customKeywords = ""
}) {
  const cleanTopic = topic.trim();
  const cleanCustom = customKeywords.trim();

  // --- 1. LinkedIn Profile Google Dork (Bypasses commercial limit & zero ads) ---
  const linkedinParts = [
    'site:linkedin.com/in',
    roleQuery,
    `"${cleanTopic}"`,
    geographyQuery,
    backgroundQuery,
    cleanCustom
  ].filter(Boolean);
  const linkedinDork = linkedinParts.join(" ");
  const linkedinGoogleUrl = `https://www.google.com/search?q=${encodeURIComponent(linkedinDork)}`;

  // --- 2. LinkedIn Direct Native Search ---
  const directKeywords = [cleanTopic, "Founder", cleanCustom].filter(Boolean).join(" ");
  const linkedinDirectUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(directKeywords)}`;

  // --- 3. Twitter / X Profile & Bio Search ---
  const twitterSearchQuery = `(founder OR cofounder OR ceo) "${cleanTopic}"`;
  const twitterDirectUrl = `https://x.com/search?q=${encodeURIComponent(twitterSearchQuery)}&f=user`;

  const twitterBioDork = `(site:x.com OR site:twitter.com) ("founder" OR "co-founder" OR "building") "${cleanTopic}" ${geographyQuery}`;
  const twitterDorkUrl = `https://www.google.com/search?q=${encodeURIComponent(twitterBioDork)}`;

  // --- 4. Direct Email & Contact Lead Dork ---
  // Searches public profile pages & resumes for direct email patterns
  const emailDork = `(site:linkedin.com/in OR site:x.com OR site:github.com) ${roleQuery} "${cleanTopic}" ("email me" OR "contact at" OR "@gmail.com" OR "reach out at" OR "dm open")`;
  const emailDorkUrl = `https://www.google.com/search?q=${encodeURIComponent(emailDork)}`;

  // --- 5. Reddit Startup & Maker Communities ---
  // r/startups, r/Entrepreneur, r/SaaS, r/ycombinator, r/IndianStartups
  const subreddits = "startups+Entrepreneur+SaaS+ycombinator+IndianStartups";
  const redditDirectUrl = `https://www.reddit.com/r/${subreddits}/search/?q=${encodeURIComponent(cleanTopic + ' founder')}&restrict_sr=1&sort=relevance`;
  const redditDork = `site:reddit.com (r/startups OR r/Entrepreneur OR r/SaaS OR r/ycombinator) "${cleanTopic}" ("I am the founder" OR "we launched" OR "my startup" OR "AMA")`;
  const redditDorkUrl = `https://www.google.com/search?q=${encodeURIComponent(redditDork)}`;

  // --- 6. Product Hunt (Makers & Launched Products) ---
  const productHuntUrl = `https://www.producthunt.com/search?q=${encodeURIComponent(cleanTopic)}`;

  // --- 7. Venture Tech Media (TechCrunch, Crunchbase, Forbes, Inc42, VentureBeat) ---
  const mediaDork = `(site:techcrunch.com OR site:crunchbase.com/person OR site:venturebeat.com OR site:inc42.com) ("founder" OR "co-founder") "${cleanTopic}" ("seed" OR "series a" OR "funding" OR "raised")`;
  const mediaUrl = `https://www.google.com/search?q=${encodeURIComponent(mediaDork)}`;

  // --- 8. GitHub Maintainers & Technical Founders ---
  const githubDork = `site:github.com ("founder" OR "creator" OR "maintainer" OR "author") "${cleanTopic}"`;
  const githubUrl = `https://www.google.com/search?q=${encodeURIComponent(githubDork)}`;

  // --- 9. Keynote Talks & Podcasts (YouTube) ---
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanTopic + ' founder podcast interview keynote')}`;

  return {
    topic: cleanTopic,
    linkedin: {
      id: "linkedin",
      title: "LinkedIn (Deep Google Dork)",
      subtitle: "Bypasses LinkedIn 30-search monthly limits; targets exact active profiles",
      dork: linkedinDork,
      primaryUrl: linkedinGoogleUrl,
      directUrl: linkedinDirectUrl,
      badge: "High Response",
      recommended: true
    },
    emailFinder: {
      id: "emailFinder",
      title: "Direct Email & Contact Discovery",
      subtitle: "Scrapes indexed profiles containing explicit contact emails and handle references",
      dork: emailDork,
      primaryUrl: emailDorkUrl,
      badge: "Direct Contact",
      recommended: true
    },
    twitter: {
      id: "twitter",
      title: "X (Twitter) Bios & Profiles",
      subtitle: "Find active builders, founders, and investors; DMs often open",
      dork: twitterBioDork,
      primaryUrl: twitterDirectUrl,
      secondaryUrl: twitterDorkUrl,
      badge: "Instant DMs",
      recommended: true
    },
    reddit: {
      id: "reddit",
      title: "Reddit Startup Communities",
      subtitle: "Searches r/startups, r/Entrepreneur, r/SaaS, and r/ycombinator",
      dork: redditDork,
      primaryUrl: redditDirectUrl,
      secondaryUrl: redditDorkUrl,
      badge: "Active Builders",
      recommended: true
    },
    startupMedia: {
      id: "startupMedia",
      title: "TechCrunch, Crunchbase & Media",
      subtitle: "Finds recently funded startups, seed announcements, and investor profiles",
      dork: mediaDork,
      primaryUrl: mediaUrl,
      badge: "Funded Startups",
      recommended: false
    },
    producthunt: {
      id: "producthunt",
      title: "Product Hunt Makers",
      subtitle: "Discover high-intent makers and product leads in your target vertical",
      dork: `site:producthunt.com/products "${cleanTopic}"`,
      primaryUrl: productHuntUrl,
      badge: "New Launches",
      recommended: false
    },
    github: {
      id: "github",
      title: "GitHub Maintainers & Tech CTOs",
      subtitle: "Pinpoint open-source creators, technical architects, and developer-first founders",
      dork: githubDork,
      primaryUrl: githubUrl,
      badge: "Technical Founders",
      recommended: false
    },
    youtube: {
      id: "youtube",
      title: "Keynote Speeches & Founder Podcasts",
      subtitle: "Review past speaking style, panel presence, and thought leadership",
      dork: `${cleanTopic} founder interview podcast keynote`,
      primaryUrl: youtubeUrl,
      badge: "Speaker Vibe Check",
      recommended: false
    }
  };
}
