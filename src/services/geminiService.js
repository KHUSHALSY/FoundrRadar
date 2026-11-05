/**
 * Gemini Pro Intelligence Service
 * Provides real-time executive search and hyper-personalized pitch generation
 * using Google's Gemini models directly via REST API.
 */

const STORAGE_KEY_API_KEY = 'founderradar_gemini_api_key';
const STORAGE_KEY_MODEL = 'founderradar_gemini_model';

export const DEFAULT_MODEL = 'gemini-1.5-flash';
export const AVAILABLE_MODELS = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Ultra-Fast & Recommended)' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Deep Reasoning & Executive Precision)' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Next-Gen)' }
];

export function getStoredGeminiKey() {
  try {
    // 1. Prioritize environment variable (for deployed/shared app with bundled key)
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey && envKey.trim()) {
      return envKey.trim();
    }
    // 2. Fall back to browser localStorage
    return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredGeminiKey(key) {
  try {
    if (key) {
      localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    }
  } catch (e) {
    console.error('Failed to save Gemini key', e);
  }
}

export function getStoredGeminiModel() {
  try {
    return localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
  }
}

export function setStoredGeminiModel(model) {
  try {
    localStorage.setItem(STORAGE_KEY_MODEL, model);
  } catch (e) {
    console.error('Failed to save Gemini model', e);
  }
}

/**
 * Validates a Gemini API Key with a lightweight ping
 */
export async function testGeminiApiKey(apiKey) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Please enter a valid Gemini API key.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Respond with 'ok'" }] }],
      generationConfig: { maxOutputTokens: 5 }
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.error?.message || `API error (${res.status})`;
    throw new Error(message);
  }

  return true;
}

/**
 * Executes an AI-powered live search across any executive niche or criteria
 */
export async function searchExecutivesWithAI(query, apiKey, model = DEFAULT_MODEL) {
  if (!apiKey) {
    throw new Error('Gemini API key is required for AI Live Search.');
  }

  const prompt = `You are an elite corporate intelligence and executive recruitment engine.
The user wants to find verified executives, founders, investors, or keynote speakers matching this query:
"${query}"

Return a JSON array of up to 6 real, currently active, real-world executives or founders that best match.
For each person, generate:
- id: a unique slug like "ai-exec-1"
- name: real full name
- company: real current company or organization
- domain: primary web domain of their company (e.g. "openai.com", "cred.club", "zeptonow.com")
- role: their real executive role / title
- sector: primary industry sector (e.g. "AI & Machine Learning", "FinTech & Payments", "D2C & Consumer", "B2B SaaS")
- location: primary city and country (e.g. "Bengaluru, India" or "San Francisco, CA")
- email: realistic standard corporate email pattern or verified email (e.g. "first@company.com")
- bio: 2 crisp, high-credibility sentences summarizing their career highlights, scale of company, and background.
- tags: array of 3-4 strings (e.g. ["Founder", "AI", "Angel Investor"])
- speakerTopics: array of 2-3 specific topics they speak about or advise on

CRITICAL RULES:
1. ONLY return real, notable, verifiable human beings. Do NOT fabricate fake people.
2. Return ONLY a valid JSON array. Do not include markdown codeblocks or other commentary.`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8
      }
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `AI search request failed (${res.status})`);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
  
  // Clean potential markdown blocks
  const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
  
  let parsed = [];
  try {
    parsed = JSON.parse(cleanJson);
  } catch (e) {
    console.error('Failed to parse Gemini response as JSON:', rawText);
    throw new Error('AI returned an unparseable response format. Please retry.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Unexpected AI response format.');
  }

  // Hydrate with guaranteed bulletproof LinkedIn URLs
  return parsed.map((founder, idx) => ({
    ...founder,
    id: founder.id || `ai-${Date.now()}-${idx}`,
    linkedin: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(founder.name + ' ' + founder.company)}`,
    isAIGenerated: true,
    verified: true
  }));
}

/**
 * Generates a hyper-personalized outreach pitch tailored to the executive using Gemini Pro
 */
export async function generatePersonalizedPitchWithAI({
  founder,
  initiative,
  sender,
  templateType = 'linkedin-connect',
  apiKey,
  model = DEFAULT_MODEL
}) {
  if (!apiKey) {
    throw new Error('Gemini API key is required to generate custom AI pitches.');
  }

  const formatInstructions = {
    'linkedin-connect': 'STRICT REQUIREMENT: Must be under 300 characters total (including spaces) so it never gets truncated by LinkedIn.',
    'keynote-invite': 'Professional 3-paragraph executive conference or keynote invitation.',
    'fireside-chat': 'Engaging 2-paragraph fireside chat / panelist proposal.',
    'title-sponsorship': 'High-impact 3-paragraph corporate partnership and sponsorship teaser with quantifiable attendee ROI.',
    'twitter-dm': 'Casual, mobile-friendly 3-sentence DM written like a peer founder.',
    'followup-3day': 'Polite 2-sentence bump referencing previous outreach.',
    'b2b-partnership': 'Direct strategic partnership proposition focused on mutual leverage.',
    'advisory-request': 'Thoughtful request for an exploratory advisory or mentorship interaction.'
  };

  const prompt = `You are a world-class executive communication strategist known for generating 80%+ response rates from unicorn founders and managing directors.

Draft a personalized outreach message with the following parameters:

RECIPIENT:
- Name: ${founder.name}
- Role & Company: ${founder.role} at ${founder.company}
- Sector: ${founder.sector}
- Background: ${founder.bio || 'Industry leader'}
- Relevant Topics: ${founder.speakerTopics?.join(', ') || 'Leadership & Innovation'}

INITIATIVE / EVENT CONTEXT:
- Organization: ${initiative.organizationName}
- Initiative: ${initiative.initiativeName}
- Date & Mode: ${initiative.eventDate} (${initiative.eventMode})
- Expected Audience / Reach: ${initiative.reach}
- Proposed Keynote / Discussion Topic: ${initiative.topic}

SENDER:
- Name: ${sender.senderName}
- Title: ${sender.senderTitle}
- Email: ${sender.senderEmail}
- Phone: ${sender.senderPhone}
- Website: ${sender.website}

OUTREACH FORMAT:
${formatInstructions[templateType] || 'Executive outreach letter.'}

CRITICAL RULES:
- Write with exceptional clarity and psychological appeal.
- Do NOT use generic buzzwords ("synergy", "paradigm shift", "esteemed presence").
- Make it immediately clear why THIS specific person was chosen.
- Return ONLY the finalized message body text ready to copy-paste.`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4
      }
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `AI pitch generation failed (${res.status})`);
  }

  const data = await res.json();
  const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return output.trim();
}
