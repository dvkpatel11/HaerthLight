import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { fetchChronicle, logView, fetchStats } from '../lib/api'
import type { Chronicle } from '../types'
import FloatingParticles from '../components/ui/FloatingParticles'
import { getThemeBackground, getThemeTextureLayers, getThemeLottieOverlay } from '../lib/themeAssets'
import LottieOverlay from '../components/ui/LottieOverlay'
import styles from './Chronicle.module.css'

const THEME_PARTICLES: Record<string, string> = {
  'golden-warmth':  'rgba(201, 168, 76, 0.5)',
  'midnight-bloom': 'rgba(160, 100, 210, 0.4)',
  'ocean-calm':     'rgba(80, 180, 200, 0.4)',
  'forest-dawn':    'rgba(100, 180, 80, 0.35)',
  'celestial':      'rgba(200, 130, 200, 0.4)',
}

const THEME_OVERLAY: Record<string, string> = {
  'golden-warmth':  'linear-gradient(180deg, rgba(14,12,10,0.55) 0%, rgba(14,12,10,0.85) 60%, #0e0c0a 100%)',
  'midnight-bloom': 'linear-gradient(180deg, rgba(10,8,20,0.55) 0%, rgba(10,8,20,0.88) 60%, #0a0814 100%)',
  'ocean-calm':     'linear-gradient(180deg, rgba(5,15,22,0.55) 0%, rgba(5,15,22,0.88) 60%, #050f16 100%)',
  'forest-dawn':    'linear-gradient(180deg, rgba(8,15,10,0.55) 0%, rgba(8,15,10,0.88) 60%, #080f0a 100%)',
  'celestial':      'linear-gradient(180deg, rgba(8,8,18,0.55) 0%, rgba(8,8,18,0.88) 60%, #080812 100%)',
}

const THEME_ACCENT: Record<string, string> = {
  'golden-warmth':  '#c9a84c',
  'midnight-bloom': '#a064d2',
  'ocean-calm':     '#50b4c8',
  'forest-dawn':    '#64b450',
  'celestial':      '#c882c8',
}

export default function Chronicle() {
  const { slug } = useParams<{ slug: string }>()
  const [chronicle, setChronicle] = useState<Chronicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [showFinal, setShowFinal] = useState(false)
  const [stats, setStats] = useState<{ views: number } | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: heroRef })
  const imageParallax = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => {
    if (!slug) return
    fetchChronicle(slug)
      .then(c => {
        setChronicle(c)
        logView(slug)
      })
      .catch(() => setError('This chronicle could not be found.'))
      .finally(() => setLoading(false))
  }, [slug])

  // Try to load stats if creator token exists
  useEffect(() => {
    if (!slug || !chronicle) return
    const token = localStorage.getItem(`hl_token_${slug}`)
    if (!token) return
    fetchStats(slug, token)
      .then(s => setStats(s))
      .catch(() => {})
  }, [slug, chronicle])

  // Begin reveal sequence after load
  useEffect(() => {
    if (chronicle) {
      const t = setTimeout(() => setRevealed(true), 400)
      return () => clearTimeout(t)
    }
  }, [chronicle])

  const theme = chronicle?.theme || 'golden-warmth'
  const accent = THEME_ACCENT[theme] || THEME_ACCENT['golden-warmth']
  const particleColor = THEME_PARTICLES[theme] || THEME_PARTICLES['golden-warmth']
  const overlay = THEME_OVERLAY[theme] || THEME_OVERLAY['golden-warmth']

  const backgroundImage = chronicle?.imageUrl || getThemeBackground(theme)
  const textureLayers = getThemeTextureLayers()
  const lottieOverlay = getThemeLottieOverlay()

  const context = chronicle?.narrativeContext
  const lifePhrase = context?.lifeContext?.chapterTone || ''
  const primaryGoal = context?.messageIntent?.primaryGoal
  const stance = context?.relationshipPerspective?.emotionalStance
  const intentLine = primaryGoal && chronicle
    ? `A letter to ${primaryGoal} ${chronicle.recipient.name.toLowerCase() === 'you' ? '' : 'you'}`.trim()
    : ''

  // Split prose into paragraphs for staggered reveal
  const paragraphs = chronicle?.prose.split('\n\n').filter(Boolean) || []

  if (loading) {
    return (
      <div className={styles.loadState}>
        <div className={styles.loadOrb} style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.loadState}>
        <p className={styles.errorMsg}>{error}</p>
      </div>
    )
  }

  if (!chronicle) return null

  return (
    <div className={styles.root} style={{ '--accent': accent } as React.CSSProperties}>
      {/* Floating particles */}
      <FloatingParticles count={25} color={particleColor} />

      {/* Hero image with parallax */}
      <div className={styles.heroWrap} ref={heroRef}>
        <motion.div
          className={styles.heroImage}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            y: shouldReduceMotion ? undefined : imageParallax,
            opacity: imageOpacity,
          }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 1.02, 1],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 40,
                  repeat: Infinity,
                  ease: 'linear',
                }
          }
        />
        {textureLayers.map((src, index) => (
          <motion.div
            key={index}
            className={styles.textureLayer}
            style={{ backgroundImage: `url(${src})` }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: [0.15, 0.3, 0.15],
                    y: [0, -10, 0],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 30 + index * 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
          />
        ))}
        <div className={styles.heroOverlay} style={{ background: overlay }} />
      </div>

      {/* Main content */}
      <div className={styles.content}>
        {lottieOverlay && (
          <div className={styles.lottieLayer}>
            <LottieOverlay src={lottieOverlay} />
          </div>
        )}

        {/* Header */}
        <AnimatePresence>
          {revealed && (
            <motion.header
              className={styles.header}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.eyebrow} style={{ color: accent }}>Hearthlight</span>
              <div className={styles.dividerLine} style={{ background: `linear-gradient(to right, transparent, ${accent}40, transparent)` }} />
            </motion.header>
          )}
        </AnimatePresence>

        {/* Occasion + name */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              className={styles.occasion}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.occasionLabel}>{chronicle.occasion.label}</span>
              <h1 className={styles.recipientName}>
                For {chronicle.recipient.name}
              </h1>
              {lifePhrase && (
                <p className={styles.lifeLine}>
                  In this season of {lifePhrase.toLowerCase()}
                </p>
              )}
              {(intentLine || stance) && (
                <p className={styles.intentLine}>
                  {intentLine}
                  {intentLine && stance ? ' · ' : ''}
                  {stance || ''}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prose */}
        <div className={styles.proseSection}>
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              className={styles.para}
              initial={{ opacity: 0, y: 24 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.7 + i * 0.25,
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              onAnimationComplete={() => {
                if (i === paragraphs.length - 1) {
                  setTimeout(() => setShowFinal(true), 600)
                }
              }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Final animated wish */}
        <AnimatePresence>
          {showFinal && (
            <motion.div
              className={styles.finalWish}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.finalOrb} style={{ background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)` }} />
              <motion.div
                className={styles.finalLine}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
              />
              <motion.p
                className={styles.finalText}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1.2 }}
                style={{ color: accent }}
              >
                With all that you are, and all you are becoming —
              </motion.p>
              <motion.p
                className={styles.finalName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 1.1 }}
              >
                Happy {chronicle.occasion.label}, {chronicle.recipient.name}.
              </motion.p>
              <motion.div
                className={styles.finalLine}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Creator stats bar */}
        {stats && (
          <motion.div
            className={styles.statsBar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <span className={styles.statsText}>
              Viewed {stats.views} {stats.views === 1 ? 'time' : 'times'}
            </span>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          Made with Hearthlight
        </motion.footer>
      </div>
    </div>
  )
}
