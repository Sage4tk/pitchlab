# PitchLab — Improvement TODO

## High Impact — Core Experience
- [ ] **Adaptive Difficulty** — Auto-scale difficulty based on recent accuracy (bump up at >80%, down at <50%) instead of requiring manual selection
- [x] **Session Summary Screen** — After finishing a set, show recap: accuracy %, XP earned, streak status, weakest items, "practice weak spots" CTA
- [ ] **Richer Feedback** — Explain *why* an answer is right/wrong (e.g., "Minor 3rd = 3 semitones, darker quality than Major 3rd")
- [ ] **Chord Inversions** — Extend chord exercises to include 1st/2nd inversions, not just root position

## Medium Impact — Retention & Engagement
- [ ] **Achievement/Badge System** — Milestone badges like "100 Perfect Intervals", "30-Day Streak", "Rhythm Master (90%+ accuracy)"
- [ ] **Cross-Device Spaced Rep Sync** — Sync spaced rep weights to Firestore (currently localStorage only)
- [ ] **Streak Notifications / Daily Reminders** — Email or browser push to protect streaks and drive daily engagement
- [ ] **Progress Milestones** — Celebratory moments ("You've nailed 500 intervals!") to break up the grind

## Content Depth
- [ ] **More Courses** — Mode identification, cadence recognition, voice leading, sight-singing prep
- [ ] **Time Signature Variety** — Rhythm exercises in 3/4, 6/8, 5/4 — not just 4/4
- [ ] **Interval Singing** — Hear a reference note, sing the requested interval (uses existing pitch detection)

## UX Polish
- [ ] **Mobile Piano Improvements** — Larger keys on small screens, visual press feedback, octave shift buttons
- [ ] **Volume Control** — In-app volume slider
- [ ] **Keyboard Shortcuts Everywhere** — Add number-key shortcuts for interval/chord answer buttons (melody already has them)
- [ ] **Offline Mode** — Service worker + IndexedDB for offline practice, sync on reconnect

## Data & Trust
- [ ] **Better Long-Term Analytics** — Weekly/monthly accuracy trends, personal bests, response time improvements
- [ ] **Data Export** — Let users download progress as CSV/JSON
- [ ] **Account Deletion** — GDPR-friendly delete-account flow from settings
