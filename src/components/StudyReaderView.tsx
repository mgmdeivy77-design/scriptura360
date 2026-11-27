import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BookOpen,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  Download,
  FileText,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Languages,
  Link2,
  ListChecks,
  Printer,
  Quote,
  Scale,
  ScrollText,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import type { ApplicationDimension, ExegesisStudy, WorkspaceTab } from '../types/exegesis';
import { downloadStudyMarkdown } from '../utils/exportStudy';
import { renderFormattedProse } from '../utils/formatProse';

interface StudyReaderViewProps {
  study: ExegesisStudy;
  onNavigateTab: (tab: WorkspaceTab) => void;
  onInspectTerm: (termQuery: string) => void;
}

type SectionKey = 'ALL' | 'sec-1' | 'sec-2' | 'sec-3' | 'sec-4' | 'sec-5' | 'sec-6' | 'sec-7';

interface SectionDef {
  id: Exclude<SectionKey, 'ALL'>;
  num: string;
  emoji: string;
  label: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

const SECTION_DEFS: SectionDef[] = [
  { id: 'sec-1', num: 'I', emoji: '📜', label: 'Texto base', Icon: ScrollText },
  { id: 'sec-2', num: 'II', emoji: '🧭', label: 'Contexto del pasaje', Icon: Compass },
  { id: 'sec-3', num: 'III', emoji: '🔤', label: 'Análisis gramatical', Icon: Languages },
  { id: 'sec-4', num: 'IV', emoji: '📖', label: 'Narración argumental', Icon: BookOpen },
  { id: 'sec-5', num: 'V', emoji: '🎯', label: 'Principio y aplicaciones', Icon: ListChecks },
  { id: 'sec-6', num: 'VI', emoji: '⚖️', label: 'Cuestiones debatidas', Icon: Scale },
  { id: 'sec-7', num: 'VII', emoji: '📚', label: 'Fuentes y valoración', Icon: BookMarked },
];

const DIMENSION_ICONS: Record<
  ApplicationDimension,
  React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
> = {
  Personal: User,
  Comunitaria: Users,
  Educativa: GraduationCap,
  Eclesial: Building2,
  Pastoral: HeartHandshake,
};

const DIMENSION_EMOJIS: Record<ApplicationDimension, string> = {
  Personal: '👤',
  Comunitaria: '🤝',
  Educativa: '🎓',
  Eclesial: '⛪',
  Pastoral: '🕊️',
};

export const StudyReaderView: React.FC<StudyReaderViewProps> = ({
  study,
  onNavigateTab,
  onInspectTerm,
}) => {
  const [activeSection, setActiveSection] = useState<SectionKey>('ALL');
  const [selectedPericopeRange, setSelectedPericopeRange] = useState<string>('ALL');
  const [selectedDebateNum, setSelectedDebateNum] = useState<number | 'ALL'>('ALL');
  const [mobileIndexOpen, setMobileIndexOpen] = useState(false);

  const readerTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveSection('ALL');
    setSelectedPericopeRange('ALL');
    setSelectedDebateNum('ALL');
  }, [study.id]);

  const totalTerms = study.grammaticalAnalysis.reduce((acc, g) => acc + g.terms.length, 0);

  const selectSection = (section: SectionKey) => {
    setActiveSection(section);
    if (section !== 'sec-3') setSelectedPericopeRange('ALL');
    if (section !== 'sec-6') setSelectedDebateNum('ALL');
    setMobileIndexOpen(false);
    readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getSectionMetaCount = (id: Exclude<SectionKey, 'ALL'>): string => {
    switch (id) {
      case 'sec-1':
        return `${study.baseText.subUnits.length} unidades`;
      case 'sec-2':
        return `${study.context.canonicalLinks.length} vínculos`;
      case 'sec-3':
        return `${totalTerms} términos`;
      case 'sec-4':
        return `${study.continuousNarrative.length} párrafos`;
      case 'sec-5':
        return `${study.keyPrincipleAndApplications.applications.length} ámbitos`;
      case 'sec-6':
        return `${study.debatedQuestions.length} debates`;
      case 'sec-7':
        return `${study.sources.length} fuentes`;
    }
  };

  const showSection = (id: Exclude<SectionKey, 'ALL'>) =>
    activeSection === 'ALL' || activeSection === id;

  const activeSectionIdx = SECTION_DEFS.findIndex((s) => s.id === activeSection);
  const prevSection = activeSectionIdx > 0 ? SECTION_DEFS[activeSectionIdx - 1] : null;
  const nextSection =
    activeSectionIdx >= 0 && activeSectionIdx < SECTION_DEFS.length - 1
      ? SECTION_DEFS[activeSectionIdx + 1]
      : null;

  const activeSectionDef = SECTION_DEFS.find((s) => s.id === activeSection);

  const visiblePericopes =
    selectedPericopeRange === 'ALL'
      ? study.grammaticalAnalysis
      : study.grammaticalAnalysis.filter((g) => g.pericopeRange === selectedPericopeRange);

  const visibleDebates =
    selectedDebateNum === 'ALL'
      ? study.debatedQuestions
      : study.debatedQuestions.filter((d) => d.number === selectedDebateNum);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Editorial Header */}
      <div className="border-b border-[#E4E1DA] pb-8">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs uppercase tracking-widest text-zinc-500">
          <span>{study.testament === 'NT' ? 'Nuevo Testamento' : 'Antiguo Testamento'}</span>
          <span aria-hidden="true">·</span>
          <span>{study.originalLanguage}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{study.readingMinutes} min de lectura</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{totalTerms} términos analizados</span>
        </div>

        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 leading-[1.1] max-w-3xl text-balance">
          Análisis exegético de {study.passage}
        </h1>

        <p className="mt-3 text-sm text-zinc-600 max-w-2xl leading-relaxed">
          <strong className="font-semibold text-zinc-800">Texto crítico de referencia:</strong>{' '}
          {study.baseText.criticalText}
        </p>
      </div>

      {/* Mobile / Tablet Smart Dynamic Index Bar */}
      <div ref={readerTopRef} className="lg:hidden mt-6 scroll-mt-16 no-print">
        <div className="bg-white border border-[#E4E1DA] rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileIndexOpen((o) => !o)}
            className="w-full min-h-[44px] px-4 py-3 flex items-center justify-between gap-3 text-left cursor-pointer"
            aria-expanded={mobileIndexOpen}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-4 h-4 text-[#1E3A8A] shrink-0" aria-hidden="true" />
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500 shrink-0">
                Índice:
              </span>
              <span className="text-sm font-semibold text-zinc-900 truncate">
                {activeSectionDef
                  ? `${activeSectionDef.emoji} ${activeSectionDef.num}. ${activeSectionDef.label}`
                  : '📑 Estudio completo'}
              </span>
            </div>
            <ChevronRight
              className={`w-4 h-4 text-zinc-500 transition-transform shrink-0 ${
                mobileIndexOpen ? 'rotate-90' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {mobileIndexOpen && (
            <div className="border-t border-[#E4E1DA] divide-y divide-[#E4E1DA]">
              <button
                type="button"
                onClick={() => selectSection('ALL')}
                className={`w-full min-h-[44px] px-4 py-2.5 flex items-center justify-between text-xs font-medium cursor-pointer ${
                  activeSection === 'ALL' ? 'bg-[#F3F1EC] text-[#1E3A8A]' : 'text-zinc-700 hover:bg-[#FAF9F6]'
                }`}
              >
                <span>📑 Ver estudio completo</span>
                <span className="text-zinc-400">7 secciones</span>
              </button>
              {SECTION_DEFS.map((item) => {
                const Icon = item.Icon;
                const isSelected = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectSection(item.id)}
                    className={`w-full min-h-[44px] px-4 py-2.5 flex items-center justify-between gap-3 text-left cursor-pointer ${
                      isSelected ? 'bg-[#F3F1EC] text-[#1E3A8A]' : 'text-zinc-700 hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span aria-hidden="true" className="text-sm shrink-0">{item.emoji}</span>
                      <Icon className="w-3.5 h-3.5 shrink-0 opacity-75" aria-hidden="true" />
                      <span className="font-mono-data text-xs w-5 text-zinc-400 shrink-0">{item.num}.</span>
                      <span className="text-sm font-medium truncate">{item.label}</span>
                    </span>
                    <span className="text-[11px] text-zinc-400 shrink-0">{getSectionMetaCount(item.id)}</span>
                  </button>
                );
              })}

              <div className="p-3 bg-[#FAF9F6] grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    downloadStudyMarkdown(study);
                    setMobileIndexOpen(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 min-h-[42px] px-3 py-2 text-xs font-medium text-zinc-800 bg-white border border-[#D4D0C7] rounded-md hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>📥 Markdown</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileIndexOpen(false);
                    setTimeout(() => window.print(), 100);
                  }}
                  className="inline-flex items-center justify-center gap-2 min-h-[42px] px-3 py-2 text-xs font-medium text-zinc-800 bg-white border border-[#D4D0C7] rounded-md hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>🖨️ Imprimir / PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Asymmetric 70/30 Editorial Reading Layout */}
      <div className="mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Main Reading Column */}
        <article className="lg:col-span-8 space-y-14 min-w-0">
          {/* Active Isolated Section Indicator Bar */}
          {activeSection !== 'ALL' && activeSectionDef && (
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E4E1DA] no-print">
              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <activeSectionDef.Icon className="w-4 h-4 text-[#1E3A8A]" aria-hidden="true" />
                <span>
                  Mostrando únicamente:{' '}
                  <strong className="font-semibold text-zinc-900">
                    {activeSectionDef.num}. {activeSectionDef.label}
                  </strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => selectSection('ALL')}
                className="text-xs font-medium text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Ver estudio completo
              </button>
            </div>
          )}

          {/* I. TEXTO BASE */}
          {showSection('sec-1') && (
            <section id="sec-1" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E4E1DA]">
                <ScrollText className="w-5 h-5 text-[#1E3A8A] shrink-0" aria-hidden="true" />
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
                  📜 I. Texto base
                </h2>
              </div>

              <div className="space-y-4 text-[15.5px] leading-[1.78] text-zinc-800 max-w-prose text-justify">
                <p>
                  <strong className="font-semibold text-zinc-950">Referencia bíblica:</strong>{' '}
                  {study.baseText.reference}.{' '}
                  <strong className="font-semibold text-zinc-950">Edición crítica:</strong>{' '}
                  {study.baseText.criticalText}
                </p>
                <p>
                  <strong className="font-semibold text-zinc-950">Unidad literaria:</strong>{' '}
                  {renderFormattedProse(study.baseText.literaryUnit)}
                </p>
              </div>

              {study.baseText.subUnits.length > 0 && (
                <div className="border border-[#E4E1DA] rounded-md bg-white divide-y divide-[#E4E1DA]">
                  <div className="px-4 sm:px-5 py-3 bg-[#F3F1EC] flex items-center gap-2">
                    <BookOpenCheck className="w-4 h-4 text-[#1E3A8A]" aria-hidden="true" />
                    <span className="text-xs uppercase tracking-widest font-semibold text-zinc-700">
                      Estructura de subunidades ({study.baseText.subUnits.length})
                    </span>
                  </div>
                  {study.baseText.subUnits.map((unit, idx) => (
                    <div key={unit.range} className="p-4 sm:px-5 sm:py-4">
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <span className="font-mono-data text-xs text-zinc-400">0{idx + 1}</span>
                        <span className="font-mono-data text-xs font-semibold text-[#1E3A8A]">
                          {unit.range}
                        </span>
                        <span aria-hidden="true" className="text-zinc-300">/</span>
                        <h3 className="text-sm font-semibold text-zinc-950">{unit.title}</h3>
                      </div>
                      <p className="mt-1.5 text-sm text-zinc-600 leading-relaxed text-justify">
                        {renderFormattedProse(unit.summary)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 sm:p-5 bg-[#F3F1EC] border border-[#D4D0C7] rounded-md flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#1E3A8A] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-sm text-zinc-800 leading-relaxed max-w-prose text-justify">
                  <strong className="font-semibold text-zinc-950">✅ Resultado estructural:</strong>{' '}
                  El pasaje conforma una unidad cohesionada de{' '}
                  <strong className="font-semibold text-zinc-950">
                    {study.baseText.subUnits.length} movimientos literarios
                  </strong>{' '}
                  evaluados directamente sobre el texto crítico{' '}
                  <strong className="font-semibold text-zinc-950">{study.originalLanguage}</strong>.
                </div>
              </div>
            </section>
          )}

          {/* II. CONTEXTO DEL PASAJE */}
          {showSection('sec-2') && (
            <section id="sec-2" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E4E1DA]">
                <Compass className="w-5 h-5 text-[#1E3A8A] shrink-0" aria-hidden="true" />
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
                  🧭 II. Contexto del pasaje
                </h2>
              </div>

              <div className="space-y-4 text-[15.5px] leading-[1.78] text-zinc-800 max-w-prose text-justify">
                <p>
                  <strong className="font-semibold text-zinc-950">Audiencia y perspectiva:</strong>{' '}
                  {renderFormattedProse(study.context.historicalAudience)}
                </p>
                <p>
                  <strong className="font-semibold text-zinc-950">Entorno literario:</strong>{' '}
                  {renderFormattedProse(study.context.literarySetting)}
                </p>
                <p>
                  <strong className="font-semibold text-zinc-950">Desarrollo narrativo:</strong>{' '}
                  {renderFormattedProse(study.context.narrativeFlow)}
                </p>
              </div>

              {study.context.canonicalLinks.length > 0 && (
                <div className="border border-[#E4E1DA] rounded-md bg-white divide-y divide-[#E4E1DA]">
                  <div className="px-4 sm:px-5 py-3 bg-[#F3F1EC] flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-[#1E3A8A]" aria-hidden="true" />
                    <span className="text-xs uppercase tracking-widest font-semibold text-zinc-700">
                      🔗 Vínculos canónicos e intertextualidad
                    </span>
                  </div>
                  {study.context.canonicalLinks.map((link, idx) => (
                    <div key={idx} className="p-4 sm:px-5 grid grid-cols-1 sm:grid-cols-12 gap-2 items-baseline">
                      <div className="sm:col-span-4 font-mono-data text-xs font-semibold text-[#1E3A8A]">
                        {link.reference}
                      </div>
                      <div className="sm:col-span-8 text-sm text-zinc-700 leading-relaxed text-justify">
                        <strong className="font-semibold text-zinc-950">{link.relation}:</strong>{' '}
                        {renderFormattedProse(link.note)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {study.context.culturalFactors.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {study.context.culturalFactors.map((cf, idx) => (
                    <div key={idx} className="p-4 bg-white border border-[#E4E1DA] rounded-md space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-[#1E3A8A] shrink-0" aria-hidden="true" />
                        <h3 className="text-sm font-semibold text-zinc-950">{cf.factor}</h3>
                      </div>
                      <p className="text-sm text-zinc-700 leading-relaxed text-justify">
                        {renderFormattedProse(cf.explanation)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* III. ANÁLISIS GRAMATICAL */}
          {showSection('sec-3') && (
            <section id="sec-3" className="scroll-mt-24 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E4E1DA]">
                <div className="flex items-center gap-3">
                  <Languages className="w-5 h-5 text-[#1E3A8A] shrink-0" aria-hidden="true" />
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
                    🔤 III. Análisis gramatical
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('grammar')}
                  className="text-xs font-medium text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0 cursor-pointer no-print"
                >
                  🔤 Abrir guía gramatical →
                </button>
              </div>

              {/* Pericope Filter Ribbon */}
              {study.grammaticalAnalysis.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 no-print">
                  <button
                    type="button"
                    onClick={() => setSelectedPericopeRange('ALL')}
                    className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedPericopeRange === 'ALL'
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                        : 'bg-white text-zinc-700 border-[#D4D0C7] hover:bg-[#F3F1EC]'
                    }`}
                  >
                    Todas las perícopas ({totalTerms})
                  </button>
                  {study.grammaticalAnalysis.map((g) => (
                    <button
                      key={g.pericopeRange}
                      type="button"
                      onClick={() => setSelectedPericopeRange(g.pericopeRange)}
                      className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedPericopeRange === g.pericopeRange
                          ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                          : 'bg-white text-zinc-700 border-[#D4D0C7] hover:bg-[#F3F1EC]'
                      }`}
                    >
                      {g.pericopeRange} ({g.terms.length})
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-10">
                {visiblePericopes.map((group) => (
                  <div key={group.pericopeRange} className="space-y-4">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900">
                      <span className="font-mono-data text-sm text-[#1E3A8A] mr-2">
                        {group.pericopeRange}
                      </span>
                      {group.pericopeTitle}
                    </h3>

                    <div className="space-y-4">
                      {group.terms.map((term, idx) => (
                        <div
                          key={`${term.transliteration}-${idx}`}
                          className="p-5 bg-white border border-[#E4E1DA] rounded-md space-y-3.5"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-[#E4E1DA]">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                              <span className="biblical-script text-2xl font-semibold text-zinc-950">
                                {term.originalScript}
                              </span>
                              <span className="font-mono-data text-sm font-semibold text-[#1E3A8A]">
                                {term.transliteration}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {term.grammaticalCategory} · {term.morphology}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onInspectTerm(term.transliteration)}
                              className="text-xs font-medium text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0 cursor-pointer no-print"
                            >
                              Profundizar léxico →
                            </button>
                          </div>

                          <div className="space-y-2.5 text-sm leading-relaxed max-w-prose">
                            <div className="flex items-start gap-2.5">
                              <Quote className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" aria-hidden="true" />
                              <p className="text-zinc-900">
                                <strong className="font-semibold text-zinc-950">Traducción literal:</strong>{' '}
                                {term.literalTranslation}
                              </p>
                            </div>

                            <div className="flex items-start gap-2.5">
                              <BookOpen className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" aria-hidden="true" />
                              <p className="text-zinc-700">
                                <strong className="font-semibold text-zinc-950">Significado original:</strong>{' '}
                                {renderFormattedProse(term.originalMeaning)}
                              </p>
                            </div>

                            <div className="p-3 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-[#1E3A8A] mt-0.5 shrink-0" aria-hidden="true" />
                              <p className="text-zinc-800">
                                <strong className="font-semibold text-zinc-950">
                                  Resultado / Función argumental:
                                </strong>{' '}
                                {renderFormattedProse(term.argumentativeFunction)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* IV. NARRACIÓN ARGUMENTAL CONTINUA */}
          {showSection('sec-4') && (
            <section id="sec-4" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E4E1DA]">
                <BookOpen className="w-5 h-5 text-[#1E3A8A] shrink-0" aria-hidden="true" />
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
                  📖 IV. Narración argumental continua
                </h2>
              </div>

              <div className="space-y-5 text-[16px] leading-[1.82] text-zinc-800 max-w-prose text-justify">
                {study.continuousNarrative.map((paragraph, index) => (
                  <p key={index} className={index === 0 ? 'drop-cap' : undefined}>
                    {renderFormattedProse(paragraph)}
                  </p>
                ))}
              </div>

              <div className="p-5 bg-[#F3F1EC] border border-[#D4D0C7] rounded-md flex items-start gap-3">
                <BookOpenCheck className="w-4 h-4 text-[#1E3A8A] mt-1 shrink-0" aria-hidden="true" />
                <div className="text-sm text-zinc-800 leading-relaxed max-w-prose text-justify">
                  <strong className="font-semibold text-zinc-950">💡 Síntesis de la exposición:</strong>{' '}
                  {renderFormattedProse(study.keyPrincipleAndApplications.keyPrinciple)}
                </div>
              </div>
            </section>
          )}

          {/* V. PRINCIPIO BÍBLICO CLAVE Y APLICACIONES */}
          {showSection('sec-5') && (
            <section id="sec-5" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E4E1DA]">
                <ListChecks className="w-5 h-5 text-[#1E3A8A] shrink-0" aria-hidden="true" />
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
                  🎯 V. Principio bíblico clave y aplicaciones
                </h2>
              </div>

              <div className="p-5 sm:p-6 bg-white border border-[#D4D0C7] rounded-md space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>💎 Principio bíblico clave</span>
                  </div>
                  <p className="mt-2 font-display text-xl sm:text-2xl font-semibold text-zinc-950 leading-snug text-justify">
                    {study.keyPrincipleAndApplications.keyPrinciple}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E4E1DA]">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
                    🔑 Hábito clave operativo
                  </div>
                  <p className="mt-1.5 text-sm text-zinc-800 leading-relaxed max-w-prose text-justify">
                    {renderFormattedProse(study.keyPrincipleAndApplications.keyHabit)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {study.keyPrincipleAndApplications.applications.map((app, index) => {
                  const DimIcon = DIMENSION_ICONS[app.dimension] ?? CheckCircle2;
                  const dimEmoji = DIMENSION_EMOJIS[app.dimension] ?? '📌';
                  return (
                    <div
                      key={app.dimension}
                      className="p-5 bg-white border border-[#E4E1DA] rounded-md space-y-3"
                    >
                      <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#E4E1DA]">
                        <span aria-hidden="true" className="text-base">{dimEmoji}</span>
                        <DimIcon className="w-4 h-4 text-[#1E3A8A] shrink-0" aria-hidden="true" />
                        <h3 className="font-display text-xl font-semibold text-zinc-950">
                          {index + 1}. Aplicación {app.dimension.toLowerCase()}
                        </h3>
                      </div>
                      <div className="space-y-2.5 text-sm leading-relaxed text-zinc-700 max-w-prose text-justify">
                        <p>
                          <strong className="font-semibold text-zinc-950">Acción concreta:</strong>{' '}
                          {renderFormattedProse(app.concreteAction)}
                        </p>
                        <p className="p-3 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md text-zinc-800">
                          <strong className="font-semibold text-zinc-950">📌 Ejemplo práctico:</strong>{' '}
                          {renderFormattedProse(app.practicalExample)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* VI. CUESTIONES DEBATIDAS */}
          {showSection('sec-6') && (
            <section id="sec-6" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E4E1DA]">
                <Scale className="w-5 h-5 text-[#1E3A8A] shrink-0" aria-hidden="true" />
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
                  ⚖️ VI. Cuestiones debatidas
                </h2>
              </div>

              {study.debatedQuestions.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 no-print">
                  <button
                    type="button"
                    onClick={() => setSelectedDebateNum('ALL')}
                    className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedDebateNum === 'ALL'
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                        : 'bg-white text-zinc-700 border-[#D4D0C7] hover:bg-[#F3F1EC]'
                    }`}
                  >
                    Todas ({study.debatedQuestions.length})
                  </button>
                  {study.debatedQuestions.map((q) => (
                    <button
                      key={q.number}
                      type="button"
                      onClick={() => setSelectedDebateNum(q.number)}
                      className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedDebateNum === q.number
                          ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                          : 'bg-white text-zinc-700 border-[#D4D0C7] hover:bg-[#F3F1EC]'
                      }`}
                    >
                      Cuestión {q.number}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-10">
                {visibleDebates.map((q) => (
                  <div key={q.number} className="space-y-4">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-zinc-950 leading-snug">
                      {q.number}. {q.question}
                    </h3>

                    <div className="space-y-3.5">
                      {q.positions.map((pos, pIdx) => (
                        <div key={pIdx} className="p-4 sm:p-5 bg-white border border-[#E4E1DA] rounded-md space-y-2">
                          <h4 className="text-sm font-semibold text-zinc-950">{pos.label}</h4>
                          <p className="text-sm text-zinc-700 leading-relaxed max-w-prose">
                            {renderFormattedProse(pos.summary)}
                          </p>
                          {pos.arguments.length > 0 && (
                            <ul className="pt-1 space-y-1.5 text-sm text-zinc-600 list-disc list-inside max-w-prose">
                              {pos.arguments.map((arg, aIdx) => (
                                <li key={aIdx} className="leading-relaxed">
                                  {renderFormattedProse(arg)}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-[#F3F1EC] border border-[#D4D0C7] rounded-md flex items-start gap-2.5 text-sm text-zinc-800 leading-relaxed max-w-prose text-justify">
                      <Scale className="w-4 h-4 text-[#1E3A8A] mt-0.5 shrink-0" aria-hidden="true" />
                      <div>
                        <strong className="font-semibold text-zinc-950">⚖️ Estado del debate académico:</strong>{' '}
                        {renderFormattedProse(q.debateStatus)}
                      </div>
                    </div>

                    {q.plausibleBiblicalConclusion && (
                      <div className="p-4 sm:p-5 bg-white border border-[#1E3A8A]/40 rounded-md flex items-start gap-3 text-sm text-zinc-900 leading-relaxed max-w-prose text-justify">
                        <BookOpenCheck className="w-4 h-4 text-[#1E3A8A] mt-0.5 shrink-0" aria-hidden="true" />
                        <div>
                          <strong className="font-semibold text-[#1E3A8A]">
                            📖 Conclusión más plausible y fiel a la Escritura:
                          </strong>{' '}
                          {renderFormattedProse(q.plausibleBiblicalConclusion)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FUENTES Y VALORACIÓN EXEGÉTICA FINAL */}
          {showSection('sec-7') && (
            <section id="sec-7" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E4E1DA]">
                <BookMarked className="w-5 h-5 text-[#1E3A8A] shrink-0" aria-hidden="true" />
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
                  📚 VII. Fuentes y valoración exegética final
                </h2>
              </div>

              <div className="p-5 bg-white border border-[#E4E1DA] rounded-md">
                <div className="text-xs uppercase tracking-widest font-semibold text-zinc-500">
                  Aparato crítico y bibliografía académica
                </div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700 leading-relaxed list-disc list-inside text-justify">
                  {study.sources.map((src, idx) => (
                    <li key={idx}>{src}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 sm:p-6 bg-[#F3F1EC] border border-[#D4D0C7] rounded-md space-y-2.5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#1E3A8A]">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>✅ Resultado · Valoración exegética final</span>
                </div>
                <p className="text-[15.5px] leading-[1.8] text-zinc-900 max-w-prose text-justify">
                  {renderFormattedProse(study.finalAppraisal)}
                </p>
              </div>

              {study.fidelityAudit?.verified && (
                <div className="p-5 bg-white border border-[#E4E1DA] rounded-md space-y-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#1E3A8A]">
                    <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>🛡️ Auditoría de fidelidad bíblica (la Biblia se interpreta a sí misma)</span>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed max-w-prose text-justify">
                    {study.fidelityAudit.auditSummary}
                  </p>
                  {study.fidelityAudit.principlesChecked.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-zinc-600 list-disc list-inside text-justify">
                      {study.fidelityAudit.principlesChecked.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="p-5 bg-white border border-[#D4D0C7] rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-zinc-950">
                    🧠 ¿Quieres poner a prueba lo aprendido?
                  </div>
                  <p className="text-xs text-zinc-600 text-justify">
                    Practica con tarjetas de memoria, preguntas de verdadero o falso, selección múltiple y emparejamiento de términos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('learn')}
                  className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Ir a aprendizaje →</span>
                </button>
              </div>
            </section>
          )}

          {/* Isolated Section Navigation Footer */}
          {activeSection !== 'ALL' && (
            <div className="pt-6 border-t border-[#E4E1DA] flex flex-wrap items-center justify-between gap-3 no-print">
              {prevSection ? (
                <button
                  type="button"
                  onClick={() => selectSection(prevSection.id)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-xs font-medium text-zinc-800 bg-white border border-[#D4D0C7] rounded-md hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {prevSection.num}. {prevSection.label}
                  </span>
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={() => selectSection('ALL')}
                className="min-h-[44px] px-4 py-2 text-xs font-medium text-[#1E3A8A] hover:underline cursor-pointer"
              >
                Ver estudio completo
              </button>

              {nextSection ? (
                <button
                  type="button"
                  onClick={() => selectSection(nextSection.id)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] transition-colors cursor-pointer"
                >
                  <span>
                    {nextSection.num}. {nextSection.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              ) : (
                <span />
              )}
            </div>
          )}
        </article>

        {/* Right Margin Rail — Smart Dynamic Index (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-20 space-y-6 no-print">
          <div className="p-5 bg-white border border-[#E4E1DA] rounded-md">
            <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#E4E1DA]">
              <span className="text-xs uppercase tracking-widest font-semibold text-zinc-500">
                Índice inteligente
              </span>
              {activeSection !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => selectSection('ALL')}
                  className="text-xs font-medium text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  Mostrar todo
                </button>
              )}
            </div>

            <nav aria-label="Índice inteligente del estudio" className="space-y-1">
              <button
                type="button"
                onClick={() => selectSection('ALL')}
                className={`w-full px-3 py-2 rounded-md flex items-center justify-between text-xs font-medium transition-colors cursor-pointer ${
                  activeSection === 'ALL'
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-zinc-700 hover:bg-[#F3F1EC]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>📑 Documento completo</span>
                </span>
                <span className={activeSection === 'ALL' ? 'text-white/80' : 'text-zinc-400'}>
                  7 secciones
                </span>
              </button>

              {SECTION_DEFS.map((item) => {
                const Icon = item.Icon;
                const isActive = activeSection === item.id;
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => selectSection(item.id)}
                      className={`w-full px-3 py-2 rounded-md flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#F3F1EC] text-[#1E3A8A] font-semibold'
                          : 'text-zinc-700 hover:bg-[#FAF9F6] hover:text-zinc-950'
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span aria-hidden="true" className="text-xs shrink-0">{item.emoji}</span>
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#1E3A8A]' : 'text-zinc-400'}`}
                          aria-hidden="true"
                        />
                        <span className="font-mono-data text-[11px] text-zinc-400 w-5 shrink-0">
                          {item.num}.
                        </span>
                        <span className="text-xs truncate">{item.label}</span>
                      </span>
                      <span className="font-mono-data text-[11px] text-zinc-400 shrink-0">
                        {getSectionMetaCount(item.id)}
                      </span>
                    </button>

                    {/* Contextual sub-index when Section III is active */}
                    {isActive && item.id === 'sec-3' && study.grammaticalAnalysis.length > 1 && (
                      <div className="pl-9 pr-2 py-1 space-y-1">
                        {study.grammaticalAnalysis.map((g) => (
                          <button
                            key={g.pericopeRange}
                            type="button"
                            onClick={() => setSelectedPericopeRange(g.pericopeRange)}
                            className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors cursor-pointer truncate ${
                              selectedPericopeRange === g.pericopeRange
                                ? 'text-[#1E3A8A] font-semibold bg-white border border-[#E4E1DA]'
                                : 'text-zinc-500 hover:text-zinc-900'
                            }`}
                          >
                            {g.pericopeRange} · {g.terms.length} términos
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Contextual sub-index when Section VI is active */}
                    {isActive && item.id === 'sec-6' && study.debatedQuestions.length > 1 && (
                      <div className="pl-9 pr-2 py-1 space-y-1">
                        {study.debatedQuestions.map((q) => (
                          <button
                            key={q.number}
                            type="button"
                            onClick={() => setSelectedDebateNum(q.number)}
                            className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors cursor-pointer truncate ${
                              selectedDebateNum === q.number
                                ? 'text-[#1E3A8A] font-semibold bg-white border border-[#E4E1DA]'
                                : 'text-zinc-500 hover:text-zinc-900'
                            }`}
                          >
                            {q.number}. {q.question}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-[#E4E1DA] grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => downloadStudyMarkdown(study)}
                className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-2.5 py-1.5 text-xs font-medium text-zinc-800 bg-[#FAF9F6] border border-[#D4D0C7] rounded-md hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>📥 Markdown</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-2.5 py-1.5 text-xs font-medium text-zinc-800 bg-[#FAF9F6] border border-[#D4D0C7] rounded-md hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>🖨️ Imprimir / PDF</span>
              </button>
            </div>
          </div>

          <div className="p-5 bg-[#F3F1EC] border border-[#E4E1DA] rounded-md space-y-3">
            <div className="text-xs uppercase tracking-widest font-semibold text-zinc-600">
              Síntesis estructural
            </div>
            <dl className="space-y-2.5 text-xs">
              <div className="flex justify-between gap-2 pb-2 border-b border-[#E4E1DA]">
                <dt className="text-zinc-500">Unidades literarias</dt>
                <dd className="font-mono-data font-medium text-zinc-900">{study.baseText.subUnits.length}</dd>
              </div>
              <div className="flex justify-between gap-2 pb-2 border-b border-[#E4E1DA]">
                <dt className="text-zinc-500">Términos griegos/hebreos</dt>
                <dd className="font-mono-data font-medium text-zinc-900">{totalTerms}</dd>
              </div>
              <div className="flex justify-between gap-2 pb-2 border-b border-[#E4E1DA]">
                <dt className="text-zinc-500">Vínculos canónicos</dt>
                <dd className="font-mono-data font-medium text-zinc-900">{study.context.canonicalLinks.length}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-zinc-500">Cuestiones debatidas</dt>
                <dd className="font-mono-data font-medium text-zinc-900">{study.debatedQuestions.length}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
};
