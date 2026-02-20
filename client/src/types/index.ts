export type Theme =
  | 'golden-warmth'
  | 'midnight-bloom'
  | 'ocean-calm'
  | 'forest-dawn'
  | 'celestial';

export type Tone =
  | 'warm & heartfelt'
  | 'playful & light'
  | 'reflective & poetic'
  | 'celebratory & joyful'
  | 'tender & intimate';

export type MessageGoal =
  | 'celebrate'
  | 'encourage'
  | 'honor'
  | 'reflect'
  | 'reassure';

export type EmotionalColor =
  | 'warm'
  | 'bittersweet'
  | 'playful'
  | 'reverent';

export type LiteraryStyle =
  | 'mythic-fantasy'
  | 'modern-literary'
  | 'minimalist'
  | 'poetic'
  | 'light-humor'
  | 'epic-chronicle';

export type MetaphorDensity =
  | 'low'
  | 'medium'
  | 'rich';

export interface RecipientData {
  name: string;
  age?: string;
  relationship: string;
}

export interface OccasionData {
  label: string;
  date?: string;
}

export interface NarrativeData {
  tone: Tone;
  sharedMemory?: string;
  traits?: string;
  notes?: string;
}

export interface SubjectIdentity {
  /**
   * How the recipient should be referred to in the prose
   * (e.g. first name, nickname, or title).
   */
  displayName: string;
  archetype?: string;
  milestone?: string;
  lifePhase?: string;
}

export interface RelationshipPerspective {
  relationshipType: string;
  narratorPersona?: string;
  emotionalStance?: string;
}

export interface SettingMood {
  environmentMood?: string;
  symbolicStyle?: string;
  emotionalAtmosphere?: string;
}

export interface LifeContext {
  recentChallenges?: string;
  transitionMoment?: string;
  chapterTone?: string;
}

export interface ConnectionSignal {
  behaviorOrDynamic?: string;
  sharedMemoryTone?: string;
  whyTheyMatter?: string;
}

export interface MessageIntent {
  primaryGoal: MessageGoal;
  emotionalMix: EmotionalColor[];
}

export interface ClosingWishStyle {
  wishIntensity: 'simple' | 'poetic' | 'grand';
  futureOrientation?: string;
}

export interface StyleLayer {
  literaryStyle?: LiteraryStyle;
  metaphorDensity: MetaphorDensity;
}

export interface NarrativeContext {
  subject: SubjectIdentity;
  traits: string[];
  behaviorExample?: string;
  relationshipPerspective: RelationshipPerspective;
  settingMood: SettingMood;
  lifeContext: LifeContext;
  connectionSignal: ConnectionSignal;
  messageIntent: MessageIntent;
  closingStyle: ClosingWishStyle;
  styleLayer: StyleLayer;
}

export interface WizardState {
  recipient: RecipientData;
  occasion: OccasionData;
  narrative: NarrativeData;
  narrativeContext: NarrativeContext;
  theme: Theme;
  prose: string;
  imageUrl?: string;
  animationUrl?: string;
}

export interface Chronicle {
  id: string;
  slug: string;
  recipient: RecipientData;
  occasion: OccasionData;
  narrative: NarrativeData;
  narrativeContext?: NarrativeContext;
  theme: Theme;
  prose: string;
  imageUrl?: string;
  animationUrl?: string;
  createdAt: string;
}
