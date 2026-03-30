# PitchLab — Improvement TODO

## High Impact — Core Experience

- [ ] **Adaptive Difficulty** — Auto-scale difficulty based on recent accuracy (bump up at >80%, down at <50%) instead of requiring manual selection
- [x] **Session Summary Screen** — After finishing a set, show recap: accuracy %, XP earned, streak status, weakest items, "practice weak spots" CTA
- [x] **Richer Feedback** — Explain _why_ an answer is right/wrong (e.g., "Minor 3rd = 3 semitones, darker quality than Major 3rd")
- [ ] **Chord Inversions** — Extend chord exercises to include 1st/2nd inversions, not just root position

## Medium Impact — Retention & Engagement

- [x] **Achievement/Badge System** — Milestone badges like "100 Perfect Intervals", "30-Day Streak", "Rhythm Master (90%+ accuracy)"
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

## Security (Pre-Ship)

### Critical

- [ ] **Firestore Security Rules** — Write and deploy `firestore.rules`; deny all by default, allow users to read/write only their own `users/{uid}/...` subcollections
- [ ] **Confirm `.env.local` not in git** — Verify Firebase credentials have never been committed to git history

### High

- [ ] **Fix npm vulnerabilities** — Run `npm audit fix` to patch `flatted` (prototype pollution/DoS) and `minimatch` (ReDoS)
- [ ] **Content Security Policy** — Add CSP + `X-Frame-Options` headers in `firebase.json`

### Medium

- [ ] **Generic auth error messages** — Map Firebase error strings to generic messages in `Login.tsx:21`, `Signup.tsx:23`, `ForgotPassword.tsx:18` to prevent account enumeration
- [ ] **Auth rate limiting** — Add client-side throttle on `signIn`/`signUp`/`resetPassword` in `firebaseAuth.ts`
- [ ] **Validate route params** — Sanitize `courseId`/`lessonId` from `useParams` in `CourseDetail.tsx` and `CourseLesson.tsx`
- [ ] **Remove console.error from prod** — Gate error logging behind `NODE_ENV === 'development'` in `Dashboard.tsx:102`, `Progress.tsx:53`

### Low

- [ ] **SRI on Google Fonts** — Add `integrity` attribute to font stylesheet in `index.html`

## Data & Trust

- [ ] **Better Long-Term Analytics** — Weekly/monthly accuracy trends, personal bests, response time improvements
- [ ] **Data Export** — Let users download progress as CSV/JSON
- [ ] **Account Deletion** — GDPR-friendly delete-account flow from settings
