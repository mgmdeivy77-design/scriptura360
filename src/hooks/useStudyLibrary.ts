import { useEffect, useState } from 'react';
import { MATEO_1_SAMPLE_STUDY } from '../data/mateoSample';
import type {
  ContextLayerResult,
  ExegesisStudy,
  LearningKit,
  TermDeepDiveResult,
} from '../types/exegesis';

const STUDIES_KEY = 'scriptura_studies_v1';
const ACTIVE_ID_KEY = 'scriptura_active_study_id_v1';
const TERM_CACHE_KEY = 'scriptura_term_analyses_v1';
const CONTEXT_CACHE_KEY = 'scriptura_context_analyses_v1';

function loadStudies(): ExegesisStudy[] {
  try {
    const raw = localStorage.getItem(STUDIES_KEY);
    if (!raw) return [MATEO_1_SAMPLE_STUDY];
    const parsed = JSON.parse(raw) as ExegesisStudy[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [MATEO_1_SAMPLE_STUDY];
    }
    const hasSample = parsed.some((s) => s.id === MATEO_1_SAMPLE_STUDY.id);
    if (!hasSample) {
      return [MATEO_1_SAMPLE_STUDY, ...parsed];
    }
    return parsed.map((s) =>
      s.id === MATEO_1_SAMPLE_STUDY.id
        ? { ...MATEO_1_SAMPLE_STUDY, learningKit: s.learningKit }
        : s
    );
  } catch {
    return [MATEO_1_SAMPLE_STUDY];
  }
}

function loadJsonArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useStudyLibrary() {
  const [studies, setStudies] = useState<ExegesisStudy[]>(loadStudies);
  const [activeStudyId, setActiveStudyId] = useState<string>(() => {
    const saved = localStorage.getItem(ACTIVE_ID_KEY);
    return saved || MATEO_1_SAMPLE_STUDY.id;
  });
  const [termAnalyses, setTermAnalyses] = useState<TermDeepDiveResult[]>(() =>
    loadJsonArray<TermDeepDiveResult>(TERM_CACHE_KEY)
  );
  const [contextAnalyses, setContextAnalyses] = useState<ContextLayerResult[]>(() =>
    loadJsonArray<ContextLayerResult>(CONTEXT_CACHE_KEY)
  );

  useEffect(() => {
    try {
      localStorage.setItem(STUDIES_KEY, JSON.stringify(studies));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [studies]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_ID_KEY, activeStudyId);
    } catch {
      // Ignore
    }
  }, [activeStudyId]);

  useEffect(() => {
    try {
      localStorage.setItem(TERM_CACHE_KEY, JSON.stringify(termAnalyses));
    } catch {
      // Ignore
    }
  }, [termAnalyses]);

  useEffect(() => {
    try {
      localStorage.setItem(CONTEXT_CACHE_KEY, JSON.stringify(contextAnalyses));
    } catch {
      // Ignore
    }
  }, [contextAnalyses]);

  const activeStudy = studies.find((s) => s.id === activeStudyId) ?? studies[0];

  const addStudy = (study: ExegesisStudy) => {
    setStudies((prev) => [study, ...prev.filter((s) => s.id !== study.id)]);
    setActiveStudyId(study.id);
  };

  const removeStudy = (id: string) => {
    if (id === MATEO_1_SAMPLE_STUDY.id) return;
    setStudies((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (activeStudyId === id && next.length > 0) {
        setActiveStudyId(next[0].id);
      }
      return next;
    });
  };

  const addTermAnalysis = (result: TermDeepDiveResult) => {
    setTermAnalyses((prev) => [result, ...prev.slice(0, 24)]);
  };

  const addContextAnalysis = (result: ContextLayerResult) => {
    setContextAnalyses((prev) => [result, ...prev.slice(0, 24)]);
  };

  const appendStudyLearningKit = (studyId: string, newKit: LearningKit) => {
    setStudies((prev) =>
      prev.map((s) => {
        if (s.id !== studyId) return s;
        const existingCards = s.learningKit?.flashcards ?? [];
        const existingQs = s.learningKit?.questions ?? [];
        return {
          ...s,
          learningKit: {
            flashcards: [...newKit.flashcards, ...existingCards],
            questions: [...newKit.questions, ...existingQs],
          },
        };
      })
    );
  };

  return {
    studies,
    activeStudy,
    activeStudyId,
    setActiveStudyId,
    addStudy,
    removeStudy,
    termAnalyses,
    addTermAnalysis,
    contextAnalyses,
    addContextAnalysis,
    appendStudyLearningKit,
  };
}
