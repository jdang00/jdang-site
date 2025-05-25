import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { base64, prompt } = await request.json();
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not set' }), { status: 500 });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: 'application/pdf', data: base64 } },
              { text: prompt }
            ]
          }]
        })
      }
    );

    const data = await geminiRes.json();
    if (!geminiRes.ok) {
      return new Response(JSON.stringify({ error: data.error || 'Gemini API error' }), { status: 500 });
    }

    // Extract summary text
    const summary = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('\n') || '';
    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Server error', details: e }), { status: 500 });
  }
}; 