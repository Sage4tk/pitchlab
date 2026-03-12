import { useState, useRef, useCallback, useEffect } from 'react'

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  const SIZE = buf.length
  const MAX_SAMPLES = Math.floor(SIZE / 2)
  let best_offset = -1
  let best_correlation = 0
  let rms = 0
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i]
  rms = Math.sqrt(rms / SIZE)
  if (rms < 0.01) return -1

  let last_correlation = 1
  for (let offset = 1; offset < MAX_SAMPLES; offset++) {
    let correlation = 0
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buf[i] - buf[i + offset])
    }
    correlation = 1 - correlation / MAX_SAMPLES
    if (correlation > 0.9 && correlation > last_correlation) {
      best_offset = offset
      best_correlation = correlation
    }
    if (correlation > best_correlation) best_correlation = correlation
    last_correlation = correlation
  }
  if (best_correlation < 0.01) return -1
  return sampleRate / best_offset
}

function freqToNoteInfo(freq: number): { note: string; octave: number; cents: number } {
  const midiNum = 12 * Math.log2(freq / 440) + 69
  const roundedMidi = Math.round(midiNum)
  const cents = Math.round((midiNum - roundedMidi) * 100)
  const octave = Math.floor(roundedMidi / 12) - 1
  const noteName = NOTE_NAMES[((roundedMidi % 12) + 12) % 12]
  return { note: noteName, octave, cents }
}

export interface PitchDetectorResult {
  detectedNote: string | null
  detectedCents: number
  isListening: boolean
  micError: string | null
  start: () => Promise<void>
  stop: () => void
}

export function usePitchDetector(): PitchDetectorResult {
  const [detectedNote, setDetectedNote] = useState<string | null>(null)
  const [detectedCents, setDetectedCents] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [micError, setMicError] = useState<string | null>(null)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animFrameRef = useRef<number | null>(null)

  const analyse = useCallback(() => {
    const analyser = analyserRef.current
    const ctx = audioContextRef.current
    if (!analyser || !ctx) return

    const buf = new Float32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(buf)

    const freq = autoCorrelate(buf, ctx.sampleRate)

    if (freq !== -1 && freq >= 65 && freq <= 2093) {
      const { note, octave, cents } = freqToNoteInfo(freq)
      setDetectedNote(`${note}${octave}`)
      setDetectedCents(cents)
    } else {
      setDetectedNote(null)
      setDetectedCents(0)
    }

    animFrameRef.current = requestAnimationFrame(analyse)
  }, [])

  const start = useCallback(async () => {
    setMicError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      streamRef.current = stream

      const ctx = new AudioContext()
      audioContextRef.current = ctx

      const analyser = ctx.createAnalyser()
      analyser.fftSize = 2048
      analyserRef.current = analyser

      const source = ctx.createMediaStreamSource(stream)
      sourceRef.current = source
      source.connect(analyser)

      setIsListening(true)
      animFrameRef.current = requestAnimationFrame(analyse)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Microphone access denied'
      setMicError(message)
    }
  }, [analyse])

  const stop = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
    if (audioContextRef.current) {
      void audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    analyserRef.current = null
    setIsListening(false)
    setDetectedNote(null)
    setDetectedCents(0)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current)
      if (sourceRef.current) sourceRef.current.disconnect()
      if (audioContextRef.current) void audioContextRef.current.close()
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return { detectedNote, detectedCents, isListening, micError, start, stop }
}
