export type Testament = 'NT' | 'AT';

export interface SubUnit {
  range: string;
  title: string;
  summary: string;
}

export interface CanonicalLink {
  reference: string;
  relation: string;
  note: string;
}

export interface CulturalFactor {
  factor: string;
  explanation: string;
}

export interface GrammaticalTerm {
  originalScript: string;
  transliteration: string;
  morphology: string;
  grammaticalCategory: 'Verbo' | 'Sustantivo' | 'Adjetivo' | 'Adverbio' | 'Expresión' | 'Título' | 'Otro';
  literalTranslation: string;
  originalMeaning: string;
  argumentativeFunction: string;
  crossReferences: string[];
}

export interface PericopeGrammaticalGroup {
  pericopeRange: string;
  pericopeTitle: string;
  terms: GrammaticalTerm[];
}

export type ApplicationDimension = 'Personal' | 'Comunitaria' | 'Educativa' | 'Eclesial' | 'Pastoral';

export interface ApplicationEntry {
  dimension: ApplicationDimension;
  concreteAction: string;
  practicalExample: string;
}

export interface DebatePosition {
  label: string;
  summary: string;
  arguments: string[];
}

export interface DebatedQuestion {
  number: number;
  question: string;
  positions: DebatePosition[];
  debateStatus: string;
  plausibleBiblicalConclusion?: string;
}

export interface FidelityAuditReport {
  verified: boolean;
  principlesChecked: string[];
  auditSummary: string;
  correctionsApplied: number;
  auditedAt: string;
}

export interface LearningFlashcard {
  id: string;
  category: 'Vocabulario' | 'Contexto' | 'Teología' | 'Debate';
  frontTitle: string;
  frontHint: string;
  originalScript?: string;
  transliteration?: string;
  backAnswer: string;
  reference: string;
}

export type LearningQuestionType =
  | 'true_false'
  | 'multiple_choice'
  | 'term_match'
  | 'fill_blank';

export interface LearningQuestion {
  id: string;
  type: LearningQuestionType;
  prompt: string;
  originalScript?: string;
  transliteration?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sectionRef: string;
}

export interface LearningKit {
  flashcards: LearningFlashcard[];
  questions: LearningQuestion[];
  fidelityAudit?: FidelityAuditReport;
}

export interface ExegesisStudy {
  id: string;
  passage: string;
  testament: Testament;
  originalLanguage: 'Griego koiné (NA28)' | 'Hebreo bíblico (BHS)' | 'Arameo / Hebreo (BHS)';
  createdAt: string;
  readingMinutes: number;
  applicationContextLabel?: string;
  baseText: {
    reference: string;
    criticalText: string;
    literaryUnit: string;
    subUnits: SubUnit[];
  };
  context: {
    historicalAudience: string;
    literarySetting: string;
    narrativeFlow: string;
    canonicalLinks: CanonicalLink[];
    culturalFactors: CulturalFactor[];
  };
  grammaticalAnalysis: PericopeGrammaticalGroup[];
  continuousNarrative: string[];
  keyPrincipleAndApplications: {
    keyPrinciple: string;
    keyHabit: string;
    applications: ApplicationEntry[];
  };
  debatedQuestions: DebatedQuestion[];
  sources: string[];
  finalAppraisal: string;
  learningKit?: LearningKit;
  fidelityAudit?: FidelityAuditReport;
}

export interface TermDeepDiveResult {
  id: string;
  passage: string;
  queryTerm: string;
  originalScript: string;
  transliteration: string;
  lemma: string;
  morphology: string;
  literalTranslation: string;
  semanticRange: string;
  lxxOrMtComparison: string;
  syntacticRole: string;
  exegeticalSignificance: string;
  keyCrossReferences: string[];
  createdAt: string;
  fidelityAudit?: FidelityAuditReport;
}

export interface ContextLayerResult {
  id: string;
  passage: string;
  queryFocus: string;
  historicalPoliticalSetting: string;
  socioReligiousDynamics: string;
  immediateLiteraryMacroStructure: string;
  intertextualEchoes: {
    reference: string;
    connectionType: string;
    explanation: string;
  }[];
  hermeneuticalGuardrails: string[];
  createdAt: string;
  fidelityAudit?: FidelityAuditReport;
}

export type WorkspaceTab = 'study' | 'grammar' | 'context' | 'learn' | 'library';

export type ThemeId = 'pergamino' | 'papiro' | 'olivo' | 'zafiro' | 'camino' | 'nocturno';
