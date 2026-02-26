import { motion } from 'framer-motion'
import type { RecipientData, OccasionData, NarrativeContext, Language } from '../../types'
import styles from './Step.module.css'

interface Props {
  recipient: RecipientData
  occasion: OccasionData
  context: NarrativeContext
  language: Language
  onRecipientChange: (d: RecipientData) => void
  onOccasionChange: (d: OccasionData) => void
  onContextChange: (ctx: NarrativeContext) => void
  onLanguageChange: (l: Language) => void
  onNext: () => void
}

const LANGUAGES: Language[] = ['English', 'Hindi', 'Gujarati', 'Bengali', 'Swahili']

const RELATIONSHIPS = [
  'Partner',
  'Spouse',
  'Parent',
  'Child',
  'Grandparent',
  'Grandchild',
  'Sibling',
  'Best Friend',
  'Friend',
  'Mentor',
  'Teacher / Coach',
  'Colleague',
  'Self',
  'Other',
]

const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Graduation',
  'New Chapter',
  'Recovery / Get Well',
  'Achievement',
  'Farewell',
  'Welcome',
  'Holiday',
  'Just Because',
  'Retirement',
  'Promotion',
  'Baby Shower',
  'Religious / Cultural Holiday',
  'Sympathy & Loss',
  'Something else…',
]

export default function Step1Recipient({
  recipient,
  occasion,
  context,
  language,
  onRecipientChange,
  onOccasionChange,
  onContextChange,
  onLanguageChange,
  onNext,
}: Props) {
  const hasName = recipient.name.trim().length > 0
  const hasRelationship = recipient.relationship.trim().length > 0
  const hasOccasion = occasion.label.trim().length > 0
  const canProceed = hasName && hasRelationship && hasOccasion

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
          <h3 className={styles.sectionTitle}>Chronicle language</h3>
          <p className={styles.sectionHint}>Choose the language your chronicle will be written in.</p>
          <div className={styles.chipRow}>
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                type="button"
                className={`${styles.chip} ${language === lang ? styles.chipActive : ''}`}
                onClick={() => onLanguageChange(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>Who is this for?</h3>

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
              const active = occasion.label === occ || (occ === 'Something else…' && isCustom)
              return (
                <button
                  key={occ}
                  type="button"
                  className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                  onClick={() => {
                    if (occ === 'Something else…') {
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

      </div>

      <div className={styles.actions}>
        <button className="btn btn-primary" onClick={onNext} disabled={!canProceed}>
          Continue
        </button>
      </div>
    </motion.div>
  )
}
