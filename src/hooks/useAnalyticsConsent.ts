import { useState, useEffect } from 'react'
import { initAnalytics } from '@/lib/firebase'

const STORAGE_KEY = 'pitchlab_analytics_consent'

export type ConsentState = 'pending' | 'accepted' | 'declined'

// Timezones that fall under GDPR (EU member states + UK post-Brexit + EEA).
// We err on the side of caution and include all Europe/* zones.
function isEuropeanTimezone(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return tz.startsWith('Europe/')
  } catch {
    // If we can't detect, assume EU to be safe
    return true
  }
}

export function useAnalyticsConsent() {
  const [consent, setConsent] = useState<ConsentState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'accepted' || stored === 'declined') return stored
    // Non-EU users: treat as silently accepted, no banner needed
    if (!isEuropeanTimezone()) return 'accepted'
    return 'pending'
  })

  useEffect(() => {
    if (consent === 'accepted') {
      void initAnalytics()
    }
  }, [consent])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setConsent('accepted')
    void initAnalytics()
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setConsent('declined')
  }

  return { consent, accept, decline }
}
