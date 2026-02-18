import { motion } from 'framer-motion'
import type {
  NarrativeData,
  Tone,
  NarrativeContext,
  MessageGoal,
  EmotionalColor,
  LiteraryStyle,
  MetaphorDensity,
} from '../../types'
import styles from './Step.module.css'

interface Props {
  data: NarrativeData
  context: NarrativeContext
  onChange: (d: NarrativeData) => void
  onContextChange: (ctx: NarrativeContext) => void
  onNext: () => void
  onBack: () => void
}

const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: 'warm & heartfelt', label: 'Heartfelt', desc: 'Sincere, tender, moving' },
  { value: 'playful & light', label: 'Playful', desc: 'Joyful, warm, witty' },
  { value: 'reflective & poetic', label: 'Poetic', desc: 'Literary, contemplative' },
  { value: 'celebratory & joyful', label: 'Celebratory', desc: 'Radiant, exuberant' },
  { value: 'tender & intimate', label: 'Intimate', desc: 'Close, personal, quiet' },
]

const GOALS: MessageGoal[] = ['celebrate', 'encourage', 'honor', 'reflect', 'reassure']
const EMOTIONAL_ATMOSPHERES: EmotionalColor[] = ['warm', 'bittersweet', 'playful', 'reverent']
const STYLES: LiteraryStyle[] = [
  'mythic-fantasy',
  'modern-literary',
  'minimalist',
  'poetic',
  'light-humor',
  'epic-chronicle',
]
const METAPHOR_LEVELS: MetaphorDensity[] = ['low', 'medium', 'rich']

export default function Step3Narrative({ data, context, onChange, onContextChange, onNext, onBack }: Props) {
  const valid = data.tone && data.tone.length > 0

  function updateMessageIntent(partial: Partial<NarrativeContext['messageIntent']>) {
    onContextChange({
      ...context,
      messageIntent: {
        ...context.messageIntent,
        ...partial,
      },
    })
  }

  function toggleEmotionalColor(color: EmotionalColor) {
    const current = context.messageIntent.emotionalMix || []
    const exists = current.includes(color)
    const next = exists ? current.filter(c => c !== color) : [...current, color]
    onContextChange({
      ...context,
      messageIntent: {
        ...context.messageIntent,
        emotionalMix: next,
      },
    })
  }

  function updateStyleLayer(partial: Partial<NarrativeContext['styleLayer']>) {
    onContextChange({
      ...context,
      styleLayer: {
        ...context.styleLayer,
        ...partial,
      },
    })
  }

  return (
    <motion.div
      className={styles.step}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Style & intention</h2>
        <p className={styles.desc}>
          Decide how you want the chronicle to feel and sound.
        </p>
      </div>

      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>Tone</h3>
          <p className={styles.sectionHint}>Choose the emotional register for the writing.</p>

          <div className={styles.field}>
            <div className={styles.toneGrid}>
              {TONES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  className={`${styles.toneCard} ${data.tone === t.value ? styles.toneActive : ''}`}
                  onClick={() => onChange({ ...data, tone: t.value })}
                >
                  <span className={styles.toneLabel}>{t.label}</span>
                  <span className={styles.toneDesc}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>What are you hoping this message does?</h3>
          <p className={styles.sectionHint}>Choose a main intention and the emotional colors you want it to carry.</p>

          <div className={styles.field}>
            <label className={styles.label}>Primary goal</label>
            <div className={styles.chipRow}>
              {GOALS.map(goal => (
                <button
                  key={goal}
                  type="button"
                  className={`${styles.chip} ${
                    context.messageIntent.primaryGoal === goal ? styles.chipActive : ''
                  }`}
                  onClick={() => updateMessageIntent({ primaryGoal: goal })}
                >
                  {goal.charAt(0).toUpperCase() + goal.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Emotional mix <span className={styles.optional}>(pick one or more)</span>
            </label>
            <div className={styles.chipRow}>
              {EMOTIONAL_ATMOSPHERES.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.chip} ${
                    context.messageIntent.emotionalMix.includes(color) ? styles.chipActive : ''
                  }`}
                  onClick={() => toggleEmotionalColor(color)}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <details className={styles.fieldGroup}>
          <summary className={styles.sectionTitle}>Style flavor (optional)</summary>
          <p className={styles.sectionHint}>
            These control the &quot;voice&quot; without changing what you told us about them.
          </p>

          <div className={styles.field}>
            <label className={styles.label}>
              Literary style <span className={styles.optional}>(optional)</span>
            </label>
            <div className={styles.chipRow}>
              {STYLES.map(style => (
                <button
                  key={style}
                  type="button"
                  className={`${styles.chip} ${
                    context.styleLayer.literaryStyle === style ? styles.chipActive : ''
                  }`}
                  onClick={() => updateStyleLayer({ literaryStyle: style })}
                >
                  {style.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Metaphor density</label>
            <div className={styles.chipRow}>
              {METAPHOR_LEVELS.map(level => (
                <button
                  key={level}
                  type="button"
                  className={`${styles.chip} ${
                    context.styleLayer.metaphorDensity === level ? styles.chipActive : ''
                  }`}
                  onClick={() => updateStyleLayer({ metaphorDensity: level })}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </details>
      </div>

      <div className={styles.actions}>
        <button className="btn btn-ghost" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext} disabled={!valid}>
          Continue
        </button>
      </div>
    </motion.div>
  )
}
