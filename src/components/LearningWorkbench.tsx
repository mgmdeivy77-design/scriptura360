import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Brain,
  CheckCircle2,
  FlipHorizontal,
  HelpCircle,
  Layers,
  Loader2,
  Puzzle,
  RefreshCw,
  RotateCcw,
  Shuffle,
  XCircle,
} from 'lucide-react';
import type {
  ExegesisStudy,
  LearningFlashcard,
  LearningKit,
  LearningQuestion,
  LearningQuestionType,
} from '../types/exegesis';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { postApiJson } from '../utils/api';
import { buildLearningKitForStudy } from '../utils/learningBuilder';
import { renderFormattedProse } from '../utils/formatProse';

interface LearningWorkbenchProps {
  study: ExegesisStudy;
  onAppendLearningKit: (studyId: string, kit: LearningKit) => void;
}

type LearnMode = 'flashcards' | 'quiz' | 'match';
type CardCategoryFilter = 'ALL' | LearningFlashcard['category'];
type QuizFilter = 'ALL' | LearningQuestionType;

const QUESTION_TYPE_META: Record<
  LearningQuestionType,
  { emoji: string; label: string }
> = {
  true_false: { emoji: '⚖️', label: 'Verdadero o Falso' },
  multiple_choice: { emoji: '☑️', label: 'Selección múltiple' },
  term_match: { emoji: '🔤', label: 'Léxico original' },
  fill_blank: { emoji: '✍️', label: 'Completar la idea' },
};

const CATEGORY_EMOJI: Record<LearningFlashcard['category'], string> = {
  Vocabulario: '🔤',
  Contexto: '🧭',
  Teología: '📖',
  Debate: '⚖️',
};

function shuffleList<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const LearningWorkbench: React.FC<LearningWorkbenchProps> = ({
  study,
  onAppendLearningKit,
}) => {
  const isOnline = useOnlineStatus();
  const [mode, setMode] = useState<LearnMode>('flashcards');

  // Mastered flashcards persisted per study
  const masteredStorageKey = `scriptura_mastered_cards_${study.id}`;
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(masteredStorageKey);
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(masteredStorageKey, JSON.stringify(masteredIds));
    } catch {
      // Ignore storage error
    }
  }, [masteredIds, masteredStorageKey]);

  const kit = useMemo(() => buildLearningKitForStudy(study), [study]);

  // AI extra generation state
  const [generatingExtra, setGeneratingExtra] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [genSuccessMsg, setGenSuccessMsg] = useState<string | null>(null);

  const handleGenerateExtraPractice = async () => {
    if (!isOnline) {
      setGenError('Necesitas conexión a internet para generar nuevos retos; los actuales funcionan sin conexión.');
      return;
    }
    setGeneratingExtra(true);
    setGenError(null);
    setGenSuccessMsg(null);
    try {
      const termsSummary = study.grammaticalAnalysis
        .flatMap((g) => g.terms)
        .slice(0, 10)
        .map((t) => `${t.transliteration} (${t.literalTranslation})`)
        .join(', ');

      const data = await postApiJson<{ learningKit: LearningKit }>(
        '/api/study/learning',
        {
          passage: study.passage,
          keyPrinciple: study.keyPrincipleAndApplications.keyPrinciple,
          termsSummary,
        },
        'No se pudieron generar nuevos ejercicios.'
      );
      const newKit = data.learningKit;
      onAppendLearningKit(study.id, newKit);
      setGenSuccessMsg(
        `✅ Se añadieron ${newKit.flashcards.length} tarjetas y ${newKit.questions.length} preguntas nuevas guardadas en tu dispositivo.`
      );
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Error de conexión.');
    } finally {
      setGeneratingExtra(false);
    }
  };

  // ---------------- FLASHCARDS STATE ----------------
  const [cardFilter, setCardFilter] = useState<CardCategoryFilter>('ALL');
  const [cardOrder, setCardOrder] = useState<LearningFlashcard[]>(kit.flashcards);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const filtered =
      cardFilter === 'ALL'
        ? kit.flashcards
        : kit.flashcards.filter((c) => c.category === cardFilter);
    setCardOrder(filtered);
    setCardIndex(0);
    setIsFlipped(false);
  }, [kit.flashcards, cardFilter]);

  const currentCard = cardOrder[cardIndex] ?? null;
  const masteredCount = kit.flashcards.filter((c) => masteredIds.includes(c.id)).length;
  const masteryPct = kit.flashcards.length
    ? Math.round((masteredCount / kit.flashcards.length) * 100)
    : 0;

  const toggleMastered = (id: string, mastered: boolean) => {
    setMasteredIds((prev) => {
      if (mastered) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((item) => item !== id);
    });
    if (cardIndex < cardOrder.length - 1) {
      setCardIndex((i) => i + 1);
      setIsFlipped(false);
    } else {
      setIsFlipped(false);
    }
  };

  // ---------------- QUIZ STATE ----------------
  const [quizFilter, setQuizFilter] = useState<QuizFilter>('ALL');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answersMap, setAnswersMap] = useState<Record<string, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions: LearningQuestion[] = useMemo(() => {
    return quizFilter === 'ALL'
      ? kit.questions
      : kit.questions.filter((q) => q.type === quizFilter);
  }, [kit.questions, quizFilter]);

  useEffect(() => {
    setQuizIndex(0);
    setSelectedOption(null);
    setAnswersMap({});
    setQuizFinished(false);
  }, [quizFilter, study.id]);

  const activeQuestion = quizQuestions[quizIndex] ?? null;
  const correctCount = quizQuestions.reduce((acc, q) => {
    return answersMap[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const handleSelectQuizOption = (idx: number) => {
    if (!activeQuestion || selectedOption !== null) return;
    setSelectedOption(idx);
    setAnswersMap((prev) => ({ ...prev, [activeQuestion.id]: idx }));
  };

  const handleNextQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      const nextQ = quizQuestions[quizIndex + 1];
      setQuizIndex((i) => i + 1);
      setSelectedOption(answersMap[nextQ.id] ?? null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setAnswersMap({});
    setQuizFinished(false);
  };

  // ---------------- MATCHING GAME STATE ----------------
  const allTerms = useMemo(
    () => study.grammaticalAnalysis.flatMap((g) => g.terms),
    [study]
  );
  const [matchRoundSeed, setMatchRoundSeed] = useState(0);
  const [selectedLeftIdx, setSelectedLeftIdx] = useState<number | null>(null);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);
  const [wrongPairMsg, setWrongPairMsg] = useState<string | null>(null);

  const matchPairs = useMemo(() => {
    if (allTerms.length === 0) return [];
    const rotated = [...allTerms.slice(matchRoundSeed % allTerms.length), ...allTerms.slice(0, matchRoundSeed % allTerms.length)];
    return rotated.slice(0, Math.min(5, rotated.length)).map((t, idx) => ({
      id: `${t.transliteration}-${idx}`,
      leftLabel: `${t.originalScript} (${t.transliteration})`,
      subLabel: t.grammaticalCategory,
      rightLabel: t.literalTranslation,
    }));
  }, [allTerms, matchRoundSeed]);

  const shuffledRightPairs = useMemo(() => {
    return shuffleList(matchPairs);
  }, [matchPairs]);

  useEffect(() => {
    setSelectedLeftIdx(null);
    setMatchedKeys([]);
    setWrongPairMsg(null);
  }, [matchRoundSeed, study.id]);

  const handleRightMatchTap = (rightPairId: string, rightLabel: string) => {
    if (selectedLeftIdx === null) return;
    const leftItem = matchPairs[selectedLeftIdx];
    if (!leftItem || matchedKeys.includes(leftItem.id)) return;

    if (leftItem.id === rightPairId) {
      setMatchedKeys((prev) => [...prev, leftItem.id]);
      setSelectedLeftIdx(null);
      setWrongPairMsg(null);
    } else {
      setWrongPairMsg(`❌ «${leftItem.leftLabel}» no significa «${rightLabel}». ¡Intenta otra pareja!`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E4E1DA] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-zinc-500">
            🧠 Entrenamiento exegético · {study.passage}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-zinc-900">
            Centro de aprendizaje interactivo
          </h1>
          <p className="text-sm text-zinc-600 max-w-2xl leading-relaxed text-justify">
            Refuerza el vocabulario original, el contexto histórico y las claves teológicas de {study.passage} mediante tarjetas de repaso, preguntas de verdadero o falso, selección múltiple y emparejamiento de términos.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateExtraPractice}
          disabled={generatingExtra}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {generatingExtra ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Creando ejercicios…</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>🎯 Generar más retos</span>
            </>
          )}
        </button>
      </div>

      {genError && (
        <div role="alert" className="p-3.5 rounded-md border border-red-200 bg-red-50 text-xs text-red-900">
          {genError}
        </div>
      )}

      {genSuccessMsg && (
        <div className="p-3.5 rounded-md border border-[#D4D0C7] bg-[#F3F1EC] text-xs font-medium text-zinc-900">
          {genSuccessMsg}
        </div>
      )}

      {/* 3-Mode Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => setMode('flashcards')}
          className={`min-h-[48px] px-4 py-3 rounded-md border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
            mode === 'flashcards'
              ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
              : 'bg-white text-zinc-800 border-[#E4E1DA] hover:border-[#1E3A8A]'
          }`}
        >
          <span className="flex items-center gap-2.5 text-sm font-semibold">
            <span aria-hidden="true">🃏</span>
            <span>Tarjetas de repaso</span>
          </span>
          <span className="font-mono-data text-xs opacity-80">{kit.flashcards.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('quiz')}
          className={`min-h-[48px] px-4 py-3 rounded-md border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
            mode === 'quiz'
              ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
              : 'bg-white text-zinc-800 border-[#E4E1DA] hover:border-[#1E3A8A]'
          }`}
        >
          <span className="flex items-center gap-2.5 text-sm font-semibold">
            <span aria-hidden="true">📝</span>
            <span>Preguntas diversas</span>
          </span>
          <span className="font-mono-data text-xs opacity-80">{kit.questions.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('match')}
          className={`min-h-[48px] px-4 py-3 rounded-md border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
            mode === 'match'
              ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
              : 'bg-white text-zinc-800 border-[#E4E1DA] hover:border-[#1E3A8A]'
          }`}
        >
          <span className="flex items-center gap-2.5 text-sm font-semibold">
            <span aria-hidden="true">🧩</span>
            <span>Emparejar términos</span>
          </span>
          <Puzzle className="w-4 h-4 opacity-80 shrink-0" aria-hidden="true" />
        </button>
      </div>

      {/* MODE 1: FLASHCARDS */}
      {mode === 'flashcards' && (
        <section className="space-y-5">
          {/* Progress + Category Filter Bar */}
          <div className="p-4 bg-white border border-[#E4E1DA] rounded-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                <Award className="w-4 h-4 text-[#1E3A8A]" aria-hidden="true" />
                <span>
                  Progreso de dominio: <strong className="text-zinc-950">{masteredCount}</strong> de{' '}
                  <strong className="text-zinc-950">{kit.flashcards.length}</strong> tarjetas ({masteryPct}%)
                </span>
              </div>
              {masteredCount > 0 && (
                <button
                  type="button"
                  onClick={() => setMasteredIds([])}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 cursor-pointer"
                >
                  Reiniciar progreso
                </button>
              )}
            </div>

            <div className="h-2 w-full bg-[#F3F1EC] rounded overflow-hidden">
              <div
                className="h-full bg-[#1E3A8A] transition-[width] duration-300"
                style={{ width: `${masteryPct}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {(
                [
                  { id: 'ALL', label: '📚 Todas' },
                  { id: 'Vocabulario', label: '🔤 Vocabulario' },
                  { id: 'Contexto', label: '🧭 Contexto' },
                  { id: 'Teología', label: '📖 Teología' },
                  { id: 'Debate', label: '⚖️ Debate' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCardFilter(cat.id)}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    cardFilter === cat.id
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-[#FAF9F6] text-zinc-700 border-[#D4D0C7] hover:border-[#1E3A8A]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Flashcard */}
          {currentCard ? (
            <div className="space-y-4">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsFlipped((f) => !f)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsFlipped((f) => !f);
                  }
                }}
                aria-label="Voltear tarjeta de estudio"
                className="min-h-[280px] p-6 sm:p-8 bg-white border border-[#D4D0C7] rounded-md shadow-xs flex flex-col justify-between gap-6 cursor-pointer hover:border-[#1E3A8A] transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E4E1DA]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    {CATEGORY_EMOJI[currentCard.category]} {currentCard.category} · {currentCard.reference}
                  </span>
                  <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                    <FlipHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isFlipped ? 'Respuesta exegética' : 'Toca para voltear'}</span>
                  </span>
                </div>

                {!isFlipped ? (
                  <div className="my-auto space-y-4">
                    {(currentCard.originalScript || currentCard.transliteration) && (
                      <div className="flex flex-wrap items-baseline gap-3">
                        {currentCard.originalScript && (
                          <span className="biblical-script text-3xl sm:text-4xl font-semibold text-zinc-950">
                            {currentCard.originalScript}
                          </span>
                        )}
                        {currentCard.transliteration && (
                          <span className="font-mono-data text-sm font-semibold text-[#1E3A8A]">
                            {currentCard.transliteration}
                          </span>
                        )}
                      </div>
                    )}
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900 leading-snug">
                      {currentCard.frontTitle}
                    </h2>
                    <p className="text-xs text-zinc-500">
                      💡 <strong>Pista:</strong> {currentCard.frontHint}
                    </p>
                  </div>
                ) : (
                  <div className="my-auto space-y-4">
                    <div className="text-xs uppercase tracking-wider font-semibold text-zinc-500">
                      ✅ Respuesta y significado exegético
                    </div>
                    <p className="text-[15.5px] leading-[1.78] text-zinc-900 text-justify">
                      {renderFormattedProse(currentCard.backAnswer)}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-[#E4E1DA] flex items-center justify-between text-xs text-zinc-500">
                  <span>
                    Tarjeta {cardIndex + 1} de {cardOrder.length}
                  </span>
                  <span>
                    {masteredIds.includes(currentCard.id) ? '✅ Marcada como dominada' : '⏳ En repaso'}
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={cardIndex === 0}
                    onClick={() => {
                      setCardIndex((i) => Math.max(0, i - 1));
                      setIsFlipped(false);
                    }}
                    className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 text-xs font-medium bg-white border border-[#D4D0C7] rounded-md text-zinc-800 hover:border-[#1E3A8A] disabled:opacity-40 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Anterior</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFlipped((f) => !f)}
                    className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 text-xs font-medium bg-[#F3F1EC] border border-[#D4D0C7] rounded-md text-zinc-900 hover:border-[#1E3A8A] cursor-pointer"
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>🔄 Voltear</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCardOrder((prev) => shuffleList(prev));
                      setCardIndex(0);
                      setIsFlipped(false);
                    }}
                    className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 text-xs font-medium bg-white border border-[#D4D0C7] rounded-md text-zinc-800 hover:border-[#1E3A8A] cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Mezclar</span>
                  </button>

                  <button
                    type="button"
                    disabled={cardIndex >= cardOrder.length - 1}
                    onClick={() => {
                      setCardIndex((i) => Math.min(cardOrder.length - 1, i + 1));
                      setIsFlipped(false);
                    }}
                    className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 text-xs font-medium bg-white border border-[#D4D0C7] rounded-md text-zinc-800 hover:border-[#1E3A8A] disabled:opacity-40 cursor-pointer"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleMastered(currentCard.id, false)}
                    className="min-h-[42px] px-3.5 py-2 text-xs font-medium bg-white border border-[#D4D0C7] rounded-md text-zinc-700 hover:border-[#1E3A8A] cursor-pointer"
                  >
                    🔁 Repasar luego
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleMastered(currentCard.id, true)}
                    className="min-h-[42px] px-4 py-2 text-xs font-medium bg-[#1E3A8A] text-white rounded-md hover:bg-[#172D6E] cursor-pointer"
                  >
                    ✅ ¡Dominada!
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white border border-[#E4E1DA] rounded-md text-center text-sm text-zinc-600">
              No hay tarjetas disponibles en esta categoría.
            </div>
          )}
        </section>
      )}

      {/* MODE 2: DIVERSE QUIZ */}
      {mode === 'quiz' && (
        <section className="space-y-5">
          {/* Question Type Filter Ribbon */}
          <div className="p-4 bg-white border border-[#E4E1DA] rounded-md flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'ALL', label: '🎯 Mixto' },
                  { id: 'true_false', label: '⚖️ Verdadero / Falso' },
                  { id: 'multiple_choice', label: '☑️ Selección múltiple' },
                  { id: 'term_match', label: '🔤 Léxico original' },
                  { id: 'fill_blank', label: '✍️ Completar idea' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setQuizFilter(t.id)}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    quizFilter === t.id
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-[#FAF9F6] text-zinc-700 border-[#D4D0C7] hover:border-[#1E3A8A]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-medium text-zinc-700">
              🏆 Aciertos: <strong className="text-zinc-950">{correctCount}</strong> / {quizQuestions.length}
            </div>
          </div>

          {quizQuestions.length === 0 ? (
            <div className="p-8 bg-white border border-[#E4E1DA] rounded-md text-center text-sm text-zinc-600">
              No hay preguntas de este tipo para el pasaje actual. Selecciona «Mixto» o genera más retos.
            </div>
          ) : quizFinished ? (
            <div className="p-6 sm:p-8 bg-white border border-[#D4D0C7] rounded-md space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">🏆</span>
                <div>
                  <div className="text-xs uppercase tracking-widest font-semibold text-[#1E3A8A]">
                    Evaluación completada · {study.passage}
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
                    Obtuviste {correctCount} de {quizQuestions.length} respuestas correctas (
                    {Math.round((correctCount / quizQuestions.length) * 100)}%)
                  </h2>
                </div>
              </div>

              <p className="text-sm text-zinc-700 leading-relaxed text-justify">
                {correctCount === quizQuestions.length
                  ? '¡Excelente dominio exegético! Has comprendido con precisión tanto el vocabulario original como la estructura argumental y las cuestiones hermenéuticas del pasaje.'
                  : 'Buen progreso en tu estudio. Puedes repasar las tarjetas de vocabulario y volver a intentar el cuestionario para afianzar los detalles morfológicos e históricos.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>🔄 Repetir cuestionario</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('flashcards')}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-xs font-medium bg-[#FAF9F6] border border-[#D4D0C7] text-zinc-800 rounded-md hover:border-[#1E3A8A] cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>🃏 Repasar tarjetas</span>
                </button>
              </div>
            </div>
          ) : (
            activeQuestion && (
              <div className="p-6 sm:p-7 bg-white border border-[#E4E1DA] rounded-md space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E4E1DA]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    {QUESTION_TYPE_META[activeQuestion.type].emoji}{' '}
                    {QUESTION_TYPE_META[activeQuestion.type].label}
                  </span>
                  <span className="font-mono-data text-xs text-zinc-500">
                    Pregunta {quizIndex + 1} / {quizQuestions.length}
                  </span>
                </div>

                {/* Term display if term_match */}
                {(activeQuestion.originalScript || activeQuestion.transliteration) && (
                  <div className="p-4 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md flex flex-wrap items-baseline gap-3">
                    {activeQuestion.originalScript && (
                      <span className="biblical-script text-3xl font-semibold text-zinc-950">
                        {activeQuestion.originalScript}
                      </span>
                    )}
                    {activeQuestion.transliteration && (
                      <span className="font-mono-data text-sm font-semibold text-[#1E3A8A]">
                        {activeQuestion.transliteration}
                      </span>
                    )}
                  </div>
                )}

                <h2 className="font-display text-2xl font-semibold text-zinc-900 leading-snug text-justify">
                  {activeQuestion.prompt}
                </h2>

                {/* Answer Options */}
                <div className="space-y-2.5">
                  {activeQuestion.options.map((opt, idx) => {
                    const isAnswered = selectedOption !== null;
                    const isPicked = selectedOption === idx;
                    const isCorrect = idx === activeQuestion.correctIndex;

                    let cardStyle =
                      'bg-[#FAF9F6] border-[#D4D0C7] text-zinc-800 hover:border-[#1E3A8A]';
                    if (isAnswered) {
                      if (isCorrect) {
                        cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium';
                      } else if (isPicked && !isCorrect) {
                        cardStyle = 'bg-red-50 border-red-400 text-red-950';
                      } else {
                        cardStyle = 'bg-[#FAF9F6] border-[#E4E1DA] text-zinc-500 opacity-75';
                      }
                    }

                    const letter = String.fromCharCode(65 + idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectQuizOption(idx)}
                        className={`w-full min-h-[48px] p-3.5 sm:px-4 rounded-md border text-left flex items-start justify-between gap-3 transition-colors cursor-pointer disabled:cursor-default ${cardStyle}`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="font-mono-data text-xs font-semibold px-2 py-0.5 rounded bg-white border border-[#D4D0C7] text-zinc-700 shrink-0 mt-0.5">
                            {activeQuestion.type === 'true_false'
                              ? idx === 0
                                ? 'V'
                                : 'F'
                              : letter}
                          </span>
                          <span className="text-sm leading-relaxed text-justify">{opt}</span>
                        </div>
                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                        )}
                        {isAnswered && isPicked && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Scholarly Explanation */}
                {selectedOption !== null && (
                  <div className="p-4 sm:p-5 bg-[#F3F1EC] border border-[#D4D0C7] rounded-md space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                      {selectedOption === activeQuestion.correctIndex ? (
                        <>
                          <span aria-hidden="true">✅</span>
                          <span>¡Respuesta correcta!</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4" aria-hidden="true" />
                          <span>💡 Explicación exegética</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-zinc-800 leading-relaxed text-justify">
                      {renderFormattedProse(activeQuestion.explanation)}
                    </p>
                    <div className="text-xs text-zinc-500">
                      📚 Referencia en el estudio: <strong>{activeQuestion.sectionRef}</strong>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] cursor-pointer"
                      >
                        <span>
                          {quizIndex < quizQuestions.length - 1
                            ? 'Siguiente pregunta'
                            : 'Ver resultado final'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </section>
      )}

      {/* MODE 3: MATCHING GAME */}
      {mode === 'match' && (
        <section className="space-y-5">
          <div className="p-5 sm:p-6 bg-white border border-[#E4E1DA] rounded-md space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E4E1DA]">
              <div>
                <h2 className="font-display text-2xl font-semibold text-zinc-900">
                  🧩 Empareja cada término original con su traducción literal
                </h2>
                <p className="mt-1 text-xs text-zinc-600 text-justify">
                  Primero toca una palabra griega o hebrea de la columna izquierda y luego toca su traducción correspondiente en la columna derecha.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMatchRoundSeed((s) => s + 3)}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 text-xs font-medium bg-[#FAF9F6] border border-[#D4D0C7] rounded-md text-zinc-800 hover:border-[#1E3A8A] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>🔄 Nueva ronda</span>
              </button>
            </div>

            {wrongPairMsg && (
              <div role="status" className="p-3 rounded-md border border-red-200 bg-red-50 text-xs text-red-900">
                {wrongPairMsg}
              </div>
            )}

            {matchedKeys.length === matchPairs.length && matchPairs.length > 0 ? (
              <div className="p-6 bg-[#F3F1EC] border border-[#D4D0C7] rounded-md text-center space-y-3">
                <div className="text-3xl" aria-hidden="true">🎉</div>
                <h3 className="font-display text-2xl font-semibold text-zinc-900">
                  ¡Ronda completada con éxito!
                </h3>
                <p className="text-sm text-zinc-700 text-center">
                  Has conectado correctamente los {matchPairs.length} términos clave del pasaje.
                </p>
                <button
                  type="button"
                  onClick={() => setMatchRoundSeed((s) => s + 5)}
                  className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] cursor-pointer"
                >
                  <Brain className="w-4 h-4" aria-hidden="true" />
                  <span>Practicar otro grupo de términos</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left column: Original terms */}
                <div className="space-y-2.5">
                  <div className="text-xs uppercase tracking-wider font-semibold text-zinc-500">
                    1. Término original ({study.originalLanguage})
                  </div>
                  {matchPairs.map((pair, idx) => {
                    const isMatched = matchedKeys.includes(pair.id);
                    const isSelected = selectedLeftIdx === idx;
                    return (
                      <button
                        key={pair.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => {
                          setSelectedLeftIdx(idx);
                          setWrongPairMsg(null);
                        }}
                        className={`w-full min-h-[54px] p-3.5 rounded-md border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer disabled:cursor-default ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 opacity-75'
                            : isSelected
                              ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                              : 'bg-[#FAF9F6] border-[#D4D0C7] text-zinc-900 hover:border-[#1E3A8A]'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-semibold">{pair.leftLabel}</div>
                          <div className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-zinc-500'}`}>
                            {pair.subLabel}
                          </div>
                        </div>
                        {isMatched && <span aria-hidden="true">✅</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Right column: Shuffled translations */}
                <div className="space-y-2.5">
                  <div className="text-xs uppercase tracking-wider font-semibold text-zinc-500">
                    2. Traducción literal correspondiente
                  </div>
                  {shuffledRightPairs.map((pair) => {
                    const isMatched = matchedKeys.includes(pair.id);
                    return (
                      <button
                        key={pair.id}
                        type="button"
                        disabled={isMatched || selectedLeftIdx === null}
                        onClick={() => handleRightMatchTap(pair.id, pair.rightLabel)}
                        className={`w-full min-h-[54px] p-3.5 rounded-md border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer disabled:cursor-default ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 opacity-75'
                            : selectedLeftIdx !== null
                              ? 'bg-white border-[#D4D0C7] text-zinc-800 hover:border-[#1E3A8A] hover:bg-[#FAF9F6]'
                              : 'bg-[#FAF9F6] border-[#E4E1DA] text-zinc-600'
                        }`}
                      >
                        <span className="text-sm leading-snug text-justify">{pair.rightLabel}</span>
                        {isMatched && <span aria-hidden="true">✅</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
