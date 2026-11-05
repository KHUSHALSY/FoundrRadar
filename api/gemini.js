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

  // GET Request: Diagnostic Health Check to verify if GEMINI_API_KEY is working on Vercel
  if (req.method === 'GET') {
    if (!apiKey || !apiKey.trim()) {
      return res.status(200).json({
        ok: false,
        status: 'missing_key',
        message: 'GEMINI_API_KEY is not set in Vercel environment variables.'
      });
    }

    try {
      // Test ping to Google Gemini API
      const testRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Respond with 'ok'" }] }],
            generationConfig: { maxOutputTokens: 5 }
          })
        }
      );

      if (testRes.ok) {
        return res.status(200).json({
          ok: true,
          status: 'verified_active',
          message: 'Gemini API Key is valid and active on Vercel!',
          model: 'gemini-1.5-flash'
        });
      } else {
        const errData = await testRes.json().catch(() => ({}));
        // Fetch available models for this key to discover exact supported model names
        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`);
        const listData = await listRes.json().catch(() => ({}));
        const available = listData.models ? listData.models.map(m => m.name) : [];

        return res.status(200).json({
          ok: false,
          status: 'api_error',
          error: errData?.error?.message || 'Model error',
          availableModels: available
        });
      }
        return res.status(200).json({
          ok: false,
          status: 'api_error',
          error: errData?.error?.message || 'Google rejected the API key.'
        });
      }
    } catch (err) {
      return res.status(200).json({
        ok: false,
        status: 'network_error',
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
    const { prompt, model = 'gemini-1.5-flash', generationConfig } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt parameter' });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

    const googleRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: generationConfig || {}
      })
    });

    if (!googleRes.ok) {
      const errData = await googleRes.json().catch(() => ({}));
      return res.status(googleRes.status).json(errData);
    }

    const data = await googleRes.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Serverless Gemini Proxy error:', error);
    return res.status(500).json({ error: error.message || 'Internal proxy error' });
  }
}
