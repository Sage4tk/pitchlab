import { Link } from 'react-router-dom'
import { COURSES } from '@/courses/data'
import { useCourseStore } from '@/store/useCourseStore'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function Courses() {
  const progress = useCourseStore((s) => s.progress)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 600,
            color: 'var(--text)', letterSpacing: '-0.01em', margin: 0, lineHeight: 1.1,
          }}>
            Courses
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)',
            margin: '8px 0 0', letterSpacing: '0.04em',
          }}>
            Structured learning paths to build your ear step by step
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(380px, 100%), 1fr))',
            gap: '12px',
            marginTop: '32px',
          }}
        >
          {COURSES.map((course) => {
            const cp = progress[course.id]
            const completedCount = cp?.completedLessons.length ?? 0
            const totalLessons = course.lessons.length
            const pct = Math.round((completedCount / totalLessons) * 100)
            const status = !cp ? 'Not Started' : cp.completedAt ? 'Completed' : 'In Progress'
            const statusColor = !cp ? 'var(--text-faint)' : cp.completedAt ? 'var(--success)' : 'var(--accent)'

            return (
              <Link key={course.id} to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    padding: '24px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'border-color 0.15s, background 0.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: '32px',
                      color: 'var(--accent)', lineHeight: 1, opacity: 0.85,
                    }}>
                      {course.symbol}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
                        color: 'var(--text)', letterSpacing: '0.02em',
                      }}>
                        {course.title}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: '10px',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: statusColor, fontWeight: 600, marginTop: '2px',
                      }}>
                        {status}
                      </div>
                    </div>
                  </div>

                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '11px',
                    color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.6,
                    letterSpacing: '0.02em',
                  }}>
                    {course.description}
                  </p>

                  {/* Progress bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      flex: 1, height: '4px', background: 'var(--bg-highlight)',
                      borderRadius: '2px', overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: cp?.completedAt ? 'var(--success)' : 'var(--accent)',
                        borderRadius: '2px', transition: 'width 0.3s ease',
                      }} />
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '10px',
                      color: 'var(--text-faint)', letterSpacing: '0.04em', whiteSpace: 'nowrap',
                    }}>
                      {completedCount}/{totalLessons} lessons
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
