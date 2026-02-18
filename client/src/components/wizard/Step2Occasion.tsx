import { motion } from 'framer-motion'
import type { NarrativeContext, NarrativeData } from '../../types'
import styles from './Step.module.css'

interface Props {
  context: NarrativeContext
  narrative: NarrativeData
  onContextChange: (ctx: NarrativeContext) => void
  onNarrativeChange: (d: NarrativeData) => void
  onNext: () => void
  onBack: () => void
}

export default function Step2Occasion({
  context,
  narrative,
  onContextChange,
  onNarrativeChange,
  onNext,
  onBack,
}: Props) {
  const valid = (context.traits && context.traits.length > 0) || narrative.sharedMemory?.trim().length > 0

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

  function toggleTrait(trait: string) {
    const traits = context.traits || []
    const exists = traits.includes(trait)
    const nextTraits = exists ? traits.filter(t => t !== trait) : [...traits, trait]
    onContextChange({
      ...context,
      traits: nextTraits,
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
        <h2 className={styles.title}>Life & relationship</h2>
        <p className={styles.desc}>
          A few details about this chapter and what they mean to you.
        </p>
      </div>

      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>How do you see them?</h3>
          <p className={styles.sectionHint}>Pick a few traits and, if you like, add your own words.</p>

          <div className={styles.chipRow}>
            {['Kind', 'Resilient', 'Curious', 'Playful', 'Steady', 'Brave', 'Gentle', 'Funny'].map(trait => (
              <button
                key={trait}
                type="button"
                className={`${styles.chip} ${
                  (context.traits || []).includes(trait) ? styles.chipActive : ''
                }`}
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

        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>A shared thread between you</h3>
          <p className={styles.sectionHint}>One memory or small dynamic keeps the chronicle from feeling generic.</p>

          <div className={styles.field}>
            <label className={styles.label}>
              A shared memory or detail to weave in <span className={styles.optional}>(optional)</span>
            </label>
            <textarea
              placeholder="e.g. The road trip where we got completely lost and laughed until we cried…"
              value={narrative.sharedMemory || ''}
              onChange={e => onNarrativeChange({ ...narrative, sharedMemory: e.target.value })}
              rows={3}
            />
          </div>

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
