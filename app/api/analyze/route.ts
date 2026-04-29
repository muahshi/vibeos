import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: { mood?: string; mood_history?: Array<{ mood: string; vibe_score: number }>; user_name?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { mood, mood_history, user_name } = body;

  if (!mood) {
    return NextResponse.json({ error: 'Mood is required' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(getFallbackAnalysis(mood));
  }

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({ apiKey });

    const historyContext =
      mood_history && mood_history.length > 0
        ? `Recent mood history: ${mood_history.map((m) => `${m.mood}(${m.vibe_score})`).join(', ')}`
        : 'No previous mood history';

    const prompt = `You are VibeOS AI, an empathetic AI personality analyst.

User: ${user_name ?? 'User'}
Current mood: ${mood}
${historyContext}

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "vibe_score": <0-100>,
  "vibe_label": "<Exceptional|Very Positive|Positive|Balanced|Neutral|Low|Needs Care>",
  "insight": "<2-3 sentence personalized insight>",
  "recommendation": "<1 actionable suggestion>",
  "traits": { "analytical": <0-100>, "creative": <0-100>, "empathetic": <0-100>, "social": <0-100>, "ambitious": <0-100>, "calm": <0-100> },
  "focus": <0-100>,
  "energy": <0-100>,
  "social_score": <0-100>,
  "calm_score": <0-100>
}`;

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    try {
      const cleaned = content.text.replace(/```json\n?|\n?```/g, '').trim();
      return NextResponse.json(JSON.parse(cleaned));
    } catch {
      return NextResponse.json(getFallbackAnalysis(mood));
    }
  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json(getFallbackAnalysis(mood));
  }
}

function getFallbackAnalysis(mood: string): object {
  const map: Record<string, object> = {
    great: {
      vibe_score: 88, vibe_label: 'Very Positive',
      insight: "You're radiating positive energy! Creativity and focus are at their peak. Perfect time to build and connect.",
      recommendation: 'Channel this energy into your most ambitious project today.',
      traits: { analytical: 82, creative: 92, empathetic: 80, social: 70, ambitious: 88, calm: 75 },
      focus: 88, energy: 92, social_score: 72, calm_score: 76,
    },
    good: {
      vibe_score: 76, vibe_label: 'Positive',
      insight: "Solid energy today. Your mind is sharp and you're in a good flow state. Perfect for meaningful work.",
      recommendation: 'Focus on 2-3 key priorities and enjoy the steady momentum.',
      traits: { analytical: 78, creative: 75, empathetic: 76, social: 68, ambitious: 74, calm: 72 },
      focus: 78, energy: 76, social_score: 68, calm_score: 74,
    },
    okay: {
      vibe_score: 62, vibe_label: 'Balanced',
      insight: "You're in a neutral, observant state. Great time for reflection and planning.",
      recommendation: 'Take a mindful break, then tackle one meaningful task at a time.',
      traits: { analytical: 68, creative: 65, empathetic: 72, social: 58, ambitious: 60, calm: 70 },
      focus: 65, energy: 62, social_score: 58, calm_score: 70,
    },
    low: {
      vibe_score: 45, vibe_label: 'Low',
      insight: "Your energy is quiet today. This is natural — honor that and be gentle with yourself.",
      recommendation: 'Prioritize rest, hydration, and one small win today.',
      traits: { analytical: 55, creative: 52, empathetic: 68, social: 48, ambitious: 50, calm: 60 },
      focus: 48, energy: 44, social_score: 46, calm_score: 62,
    },
    bad: {
      vibe_score: 30, vibe_label: 'Needs Care',
      insight: "Tough day — and that's okay. Even low moments carry valuable information. You're not alone.",
      recommendation: 'Reach out to someone you trust. Small acts of self-care make a big difference.',
      traits: { analytical: 45, creative: 40, empathetic: 70, social: 38, ambitious: 42, calm: 50 },
      focus: 35, energy: 30, social_score: 36, calm_score: 52,
    },
  };
  return map[mood] ?? map['okay'];
}
