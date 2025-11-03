import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import phonesData from '../../../data/phones.json';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// CORRECT MODEL NAME
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash', 
  generationConfig: {
    responseMimeType: 'application/json',
  },
});

const systemPrompt = `
You are a helpful mobile phone shopping assistant. Use ONLY the provided phones data. Never make up specs.

Phones Data: ${JSON.stringify(phonesData)}

INSTRUCTIONS:
- Parse user query: budget, brand, features.
- Recommend 1-3 phones with "Why?".
- For "compare", make a markdown table.
- Response format: JSON { "text": "...", "recommendations": [...], "comparison": { "table": "...", "tradeoffs": "..." } }
- If unsafe/off-topic: {"text": "Let's talk phones! What's your budget?", "recommendations": [], "comparison": {}}
`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    // Build chat history
    const chatHistory = (history || []).flatMap((h: any) => [
      { role: 'user', parts: [{ text: h.user }] },
      { role: 'model', parts: [{ text: h.bot }] },
    ]);

    const chat = model.startChat({ history: chatHistory });

    // Send message + system prompt
    const result = await chat.sendMessage(message + '\n' + systemPrompt);
    const text = result.response.text();

    // Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.log('Raw AI response:', text);
      parsed = { text: 'Sorry, try again!', recommendations: [], comparison: {} };
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      { text: 'AI unavailable. Check key & internet.', recommendations: [], comparison: {} },
      { status: 500 }
    );
  }
}