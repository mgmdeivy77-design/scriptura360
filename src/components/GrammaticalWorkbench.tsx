import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  History,
  Languages,
  Loader2,
  Quote,
  Search,
} from 'lucide-react';
import type { ExegesisStudy, GrammaticalTerm, TermDeepDiveResult } from '../types/exegesis';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { postApiJson } from '../utils/api';
import { renderFormattedProse } from '../utils/formatProse';

interface GrammaticalWorkbenchProps {
  study: ExegesisStudy;
  initialSearchQuery?: string;
  cachedTermAnalyses: TermDeepDiveResult[];
  onSaveTermAnalysis: (result: TermDeepDiveResult) => void;
}

type WorkbenchMode = 'study_words' | 'lookup';

const SIMPLE_FILTERS = [
  { id: 'ALL', label: 'Todas' },
  { id: 'Verbo', label: 'Verbos' },
  { id: 'Sustantivo', label: 'Sustantivos' },
  { id: 'Título', label: 'Títulos' },
  { id: 'Adjetivo', label: 'Adjetivos' },
  { id: 'Expresión', label: 'Expresiones' },
] as const;

export const GrammaticalWorkbench: React.FC<GrammaticalWorkbenchProps> = ({
  study,
  initialSearchQuery = '',
  cachedTermAnalyses,
  onSaveTermAnalysis,
}) => {
  const isOnline = useOnlineStatus();

  const [mode, setMode] = useState<WorkbenchMode>('study_words');
  const [selectedPericope, setSelectedPericope] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  // Track which term cards are expanded; auto-open matching term if seeded, or the first term by default
  const initialExpandedKeys = useMemo(() => {
    const q = initialSearchQuery.trim().toLowerCase();
    if (q) {
      const matched: Record<string, boolean> = {};
      for (const group of study.grammaticalAnalysis) {
        group.terms.forEach((term, idx) => {
          const hay =
            `${term.originalScript} ${term.transliteration} ${term.literalTranslation} ${term.originalMeaning} ${term.argumentativeFunction}`.toLowerCase();
          if (hay.includes(q)) {
            matched[`${group.pericopeRange}::${term.transliteration}::${idx}`] = true;
          }
        });
      }
      if (Object.keys(matched).length > 0) return matched;
    }
    const firstGroup = study.grammaticalAnalysis[0];
    const firstTerm = firstGroup?.terms[0];
    return firstGroup && firstTerm
      ? { [`${firstGroup.pericopeRange}::${firstTerm.transliteration}::0`]: true }
      : {};
  }, [study, initialSearchQuery]);

  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>(initialExpandedKeys);

  // Lookup state (Tab 2)
  const [customTerm, setCustomTerm] = useState<string>(initialSearchQuery);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [activeDeepDive, setActiveDeepDive] = useState<TermDeepDiveResult | null>(() => {
    return cachedTermAnalyses.find((t) => t.passage === study.passage) ?? null;
  });

  const totalTerms = useMemo(
    () => study.grammaticalAnalysis.reduce((acc, g) => acc + g.terms.length, 0),
    [study]
  );

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return study.grammaticalAnalysis
      .filter((group) => selectedPericope === 'ALL' || group.pericopeRange === selectedPericope)
      .map((group) => {
        const terms = group.terms
          .map((term, idx) => ({
            term,
            key: `${group.pericopeRange}::${term.transliteration}::${idx}`,
          }))
          .filter(({ term }) => {
            if (selectedCategory !== 'ALL' && term.grammaticalCategory !== selectedCategory) {
              return false;
            }
            if (q) {
              const hay =
                `${term.originalScript} ${term.transliteration} ${term.literalTranslation} ${term.originalMeaning} ${term.argumentativeFunction}`.toLowerCase();
              return hay.includes(q);
            }
            return true;
          });
        return { ...group, entries: terms };
      })
      .filter((group) => group.entries.length > 0);
  }, [study, selectedPericope, selectedCategory, searchQuery]);

  const visibleCount = filteredGroups.reduce((acc, g) => acc + g.entries.length, 0);

  const toggleCard = (key: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const expandAllVisible = () => {
    const next: Record<string, boolean> = {};
    for (const g of filteredGroups) {
      for (const e of g.entries) {
        next[e.key] = true;
      }
    }
    setExpandedKeys(next);
  };

  const collapseAll = () => {
    setExpandedKeys({});
  };

  const runDeepDive = async (termToAnalyze: string) => {
    const query = termToAnalyze.trim();
    if (!query) return;

    setMode('lookup');
    setCustomTerm(query);

    const existing = cachedTermAnalyses.find(
      (c) => c.passage === study.passage && c.queryTerm.toLowerCase() === query.toLowerCase()
    );
    if (existing) {
      setActiveDeepDive(existing);
      setAnalysisError(null);
      return;
    }

    if (!isOnline) {
      setAnalysisError(
        'Sin conexión a internet. Puedes consultar las palabras ya analizadas del pasaje o las búsquedas guardadas abajo.'
      );
      return;
    }

    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const data = await postApiJson<{ analysis: TermDeepDiveResult }>(
        '/api/analyze/term',
        {
          passage: study.passage,
          term: query,
        },
        'No se pudo completar el análisis léxico.'
      );
      const result = data.analysis;
      onSaveTermAnalysis(result);
      setActiveDeepDive(result);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Error de conexión.');
    } finally {
      setAnalyzing(false);
    }
  };

  const passageHistory = cachedTermAnalyses.filter((c) => c.passage === study.passage);

  // Suggest up to 4 terms from the study for quick 1-tap lookup in Tab 2
  const quickTerms: GrammaticalTerm[] = useMemo(() => {
    return study.grammaticalAnalysis.flatMap((g) => g.terms).slice(0, 5);
  }, [study]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
      {/* Clean Header */}
      <div className="border-b border-[#E4E1DA] pb-6">
        <div className="text-xs uppercase tracking-widest text-zinc-500">
          🔤 Gramática y vocabulario original · {study.passage} · {study.originalLanguage}
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-zinc-900">
          Guía gramatical del pasaje
        </h1>
        <p className="mt-2 text-sm text-zinc-600 max-w-2xl leading-relaxed text-justify">
          Explora paso a paso qué significa cada palabra clave en su idioma original y por qué es importante en el argumento, o consulta cualquier otro término del texto.
        </p>

        {/* Simple 2-Mode Switcher */}
        <div className="mt-5 grid grid-cols-2 sm:inline-flex p-1 bg-[#F3F1EC] border border-[#E4E1DA] rounded-md gap-1">
          <button
            type="button"
            onClick={() => setMode('study_words')}
            className={`inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              mode === 'study_words'
                ? 'bg-white text-[#1E3A8A] shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Languages className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>📖 Palabras del estudio ({totalTerms})</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('lookup')}
            className={`inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              mode === 'lookup'
                ? 'bg-white text-[#1E3A8A] shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>🔎 Consultar otra palabra</span>
          </button>
        </div>
      </div>

      {/* MODE 1: Guided Word-by-Word Study (Accordion Cards by Pericope) */}
      {mode === 'study_words' && (
        <div className="space-y-6">
          {/* Streamlined Single Filter Bar */}
          <div className="p-4 bg-white border border-[#E4E1DA] rounded-md space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search */}
              <div className="sm:col-span-5 relative">
                <Search
                  className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar palabra o significado..."
                  className="w-full min-h-[40px] pl-9 pr-3 py-2 text-xs bg-[#FAF9F6] border border-[#D4D0C7] rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              {/* Pericope Dropdown */}
              <div className="sm:col-span-4">
                <label htmlFor="pericope-select" className="sr-only">
                  Filtrar por sección del pasaje
                </label>
                <select
                  id="pericope-select"
                  value={selectedPericope}
                  onChange={(e) => setSelectedPericope(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 text-xs font-medium bg-[#FAF9F6] border border-[#D4D0C7] rounded-md text-zinc-800 focus:outline-none focus:border-[#1E3A8A] cursor-pointer"
                >
                  <option value="ALL">Todas las secciones del pasaje</option>
                  {study.grammaticalAnalysis.map((g) => (
                    <option key={g.pericopeRange} value={g.pericopeRange}>
                      {g.pericopeRange} — {g.terms.length} palabras
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Dropdown */}
              <div className="sm:col-span-3">
                <label htmlFor="category-select" className="sr-only">
                  Tipo de palabra
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 text-xs font-medium bg-[#FAF9F6] border border-[#D4D0C7] rounded-md text-zinc-800 focus:outline-none focus:border-[#1E3A8A] cursor-pointer"
                >
                  {SIMPLE_FILTERS.map((f) => (
                    <option key={f.id} value={f.id}>
                      Tipo: {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E4E1DA] text-xs text-zinc-500">
              <span>
                Mostrando <strong className="font-semibold text-zinc-800">{visibleCount}</strong> palabras. Toca cualquier tarjeta para ver su análisis completo.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={expandAllVisible}
                  className="font-medium text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  Expandir todas
                </button>
                <span aria-hidden="true" className="text-zinc-300">·</span>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  Contraer
                </button>
              </div>
            </div>
          </div>

          {/* Pericope Groups with Inline Expandable Term Cards */}
          {filteredGroups.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#E4E1DA] rounded-md space-y-3">
              <p className="text-sm text-zinc-600">
                No hay palabras en la lista que coincidan con «{searchQuery}».
              </p>
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => runDeepDive(searchQuery)}
                  className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Consultar «{searchQuery}» en el diccionario exegético</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {filteredGroups.map((group) => (
                <section key={group.pericopeRange} className="space-y-3">
                  <div className="flex flex-wrap items-baseline gap-2.5 pb-2 border-b border-[#E4E1DA]">
                    <span className="font-mono-data text-xs font-semibold text-[#1E3A8A]">
                      {group.pericopeRange}
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900">
                      {group.pericopeTitle}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {group.entries.map(({ term, key }) => {
                      const isOpen = !!expandedKeys[key];
                      return (
                        <div
                          key={key}
                          className="bg-white border border-[#E4E1DA] rounded-md overflow-hidden transition-colors"
                        >
                          {/* Term Card Summary Trigger */}
                          <button
                            type="button"
                            onClick={() => toggleCard(key)}
                            aria-expanded={isOpen}
                            className="w-full text-left p-4 sm:px-5 sm:py-4 flex items-center justify-between gap-4 hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                          >
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <span className="biblical-script text-2xl font-semibold text-zinc-950">
                                  {term.originalScript}
                                </span>
                                <span className="font-mono-data text-sm font-semibold text-[#1E3A8A]">
                                  {term.transliteration}
                                </span>
                                <span className="text-xs text-zinc-500">
                                  {term.grammaticalCategory}
                                </span>
                              </div>
                              <p className="text-sm text-zinc-700 leading-snug">
                                <strong className="font-medium text-zinc-900">Traducción literal:</strong>{' '}
                                {term.literalTranslation}
                              </p>
                            </div>

                            <ChevronDown
                              className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-150 ${
                                isOpen ? 'rotate-180 text-[#1E3A8A]' : ''
                              }`}
                              aria-hidden="true"
                            />
                          </button>

                          {/* Expanded Step-by-Step Guide */}
                          {isOpen && (
                            <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-[#E4E1DA] bg-[#FAF9F6] space-y-4 text-sm leading-relaxed">
                                <div className="flex flex-wrap items-baseline gap-2 text-xs text-zinc-600">
                                  <strong className="font-semibold text-zinc-900 uppercase tracking-wider">
                                    🧩 1. Forma gramatical:
                                  </strong>
                                  <span>{term.morphology}</span>
                                </div>

                                {/* Step 2: Original Meaning */}
                                <div className="flex items-start gap-2.5">
                                  <BookOpen
                                    className="w-4 h-4 text-zinc-400 mt-1 shrink-0"
                                    aria-hidden="true"
                                  />
                                  <div>
                                    <div className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-1">
                                      📚 2. Significado en su contexto original
                                    </div>
                                    <p className="text-zinc-800 max-w-prose text-justify">
                                      {renderFormattedProse(term.originalMeaning)}
                                    </p>
                                  </div>
                                </div>

                                {/* Step 3: Result / Argumentative Function */}
                                <div className="p-3.5 sm:p-4 bg-white border border-[#D4D0C7] rounded-md flex items-start gap-2.5">
                                  <CheckCircle2
                                    className="w-4 h-4 text-[#1E3A8A] mt-0.5 shrink-0"
                                    aria-hidden="true"
                                  />
                                  <div className="space-y-1">
                                    <div className="text-xs uppercase tracking-wider font-semibold text-[#1E3A8A]">
                                      ✅ 3. Resultado · Por qué importa en el pasaje
                                    </div>
                                    <p className="text-zinc-900 max-w-prose text-justify">
                                      {renderFormattedProse(term.argumentativeFunction)}
                                    </p>
                                  </div>
                                </div>

                              {/* Footer Row: References + Deep Lookup */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                                {term.crossReferences.length > 0 ? (
                                  <span className="text-zinc-600">
                                    <strong className="font-semibold text-zinc-800">Ver también:</strong>{' '}
                                    {term.crossReferences.join(' · ')}
                                  </span>
                                ) : (
                                  <span />
                                )}

                                <button
                                  type="button"
                                  onClick={() => runDeepDive(term.transliteration)}
                                  className="font-medium text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  Ver análisis sintáctico completo →
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: Simple Guided Lookup for Any Word */}
      {mode === 'lookup' && (
        <div className="space-y-6">
          <section className="p-5 sm:p-6 bg-white border border-[#E4E1DA] rounded-md space-y-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-zinc-900">
                Consultar cualquier palabra o frase de {study.passage}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 leading-relaxed">
                Escribe una palabra en español, su transliteración o el término griego/hebreo para obtener su raíz, morfología y sentido exacto en el versículo.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                runDeepDive(customTerm);
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search
                  className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={customTerm}
                  onChange={(e) => setCustomTerm(e.target.value)}
                  placeholder={`Ej. salvación, dikaios, parthenos, nombre...`}
                  className="w-full min-h-[44px] pl-10 pr-4 py-2 text-sm bg-[#FAF9F6] border border-[#D4D0C7] rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>
              <button
                type="submit"
                disabled={analyzing || !customTerm.trim()}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 text-sm font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Analizando…</span>
                  </>
                ) : (
                  <span>Analizar palabra</span>
                )}
              </button>
            </form>

            {/* Quick clickable terms from the passage */}
            {quickTerms.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-zinc-500">Probar con términos del pasaje:</span>
                {quickTerms.map((t) => (
                  <button
                    key={t.transliteration}
                    type="button"
                    onClick={() => runDeepDive(t.transliteration)}
                    className="px-2.5 py-1 text-xs font-medium text-zinc-700 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors cursor-pointer"
                  >
                    {t.transliteration}
                  </button>
                ))}
              </div>
            )}

            {analysisError && (
              <div
                role="alert"
                className="p-3.5 rounded-md border border-red-200 bg-red-50 text-xs text-red-900"
              >
                {analysisError}
              </div>
            )}
          </section>

          {activeDeepDive && (
            <section className="p-5 sm:p-6 bg-white border border-[#E4E1DA] rounded-md space-y-5">
              <div className="pb-4 border-b border-[#E4E1DA] space-y-1.5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="biblical-script text-3xl font-semibold text-zinc-950">
                    {activeDeepDive.originalScript}
                  </span>
                  <span className="font-mono-data text-base font-semibold text-[#1E3A8A]">
                    {activeDeepDive.transliteration}
                  </span>
                </div>
                <div className="text-xs text-zinc-600">
                  <strong className="font-semibold text-zinc-900">Forma léxica (lema):</strong>{' '}
                  {activeDeepDive.lemma} ·{' '}
                  <strong className="font-semibold text-zinc-900">Morfología:</strong>{' '}
                  {activeDeepDive.morphology}
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="p-4 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md space-y-1">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-zinc-500">
                    <Quote className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Traducción literal y alcance semántico</span>
                  </div>
                  <p className="font-semibold text-zinc-950">{activeDeepDive.literalTranslation}</p>
                  <p className="text-zinc-700">{renderFormattedProse(activeDeepDive.semanticRange)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md space-y-1">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-zinc-500">
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Uso en LXX / Texto Masorético</span>
                    </div>
                    <p className="text-zinc-700">{renderFormattedProse(activeDeepDive.lxxOrMtComparison)}</p>
                  </div>

                  <div className="p-4 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md space-y-1">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-zinc-500">
                      <BookOpenCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Función en la oración</span>
                    </div>
                    <p className="text-zinc-700">{renderFormattedProse(activeDeepDive.syntacticRole)}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#F3F1EC] border border-[#D4D0C7] rounded-md flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1E3A8A] mt-0.5 shrink-0" aria-hidden="true" />
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wider font-semibold text-[#1E3A8A]">
                      Resultado exegético
                    </div>
                    <p className="text-zinc-900">
                      {renderFormattedProse(activeDeepDive.exegeticalSignificance)}
                    </p>
                  </div>
                </div>

                {activeDeepDive.keyCrossReferences.length > 0 && (
                  <div className="text-xs text-zinc-600 pt-1">
                    <strong className="font-semibold text-zinc-900">Pasajes paralelos:</strong>{' '}
                    {activeDeepDive.keyCrossReferences.join(' · ')}
                  </div>
                )}
              </div>
            </section>
          )}

          {passageHistory.length > 0 && (
            <section className="p-4 bg-white border border-[#E4E1DA] rounded-md space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <History className="w-3.5 h-3.5 text-[#1E3A8A]" aria-hidden="true" />
                <span>Consultas guardadas en tu dispositivo</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {passageHistory.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveDeepDive(item);
                      setCustomTerm(item.queryTerm);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md hover:border-[#1E3A8A] cursor-pointer"
                  >
                    {item.transliteration} ({item.queryTerm})
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
