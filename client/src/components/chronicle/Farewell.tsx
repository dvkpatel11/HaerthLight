import { motion } from 'framer-motion'
import styles from './Flow.module.css'

interface Props {
  senderName?: string
  occasionLabel?: string
  onShare: () => void
  onReplay: () => void
}

function getFarewellCopy(occasionLabel?: string) {
  if (!occasionLabel) {
    return {
      line: 'May your story continue beautifully…',
      signature: 'With warmth,\nThe Chronicle Keeper',
    }
  }

  const lower = occasionLabel.toLowerCase()

  if (lower.includes('birthday')) {
    return {
      line: 'May this year unfold in bright, gentle chapters for you…',
      signature: 'With a quiet birthday wish,\nThe Chronicle Keeper',
    }
  }

  if (lower.includes('anniversary') || lower.includes('wedding')) {
    return {
      line: 'May your shared story keep deepening in light and tenderness…',
      signature: 'With admiration for your chapter together,\nThe Chronicle Keeper',
    }
  }

  if (lower.includes('job') || lower.includes('promotion') || lower.includes('offer')) {
    return {
      line: 'May this new chapter meet you with courage, ease, and small miracles…',
      signature: 'Cheering you on,\nThe Chronicle Keeper',
    }
  }

  if (lower.includes('graduation') || lower.includes('degree')) {
    return {
      line: 'May the road ahead feel spacious, possible, and completely yours…',
      signature: 'With reverence for your hard work,\nThe Chronicle Keeper',
    }
  }

  if (lower.includes('just because') || lower.includes('just-because')) {
    return {
      line: 'May you feel quietly seen and gently held in this moment…',
      signature: 'From someone who’s glad you’re here,\nThe Chronicle Keeper',
    }
  }

  return {
    line: 'May your story continue beautifully…',
    signature: 'With warmth,\nThe Chronicle Keeper',
  }
}

export default function Farewell({ senderName = 'A friend', occasionLabel, onShare, onReplay }: Props) {
  const farewell = getFarewellCopy(occasionLabel)
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
