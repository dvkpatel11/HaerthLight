import { motion } from 'framer-motion'
import styles from './Flow.module.css'

interface Props {
  senderName?: string
  occasionLabel?: string
  tone?: string
  onShare: () => void
  onReplay: () => void
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

function getFarewellCopy(occasionLabel?: string, tone?: string) {
  const lower = (occasionLabel || '').toLowerCase()
  const toneKey = normalizeTone(tone)

  // Birthday × tone matrix
  if (lower.includes('birthday')) {
    if (toneKey === 'heartfelt') return { line: 'May this year hold everything you deserve…', signature: 'With so much love,\nThe Chronicle Keeper' }
    if (toneKey === 'playful') return { line: 'Now go have the best birthday ever!', signature: 'Your personal hype squad,\nThe Chronicle Keeper' }
    if (toneKey === 'celebratory') return { line: "Here's to an absolutely spectacular year ahead!", signature: 'With confetti and cheers,\nThe Chronicle Keeper' }
    if (toneKey === 'intimate') return { line: 'You are so known, and so deeply loved.', signature: 'Softly,\nThe Chronicle Keeper' }
    return { line: 'May this year unfold in bright, gentle chapters for you…', signature: 'With a quiet birthday wish,\nThe Chronicle Keeper' }
  }

  // Recovery / Get Well × tone matrix
  if (lower.includes('recovery') || lower.includes('get well')) {
    if (toneKey === 'heartfelt') return { line: 'One gentle step at a time. We\'re rooting for you.', signature: 'With all the warmth,\nThe Chronicle Keeper' }
    if (toneKey === 'intimate') return { line: "You don't have to be okay yet. We're right here.", signature: 'Quietly beside you,\nThe Chronicle Keeper' }
    return { line: 'May healing find you gently, and rest come easily…', signature: 'With care,\nThe Chronicle Keeper' }
  }

  // Sympathy & Loss
  if (lower.includes('sympathy') || lower.includes('loss')) {
    if (toneKey === 'heartfelt') return { line: 'May you feel held, in however small a way, today.', signature: 'With gentleness,\nThe Chronicle Keeper' }
    return { line: 'May you feel held, in however small a way, today.', signature: 'With gentleness,\nThe Chronicle Keeper' }
  }

  // Just Because × tone matrix
  if (lower.includes('just because') || lower.includes('just-because')) {
    if (toneKey === 'playful') return { line: "You're pretty great. Just so you know.", signature: "From someone who's glad you're here,\nThe Chronicle Keeper" }
    return { line: 'May you feel quietly seen and gently held in this moment…', signature: "From someone who's glad you're here,\nThe Chronicle Keeper" }
  }

  // Anniversary
  if (lower.includes('anniversary') || lower.includes('wedding')) {
    return { line: 'May your shared story keep deepening in light and tenderness…', signature: 'With admiration for your chapter together,\nThe Chronicle Keeper' }
  }

  // Graduation
  if (lower.includes('graduation') || lower.includes('degree')) {
    return { line: 'May the road ahead feel spacious, possible, and completely yours…', signature: 'With reverence for your hard work,\nThe Chronicle Keeper' }
  }

  // Promotion / Career
  if (lower.includes('promotion') || lower.includes('job') || lower.includes('offer')) {
    return { line: 'May this new chapter meet you with courage, ease, and small miracles…', signature: 'Cheering you on,\nThe Chronicle Keeper' }
  }

  // Farewell
  if (lower.includes('farewell')) {
    return { line: 'Carry everything good with you. The world ahead is lucky to have you in it.', signature: 'Until the next chapter,\nThe Chronicle Keeper' }
  }

  // Generic fallback
  return {
    line: 'May your story continue beautifully…',
    signature: 'With warmth,\nThe Chronicle Keeper',
  }
}

export default function Farewell({ senderName = 'A friend', occasionLabel, tone, onShare, onReplay }: Props) {
  const farewell = getFarewellCopy(occasionLabel, tone)
  return (
    <motion.div
      className={styles.stage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className={styles.farewellContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.p
          className={styles.farewellText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {farewell.line}
        </motion.p>

        <motion.p
          className={styles.farewellSignature}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {farewell.signature.split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </motion.p>

        <motion.div
          className={styles.farewellActions}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button
            className={`${styles.ctaButton} ${styles.ctaSecondary}`}
            onClick={onReplay}
          >
            🔁 Replay
          </button>
          <button
            className={`${styles.ctaButton} ${styles.ctaPrimary}`}
            onClick={onShare}
          >
            Share Your Own
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
