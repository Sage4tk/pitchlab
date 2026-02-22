const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function noteToMidi(note: string): number {
  const match = note.match(/^([A-G]#?)(\d+)$/)
  if (!match) throw new Error(`Invalid note: ${note}`)
  const name = match[1]
  const octave = parseInt(match[2], 10)
  const idx = NOTE_NAMES.indexOf(name)
  if (idx === -1) throw new Error(`Unknown note name: ${name}`)
  return (octave + 1) * 12 + idx
}

export function midiToNote(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  const name = NOTE_NAMES[midi % 12]
  return `${name}${octave}`
}

export function applyInterval(root: string, semitones: number): string {
  return midiToNote(noteToMidi(root) + semitones)
}

export function randomNote(low: string, high: string): string {
  const lo = noteToMidi(low)
  const hi = noteToMidi(high)
  const midi = lo + Math.floor(Math.random() * (hi - lo + 1))
  return midiToNote(midi)
}
