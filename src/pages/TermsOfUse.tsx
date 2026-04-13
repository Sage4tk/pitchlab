import { Link } from 'react-router-dom'

export function TermsOfUse() {
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
            Terms of Use
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}>
            Last updated: April 13, 2026
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '40px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Section title="Acceptance of Terms">
            By creating an account or using Pitchlab, you agree to these Terms of Use. If you do not agree, please do not use the service.
          </Section>

          <Section title="Description of Service">
            Pitchlab is an ear training web application that provides interval, chord, melody, rhythm, and chord progression exercises. We reserve the right to modify, suspend, or discontinue any part of the service at any time.
          </Section>

          <Section title="Accounts">
            <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>You must provide accurate information when registering.</li>
              <li>You are responsible for maintaining the security of your account and password.</li>
              <li>You must be at least 13 years old to use Pitchlab.</li>
              <li>One person may not maintain more than one free account.</li>
            </ul>
          </Section>

          <Section title="Acceptable Use">
            You agree not to:
            <ul style={{ paddingLeft: '20px', marginTop: '12px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Use the service for any unlawful purpose.</li>
              <li>Attempt to gain unauthorized access to any part of the service or its infrastructure.</li>
              <li>Scrape, crawl, or systematically download content from the service.</li>
              <li>Interfere with or disrupt the integrity or performance of the service.</li>
              <li>Impersonate another person or entity.</li>
            </ul>
          </Section>

          <Section title="Intellectual Property">
            All content, design, audio samples, and code comprising Pitchlab are owned by or licensed to us. You may not copy, reproduce, distribute, or create derivative works from any part of the service without our prior written consent.
          </Section>

          <Section title="User Data">
            Your use of Pitchlab is also governed by our{' '}
            <Link to="/privacy" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference.
          </Section>

          <Section title="Disclaimer of Warranties">
            Pitchlab is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components. Ear training results vary and we make no guarantees regarding musical improvement.
          </Section>

          <Section title="Limitation of Liability">
            To the fullest extent permitted by law, Pitchlab and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the service.
          </Section>

          <Section title="Termination">
            We reserve the right to suspend or terminate your account at our discretion, including for violations of these Terms. You may delete your account at any time by contacting us.
          </Section>

          <Section title="Changes to These Terms">
            We may update these Terms from time to time. The date at the top of this page reflects the most recent revision. Continued use of Pitchlab after changes constitutes acceptance of the updated Terms.
          </Section>

          <Section title="Governing Law">
            These Terms are governed by the laws of the jurisdiction in which the service operator is located, without regard to conflict of law principles.
          </Section>

          <Section title="Contact">
            Questions about these Terms? Reach us at{' '}
            <a
              href="mailto:legal@pitchlab.app"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              legal@pitchlab.app
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
          <Link to="/privacy" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            letterSpacing: '0.04em',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            Privacy Policy
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
