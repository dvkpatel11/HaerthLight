import { motion } from 'framer-motion'
import styles from './Flow.module.css'

interface Props {
  prose: string
  recipientName: string
  occasionLabel: string
  onComplete: () => void
}

export default function ChronicleReading({
  prose,
  recipientName,
  occasionLabel,
  onComplete,
}: Props) {
  const paragraphs = prose.split('\n\n').filter(Boolean)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const paragraphVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
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
      <div className={styles.readingContainer}>
        <motion.div
          className={styles.readingHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.readingCrest}>✦</div>
          <p className={styles.readingOccasion}>{occasionLabel}</p>
          <h2 className={styles.readingName}>{recipientName}</h2>
        </motion.div>

        <motion.div
          className={styles.proseContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {paragraphs.map((para, idx) => (
            <motion.p
              key={idx}
              className={styles.proseParagraph}
              variants={paragraphVariants}
            >
              {para}
            </motion.p>
          ))}
        </motion.div>

        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ↓
          </motion.div>
        </motion.div>

        <motion.button
          className={`${styles.ctaButton} ${styles.ctaPrimary}`}
          onClick={onComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➜ Next
        </motion.button>
      </div>
    </motion.div>
  )
}
