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

    // Create a TransformStream to process the SSE stream
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Process the stream
    const reader = geminiRes.body?.getReader();
    if (!reader) {
      return new Response(
        JSON.stringify({ error: 'Failed to get response stream' }), 
        { status: 500 }
      );
    }

    // Start processing the stream with proper JSON accumulation
    (async () => {
      const decoder = new TextDecoder();
      let jsonBuffer = '';
      let braceCount = 0;
      let inJsonObject = false;
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // Process any remaining complete JSON in buffer
            if (jsonBuffer.trim() && braceCount === 0) {
              await processCompleteJson(jsonBuffer.trim());
            }
            // Send completion signal
            await writer.write(encoder.encode(`data: {"done": true}\n\n`));
            break;
          }

          // Add new chunk to buffer
          const chunk = decoder.decode(value, { stream: true });
          console.log('Raw chunk:', chunk.substring(0, 100));
          
          // Process character by character to find complete JSON objects
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
                
                // Complete JSON object found
                if (braceCount === 0) {
                  await processCompleteJson(jsonBuffer.trim());
                  jsonBuffer = '';
                  inJsonObject = false;
                }
              }
            } else if (inJsonObject) {
              jsonBuffer += char;
            }
            // Ignore characters outside of JSON objects
          }
        }
      } catch (e) {
        console.error('Stream processing error:', e);
        await writer.write(
          encoder.encode(`data: {"error": "Stream processing failed"}\n\n`)
        );
      } finally {
        await writer.close();
      }

      async function processCompleteJson(jsonStr: string) {
        try {
          console.log('Processing complete JSON:', jsonStr.substring(0, 200));
          const parsed = JSON.parse(jsonStr);
          
          // Extract text from Gemini's response structure
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
          if (text) {
            console.log('Extracted text:', text.substring(0, 50) + '...');
            await writer.write(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          } else {
            console.log('No text found in response:', parsed);
          }
        } catch (e) {
          console.error('Error parsing complete JSON:', e, 'JSON:', jsonStr.substring(0, 200));
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
  } catch (e: any) {
    console.error('API error:', e);
    return new Response(
      JSON.stringify({ error: 'Server error', details: e.message }), 
      { status: 500 }
    );
  }
};