import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { WizardState } from '../../types'
import { saveChronicle } from '../../lib/api'
import styles from './Step.module.css'
import previewStyles from './Step5Preview.module.css'

interface Props {
  state: WizardState
  onProseChange: (prose: string) => void
  onRegenerate: () => void
  onBack: () => void
  generating: boolean
  error?: string
}

export default function Step5Preview({
  state,
  onProseChange,
  onRegenerate,
  onBack,
  generating,
  error,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<{ slug: string; creatorToken: string } | null>(null)
  const [saveError, setSaveError] = useState('')
  const navigate = useNavigate()

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    try {
      const result = await saveChronicle(state)
      localStorage.setItem(`hl_token_${result.slug}`, result.creatorToken)
      setSaved({ slug: result.slug, creatorToken: result.creatorToken })
    } catch {
      setSaveError('Failed to save. Is the server running?')
    } finally {
      setSaving(false)
    }
  }

  if (saved) {
    const url = `${window.location.origin}/c/${saved.slug}`
    return (
      <motion.div
        className={previewStyles.savedState}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={previewStyles.savedIcon}>✦</div>
        <h2 className={previewStyles.savedTitle}>Your chronicle is ready</h2>
        <p className={previewStyles.savedSub}>
          Share this link with {state.recipient.name}.
        </p>
        <div className={previewStyles.linkBox}>
          <span className={previewStyles.linkText}>{url}</span>
          <button
            className="btn btn-primary"
            onClick={() => navigator.clipboard.writeText(url)}
          >
            Copy
          </button>
        </div>
        <div className={previewStyles.savedActions}>
          <button className="btn btn-ghost" onClick={() => navigate(`/c/${saved.slug}`)}>
            Preview as recipient
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/')}>
            Create another
          </button>
        </div>
        <p className={previewStyles.tokenNote}>
          Your creator token has been saved in this browser to track views.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`${styles.step} ${previewStyles.root}`}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Your chronicle</h2>
        <p className={styles.desc}>
          Read it. Refine it. When it feels right, share it.
        </p>
      </div>

      {generating ? (
        <div className={previewStyles.generating}>
          <div className={previewStyles.generatingOrb} />
          <p>Composing your chronicle…</p>
        </div>
      ) : error ? (
        <div className={previewStyles.error}>
          <p>{error}</p>
          <button className="btn btn-ghost" onClick={onRegenerate}>Try again</button>
        </div>
      ) : (
        <>
          <div className={previewStyles.proseContainer}>
            {state.imageUrl && (
              <div
                className={previewStyles.imageStrip}
                style={{ backgroundImage: `url(${state.imageUrl})` }}
              />
            )}
            {editing ? (
              <textarea
                className={previewStyles.proseEditor}
                value={state.prose}
                onChange={e => onProseChange(e.target.value)}
                rows={18}
              />
            ) : (
              <div className={previewStyles.prose}>
                {state.prose.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </div>

          <div className={previewStyles.toolbar}>
            <button className="btn btn-ghost" onClick={() => setEditing(!editing)}>
              {editing ? 'Done editing' : 'Edit prose'}
            </button>
            <button className="btn btn-ghost" onClick={onRegenerate} disabled={generating}>
              Regenerate
            </button>
          </div>
        </>
      )}

      {saveError && <p className={previewStyles.saveError}>{saveError}</p>}

      <div className={styles.actions}>
        <button className="btn btn-ghost" onClick={onBack}>Back</button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving || generating || !state.prose}
        >
          {saving ? <><span className="spinner" /> Saving…</> : 'Share Chronicle'}
        </button>
      </div>
    </motion.div>
  )
}
