import { motion } from 'framer-motion'
import type { RecipientData, NarrativeContext, MessageGoal, EmotionalColor, MetaphorDensity, LiteraryStyle } from '../../types'
import styles from './Step.module.css'

interface Props {
  recipient: RecipientData
  context: NarrativeContext
  onRecipientChange: (d: RecipientData) => void
  onContextChange: (ctx: NarrativeContext) => void
  onNext: () => void
}

const RELATIONSHIPS = [
  'Partner', 'Spouse', 'Parent', 'Child', 'Sibling',
  'Best Friend', 'Friend', 'Mentor', 'Colleague', 'Other',
]

const TRAIT_PRESETS = [
  'Kind', 'Resilient', 'Curious', 'Playful', 'Steady', 'Brave', 'Gentle', 'Funny',
]

const ENVIRONMENT_PRESETS = [
  'Quiet evening at home',
  'City lights at night',
  'Forest path at dawn',
  'Seaside at golden hour',
]

const SYMBOLIC_STYLES = [
  'Mythic realm',
  'Coastal town',
  'Modern city',
  'Pastoral landscape',
]

const EMOTIONAL_ATMOSPHERES: EmotionalColor[] = ['warm', 'bittersweet', 'playful', 'reverent']

const GOALS: MessageGoal[] = ['celebrate', 'encourage', 'honor', 'reflect', 'reassure']

const STYLES: LiteraryStyle[] = [
  'mythic-fantasy',
  'modern-literary',
  'minimalist',
  'poetic',
  'light-humor',
  'epic-chronicle',
]

const METAPHOR_LEVELS: MetaphorDensity[] = ['low', 'medium', 'rich']

export default function Step1Recipient({ recipient, context, onRecipientChange, onContextChange, onNext }: Props) {
  const traits = context.traits || []
  const canProceed =
    recipient.name.trim().length > 0 &&
    recipient.relationship.length > 0 &&
    traits.length >= 1 &&
    context.messageIntent.primaryGoal !== undefined

  function toggleTrait(trait: string) {
    const exists = traits.includes(trait)
    const nextTraits = exists ? traits.filter(t => t !== trait) : [...traits, trait]
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

  function updateConnection<K extends keyof NarrativeContext['connectionSignal']>(
    key: K,
    value: NarrativeContext['connectionSignal'][K],
  ) {
    onContextChange({
      ...context,
      connectionSignal: {
        ...context.connectionSignal,
        [key]: value,
      },
    })
  }

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

  function updateClosing<K extends keyof NarrativeContext['closingStyle']>(
    key: K,
    value: NarrativeContext['closingStyle'][K],
  ) {
    onContextChange({
      ...context,
      closingStyle: {
        ...context.closingStyle,
        [key]: value,
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
        <h2 className={styles.title}>Lay the foundation</h2>
        <p className={styles.desc}>
          A few focused details so the chronicle feels like it could only be for them.
        </p>
      </div>

      <div className={styles.fields}>
        {/* Section 1: Who is this for? */}
        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>Who is this for?</h3>
          <p className={styles.sectionHint}>We&apos;ll start with how you see them in everyday life.</p>

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

          <div className={styles.field}>
            <label className={styles.label}>
              Life milestone or moment <span className={styles.optional}>(e.g. birthday, new chapter)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 30th birthday, starting a new job, moving cities"
              value={context.subject.milestone || ''}
              onChange={e => updateSubject('milestone', e.target.value)}
            />
          </div>
        </div>

        {/* Section 2: How do you see them? */}
        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>How do you see them?</h3>
          <p className={styles.sectionHint}>Choose a few traits and, if you like, one small example.</p>

          <div className={styles.chipRow}>
            {TRAIT_PRESETS.map(trait => (
              <button
                key={trait}
                type="button"
                className={`${styles.chip} ${traits.includes(trait) ? styles.chipActive : ''}`}
                onClick={() => toggleTrait(trait)}
              >
                {trait}
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

        {/* Section 3: Where are they in life right now? */}
        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>Where are they in life right now?</h3>
          <p className={styles.sectionHint}>A sentence or two about this chapter is perfect.</p>

          <div className={styles.field}>
            <label className={styles.label}>This chapter looks like…</label>
            <textarea
              rows={2}
              placeholder="e.g. Learning how to be newly married while carrying a lot at work."
              value={context.lifeContext.transitionMoment || ''}
              onChange={e => updateLifeContext('transitionMoment', e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              The emotional tone of this season <span className={styles.optional}>(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Quietly brave, a little tender around the edges."
              value={context.lifeContext.chapterTone || ''}
              onChange={e => updateLifeContext('chapterTone', e.target.value)}
            />
          </div>
        </div>

        {/* Section 4: Atmosphere */}
        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>What atmosphere should this live in?</h3>
          <p className={styles.sectionHint}>We&apos;ll use this as a backdrop for the opening.</p>

          <div className={styles.occasionGrid}>
            {ENVIRONMENT_PRESETS.map(env => (
              <button
                key={env}
                type="button"
                className={`${styles.chip} ${
                  context.settingMood.environmentMood === env ? styles.chipActive : ''
                }`}
                onClick={() => updateSettingMood('environmentMood', env)}
              >
                {env}
              </button>
            ))}
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>
                Symbolic setting style <span className={styles.optional}>(optional)</span>
              </label>
              <select
                value={context.settingMood.symbolicStyle || ''}
                onChange={e => updateSettingMood('symbolicStyle', e.target.value)}
              >
                <option value="">Choose style…</option>
                {SYMBOLIC_STYLES.map(style => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Atmosphere in one phrase <span className={styles.optional}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Tender and hopeful, with a little starlight."
                value={context.settingMood.emotionalAtmosphere || ''}
                onChange={e => updateSettingMood('emotionalAtmosphere', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 5: What are you hoping this message does? */}
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

        {/* Section 6: Personal connection */}
        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>What makes this relationship yours?</h3>
          <p className={styles.sectionHint}>A single detail is enough to keep it from feeling generic.</p>

          <div className={styles.field}>
            <label className={styles.label}>One small behavior or dynamic</label>
            <input
              type="text"
              placeholder="e.g. She always texts when she knows I have a big day coming."
              value={context.connectionSignal.behaviorOrDynamic || ''}
              onChange={e => updateConnection('behaviorOrDynamic', e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Why they matter to you <span className={styles.optional}>(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. She is the person who quietly holds the edges of my life together."
              value={context.connectionSignal.whyTheyMatter || ''}
              onChange={e => updateConnection('whyTheyMatter', e.target.value)}
            />
          </div>
        </div>

        {/* Section 7: Style flavor (optional) */}
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
        <button className="btn btn-primary" onClick={onNext} disabled={!canProceed}>
          Continue
        </button>
      </div>
    </motion.div>
  )
}
