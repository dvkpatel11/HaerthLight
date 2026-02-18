import { motion } from 'framer-motion'
import styles from './Flow.module.css'

interface Props {
  wish: string
  theme: string
  onComplete: () => void
}

export default function AnimatedWish({ wish, theme, onComplete }: Props) {
  const words = wish.split(' ')

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
          ❤️ Send a Smile Back
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
