import { motion } from 'framer-motion'
import styles from './Flow.module.css'

interface Props {
  wish: string
  theme: string
  occasionLabel?: string
  onComplete: () => void
}

function getOccasionCategory(label?: string) {
  if (!label) return 'general'
  const lower = label.toLowerCase()
  if (lower.includes('birthday')) return 'birthday'
  if (lower.includes('anniversary') || lower.includes('wedding')) return 'anniversary'
  if (lower.includes('graduation')) return 'graduation'
  if (lower.includes('new chapter')) return 'new_chapter'
  if (lower.includes('recovery')) return 'recovery'
  if (lower.includes('achievement')) return 'achievement'
  if (lower.includes('farewell')) return 'farewell'
  if (lower.includes('welcome')) return 'welcome'
  if (lower.includes('holiday')) return 'holiday'
  if (lower.includes('just because') || lower.includes('just-because')) return 'just_because'
  return 'general'
}

function getCtaLabel(occasionLabel?: string) {
  const category = getOccasionCategory(occasionLabel)

  switch (category) {
    case 'birthday':
      return 'Send a little birthday light back'
    case 'anniversary':
      return 'Send a little warmth back'
    case 'graduation':
      return 'Send a cheer forward'
    case 'new_chapter':
      return 'Send courage into this chapter'
    case 'recovery':
      return 'Send a gentle note back'
    case 'achievement':
      return 'Send a quiet applause back'
    case 'farewell':
      return 'Carry this wish with you'
    case 'welcome':
      return 'Send a hello back'
    case 'holiday':
      return 'Send a festive spark back'
    case 'just_because':
      return 'Send a small smile back'
    default:
      return 'Send a smile back'
  }
}

export default function AnimatedWish({ wish, theme, occasionLabel, onComplete }: Props) {
  const words = wish.split(' ')
  const ctaLabel = getCtaLabel(occasionLabel)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      className={styles.stage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className={styles.wishContainer}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className={`${styles.wishGlow} ${styles[`glow_${theme}`] || ''}`}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <motion.div
          className={styles.wishText}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, idx) => (
            <motion.span
              key={idx}
              className={styles.wishWord}
              variants={wordVariants}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        <motion.button
          className={`${styles.ctaButton} ${styles.ctaSecondary}`}
          onClick={onComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: words.length * 0.06 + 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {ctaLabel}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
