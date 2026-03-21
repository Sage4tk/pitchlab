# AI Features Plan — Pitchlab

## 1. AI Coach (Post-Session Feedback)

After a session ends, send the user's mistakes to Claude and get a personalized debrief.

**Example output:**
> You got 3/5 wrong — all were m3 vs M3 confusions.
> Try singing the first two notes of *Greensleeves* (m3) vs *When the Saints* (M3) before each answer.

**Implementation:**
- Call the Claude API from a serverless function (Firebase Cloud Function or Vercel edge function)
- Send session results: exercise type, difficulty, list of questions with correct answer + user answer + response time
- System prompt instructs Claude to act as a concise ear training coach
- Display the response on the results screen in a collapsible "AI Coach" card
- Cache responses per session to avoid duplicate API calls

**Data shape sent to API:**
```json
{
  "exerciseType": "interval",
  "difficulty": 2,
  "rounds": [
    { "correct": "P5", "answered": "P4", "correct": false, "ms": 3200 },
    { "correct": "m3", "answered": "M3", "correct": false, "ms": 1800 }
  ]
}
```

**Priority:** Highest — cheapest to build, most immediate user value.

---

## 2. Adaptive Practice Planner

Instead of the user manually picking exercises, AI analyzes their full history and generates a daily practice plan.

**Example output:**
> Today's plan (15 min):
> 1. Interval warm-up — m3 vs M3 focus (5 rounds, easy)
> 2. Chord identification — Major/Minor/Dim (5 rounds, medium)
> 3. Progression ear test — I–V–vi–IV variations (5 rounds, medium)

**Implementation:**
- Pull data from `useSpacedRepStore` (per-item accuracy) + `useProgressStore` (attempt history)
- Summarize weak areas, streaks, recent activity
- Send summary to Claude API with a system prompt that returns structured JSON
- Parse the JSON plan and render as a guided "Today's Practice" dashboard card
- Could also auto-generate custom course sequences for specific weak spots

**Response schema:**
```json
{
  "plan": [
    {
      "exerciseType": "interval",
      "pool": ["m3", "M3"],
      "difficulty": 1,
      "rounds": 5,
      "reason": "You confuse these most often"
    }
  ]
}
```

**Priority:** High — builds on existing spaced rep data, strong retention impact.

---

## 3. Conversational Theory Tutor

A chat panel where users can ask music theory questions scoped to what they're currently learning.

**Example interactions:**
- "Why does a tritone sound tense?"
- "What's the difference between sus2 and sus4?"
- "How do I remember minor 6ths?"
- "Explain the I–V–vi–IV progression"

**Implementation:**
- Chat UI component (slide-out panel or dedicated page)
- System prompt grounded in music theory, scoped to the user's current course/lesson
- Include the user's recent mistakes as context so the tutor can be proactive
- Stream responses via Claude API for real-time feel
- Conversation history stored in localStorage or Firestore
- Could add suggested questions based on recent wrong answers

**System prompt context:**
- Current course + lesson the user is on
- Their recent mistake patterns
- Their experience level (derived from progress data)
- Instruction to keep answers concise, use song references, avoid jargon overload

**Priority:** Medium — high engagement value but more UI work.

---

## 4. AI-Analyzed Vocal Input

Use pitch detection to let users sing intervals/melodies, then have AI evaluate intonation quality beyond just right/wrong.

**Example output:**
> Your C4→E4 was 12 cents sharp — you tend to overshoot ascending major thirds.
> Try approaching from below: sing C4, then slide up slowly to E4.

**Implementation:**
- Extend the existing `PitchMatch` exercise with more detailed pitch tracking
- Use Web Audio API + `pitchy` library to capture sung pitch over time
- Collect pitch accuracy data per note (cents deviation, timing)
- Send pitch trace to Claude API for qualitative analysis
- AI interprets trends: "you go sharp on ascending intervals", "your rhythm drifts on longer melodies"

**Data shape:**
```json
{
  "exercise": "melody",
  "targetNotes": ["C4", "E4", "G4"],
  "sungPitches": [
    { "target": "C4", "actual_cents": -5, "timing_ms": 520 },
    { "target": "E4", "actual_cents": 18, "timing_ms": 1100 },
    { "target": "G4", "actual_cents": 3, "timing_ms": 1650 }
  ]
}
```

**Priority:** Lower — requires more audio processing work, but unique differentiator.

---

## Architecture Notes

**Backend:** Firebase Cloud Functions (already using Firebase for auth + Firestore)
- Single endpoint: `POST /api/ai/{feature}` (coach, planner, tutor, vocal-analysis)
- Anthropic API key stored in Firebase environment config
- Rate limit per user to control costs

**Model:** Claude Sonnet for coach/planner (fast, cheap), Claude Opus for tutor conversations (deeper reasoning)

**Cost control:**
- Cache coach responses per session ID
- Limit planner to 1 generation per day
- Cap tutor at N messages per day for free tier
- Use `max_tokens` to keep responses concise

**Frontend:**
- New `src/components/AICoach.tsx` — results screen card
- New `src/components/PracticePlanner.tsx` — dashboard card
- New `src/pages/Tutor.tsx` — chat interface
- New `src/hooks/useAI.ts` — shared hook for API calls + loading/error state
