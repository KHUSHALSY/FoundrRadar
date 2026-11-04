export const PLAYBOOK_SECTIONS = [
  {
    id: "golden-hours",
    title: "Timing & Cadence: When Top Executives Read Cold Inboxes",
    icon: "Clock",
    summary: "Founders and C-level executives check inboxes during specific micro-windows throughout the day. Miss these, and your message sinks under 200 daily threads.",
    rules: [
      {
        heading: "The 'Pre-Standup' Window (8:15 AM – 9:30 AM Local Time)",
        content: "The highest response window of the day. Executives review their inboxes during transit or morning coffee before their calendar fills with 10:00 AM back-to-back meetings. Target Tuesday through Thursday."
      },
      {
        heading: "The 'Evening Wind-Down' Window (8:30 PM – 10:15 PM)",
        content: "Second-best window for casual DMs (LinkedIn & X). Executives scroll social feeds on mobile from home. Keep the message under 3 sentences for instant mobile reading."
      },
      {
        heading: "Days to Avoid Completely",
        content: "Monday mornings (executives are triaging emergency issues and planning weekly sprints) and Friday afternoons after 2:00 PM (decision fatigue sets in and leads ignore new commitments)."
      }
    ]
  },
  {
    id: "subject-lines",
    title: "Subject Line Architecture (75%+ Open Rates)",
    icon: "Sparkles",
    summary: "Executive subject lines must look like an internal memo or a high-value invitation, never a sales pitch or automated marketing drip.",
    rules: [
      {
        heading: "The [Topic + Executive Name] Direct Format",
        content: "Format: {First_Name} x {Your_Company/Event}: {Specific_Topic}\nExample: Aman x Global Brand Summit: Scaling D2C in 2026\nWhy it works: Looks bespoke, non-automated, and immediately conveys mutual relevance."
      },
      {
        heading: "The [Prestigious Event / Keynote Invitation] Format",
        content: "Format: [Keynote Invitation] Speaking on {Topic} @ {Flagship_Summit_Name}\nExample: [Keynote Invitation] Scaling Enterprise AI @ Tech Leaders Conclave '26\nWhy it works: Clear honorific and high-status context."
      },
      {
        heading: "The [Mutual Synergy / Short B2B] Format",
        content: "Format: Quick collaboration question regarding {Specific_Company_Project}\nExample: Quick collaboration question regarding boAt's upcoming audio lineup"
      }
    ]
  },
  {
    id: "gatekeeper-navigation",
    title: "Reaching Founders Through Chiefs of Staff & EAs",
    icon: "ShieldAlert",
    summary: "For Series B+ founders and public company executives, direct inboxes are triaged by an Executive Assistant (EA) or Chief of Staff. Turning the gatekeeper into an ally is the secret.",
    rules: [
      {
        heading: "Search LinkedIn for the Chief of Staff",
        content: "Search: 'site:linkedin.com/in \"Chief of Staff\" \"[Target Company]\"'. The Chief of Staff is responsible for high-leverage strategic opportunities and calendar triage."
      },
      {
        heading: "The 'Routing Protocol' Request",
        content: "Never send a long pitch to an EA. Send a 4-line note: 'Dear [EA Name], we sent an executive keynote invitation to [Founder] for [Event]. Given [Founder]'s schedule, could you advise on the preferred protocol for submitting this for their calendar review?' EAs appreciate respectful, low-friction inquiries."
      },
      {
        heading: "Provide Calendar Ready Details",
        content: "Always specify exact proposed dates, duration, venue/stream format, and what preparation is required. Ambiguity causes EAs to auto-decline."
      }
    ]
  },
  {
    id: "followup-funnel",
    title: "The 3-Step Follow-Up Funnel",
    icon: "Send",
    summary: "Over 65% of executive confirmations happen on Follow-up #1 or #2. Executives are rarely ignoring you maliciously; their inboxes simply churn fast.",
    rules: [
      {
        heading: "Day 0: The Multi-Channel Touchpoint",
        content: "Send formal email + send a concise LinkedIn connection request (<300 chars) referencing the email sent."
      },
      {
        heading: "Day 3: The Low-Friction 2-Sentence Bump",
        content: "Reply directly on the original email thread (do not start a new thread). 'Hi [Name], gently bumping this in case it got buried under your week's priorities. We are finalizing our speaker agenda by Thursday and would love to hold a slot for you.'"
      },
      {
        heading: "Day 7: The Graceful Closeout",
        content: "'Hi [Name], circling back one final time. If your current focus is elsewhere, completely understand. Should things open up next quarter, we'd love to reconnect.'"
      }
    ]
  },
  {
    id: "deliverability",
    title: "Deliverability: Avoiding the Spam & Promotions Tab",
    icon: "Award",
    summary: "Technical factors that ensure your email lands in the Primary inbox and gets seen.",
    rules: [
      {
        heading: "Zero Heavy Attachments on Touchpoint #1",
        content: "Attaching a 15MB PDF pitch deck or PDF prospectus on your first cold email immediately triggers Google Workspace and Outlook spam filters. Use a clean Notion or view-only Google Drive link, or offer to send it upon reply."
      },
      {
        heading: "Plain Text Beats Rich HTML",
        content: "Marketing blast templates (tables, colored banners, multiple tracking buttons) look like spam to executive filters. Plain text written from a real person's inbox gets 4x higher deliverability."
      },
      {
        heading: "Clean Signature Architecture",
        content: "Ensure your email signature contains your full name, title, organization, phone number, and official website. Lack of sender identity flags spam detectors."
      }
    ]
  }
];
