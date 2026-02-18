import { motion } from 'framer-motion'
import FloatingParticles from '../ui/FloatingParticles'
import styles from './Flow.module.css'

interface Props {
  recipientName: string
  particleColor: string
  onReveal: () => void
}

export default function Reveal({
  recipientName,
  particleColor,
  onReveal,
}: Props) {
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
          A Chronicle Awaits…
        </motion.h1>

        <motion.p
          className={styles.revealSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          For {recipientName}
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
          Open the Chronicle
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
