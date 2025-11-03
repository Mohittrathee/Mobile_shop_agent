// app/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import phonesData from '../data/phones.json';

marked.setOptions({ breaks: true });

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; content: string; time: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    const time = getTime();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, time }]);
    setLoading(true);

    try {
      const prompt = `You are Mobile Guru AI — a friendly, professional mobile shopping assistant.
Use ONLY this data: ${JSON.stringify(phonesData)}
Respond in clean Markdown. Use **Name – ₹Price**. Keep it short.
User: ${userMsg}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
      });

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Let me check...';
      const botTime = getTime();

      setMessages(prev => [...prev, { role: 'bot', content: reply, time: botTime }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Network error.', time }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (content: string) => {
    const html = marked.parseInline(content);
    const clean = DOMPurify.sanitize(html);
    return { __html: clean };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">

        {/* HEADER - PURPLE */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
              M
            </div>
            <div>
              <h3 className="font-semibold text-lg">Mobile Guru AI</h3>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4z" />
              </svg>
            </button>
            <button className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-lg font-medium">Ask about phones!</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2 items-end`}>
                {m.role === 'bot' && (
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    M
                  </div>
                )}
                <div className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  <div dangerouslySetInnerHTML={renderMessage(m.content)} />
                  <p className={`text-xs mt-1 ${m.role === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
                    {m.time}
                  </p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start gap-2 items-end">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">M</div>
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-2xl flex items-center gap-2">
                <span className="flex space-x-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></span>
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* QUICK REPLIES */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['iPhone under ₹50k', 'Best camera', 'Gaming phone'].map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs font-medium whitespace-nowrap hover:bg-purple-200 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-full text-white shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}