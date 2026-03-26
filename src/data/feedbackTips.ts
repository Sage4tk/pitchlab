export const INTERVAL_TIPS: Record<string, string> = {
  'Unison':  'Same pitch — 0 semitones. The two notes are identical.',
  'm2':      'Minor 2nd — 1 semitone. The smallest step; sounds tense and dissonant, like a doorbell or a half-step crunch.',
  'M2':      'Major 2nd — 2 semitones. A whole step; bright and stepwise, like the opening of "Happy Birthday".',
  'm3':      'Minor 3rd — 3 semitones. The defining interval of a minor chord; darker and more melancholy than a Major 3rd.',
  'M3':      'Major 3rd — 4 semitones. Warm and bright; the core of a major chord. Think the first two notes of "When the Saints Go Marching In".',
  'P4':      'Perfect 4th — 5 semitones. Stable and open; think "Here Comes the Bride" or the first two notes of "Amazing Grace".',
  'Tritone': 'Tritone — 6 semitones. Exactly half an octave; dissonant and unstable, nicknamed "diabolus in musica". Think the opening of "The Simpsons" theme.',
  'P5':      'Perfect 5th — 7 semitones. Hollow and powerful; the foundation of power chords. Think "Twinkle Twinkle" (first two notes).',
  'm6':      'Minor 6th — 8 semitones. Bittersweet; enharmonic to an Augmented 5th. Think the first leap in "The Entertainer".',
  'M6':      'Major 6th — 9 semitones. Warm and nostalgic; the opening of "My Bonnie Lies Over the Ocean".',
  'm7':      'Minor 7th — 10 semitones. Bluesy and unresolved; the backbone of a Dominant 7th chord.',
  'M7':      'Major 7th — 11 semitones. Dreamy and tense; one semitone below the octave. Think the first two notes of "Take On Me".',
  'P8':      'Perfect Octave — 12 semitones. The same note an octave higher; pure and consonant.',
}

export const CHORD_TIPS: Record<string, string> = {
  'Major':      'Major triad: root + Major 3rd + Perfect 5th (0-4-7). Bright and stable — the default "happy" chord.',
  'Minor':      'Minor triad: root + minor 3rd + Perfect 5th (0-3-7). Darker and more emotional than Major.',
  'Diminished': 'Diminished triad: root + minor 3rd + diminished 5th (0-3-6). Tense and unstable; wants to resolve.',
  'Augmented':  'Augmented triad: root + Major 3rd + Augmented 5th (0-4-8). Dreamy and ambiguous; no clear resolution.',
  'Sus2':       'Sus2: root + Major 2nd + Perfect 5th (0-2-7). Open and airy — the 3rd is replaced by a 2nd.',
  'Sus4':       'Sus4: root + Perfect 4th + Perfect 5th (0-5-7). Suspended, longing to resolve — the 3rd is replaced by a 4th.',
  'Dom7':       'Dominant 7th: Major triad + minor 7th (0-4-7-10). Bluesy and tense; strongly wants to resolve to the tonic.',
  'Maj7':       'Major 7th: Major triad + Major 7th (0-4-7-11). Lush and jazzy; the 7th is only one semitone below the octave.',
  'Min7':       'Minor 7th: Minor triad + minor 7th (0-3-7-10). Smooth and melancholic; common in jazz and soul.',
  'Dim7':       'Diminished 7th: stacked minor 3rds (0-3-6-9). Symmetrical and very tense; every inversion sounds the same.',
}

export const PROGRESSION_TIPS: Record<string, string> = {
  'I – IV – V – I':       'Classic cadential loop. The IV (subdominant) moves away from home; V (dominant) creates strong tension that resolves back to I.',
  'I – V – vi – IV':      '"The four-chord song" — used in hundreds of pop hits. The vi (relative minor) adds an emotional dip before IV lifts back.',
  'I – vi – IV – V':      '"50s progression". The vi adds a minor colour; IV and V drive back to I. Heard in doo-wop and early rock.',
  'I – V – IV – I':       'Blues-influenced. Moving V→IV breaks the usual IV→V tension, giving it a more relaxed, rocking feel.',
  'I – vi – ii – V':      'Jazz turnaround. Each chord prepares the next: vi→ii is a 4th down, ii→V is a 4th down, V→I resolves.',
  'vi – IV – I – V':      'Minor-flavoured pop variant. Starting on vi gives an introspective feel before landing on the bright I.',
  'ii – V – I':           'The cornerstone of jazz harmony. ii prepares V; V strongly resolves to I — the strongest cadence in tonal music.',
  'I – iii – vi – IV':    'Descending-thirds progression. iii bridges I and vi, creating a smooth stepwise bass movement.',
  'I – IV – vii° – iii':  'Chromatic mediant. The vii° adds tension and colour; iii is the mediant chord, giving a classical flavour.',
  'vi – ii – V – I':      'Extended jazz turnaround. Four chords each a 4th apart, cycling smoothly back to I.',
  'IV – V – iii – vi':    'Deceptive cadence variation. V resolves unexpectedly to iii instead of I, then slides to vi for a bittersweet feel.',
}
