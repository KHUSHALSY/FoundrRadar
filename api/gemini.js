export default async function handler(req, res) {
  // CORS support
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  // GET Request: Diagnostic Health Check
  if (req.method === 'GET') {
    if (!apiKey || !apiKey.trim()) {
      return res.status(200).json({
        ok: false,
        status: 'missing_key',
        message: 'GEMINI_API_KEY is not set in Vercel environment variables.'
      });
    }

    try {
      // 1. Fetch available models for this specific API key
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`);
      const listData = await listRes.json().catch(() => ({}));

      if (!listRes.ok) {
        return res.status(200).json({
          ok: false,
          status: 'invalid_key',
          error: listData?.error?.message || 'Failed to authenticate with Google Gemini API'
        });
      }

      const models = listData.models || [];
      const supported = models
        .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name.replace(/^models\//, ''));

      return res.status(200).json({
        ok: true,
        status: 'verified_active',
        message: 'Gemini API Key is valid and active on Vercel!',
        availableModels: supported
      });
    } catch (err) {
      return res.status(200).json({
        ok: false,
        status: 'server_error',
        error: err.message
      });
    }
  }

  // POST Request: Process AI Generation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!apiKey || !apiKey.trim()) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in Vercel environment variables.' });
  }

  try {
    const { prompt, model: requestedModel, generationConfig } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt parameter' });
    }

    // Try a list of fallback models in case the account has specific version access
    const candidateModels = requestedModel 
      ? [requestedModel, 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.5-flash']
      : ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];

    let lastError = null;

    for (const model of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      const googleRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: generationConfig || {}
        })
      });

      if (googleRes.ok) {
        const data = await googleRes.json();
        return res.status(200).json(data);
      } else {
        const errData = await googleRes.json().catch(() => ({}));
        lastError = errData?.error?.message || `Model ${model} failed`;
      }
    }

    return res.status(500).json({ error: lastError || 'All Gemini models failed' });
  } catch (error) {
    console.error('Serverless Gemini Proxy error:', error);
    return res.status(500).json({ error: error.message || 'Internal proxy error' });
  }
}
