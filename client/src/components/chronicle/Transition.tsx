import { useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './Flow.module.css'

interface Props {
  onComplete: () => void
  occasionLabel?: string
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

function getTransitionLine(occasionLabel?: string) {
  const category = getOccasionCategory(occasionLabel)

  switch (category) {
    case 'birthday':
      return 'Before this page closes, a small birthday wish is gathering itself for you…'
    case 'anniversary':
      return 'Between these pages, a quiet toast to your shared chapter is coming into view…'
    case 'graduation':
      return 'Across this turning point, a wish for the path ahead is about to appear…'
    case 'new_chapter':
      return 'On the cusp of this new chapter, a gentle sendoff is finding its words…'
    case 'recovery':
      return 'In the hush after the story, a softer, steadier wish is arriving for you…'
    case 'achievement':
      return 'Beyond these words, a small standing ovation is waiting for you…'
    case 'farewell':
      return 'As this chapter settles, a quiet blessing for the road ahead is taking shape…'
    case 'welcome':
      return 'At the doorway of this beginning, a warm welcome is almost here…'
    case 'holiday':
      return 'After the story’s last line, a little seasonal light is about to flicker on…'
    case 'just_because':
      return 'On the other side of this page, a simple “I’m glad you’re here” is unfolding…'
    default:
      return 'Every story deserves a wish…'
  }
}

export default function Transition({ onComplete, occasionLabel }: Props) {
  const line = getTransitionLine(occasionLabel)
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className={styles.stage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className={styles.transitionContent}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.p
          className={styles.transitionText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {line}
        </motion.p>

        <motion.div
          className={styles.transitionGlow}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  )
}
