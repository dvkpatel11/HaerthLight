import { motion } from 'framer-motion'
import type { OccasionData } from '../../types'
import styles from './Step.module.css'

interface Props {
  data: OccasionData
  recipient: string
  onChange: (d: OccasionData) => void
  onNext: () => void
  onBack: () => void
}

const OCCASIONS = [
  'Birthday', 'Anniversary', 'Wedding', 'Graduation',
  'New Chapter', 'Recovery', 'Achievement', 'Farewell',
  'Welcome', 'Holiday', 'Just Because', 'Custom…'
]

export default function Step2Occasion({ data, recipient, onChange, onNext, onBack }: Props) {
  const isCustom = !OCCASIONS.slice(0, -1).includes(data.label) && data.label !== ''
  const valid = data.label.trim().length > 0

  return (
    <motion.div
      className={styles.step}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>What are we celebrating?</h2>
        <p className={styles.desc}>
          Choose the occasion for {recipient || 'them'}.
        </p>
      </div>

      <div className={styles.fields}>
        <div className={styles.occasionGrid}>
          {OCCASIONS.map(occ => (
            <button
              key={occ}
              className={`${styles.chip} ${data.label === occ || (occ === 'Custom…' && isCustom) ? styles.chipActive : ''}`}
              onClick={() => {
                if (occ === 'Custom…') {
                  onChange({ ...data, label: '' })
                } else {
                  onChange({ ...data, label: occ })
                }
              }}
            >
              {occ}
            </button>
          ))}
        </div>

        {(isCustom || data.label === '') && (
          <div className={styles.field}>
            <label className={styles.label}>Describe the occasion</label>
            <input
              type="text"
              placeholder="e.g. Finishing her first novel"
              value={isCustom ? data.label : ''}
              onChange={e => onChange({ ...data, label: e.target.value })}
              autoFocus
            />
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Date <span className={styles.optional}>(optional)</span></label>
          <input
            type="date"
            value={data.date || ''}
            onChange={e => onChange({ ...data, date: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn btn-ghost" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={onNext} disabled={!valid}>Continue</button>
      </div>
    </motion.div>
  )
}
