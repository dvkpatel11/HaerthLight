import { motion } from 'framer-motion'
import FloatingParticles from '../ui/FloatingParticles'
import styles from './Flow.module.css'

interface Props {
  recipientName: string
  occasionLabel?: string
  particleColor: string
  onReveal: () => void
}

function getOccasionCategory(label?: string) {
  if (!label) return 'general'
  const lower = label.toLowerCase()
  if (lower.includes('birthday')) return 'birthday'
  if (lower.includes('anniversary')) return 'anniversary'
  if (lower.includes('wedding')) return 'anniversary'
  if (lower.includes('job') || lower.includes('promotion') || lower.includes('offer')) return 'milestone'
  if (lower.includes('graduation') || lower.includes('degree')) return 'milestone'
  if (lower.includes('just because') || lower.includes('just-because')) return 'just_because'
  return 'general'
}

function getRevealCopy(occasionLabel: string | undefined, recipientName: string) {
  const category = getOccasionCategory(occasionLabel)

  switch (category) {
    case 'birthday':
      return {
        title: 'A Birthday Chronicle',
        subtitle: `A little constellation for ${recipientName}`,
        cta: 'Open your birthday chapter',
      }
    case 'anniversary':
      return {
        title: 'An Anniversary Chronicle',
        subtitle: `A quiet toast to this chapter with ${recipientName}`,
        cta: 'Open this shared moment',
      }
    case 'milestone':
      return {
        title: 'A Milestone Chronicle',
        subtitle: `A pause to honor this step for ${recipientName}`,
        cta: 'Open this turning point',
      }
    case 'just_because':
      return {
        title: 'A Chronicle, Just Because',
        subtitle: `A small, glowing note for ${recipientName}`,
        cta: 'Open this little love letter',
      }
    default:
      return {
        title: 'A Chronicle Awaits…',
        subtitle: `For ${recipientName}`,
        cta: 'Open the Chronicle',
      }
  }
}

export default function Reveal({
  recipientName,
  occasionLabel,
  particleColor,
  onReveal,
}: Props) {
  const copy = getRevealCopy(occasionLabel, recipientName)
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
