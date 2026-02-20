import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type {
  WizardState,
  RecipientData,
  OccasionData,
  NarrativeData,
  Theme,
  NarrativeContext,
  MessageGoal,
  EmotionalColor,
  MetaphorDensity,
} from '../types'
import WizardProgress from '../components/wizard/WizardProgress'
import Step1Recipient from '../components/wizard/Step1Recipient'
import Step2Occasion from '../components/wizard/Step2Occasion'
import Step3Narrative from '../components/wizard/Step3Narrative'
import Step4Theme from '../components/wizard/Step4Theme'
import Step5Preview from '../components/wizard/Step5Preview'
import { generateProse, generateImage } from '../lib/api'
import styles from './Create.module.css'

const DEFAULT_GOAL: MessageGoal = 'celebrate'
const DEFAULT_EMOTIONAL_MIX: EmotionalColor[] = ['warm']
const DEFAULT_METAPHOR_DENSITY: MetaphorDensity = 'medium'

const INITIAL_CONTEXT: NarrativeContext = {
  subject: {
    displayName: '',
    archetype: '',
    milestone: '',
    lifePhase: '',
  },
  traits: [],
  behaviorExample: '',
  relationshipPerspective: {
    relationshipType: '',
    narratorPersona: '',
    emotionalStance: '',
  },
  settingMood: {
    environmentMood: '',
    symbolicStyle: '',
    emotionalAtmosphere: '',
  },
  lifeContext: {
    recentChallenges: '',
    transitionMoment: '',
    chapterTone: '',
  },
  connectionSignal: {
    behaviorOrDynamic: '',
    sharedMemoryTone: '',
    whyTheyMatter: '',
  },
  messageIntent: {
    primaryGoal: DEFAULT_GOAL,
    emotionalMix: DEFAULT_EMOTIONAL_MIX,
  },
  closingStyle: {
    wishIntensity: 'poetic',
    futureOrientation: '',
  },
  styleLayer: {
    literaryStyle: 'modern-literary',
    metaphorDensity: DEFAULT_METAPHOR_DENSITY,
  },
}

const INITIAL_STATE: WizardState = {
  recipient: { name: '', relationship: '' },
  occasion: { label: '' },
  narrative: { tone: 'warm & heartfelt' },
  narrativeContext: INITIAL_CONTEXT,
  theme: 'golden-warmth',
  prose: '',
  imageUrl: undefined,
}

export default function Create() {
  const [authenticated, setAuthenticated] = useState(false)
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [step, setStep] = useState(1)
  const [state, setState] = useState<WizardState>(INITIAL_STATE)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')
  const navigate = useNavigate()

  function handleAuth() {
    if (authPassword === 'Adminx11!') {
      setAuthenticated(true)
      setAuthError('')
    } else {
      setAuthError('Invalid credentials')
      setAuthPassword('')
    }
  }

  const updateRecipient = useCallback((d: RecipientData) => {
    setState(s => ({
      ...s,
      recipient: d,
      narrativeContext: {
        ...s.narrativeContext,
        subject: {
          ...s.narrativeContext.subject,
          displayName: d.name || s.narrativeContext.subject.displayName,
        },
        relationshipPerspective: {
          ...s.narrativeContext.relationshipPerspective,
          relationshipType: d.relationship || s.narrativeContext.relationshipPerspective.relationshipType,
        },
      },
    }))
  }, [])

  const updateNarrativeContext = useCallback((ctx: NarrativeContext) => {
    setState(s => ({
      ...s,
      narrativeContext: ctx,
    }))
  }, [])

  const updateOccasion = useCallback((d: OccasionData) => {
    setState(s => ({
      ...s,
      occasion: d,
      narrativeContext: {
        ...s.narrativeContext,
        subject: {
          ...s.narrativeContext.subject,
          milestone: d.label || s.narrativeContext.subject.milestone,
        },
      },
    }))
  }, [])

  const updateNarrative = useCallback((d: NarrativeData) => {
    setState(s => ({
      ...s,
      narrative: d,
      narrativeContext: {
        ...s.narrativeContext,
        connectionSignal: {
          ...s.narrativeContext.connectionSignal,
          sharedMemoryTone: d.sharedMemory || s.narrativeContext.connectionSignal.sharedMemoryTone,
          behaviorOrDynamic: d.traits || s.narrativeContext.connectionSignal.behaviorOrDynamic,
        },
        lifeContext: {
          ...s.narrativeContext.lifeContext,
          chapterTone: d.tone || s.narrativeContext.lifeContext.chapterTone,
        },
      },
    }))
  }, [])
  const updateTheme = useCallback((t: Theme) => setState(s => ({ ...s, theme: t })), [])
  const updateProse = useCallback((prose: string) => setState(s => ({ ...s, prose })), [])

  async function generate() {
    setGenerating(true)
    setGenError('')
    setStep(5)

    try {
      const [prose, imageUrl] = await Promise.all([
        generateProse({
          recipient: state.recipient,
          occasion: state.occasion,
          narrative: state.narrative,
          narrativeContext: state.narrativeContext,
          theme: state.theme,
        }),
        generateImage(state.theme).catch(() => undefined), // image is optional
      ])
      setState(s => ({ ...s, prose, imageUrl }))
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setGenError(error.message || 'Generation failed. Check server config.')
    } finally {
      setGenerating(false)
    }
  }

  async function handleRegenerate() {
    setGenerating(true)
    setGenError('')
    try {
      const prose = await generateProse({
        recipient: state.recipient,
        occasion: state.occasion,
        narrative: state.narrative,
        narrativeContext: state.narrativeContext,
        theme: state.theme,
      })
      setState(s => ({ ...s, prose }))
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setGenError(error.message || 'Generation failed.')
    } finally {
      setGenerating(false)
    }
  }

  if (!authenticated) {
    return (
      <div className={styles.root}>
        <div className={styles.ambient} aria-hidden />
        <div className={styles.layout}>
          <button className={styles.homeLink} onClick={() => navigate('/')}>
            ← Hearthlight
          </button>
          <div className={styles.authModal}>
            <h2 className={styles.authTitle}>Access Required</h2>
            <p className={styles.authDesc}>Enter credentials to create a chronicle</p>
            <input
              type="password"
              placeholder="Password"
              value={authPassword}
              onChange={e => setAuthPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
              autoFocus
              className={styles.authInput}
            />
            {authError && <p className={styles.authError}>{authError}</p>}
            <button className={`btn btn-primary ${styles.authButton}`} onClick={handleAuth}>
              Authenticate
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      {/* Ambient */}
      <div className={styles.ambient} aria-hidden />

      <div className={styles.layout}>
        {/* Back to home */}
        <button className={styles.homeLink} onClick={() => navigate('/')}>
          ← Hearthlight
        </button>

        {/* Progress */}
        <div className={styles.progressWrap}>
          <WizardProgress current={step} />
        </div>

        {/* Steps */}
        <div className={styles.stepWrap}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1Recipient
                key="s1"
                recipient={state.recipient}
                occasion={state.occasion}
                context={state.narrativeContext}
                onRecipientChange={updateRecipient}
                onOccasionChange={updateOccasion}
                onContextChange={updateNarrativeContext}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <Step2Occasion
                key="s2"
                context={state.narrativeContext}
                narrative={state.narrative}
                onContextChange={updateNarrativeContext}
                onNarrativeChange={updateNarrative}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3Narrative
                key="s3"
                data={state.narrative}
                context={state.narrativeContext}
                onChange={updateNarrative}
                onContextChange={updateNarrativeContext}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <Step4Theme
                key="s4"
                value={state.theme}
                context={state.narrativeContext}
                onChange={updateTheme}
                onContextChange={updateNarrativeContext}
                onNext={generate}
                onBack={() => setStep(3)}
              />
            )}
            {step === 5 && (
              <Step5Preview
                key="s5"
                state={state}
                onProseChange={updateProse}
                onRegenerate={handleRegenerate}
                onBack={() => setStep(4)}
                generating={generating}
                error={genError}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
