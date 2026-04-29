# VibeOS 🎯

> **Your AI Identity Layer** — AI-powered social platform that understands your vibe, connects you with your people, and evolves with you.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/vibeos.git
cd vibeos
npm install
```

### 2. Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste contents of `supabase/schema.sql` → Run
3. Copy your **Project URL** and **anon key** into `.env.local`

### 4. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Folder Structure

```
vibeos/
├── app/
│   ├── layout.tsx              # Root layout (fonts, global providers)
│   ├── page.tsx                # Redirect to /home
│   ├── globals.css             # Global styles + Tailwind
│   ├── home/                   # 🏠 Daily Vibe + Mood Tracker
│   │   └── page.tsx
│   ├── my-vibe/                # 🧠 Personality Dashboard
│   │   └── page.tsx
│   ├── explore/                # 🌍 User Discovery
│   │   └── page.tsx
│   ├── match-page/             # ❤️ Compatibility System
│   │   └── page.tsx
│   ├── ai-twin/                # 🤖 AI Twin Chat
│   │   └── page.tsx
│   ├── profile/[id]/           # 👤 Public Profile View
│   │   └── page.tsx
│   ├── onboarding/             # ✨ Onboarding Flow
│   │   └── page.tsx
│   ├── notifications/          # 🔔 Notifications
│   │   └── page.tsx
│   ├── settings/               # ⚙️ Settings
│   │   └── page.tsx
│   └── api/
│       ├── analyze/route.ts    # POST /api/analyze → AI personality analysis
│       ├── chat/route.ts       # POST /api/chat → AI twin chat
│       └── match/route.ts      # POST /api/match → Match scoring
├── components/
│   ├── layout/
│   │   └── BottomNav.tsx       # Persistent bottom navigation
│   ├── ui/
│   │   ├── VibeScoreRing.tsx   # Animated circular score
│   │   ├── RadarChart.tsx      # Personality radar/spider chart
│   │   ├── TraitBar.tsx        # Animated trait progress bars
│   │   ├── MoodPicker.tsx      # 5-mood emoji selector
│   │   ├── GradientButton.tsx  # Reusable gradient CTA button
│   │   ├── AnimatedCounter.tsx # Spring-animated number counter
│   │   └── Skeleton.tsx        # Loading skeleton states
│   └── cards/
│       └── VibeCard.tsx        # Shareable vibe card
├── hooks/
│   ├── useVibeAnalysis.ts      # AI analysis with fallbacks
│   ├── useChat.ts              # AI twin chat state
│   └── useMood.ts              # Mood persistence (localStorage)
├── lib/
│   ├── supabase.ts             # Supabase client + DB helpers
│   ├── utils.ts                # Helpers, mock data, constants
│   └── store.ts                # Zustand global state
├── types/
│   └── index.ts                # Full TypeScript types
├── supabase/
│   └── schema.sql              # Complete DB schema + RLS policies
├── public/
│   └── manifest.json           # PWA manifest
├── tailwind.config.ts
├── next.config.mjs
└── tsconfig.json
```

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + custom CSS |
| Animation | Framer Motion |
| Auth + DB | Supabase |
| AI | Anthropic Claude API |
| State | Zustand |
| Charts | Recharts |
| Icons | Lucide React |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0A0A0A` |
| Surface | `#111111` |
| Primary | `#7C3AED` (purple) |
| Accent | `#06B6D4` (cyan) |
| Pink | `#EC4899` |
| Green | `#10B981` |
| Orange | `#F97316` |

**Glass morphism** cards with `backdrop-blur` and subtle borders throughout.

---

## 🔌 API Reference

### `POST /api/analyze`
Analyzes user mood and returns personality insights.

**Request:**
```json
{
  "mood": "great",
  "mood_history": [...],
  "user_name": "Aditya"
}
```

**Response:**
```json
{
  "vibe_score": 88,
  "vibe_label": "Very Positive",
  "insight": "You're radiating...",
  "recommendation": "Channel this...",
  "traits": { "analytical": 82, "creative": 92, ... },
  "focus": 88,
  "energy": 92,
  "social_score": 72,
  "calm_score": 76
}
```

---

### `POST /api/chat`
AI Twin chat endpoint.

**Request:**
```json
{
  "message": "How do I feel today?",
  "conversation_history": [...],
  "twin_name": "Aditya",
  "user_profile": { "vibe_score": 82, ... }
}
```

**Response:**
```json
{
  "message": "Your energy today suggests...",
  "emotion": "supportive"
}
```

---

### `POST /api/match`
Calculate compatibility between two vibe profiles.

**Request:**
```json
{
  "user_profile": { "analytical": 85, ... },
  "target_profile": { "creative": 90, ... },
  "user_name": "Aditya",
  "target_name": "Priya"
}
```

**Response:**
```json
{
  "score": 92,
  "compatibility_type": "Creative Alliance",
  "reasons": ["Similar values", "Creative synergy", "Emotional depth"]
}
```

---

## 🗃️ Database Schema

```sql
users            → id, name, email, avatar, bio, is_public
vibe_profiles    → user_id, analytical, creative, empathetic, social, ambitious, calm, vibe_score
mood_logs        → user_id, mood, mood_score, vibe_score, insight, focus, energy, social, calm
matches          → user_id, matched_user_id, score, status, compatibility_reasons
chat_sessions    → user_id, target_user_id, messages (JSONB)
```

Full schema with RLS policies in `supabase/schema.sql`.

---

## 💰 Monetization Tiers

| Tier | Price | Features |
|------|-------|---------|
| Free | ₹0 | Daily vibe, basic personality, 3 matches/day |
| Pro | ₹299/mo | Deep insights, full match reports, AI Twin |
| Creator | ₹999/mo | Monetize your AI Twin, fan subscriptions |

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

Set environment variables in Vercel dashboard.

### Docker
```bash
docker build -t vibeos .
docker run -p 3000:3000 vibeos
```

---

## 🧩 Growth Loops Built-in

1. **Daily Hook** — Mood check-in streak system
2. **Social Loop** — Shareable vibe cards → viral spread
3. **Identity Lock-in** — Personality evolves over time → can't leave
4. **AI Twin** — Others chat with your AI → you get notified → you come back

---

## 🛠️ Next Steps for Production

- [ ] Supabase Auth (Google / Apple / Email OTP)
- [ ] Real-time notifications (Supabase Realtime)
- [ ] Image generation for Vibe Cards (html2canvas)
- [ ] Stripe / Razorpay payment integration
- [ ] Push notifications (web-push)
- [ ] Vector DB for AI memory (Pinecone / pgvector)
- [ ] Rate limiting on API routes
- [ ] Sentry error tracking
- [ ] PostHog analytics

---

## 📄 License

MIT © VibeOS Team
