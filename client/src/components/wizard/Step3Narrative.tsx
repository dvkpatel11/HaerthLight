import { motion } from 'framer-motion'
import type { NarrativeData, Tone } from '../../types'
import styles from './Step.module.css'

interface Props {
  data: NarrativeData
  onChange: (d: NarrativeData) => void
  onNext: () => void
  onBack: () => void
}

const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: 'warm & heartfelt',     label: 'Heartfelt',   desc: 'Sincere, tender, moving' },
  { value: 'playful & light',      label: 'Playful',     desc: 'Joyful, warm, witty' },
  { value: 'reflective & poetic',  label: 'Poetic',      desc: 'Literary, contemplative' },
  { value: 'celebratory & joyful', label: 'Celebratory', desc: 'Radiant, exuberant' },
  { value: 'tender & intimate',    label: 'Intimate',    desc: 'Close, personal, quiet' },
]

export default function Step3Narrative({ data, onChange, onNext, onBack }: Props) {
  const valid = data.tone && data.tone.length > 0

  return (
    <motion.div
      className={styles.step}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Shape the story</h2>
        <p className={styles.desc}>
          These details give the chronicle its soul.
        </p>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>Tone</label>
          <div className={styles.toneGrid}>
            {TONES.map(t => (
              <button
                key={t.value}
                className={`${styles.toneCard} ${data.tone === t.value ? styles.toneActive : ''}`}
                onClick={() => onChange({ ...data, tone: t.value })}
              >
                <span className={styles.toneLabel}>{t.label}</span>
                <span className={styles.toneDesc}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            A shared memory or detail to weave in <span className={styles.optional}>(optional)</span>
          </label>
          <textarea
            placeholder="e.g. The road trip where we got completely lost and laughed until we cried…"
            value={data.sharedMemory || ''}
            onChange={e => onChange({ ...data, sharedMemory: e.target.value })}
            rows={3}
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>
              Their qualities <span className={styles.optional}>(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. resilient, curious, generous"
              value={data.traits || ''}
              onChange={e => onChange({ ...data, traits: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Anything else to include <span className={styles.optional}>(optional)</span>
          </label>
          <textarea
            placeholder="Any other context, inside jokes, or things that matter…"
            value={data.notes || ''}
            onChange={e => onChange({ ...data, notes: e.target.value })}
            rows={2}
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
