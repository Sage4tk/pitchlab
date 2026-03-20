import { useParams, Link, Navigate } from 'react-router-dom'
import { getCourse } from '@/courses/data'
import { useCourseStore } from '@/store/useCourseStore'
import { useSession } from '@/hooks/useSession'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>()
  const course = courseId ? getCourse(courseId) : undefined
  const { user } = useSession()
  const { progress, startCourse, isLessonUnlocked, isLessonCompleted } = useCourseStore()

  if (!course) return <Navigate to="/courses" replace />

  const cp = progress[course.id]
  const completedCount = cp?.completedLessons.length ?? 0
  const pct = Math.round((completedCount / course.lessons.length) * 100)

  function handleStart() {
    startCourse(course!.id, user?.uid)
  }

  // Find current lesson to continue
  const currentLesson = cp
    ? course.lessons.find((l) => !cp.completedLessons.includes(l.id))
    : course.lessons[0]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Back link */}
        <Link to="/courses" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
          }}>
            ← All Courses
          </span>
        </Link>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}
          style={{ marginTop: '20px', marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '36px',
              color: 'var(--accent)', lineHeight: 1, opacity: 0.85,
            }}>
              {course.symbol}
            </span>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 600,
              color: 'var(--text)', margin: 0, letterSpacing: '-0.01em',
            }}>
              {course.title}
            </h1>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)',
            margin: '8px 0 16px', letterSpacing: '0.02em', lineHeight: 1.6,
          }}>
            {course.description}
          </p>

          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              flex: 1, height: '6px', background: 'var(--bg-highlight)',
              borderRadius: '3px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: cp?.completedAt ? 'var(--success)' : 'var(--accent)',
                borderRadius: '3px', transition: 'width 0.3s ease',
                boxShadow: pct > 0 ? '0 0 6px var(--accent-glow)' : 'none',
              }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
              color: 'var(--accent)', letterSpacing: '0.04em',
            }}>
              {pct}%
            </span>
          </div>

          {/* Continue button */}
          {currentLesson && !cp?.completedAt && (
            <Link
              to={cp ? `/courses/${course.id}/${currentLesson.id}` : '#'}
              onClick={!cp ? handleStart : undefined}
              style={{ textDecoration: 'none', display: 'block', marginTop: '20px' }}
            >
              <button
                onClick={!cp ? handleStart : undefined}
                style={{
                  width: '100%', padding: '14px',
                  background: 'var(--accent)', color: '#0F0D0B', border: 'none',
                  borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)',
                  fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  boxShadow: '0 4px 16px var(--accent-glow)', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-bright)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
              >
                {cp ? `Continue: ${currentLesson.title}` : 'Start Course'}
              </button>
            </Link>
          )}
        </motion.div>

        {/* Lesson timeline */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0' }}
        >
          {course.lessons.map((lesson, idx) => {
            const completed = isLessonCompleted(course.id, lesson.id)
            const unlocked = isLessonUnlocked(course.id, lesson.id)
            const isLast = idx === course.lessons.length - 1

            return (
              <div key={lesson.id}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {/* Timeline indicator */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    width: '32px', flexShrink: 0,
                  }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      border: '2px solid',
                      borderColor: completed ? 'var(--success)' : unlocked ? 'var(--accent)' : 'var(--border)',
                      background: completed ? 'var(--success)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700,
                      color: completed ? '#fff' : unlocked ? 'var(--accent)' : 'var(--text-faint)',
                    }}>
                      {completed ? '✓' : unlocked ? '▶' : '🔒'}
                    </div>
                    {!isLast && (
                      <div style={{
                        width: '2px', flex: 1, minHeight: '20px',
                        background: completed ? 'var(--success)' : 'var(--border)',
                      }} />
                    )}
                  </div>

                  {/* Lesson card */}
                  {unlocked ? (
                    <Link to={`/courses/${course.id}/${lesson.id}`} style={{ textDecoration: 'none', flex: 1, marginBottom: '12px' }}>
                      <div
                        style={{
                          padding: '16px 20px',
                          background: 'var(--bg-surface)',
                          border: '1px solid',
                          borderColor: completed ? 'var(--success)' : 'var(--border)',
                          borderRadius: 'var(--radius-md)',
                          opacity: completed ? 0.8 : 1,
                          transition: 'border-color 0.15s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => { if (!completed) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = completed ? 'var(--success)' : 'var(--border)' }}
                      >
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500,
                          color: 'var(--text)', marginBottom: '4px',
                        }}>
                          {lesson.title}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: '11px',
                          color: 'var(--text-muted)', letterSpacing: '0.02em',
                        }}>
                          {lesson.description}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: '10px',
                          color: 'var(--text-faint)', marginTop: '8px',
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                        }}>
                          {lesson.rounds} rounds
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div style={{
                      flex: 1, marginBottom: '12px',
                      padding: '16px 20px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      opacity: 0.5,
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500,
                        color: 'var(--text-muted)', marginBottom: '4px',
                      }}>
                        {lesson.title}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: '11px',
                        color: 'var(--text-faint)', letterSpacing: '0.02em',
                      }}>
                        {lesson.description}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: '10px',
                        color: 'var(--text-faint)', marginTop: '8px',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                      }}>
                        {lesson.rounds} rounds · Complete previous lesson to unlock
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
