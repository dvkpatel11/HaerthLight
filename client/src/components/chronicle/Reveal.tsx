import { motion } from 'framer-motion'
import FloatingParticles from '../ui/FloatingParticles'
import styles from './Flow.module.css'

interface Props {
  recipientName: string
  occasionLabel?: string
  tone?: string
  particleColor: string
  onReveal: () => void
}

function getOccasionCategory(label?: string) {
  if (!label) return 'general'
  const lower = label.toLowerCase()
  if (lower.includes('birthday')) return 'birthday'
  if (lower.includes('anniversary')) return 'anniversary'
  if (lower.includes('wedding')) return 'anniversary'
  if (lower.includes('graduation') || lower.includes('degree')) return 'graduation'
  if (lower.includes('farewell')) return 'farewell'
  if (lower.includes('just because') || lower.includes('just-because')) return 'just_because'
  if (lower.includes('job') || lower.includes('promotion') || lower.includes('offer')) return 'milestone'
  return 'general'
}

function normalizeTone(tone?: string) {
  if (!tone) return 'general'
  const t = tone.toLowerCase()
  if (t.includes('heartfelt') || t.includes('warm')) return 'heartfelt'
  if (t.includes('playful') || t.includes('light')) return 'playful'
  if (t.includes('poetic') || t.includes('reflective')) return 'poetic'
  if (t.includes('celebratory') || t.includes('joyful')) return 'celebratory'
  if (t.includes('intimate') || t.includes('tender')) return 'intimate'
  return 'general'
}

function getRevealCopy(occasionLabel: string | undefined, recipientName: string, tone?: string) {
  const category = getOccasionCategory(occasionLabel)
  const toneKey = normalizeTone(tone)

  // Birthday × tone matrix
  if (category === 'birthday') {
    if (toneKey === 'heartfelt') return { title: 'A Birthday Chronicle', subtitle: `A little constellation for ${recipientName}`, cta: 'Open this birthday letter' }
    if (toneKey === 'playful') return { title: "It's Your Day!", subtitle: `A birthday surprise for ${recipientName}`, cta: 'Open your birthday surprise' }
    if (toneKey === 'poetic') return { title: 'A Chronicle for the Day You Were Born', subtitle: `For ${recipientName}`, cta: 'Step into this birthday chapter' }
    if (toneKey === 'celebratory') return { title: 'Happy Birthday!', subtitle: `Time to celebrate ${recipientName}`, cta: "Let's celebrate you properly" }
    if (toneKey === 'intimate') return { title: 'A Letter, Just for You', subtitle: `For ${recipientName}`, cta: 'Open this quiet birthday wish' }
    return { title: 'A Birthday Chronicle', subtitle: `A little constellation for ${recipientName}`, cta: 'Open your birthday chapter' }
  }

  // Anniversary
  if (category === 'anniversary') {
    if (toneKey === 'heartfelt') return { title: 'An Anniversary Chronicle', subtitle: `A quiet toast to this chapter with ${recipientName}`, cta: 'Open this shared moment' }
    return { title: 'An Anniversary Chronicle', subtitle: `A quiet toast to this chapter with ${recipientName}`, cta: 'Open this shared moment' }
  }

  // Graduation
  if (category === 'graduation') {
    if (toneKey === 'celebratory') return { title: 'You Did It.', subtitle: `A graduation tribute for ${recipientName}`, cta: 'Open your graduation tribute' }
    return { title: 'A Milestone Chronicle', subtitle: `A pause to honor this step for ${recipientName}`, cta: 'Open this turning point' }
  }

  // Farewell
  if (category === 'farewell') {
    if (toneKey === 'intimate' || toneKey === 'heartfelt') return { title: 'Before You Go…', subtitle: `For ${recipientName}`, cta: 'Open this farewell letter' }
    return { title: 'Before You Go…', subtitle: `For ${recipientName}`, cta: 'Open this farewell letter' }
  }

  // Just because
  if (category === 'just_because') {
    if (toneKey === 'playful') return { title: 'A Little Something', subtitle: `A small, glowing note for ${recipientName}`, cta: 'Open this little love note' }
    return { title: 'A Chronicle, Just Because', subtitle: `A small, glowing note for ${recipientName}`, cta: 'Open this little love letter' }
  }

  // Milestone fallback
  if (category === 'milestone') {
    return { title: 'A Milestone Chronicle', subtitle: `A pause to honor this step for ${recipientName}`, cta: 'Open this turning point' }
  }

  // General fallback
  return {
    title: 'A Chronicle Awaits…',
    subtitle: `For ${recipientName}`,
    cta: 'Open the Chronicle',
  }
}

export default function Reveal({
  recipientName,
  occasionLabel,
  tone,
  particleColor,
  onReveal,
}: Props) {
  const copy = getRevealCopy(occasionLabel, recipientName, tone)
  return (
    <motion.div
      className={styles.stage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <FloatingParticles
        count={30}
        color={particleColor}
      />

      <motion.div className={styles.revealContent}>
        <motion.h1
          className={styles.revealTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {copy.title}
        </motion.h1>

        <motion.p
          className={styles.revealSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {copy.subtitle}
        </motion.p>

        <motion.button
          className={`${styles.ctaButton} ${styles.ctaReveal}`}
          onClick={onReveal}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✨ {copy.cta}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
