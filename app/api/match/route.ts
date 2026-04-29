import { NextRequest, NextResponse } from 'next/server';

function calculateBaseScore(
  profile1: Record<string, number>,
  profile2: Record<string, number>
): number {
  const traits = ['analytical', 'creative', 'empathetic', 'social', 'ambitious', 'calm'];
  const weights = [0.15, 0.2, 0.25, 0.15, 0.1, 0.15];

  let score = 0;
  traits.forEach((trait, i) => {
    const diff = Math.abs((profile1[trait] ?? 50) - (profile2[trait] ?? 50));
    const similarity = (100 - diff) / 100;
    score += similarity * weights[i] * 100;
  });

  return Math.round(score);
}

export async function POST(req: NextRequest) {
  let body: {
    user_profile?: Record<string, number>;
    target_profile?: Record<string, number>;
    user_name?: string;
    target_name?: string;
  } = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { user_profile, target_profile, user_name, target_name } = body;

  if (!user_profile || !target_profile) {
    return NextResponse.json({ error: 'Both profiles required' }, { status: 400 });
  }

  const baseScore = calculateBaseScore(user_profile, target_profile);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      score: baseScore,
      compatibility_type: 'Growth Partners',
      reasons: ['Similar values and goals', 'Complementary personality traits', 'Strong communication potential'],
    });
  }

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({ apiKey });

    const prompt = `You are VibeOS compatibility analyzer.

Person 1 (${user_name ?? 'User'}): Analytical ${user_profile.analytical}%, Creative ${user_profile.creative}%, Empathetic ${user_profile.empathetic}%, Social ${user_profile.social}%, Ambitious ${user_profile.ambitious}%, Calm ${user_profile.calm}%

Person 2 (${target_name ?? 'Match'}): Analytical ${target_profile.analytical}%, Creative ${target_profile.creative}%, Empathetic ${target_profile.empathetic}%, Social ${target_profile.social}%, Ambitious ${target_profile.ambitious}%, Calm ${target_profile.calm}%

Base score: ${baseScore}%

Respond ONLY with valid JSON (no markdown):
{
  "score": <0-100, refined score considering complementary differences>,
  "compatibility_type": "<Soul Connection|Creative Alliance|Power Duo|Calm Partnership|Growth Partners|Dynamic Balance>",
  "reasons": ["<reason 1>", "<reason 2>", "<reason 3>"]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    try {
      const cleaned = content.text.replace(/```json\n?|\n?```/g, '').trim();
      return NextResponse.json(JSON.parse(cleaned));
    } catch {
      return NextResponse.json({
        score: baseScore,
        compatibility_type: 'Growth Partners',
        reasons: ['Similar values and goals', 'Complementary personality traits', 'Strong communication potential'],
      });
    }
  } catch (error) {
    console.error('Match API error:', error);
    return NextResponse.json({
      score: baseScore,
      compatibility_type: 'Growth Partners',
      reasons: ['Similar values and goals', 'Complementary personality traits', 'Strong communication potential'],
    });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST to calculate match scores' });
}
