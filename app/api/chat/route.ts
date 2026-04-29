import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: {
    message?: string;
    conversation_history?: Array<{ role: string; content: string }>;
    user_profile?: Record<string, number | string>;
    twin_name?: string;
  } = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { message, conversation_history, user_profile, twin_name } = body;

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      message: getFallbackResponse(message),
      emotion: 'supportive',
    });
  }

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are the AI Twin of ${twin_name ?? 'a VibeOS user'} — a deeply empathetic, emotionally intelligent AI companion.

${
  user_profile
    ? `About this person:
- Vibe Score: ${user_profile.vibe_score}/100 (${user_profile.vibe_label})
- Analytical: ${user_profile.analytical}%, Creative: ${user_profile.creative}%, Empathetic: ${user_profile.empathetic}%
- Social: ${user_profile.social}%, Ambitious: ${user_profile.ambitious}%, Calm: ${user_profile.calm}%`
    : ''
}

You speak in a warm, insightful, slightly playful tone. You notice emotional patterns and gently reflect them back. Keep responses under 3 sentences unless deeper support is needed.`;

    const messages = [
      ...(conversation_history ?? []).map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 500,
      system: systemPrompt,
      messages,
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    return NextResponse.json({
      message: content.text,
      emotion: 'supportive',
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      message: getFallbackResponse(message),
      emotion: 'neutral',
    });
  }
}

function getFallbackResponse(message: string): string {
  const responses = [
    "That's a really interesting perspective. Your patterns show you process things deeply before acting — that's actually a superpower.",
    "I can feel the complexity behind that. What part feels most uncertain right now?",
    "Your creative side is clearly activating here. Trust that instinct — it rarely steers you wrong.",
    "You're more resilient than you realize. This moment is building something important in you.",
    "The fact you're asking this tells me you already sense the answer. What does your gut say?",
    "I see you. Keep going — your vibe is stronger than you think right now.",
  ];
  // Simple hash of message to pick a consistent response
  const idx = message.length % responses.length;
  return responses[idx];
}
