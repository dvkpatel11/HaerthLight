import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.18, duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  })
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.root}>
      {/* Ambient background */}
      <div className={styles.ambient} aria-hidden />

      <main className={styles.center}>
        <motion.span
          className={styles.eyebrow}
          custom={0} variants={FADE_UP} initial="hidden" animate="visible"
        >
          Hearthlight
        </motion.span>

        <motion.h1
          className={styles.headline}
          custom={1} variants={FADE_UP} initial="hidden" animate="visible"
        >
          Words that<br />
          <em>hold someone</em>
        </motion.h1>

        <motion.p
          className={styles.sub}
          custom={2} variants={FADE_UP} initial="hidden" animate="visible"
        >
          Craft a living, personalized message for the people who matter most —
          one they will carry with them.
        </motion.p>

        <motion.div
          custom={3} variants={FADE_UP} initial="hidden" animate="visible"
        >
          <button className={`btn btn-primary ${styles.cta}`} onClick={() => navigate('/create')}>
            Begin a Chronicle
          </button>
        </motion.div>

        <motion.p
          className={styles.footnote}
          custom={4} variants={FADE_UP} initial="hidden" animate="visible"
        >
          No account needed &nbsp;·&nbsp; Shareable link &nbsp;·&nbsp; Private by default
        </motion.p>
      </main>

      {/* Decorative line */}
      <div className={styles.lineLeft} aria-hidden />
      <div className={styles.lineRight} aria-hidden />
    </div>
  )
}
