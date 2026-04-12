import { Link } from 'react-router-dom'

export function PrivacyPolicy() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      backgroundImage: 'repeating-linear-gradient(transparent, transparent 47px, rgba(255,255,255,0.025) 47px, rgba(255,255,255,0.025) 48px)',
      padding: '64px 24px',
    }}>
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--accent)',
              letterSpacing: '0.02em',
            }}>
              Pitchlab
            </span>
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '36px',
            fontWeight: 600,
            color: 'var(--text)',
            marginTop: '24px',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}>
            Privacy Policy
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}>
            Last updated: April 12, 2026
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '40px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Section title="Overview">
            Pitchlab ("we", "our", or "us") is an ear training web application. This policy explains what data we collect, why we collect it, and how it is used. We are committed to keeping your information minimal and secure.
          </Section>

          <Section title="Information We Collect">
            <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Account data</strong> — email address and display name when you register or sign in with Google.</li>
              <li><strong>Exercise progress</strong> — your answers, accuracy scores, streaks, and spaced-repetition weights, stored in Firestore and linked to your account.</li>
              <li><strong>Usage data</strong> — basic analytics such as which exercises you complete, collected to improve the product.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>We do not collect payment information, precise location, or any audio recordings.</p>
          </Section>

          <Section title="How We Use Your Data">
            <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>To authenticate you and maintain your session.</li>
              <li>To track your exercise history and personalize the spaced-repetition system.</li>
              <li>To display streaks, achievements, and progress statistics.</li>
              <li>To improve Pitchlab features and fix bugs.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </Section>

          <Section title="Third-Party Services">
            Pitchlab uses the following third-party services which have their own privacy policies:
            <ul style={{ paddingLeft: '20px', marginTop: '12px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Firebase (Google)</strong> — authentication and database hosting.</li>
              <li><strong>Google Sign-In</strong> — optional OAuth login.</li>
            </ul>
          </Section>

          <Section title="Data Retention">
            Your account and progress data are retained for as long as your account is active. You may request deletion of your account and all associated data at any time by contacting us (see below).
          </Section>

          <Section title="Cookies & Local Storage">
            Pitchlab stores exercise preferences and spaced-repetition weights in your browser's <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-surface-2)', padding: '1px 6px', borderRadius: '4px' }}>localStorage</code>. No advertising or tracking cookies are used.
          </Section>

          <Section title="Children's Privacy">
            Pitchlab is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will delete it.
          </Section>

          <Section title="Changes to This Policy">
            We may update this policy from time to time. The date at the top of this page reflects the most recent revision. Continued use of Pitchlab after changes constitutes acceptance of the updated policy.
          </Section>

          <Section title="Contact">
            For questions or data requests, reach us at{' '}
            <a
              href="mailto:privacy@pitchlab.app"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              privacy@pitchlab.app
            </a>.
          </Section>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '56px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '24px',
        }}>
          <Link to="/login" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            letterSpacing: '0.04em',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            Back to Login
          </Link>
          <Link to="/" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            letterSpacing: '0.04em',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--text)',
        marginBottom: '12px',
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h2>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        color: 'var(--text-muted)',
        lineHeight: '1.7',
      }}>
        {children}
      </div>
    </div>
  )
}
