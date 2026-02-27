import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { fetchChronicle, logView } from '../lib/api'
import type { Chronicle } from '../types'
import FloatingParticles from '../components/ui/FloatingParticles'
import AudioControls from '../components/ui/AudioControls'
import { getThemeBackground, getThemeTextureLayers, getThemeLottieOverlay } from '../lib/themeAssets'
import LottieOverlay from '../components/ui/LottieOverlay'
import Reveal from '../components/chronicle/Reveal'
import ChronicleReading from '../components/chronicle/ChronicleReading'
import Transition from '../components/chronicle/Transition'
import AnimatedWish from '../components/chronicle/AnimatedWish'
import Farewell from '../components/chronicle/Farewell'
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

type FlowStage = 'reveal' | 'reading' | 'transition' | 'wish' | 'farewell'

export default function Chronicle() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [chronicle, setChronicle] = useState<Chronicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [flowStage, setFlowStage] = useState<FlowStage>('reveal')
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

  const theme = chronicle?.theme || 'golden-warmth'
  const accent = THEME_ACCENT[theme] || THEME_ACCENT['golden-warmth']
  const particleColor = THEME_PARTICLES[theme] || THEME_PARTICLES['golden-warmth']
  const overlay = THEME_OVERLAY[theme] || THEME_OVERLAY['golden-warmth']

  const backgroundImage = chronicle?.imageUrl || getThemeBackground(theme)
  const showAnimation = !!chronicle?.animationUrl && !shouldReduceMotion
  const textureLayers = getThemeTextureLayers()
  const lottieOverlay = getThemeLottieOverlay()

  const generateWish = (): string => {
    const recipient = chronicle?.recipient.name || 'you'
    const occasion = chronicle?.occasion.label || 'this special moment'
    const wishes = [
      `May ${recipient} shine brightly on this ${occasion.toLowerCase()}.`,
      `Wishing ${recipient} a magnificent ${occasion.toLowerCase()}.`,
      `Here's to ${recipient}'s beautiful journey ahead.`,
      `${recipient}, you are truly cherished.`,
      `May your ${occasion.toLowerCase()} be as wonderful as you are.`,
    ]
    return wishes[Math.floor(Math.random() * wishes.length)]
  }

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
      {/* Background layers */}
      <FloatingParticles count={25} color={particleColor} />

      {chronicle.audioUrl && (
        <audio src={chronicle.audioUrl} autoPlay loop style={{ display: 'none' }} />
      )}
      {chronicle.musicUrl && (
        <AudioControls src={chronicle.musicUrl} accentColor={accent} />
      )}

      <div className={styles.heroWrap} ref={heroRef}>
        {showAnimation ? (
          <video
            className={styles.heroImage}
            src={chronicle.animationUrl}
            poster={backgroundImage}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
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
        )}
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

      {lottieOverlay && (
        <div className={styles.lottieLayer}>
          <LottieOverlay src={lottieOverlay} />
        </div>
      )}

      {/* Flow stages */}
      <AnimatePresence mode="wait">
        {flowStage === 'reveal' && (
          <Reveal
            key="reveal"
            recipientName={chronicle.recipient.name}
            occasionLabel={chronicle.occasion.label}
            tone={chronicle.narrative?.tone}
            particleColor={particleColor}
            onReveal={() => setFlowStage('reading')}
          />
        )}

        {flowStage === 'reading' && (
          <ChronicleReading
            key="reading"
            prose={chronicle.prose}
            recipientName={chronicle.recipient.name}
            occasionLabel={chronicle.occasion.label}
            onComplete={() => setFlowStage('transition')}
          />
        )}

        {flowStage === 'transition' && (
          <Transition
            key="transition"
            occasionLabel={chronicle.occasion.label}
            onComplete={() => setFlowStage('wish')}
          />
        )}

        {flowStage === 'wish' && (
          <AnimatedWish
            key="wish"
            wish={generateWish()}
            theme={theme}
            occasionLabel={chronicle.occasion.label}
            onComplete={() => setFlowStage('farewell')}
          />
        )}

        {flowStage === 'farewell' && (
          <Farewell
            key="farewell"
            senderName={chronicle.recipient.name}
            occasionLabel={chronicle.occasion.label}
            tone={chronicle.narrative?.tone}
            onShare={() => navigate('/')}
            onReplay={() => setFlowStage('reveal')}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
