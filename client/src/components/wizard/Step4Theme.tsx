import { motion } from 'framer-motion'
import type { Theme, Language, NarrativeContext } from '../../types'
import { getThemeBackground } from '../../lib/themeAssets'
import styles from './Step.module.css'

interface Props {
  value: Theme
  language: Language
  context: NarrativeContext
  onChange: (t: Theme) => void
  onLanguageChange: (l: Language) => void
  onContextChange: (ctx: NarrativeContext) => void
  onNext: () => void
  onBack: () => void
}

const LANGUAGES: Language[] = ['English', 'Hindi', 'Gujarati', 'Bengali', 'Swahili']

const THEMES: { id: Theme; label: string; desc: string; color: string }[] = [
  {
    id: 'golden-warmth',
    label: 'Golden Warmth',
    desc: 'Amber hour, autumn light',
    color: '#c9a84c',
  },
  {
    id: 'midnight-bloom',
    label: 'Midnight Bloom',
    desc: 'Moonlit garden, deep indigo',
    color: '#a064d2',
  },
  {
    id: 'ocean-calm',
    label: 'Ocean Calm',
    desc: 'Teal dawn, still waters',
    color: '#50b4c8',
  },
  {
    id: 'forest-dawn',
    label: 'Forest Dawn',
    desc: 'Ancient trees, morning mist',
    color: '#64b450',
  },
  {
    id: 'celestial',
    label: 'Celestial',
    desc: 'Deep cosmos, rose nebula',
    color: '#c882c8',
  },
]

const ENVIRONMENT_PRESETS = [
  'Quiet evening at home',
  'City lights at night',
  'Forest path at dawn',
  'Seaside at golden hour',
]

const SYMBOLIC_STYLES = ['Mythic realm', 'Coastal town', 'Modern city', 'Pastoral landscape']

export default function Step4Theme({ value, language, context, onChange, onLanguageChange, onContextChange, onNext, onBack }: Props) {
  function updateSettingMood<K extends keyof NarrativeContext['settingMood']>(
    key: K,
    val: NarrativeContext['settingMood'][K],
  ) {
    onContextChange({
      ...context,
      settingMood: {
        ...context.settingMood,
        [key]: val,
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
        <h2 className={styles.title}>Visual atmosphere</h2>
        <p className={styles.desc}>
          Choose the visual world and backdrop your chronicle will live in.
        </p>
      </div>

      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>Language</h3>
          <p className={styles.sectionHint}>Choose the language for your chronicle.</p>
          <div className={styles.occasionGrid}>
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
          <h3 className={styles.sectionTitle}>Theme</h3>
          <p className={styles.sectionHint}>This controls the overall color palette and artwork.</p>

          <div className={styles.themeGrid}>
            {THEMES.map(theme => (
              <button
                key={theme.id}
                type="button"
                className={`${styles.themeCard} ${value === theme.id ? styles.themeActive : ''}`}
                onClick={() => onChange(theme.id)}
              >
                <div
                  className={styles.themePreview}
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme.color}22 0%, ${theme.color}11 50%, rgba(0,0,0,0.3) 100%), url(${getThemeBackground(
                      theme.id,
                    )})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div
                  className={styles.themeColorSwatch}
                  style={{ backgroundColor: theme.color }}
                  aria-hidden
                />
                <div className={styles.themeMeta}>
                  <span className={styles.themeLabel}>{theme.label}</span>
                  <span className={styles.themeDesc}>{theme.desc}</span>
                </div>
                {value === theme.id && (
                  <div className={styles.themeCheck}>
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1 5L4.5 8.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>Backdrop & atmosphere</h3>
          <p className={styles.sectionHint}>We&apos;ll use this to set the opening scene.</p>

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
      </div>

      <div className={styles.actions}>
        <button className="btn btn-ghost" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Generate Chronicle
        </button>
      </div>
    </motion.div>
  )
}
