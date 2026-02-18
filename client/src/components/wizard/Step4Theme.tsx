import { motion } from 'framer-motion'
import type { Theme } from '../../types'
import { getThemeBackground } from '../../lib/themeAssets'
import styles from './Step.module.css'

interface Props {
  value: Theme
  onChange: (t: Theme) => void
  onNext: () => void
  onBack: () => void
}

const THEMES: { id: Theme; label: string; desc: string; gradient: string }[] = [
  {
    id: 'golden-warmth',
    label: 'Golden Warmth',
    desc: 'Amber hour, autumn light',
    gradient: 'linear-gradient(135deg, #3d2b0f 0%, #6b4c1e 40%, #c9a84c 100%)',
  },
  {
    id: 'midnight-bloom',
    label: 'Midnight Bloom',
    desc: 'Moonlit garden, deep indigo',
    gradient: 'linear-gradient(135deg, #0d0a1f 0%, #2a1a4a 40%, #7b4f9e 100%)',
  },
  {
    id: 'ocean-calm',
    label: 'Ocean Calm',
    desc: 'Teal dawn, still waters',
    gradient: 'linear-gradient(135deg, #071f2a 0%, #0d4a5e 40%, #2a9ab5 100%)',
  },
  {
    id: 'forest-dawn',
    label: 'Forest Dawn',
    desc: 'Ancient trees, morning mist',
    gradient: 'linear-gradient(135deg, #0c1f0e 0%, #1e4a22 40%, #4a8c3f 100%)',
  },
  {
    id: 'celestial',
    label: 'Celestial',
    desc: 'Deep cosmos, rose nebula',
    gradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 40%, #7a3a7a 100%)',
  },
]

export default function Step4Theme({ value, onChange, onNext, onBack }: Props) {
  return (
    <motion.div
      className={styles.step}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Set the atmosphere</h2>
        <p className={styles.desc}>
          The visual world your chronicle will inhabit.
        </p>
      </div>

      <div className={styles.themeGrid}>
        {THEMES.map(theme => (
          <button
            key={theme.id}
            className={`${styles.themeCard} ${value === theme.id ? styles.themeActive : ''}`}
            onClick={() => onChange(theme.id)}
          >
            <div
              className={styles.themePreview}
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.1)), url(${getThemeBackground(theme.id)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className={styles.themeMeta}>
              <span className={styles.themeLabel}>{theme.label}</span>
              <span className={styles.themeDesc}>{theme.desc}</span>
            </div>
            {value === theme.id && (
              <div className={styles.themeCheck}>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <button className="btn btn-ghost" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={onNext}>Generate Chronicle</button>
      </div>
    </motion.div>
  )
}
