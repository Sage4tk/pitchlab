import { useCallback } from 'react'
import { playNote, playChord, playMelody, playRhythm } from '@/audio/AudioEngine'

export function useAudio() {
  const playIntervalNotes = useCallback((root: string, target: string) => {
    void playNote(root, '4n').then(() => {
      void playNote(target, '4n')
    })
  }, [])

  const playChordNotes = useCallback((notes: string[]) => {
    void playChord(notes, '2n')
  }, [])

  const playMelodyNotes = useCallback((notes: string[], bpm?: number) => {
    void playMelody(notes, bpm)
  }, [])

  const playRhythmPattern = useCallback((pattern: boolean[], bpm?: number) => {
    void playRhythm(pattern, bpm)
  }, [])

  return { playIntervalNotes, playChordNotes, playMelodyNotes, playRhythmPattern }
}
