import { motion } from 'framer-motion'

interface Props {
  label: string
  onClick: () => void
}

export function PlayButton({ label, onClick }: Props) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '28px 0',
    }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Ripple rings */}
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 88,
              height: 88,
              borderRadius: '50%',
              border: '1.5px solid var(--accent)',
              pointerEvents: 'none',
            }}
            animate={{ scale: [1, 2.2 + i * 0.4], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, delay: i * 1.0, ease: 'easeOut' }}
          />
        ))}

        {/* Button */}
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'var(--bg-surface-2)',
            border: '1.5px solid var(--accent)',
            color: 'var(--accent)',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 32px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.04)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          ▶
        </motion.button>
      </div>

      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        fontWeight: 500,
      }}>
        {label}
      </span>
    </div>
  )
}
