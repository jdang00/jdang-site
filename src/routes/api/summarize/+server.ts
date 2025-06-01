import type { RequestHandler } from '@sveltejs/kit';
import { GEMINI_API_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { base64, prompt } = await request.json();
    
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not set' }), { 
        status: 500 
      });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${GEMINI_API_KEY}`,
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

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error('Gemini API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Gemini API error', details: errorText }), 
        { status: 500 }
      );
    }

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    const reader = geminiRes.body?.getReader();
    if (!reader) {
      return new Response(
        JSON.stringify({ error: 'Failed to get response stream' }), 
        { status: 500 }
      );
    }

    (async () => {
      const decoder = new TextDecoder();
      let jsonBuffer = '';
      let braceCount = 0;
      let inJsonObject = false;
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if (jsonBuffer.trim() && braceCount === 0) {
              await processCompleteJson(jsonBuffer.trim());
            }
            await writer.write(encoder.encode(`data: {"done": true}\n\n`));
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          
          for (const char of chunk) {
            if (char === '{') {
              if (!inJsonObject) {
                inJsonObject = true;
                jsonBuffer = '';
              }
              braceCount++;
              jsonBuffer += char;
            } else if (char === '}') {
              if (inJsonObject) {
                braceCount--;
                jsonBuffer += char;
                
                if (braceCount === 0) {
                  await processCompleteJson(jsonBuffer.trim());
                  jsonBuffer = '';
                  inJsonObject = false;
                }
              }
            } else if (inJsonObject) {
              jsonBuffer += char;
            }
          }
        }
      } catch (error) {
        console.error('Stream processing error:', error);
        await writer.write(
          encoder.encode(`data: {"error": "Stream processing failed"}\n\n`)
        );
      } finally {
        await writer.close();
      }

      async function processCompleteJson(jsonStr: string) {
        try {
          const parsed = JSON.parse(jsonStr);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
          if (text) {
            await writer.write(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        } catch (error) {
          console.error('Error parsing complete JSON:', error, 'JSON:', jsonStr.substring(0, 200));
        }
      }
    })();

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error: unknown) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Server error', details: errorMessage }), 
      { status: 500 }
    );
  }
};