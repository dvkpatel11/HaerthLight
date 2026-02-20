import { motion } from 'framer-motion'
import styles from './Flow.module.css'

interface Props {
  senderName?: string
  onShare: () => void
  onReplay: () => void
}

export default function Farewell({ senderName = 'A friend', onShare, onReplay }: Props) {
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
          May your story continue beautifully…
        </motion.p>

        <motion.p
          className={styles.farewellSignature}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          With warmth,<br />
          The Chronicle Keeper
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
