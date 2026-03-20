/**
 * Mnemonic tips for ear training — shown on wrong answers in course lessons.
 * Song references help students anchor each sound to something familiar.
 */

export const INTERVAL_TIPS: Record<string, string> = {
  'Unison':  'Same note twice — like the opening of "Happy Birthday" (Hap-py).',
  'm2':      'Minor 2nd — tense, crunchy. Think of the "Jaws" theme.',
  'M2':      'Major 2nd — a whole step. First two notes of "Happy Birthday" (Hap-py Birth-).',
  'm3':      'Minor 3rd — sad, gentle. Opening of "Greensleeves" or Beethoven\'s 5th (da-da-da-DUM).',
  'M3':      'Major 3rd — bright, warm. First two notes of "When the Saints Go Marching In".',
  'P4':      'Perfect 4th — strong, open. Opening of "Here Comes the Bride" or "Amazing Grace".',
  'Tritone': 'Tritone — the "devil\'s interval." Opening of "The Simpsons" theme or "Maria" (West Side Story).',
  'P5':      'Perfect 5th — powerful, hollow. Think of "Twinkle Twinkle Little Star" or Star Wars main theme.',
  'm6':      'Minor 6th — bittersweet. Theme from "Love Story" or "The Entertainer".',
  'M6':      'Major 6th — warm, yearning. "My Bonnie Lies Over the Ocean" (My Bon-).',
  'm7':      'Minor 7th — bluesy, unresolved. Opening of "Star Trek" (original) or "There\'s a Place for Us".',
  'M7':      'Major 7th — dreamy, almost dissonant. "Take On Me" (Take-On) or think one semitone below the octave.',
  'P8':      'Octave — same note, higher. "Somewhere Over the Rainbow" (Some-where).',
}

export const CHORD_TIPS: Record<string, string> = {
  'Major':      'Major — bright, happy, resolved. The "default" chord sound.',
  'Minor':      'Minor — darker, sadder. Same shape as major but with a lowered 3rd.',
  'Diminished': 'Diminished — tense, unstable, wants to resolve. All minor 3rds stacked.',
  'Augmented':  'Augmented — eerie, dreamlike, symmetrical. All major 3rds stacked.',
  'Sus2':       'Sus2 — open, airy, ambiguous. Neither major nor minor — the 3rd is replaced by a 2nd.',
  'Sus4':       'Sus4 — suspended, wants to resolve down to major. The 3rd is replaced by a 4th.',
  'Dom7':       'Dominant 7th — bluesy, strong pull to resolve. Major triad + minor 7th.',
  'Maj7':       'Major 7th — lush, jazzy, dreamy. Major triad + major 7th.',
  'Min7':       'Minor 7th — mellow, smooth, jazzy. Minor triad + minor 7th.',
  'Dim7':       'Diminished 7th — dramatic, suspenseful. Every note is a minor 3rd apart.',
}

export const PROGRESSION_TIPS: Record<string, string> = {
  'I – IV – V – I':       'The classic cadence — tension builds on V and resolves home. Countless folk & rock songs.',
  'I – V – vi – IV':      'The "four chord" pop progression. "Let It Be," "No Woman No Cry," "Someone Like You."',
  'I – vi – IV – V':       'Classic 50s doo-wop changes. "Stand By Me," "Every Breath You Take."',
  'I – V – IV – I':       'Rock & country staple — V drops to IV for a relaxed feel. "Sweet Home Alabama."',
  'I – IV – vi – V':      'Pop variant — vi adds an emotional dip before V resolves.',
  'I – IV – I – V':       'Simple folk/country turnaround — stays close to home.',
  'ii – V – I':           'The jazz cadence — ii sets up V which resolves to I. Foundation of jazz harmony.',
  'I – vi – ii – V':      'Jazz turnaround (rhythm changes). "I Got Rhythm," countless standards.',
  'vi – IV – I – V':      'Minor-start pop. "Despacito," "Numb." Same chords as I–V–vi–IV rotated.',
  'I – iii – IV – V':     'iii adds a gentle step down before IV. Wistful, bittersweet color.',
  'I – V – vi – iii – IV': 'Pachelbel\'s Canon progression — timeless descending bass line.',
}

export function getTip(exerciseType: string, label: string): string | undefined {
  switch (exerciseType) {
    case 'interval': return INTERVAL_TIPS[label]
    case 'chord': return CHORD_TIPS[label]
    case 'progression': return PROGRESSION_TIPS[label]
    default: return undefined
  }
}
