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

    // Prioritize Gemini Pro and stable flash models
    const modernModels = [
      'gemini-2.5-pro',
      'gemini-pro-latest',
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.7-flash',
      'gemini-3.8-flash'
    ];
    
    // Put requestedModel first if specified
    const candidateModels = requestedModel 
      ? [requestedModel, ...modernModels.filter(m => m !== requestedModel)]
      : modernModels;

    const attempts = {};

    for (const model of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      
      // Try up to 2 times for transient errors (e.g. high demand spikes)
      for (let retry = 0; retry < 2; retry++) {
        try {
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
            const errMsg = errData?.error?.message || `HTTP ${googleRes.status}`;
            attempts[`${model}_try${retry + 1}`] = errMsg;

            // If it's a high demand error, wait 500ms before next attempt
            if (errMsg.includes('high demand') || googleRes.status === 503 || googleRes.status === 429) {
              await new Promise(r => setTimeout(r, 600));
            } else {
              // Non-retryable error for this model, move to next model
              break;
            }
          }
        } catch (reqErr) {
          attempts[`${model}_try${retry + 1}`] = reqErr.message;
        }
      }
    }

    return res.status(500).json({ 
      error: 'All Gemini models failed or are at peak capacity. Please retry.',
      attempts
    });
  } catch (error) {
    console.error('Serverless Gemini Proxy error:', error);
    return res.status(500).json({ error: error.message || 'Internal proxy error' });
  }
}
