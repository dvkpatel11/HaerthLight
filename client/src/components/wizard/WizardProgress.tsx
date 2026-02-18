import { motion } from 'framer-motion'
import styles from './WizardProgress.module.css'

const STEPS = [
  { n: 1, label: 'Addressee' },
  { n: 2, label: 'Life & Relationship' },
  { n: 3, label: 'Style' },
  { n: 4, label: 'Visuals' },
  { n: 5, label: 'Preview' },
]

interface Props {
  current: number
}

export default function WizardProgress({ current }: Props) {
  return (
    <nav className={styles.root}>
      {STEPS.map((step, i) => {
        const state = step.n < current ? 'done' : step.n === current ? 'active' : 'idle'
        return (
          <div key={step.n} className={styles.item}>
            <div className={`${styles.node} ${styles[state]}`}>
              {state === 'done' ? (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.8 7L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span>{step.n}</span>
              )}
              {state === 'active' && (
                <motion.div
                  className={styles.ring}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            <span className={`${styles.label} ${styles[state]}`}>{step.label}</span>
            {i < STEPS.length - 1 && (
              <div className={styles.connector}>
                <motion.div
                  className={styles.connectorFill}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: state === 'done' ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
