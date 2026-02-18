import { motion } from 'framer-motion'
import type { RecipientData, OccasionData, NarrativeContext } from '../../types'
import styles from './Step.module.css'

interface Props {
  recipient: RecipientData
  occasion: OccasionData
  context: NarrativeContext
  onRecipientChange: (d: RecipientData) => void
  onOccasionChange: (d: OccasionData) => void
  onContextChange: (ctx: NarrativeContext) => void
  onNext: () => void
}

const RELATIONSHIPS = [
  'Partner',
  'Spouse',
  'Parent',
  'Child',
  'Sibling',
  'Best Friend',
  'Friend',
  'Mentor',
  'Colleague',
  'Other',
]

const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Graduation',
  'New Chapter',
  'Recovery',
  'Achievement',
  'Farewell',
  'Welcome',
  'Holiday',
  'Just Because',
  'Custom…',
]

export default function Step1Recipient({
  recipient,
  occasion,
  context,
  onRecipientChange,
  onOccasionChange,
  onContextChange,
  onNext,
}: Props) {
  const canProceed =
    recipient.name.trim().length > 0 &&
    recipient.relationship.length > 0 &&
    occasion.label.trim().length > 0

  function toggleTrait(trait: string) {
    const exists = (context.traits || []).includes(trait)
    const nextTraits = exists ? context.traits.filter(t => t !== trait) : [...(context.traits || []), trait]
    onContextChange({
      ...context,
      traits: nextTraits,
    })
  }

  function updateSubject<K extends keyof NarrativeContext['subject']>(key: K, value: NarrativeContext['subject'][K]) {
    onContextChange({
      ...context,
      subject: {
        ...context.subject,
        [key]: value,
      },
    })
  }

  function updateRelationshipPerspective<K extends keyof NarrativeContext['relationshipPerspective']>(
    key: K,
    value: NarrativeContext['relationshipPerspective'][K],
  ) {
    onContextChange({
      ...context,
      relationshipPerspective: {
        ...context.relationshipPerspective,
        [key]: value,
      },
    })
  }

  function updateSettingMood<K extends keyof NarrativeContext['settingMood']>(
    key: K,
    value: NarrativeContext['settingMood'][K],
  ) {
    onContextChange({
      ...context,
      settingMood: {
        ...context.settingMood,
        [key]: value,
      },
    })
  }

  function updateLifeContext<K extends keyof NarrativeContext['lifeContext']>(
    key: K,
    value: NarrativeContext['lifeContext'][K],
  ) {
    onContextChange({
      ...context,
      lifeContext: {
        ...context.lifeContext,
        [key]: value,
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
        <h2 className={styles.title}>Who and what is this for?</h2>
        <p className={styles.desc}>
          Start with the person you&apos;re writing to and the occasion you&apos;re marking.
        </p>
      </div>

      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>Who is this for?</h3>
          <p className={styles.sectionHint}>Just the basics are perfect here.</p>

          <div className={styles.field}>
            <label className={styles.label}>Their name</label>
            <input
              type="text"
              placeholder="e.g. Margot"
              value={recipient.name}
              onChange={e => {
                const name = e.target.value
                onRecipientChange({ ...recipient, name })
                updateSubject('displayName', name)
              }}
              autoFocus
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>
                Age <span className={styles.optional}>(optional)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 30"
                min={1}
                max={120}
                value={recipient.age || ''}
                onChange={e => onRecipientChange({ ...recipient, age: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Your relationship</label>
              <select
                value={recipient.relationship}
                onChange={e => {
                  const relationship = e.target.value
                  onRecipientChange({ ...recipient, relationship })
                  updateRelationshipPerspective('relationshipType', relationship)
                }}
              >
                <option value="" disabled>
                  Select…
                </option>
                {RELATIONSHIPS.map(r => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>What&apos;s the occasion?</h3>
          <p className={styles.sectionHint}>Choose what you&apos;re marking for them.</p>

          <div className={styles.occasionGrid}>
            {OCCASIONS.map(occ => {
              const isCustom = !OCCASIONS.slice(0, -1).includes(occasion.label) && occasion.label !== ''
              const active = occasion.label === occ || (occ === 'Custom…' && isCustom)
              return (
                <button
                  key={occ}
                  type="button"
                  className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                  onClick={() => {
                    if (occ === 'Custom…') {
                      onOccasionChange({ ...occasion, label: '' })
                    } else {
                      onOccasionChange({ ...occasion, label: occ })
                    }
                  }}
                >
                  {occ}
                </button>
              )
            })}
          </div>

          {(occasion.label === '' ||
            (!OCCASIONS.slice(0, -1).includes(occasion.label) && occasion.label !== '')) && (
            <div className={styles.field}>
              <label className={styles.label}>Describe the occasion</label>
              <input
                type="text"
                placeholder="e.g. Finishing her first novel"
                value={
                  !OCCASIONS.slice(0, -1).includes(occasion.label) && occasion.label !== ''
                    ? occasion.label
                    : ''
                }
                onChange={e => onOccasionChange({ ...occasion, label: e.target.value })}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>
              Date <span className={styles.optional}>(optional)</span>
            </label>
            <input
              type="date"
              value={occasion.date || ''}
              onChange={e => onOccasionChange({ ...occasion, date: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>A hint of who they are</h3>
          <p className={styles.sectionHint}>You can say more later, but a few traits now help.</p>

          <div className={styles.chipRow}>
            {['Kind', 'Resilient', 'Curious', 'Playful', 'Steady', 'Brave', 'Gentle', 'Funny'].map(env => (
              <button
                key={env}
                type="button"
                className={`${styles.chip} ${
                  (context.traits || []).includes(env) ? styles.chipActive : ''
                }`}
                onClick={() => toggleTrait(env)}
              >
                {env}
              </button>
            ))}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              In your own words <span className={styles.optional}>(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Somehow always steady and gentle, even when everything is loud."
              value={context.behaviorExample || ''}
              onChange={e =>
                onContextChange({
                  ...context,
                  behaviorExample: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn btn-primary" onClick={onNext} disabled={!canProceed}>
          Continue
        </button>
      </div>
    </motion.div>
  )
}
