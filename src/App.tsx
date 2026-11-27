import { useEffect, useState } from 'react';
import { BookOpen, Brain, Layers, Languages, Library, Plus } from 'lucide-react';
import { ContextualWorkbench } from './components/ContextualWorkbench';
import { GrammaticalWorkbench } from './components/GrammaticalWorkbench';
import { LearningWorkbench } from './components/LearningWorkbench';
import { LibraryView } from './components/LibraryView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { StudyGeneratorModal } from './components/StudyGeneratorModal';
import { StudyReaderView } from './components/StudyReaderView';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { useStudyLibrary } from './hooks/useStudyLibrary';
import { useTheme } from './hooks/useTheme';
import type { WorkspaceTab } from './types/exegesis';

export default function App() {
  const {
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
  } = useStudyLibrary();

  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('study');
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [grammarSearchSeed, setGrammarSearchSeed] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeTab, activeStudyId]);

  const handleNavigateTab = (tab: WorkspaceTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInspectTerm = (termQuery: string) => {
    setGrammarSearchSeed(termQuery);
    setActiveTab('grammar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#18181B]">
      {/* Top Navigation Bar — 3-Zone Editorial Contract */}
      <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E4E1DA] no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-12 md:h-14 flex items-center justify-between gap-4 sm:gap-6">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => handleNavigateTab('study')}
            className="font-display text-2xl font-semibold tracking-tight text-zinc-900 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span aria-hidden="true" className="text-lg">📜</span>
            <span>Scriptura</span>
          </button>

          {/* Zone 2: Concise single-line nav links */}
          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium">
            {(
              [
                { id: 'study', label: 'Estudio', emoji: '📖' },
                { id: 'grammar', label: 'Gramática', emoji: '🔤' },
                { id: 'context', label: 'Contexto', emoji: '🧭' },
                { id: 'learn', label: 'Aprender', emoji: '🧠' },
                { id: 'library', label: 'Biblioteca', emoji: '📚' },
              ] as const
            ).map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigateTab(item.id)}
                  className={`py-1 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    active
                      ? 'text-[#1E3A8A] border-[#1E3A8A]'
                      : 'text-zinc-600 border-transparent hover:text-zinc-900'
                  }`}
                >
                  <span aria-hidden="true" className="text-xs">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Theme switcher + primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeSwitcher theme={theme} onSelectTheme={setTheme} />
            <button
              type="button"
              onClick={() => setGeneratorOpen(true)}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-3 sm:px-3.5 py-1.5 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Nuevo estudio</span>
            </button>
          </div>
        </div>

        {/* Reading Depth Progress Hairline */}
        {activeTab === 'study' && (
          <div className="h-[2px] w-full bg-transparent">
            <div
              className="h-full bg-[#1E3A8A] transition-[width] duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Workspace */}
      <main className="flex-1 pb-20 md:pb-12">
        {activeTab === 'study' && (
          <StudyReaderView
            study={activeStudy}
            onNavigateTab={handleNavigateTab}
            onInspectTerm={handleInspectTerm}
          />
        )}

        {activeTab === 'grammar' && (
          <GrammaticalWorkbench
            key={`${activeStudy.id}-${grammarSearchSeed}`}
            study={activeStudy}
            initialSearchQuery={grammarSearchSeed}
            cachedTermAnalyses={termAnalyses}
            onSaveTermAnalysis={addTermAnalysis}
          />
        )}

        {activeTab === 'context' && (
          <ContextualWorkbench
            key={activeStudy.id}
            study={activeStudy}
            cachedContextAnalyses={contextAnalyses}
            onSaveContextAnalysis={addContextAnalysis}
          />
        )}

        {activeTab === 'learn' && (
          <LearningWorkbench
            key={activeStudy.id}
            study={activeStudy}
            onAppendLearningKit={appendStudyLearningKit}
          />
        )}

        {activeTab === 'library' && (
          <LibraryView
            studies={studies}
            activeStudyId={activeStudyId}
            onSelectStudy={(id) => {
              setActiveStudyId(id);
              setGrammarSearchSeed('');
              handleNavigateTab('study');
            }}
            onDeleteStudy={removeStudy}
            onOpenGenerator={() => setGeneratorOpen(true)}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="hidden md:block border-t border-[#E4E1DA] py-6 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-zinc-500">
          <span>📜 Scriptura · Metodología histórico-gramatical y hermenéutica objetiva (NA28 / BHS / LXX)</span>
          <span>📖 Lectura activa: {activeStudy.passage}</span>
        </div>
      </footer>

      {/* Mobile Bottom Tab Bar (Thumb Zone) */}
      <nav
        aria-label="Navegación móvil"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#E4E1DA] pb-safe no-print"
      >
        <div className="grid grid-cols-5 h-14 items-center">
          {(
            [
              { id: 'study', label: 'Estudio', Icon: BookOpen },
              { id: 'grammar', label: 'Gramática', Icon: Languages },
              { id: 'context', label: 'Contexto', Icon: Layers },
              { id: 'learn', label: 'Aprender', Icon: Brain },
              { id: 'library', label: 'Biblioteca', Icon: Library },
            ] as const
          ).map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigateTab(id)}
                className={`flex flex-col items-center justify-center min-h-[44px] transition-colors cursor-pointer ${
                  active ? 'text-[#1E3A8A]' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.75} aria-hidden="true" />
                <span className="text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Study Generator Modal */}
      <StudyGeneratorModal
        isOpen={generatorOpen}
        onClose={() => setGeneratorOpen(false)}
        onStudyGenerated={(newStudy) => {
          addStudy(newStudy);
          setGrammarSearchSeed('');
          handleNavigateTab('study');
        }}
      />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
