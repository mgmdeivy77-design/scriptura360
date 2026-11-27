import React, { useState } from 'react';
import { BookOpen, Download, Plus, Search, Trash2 } from 'lucide-react';
import { MATEO_1_SAMPLE_STUDY } from '../data/mateoSample';
import type { ExegesisStudy } from '../types/exegesis';
import { downloadStudyMarkdown } from '../utils/exportStudy';
import { PWAInstallButton } from './PWAInstallButton';

interface LibraryViewProps {
  studies: ExegesisStudy[];
  activeStudyId: string;
  onSelectStudy: (id: string) => void;
  onDeleteStudy: (id: string) => void;
  onOpenGenerator: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  studies,
  activeStudyId,
  onSelectStudy,
  onDeleteStudy,
  onOpenGenerator,
}) => {
  const [filterTestament, setFilterTestament] = useState<'ALL' | 'NT' | 'AT'>('ALL');
  const [query, setQuery] = useState('');

  const filtered = studies.filter((s) => {
    if (filterTestament !== 'ALL' && s.testament !== filterTestament) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      return (
        s.passage.toLowerCase().includes(q) ||
        s.baseText.literaryUnit.toLowerCase().includes(q) ||
        s.originalLanguage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4E1DA] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-zinc-500">
            💾 Archivo local sin conexión
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-zinc-900">
            📚 Biblioteca de estudios exegéticos
          </h1>
          <p className="mt-2 text-sm text-zinc-600 max-w-xl leading-relaxed text-justify">
            Todos los estudios generados se almacenan en tu dispositivo para consulta inmediata sin conexión y exportación en Markdown o PDF.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <PWAInstallButton variant="subtle" />
          <button
            type="button"
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>✨ Nuevo estudio</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-[#F3F1EC] border border-[#E4E1DA] rounded-md w-fit">
          {(
            [
              { id: 'ALL', label: 'Todos' },
              { id: 'NT', label: 'Nuevo Testamento' },
              { id: 'AT', label: 'Antiguo Testamento' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilterTestament(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filterTestament === item.id
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar pasaje o tema..."
            className="w-full min-h-[40px] pl-9 pr-3 py-1.5 text-xs bg-white border border-[#D4D0C7] rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#1E3A8A]"
          />
        </div>
      </div>

      {/* Study List */}
      {filtered.length === 0 ? (
        <div className="p-10 text-center bg-white border border-[#E4E1DA] rounded-md text-sm text-zinc-500">
          No se encontraron estudios que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="bg-white border border-[#E4E1DA] rounded-md divide-y divide-[#E4E1DA]">
          {filtered.map((study) => {
            const isSelected = study.id === activeStudyId;
            const isSample = study.id === MATEO_1_SAMPLE_STUDY.id;
            const termCount = study.grammaticalAnalysis.reduce((acc, g) => acc + g.terms.length, 0);
            const formattedDate = new Date(study.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={study.id}
                className={`p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  isSelected ? 'bg-[#FAF9F6]' : 'hover:bg-[#FAF9F6]'
                }`}
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-500">
                    <span>{study.testament === 'NT' ? 'Nuevo Testamento' : 'Antiguo Testamento'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{study.originalLanguage}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{termCount} términos</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{formattedDate}</span>
                    {isSample && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-[#1E3A8A]">Estudio modelo</span>
                      </>
                    )}
                  </div>

                  <h2 className="font-display text-2xl font-semibold text-zinc-900">
                    {study.passage}
                  </h2>

                  <p className="text-sm text-zinc-600 line-clamp-2 max-w-2xl leading-relaxed text-justify">
                    {study.baseText.literaryUnit}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectStudy(study.id)}
                    className={`inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E3A8A] text-white'
                        : 'bg-white text-zinc-800 border border-[#D4D0C7] hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isSelected ? '📖 Abierto' : '📖 Abrir estudio'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadStudyMarkdown(study)}
                    aria-label={`Exportar ${study.passage} en Markdown`}
                    title="Exportar Markdown"
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center text-zinc-600 bg-white border border-[#D4D0C7] rounded-md hover:bg-[#F3F1EC] transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {!isSample && (
                    <button
                      type="button"
                      onClick={() => onDeleteStudy(study.id)}
                      aria-label={`Eliminar estudio ${study.passage}`}
                      title="Eliminar estudio"
                      className="min-h-[40px] min-w-[40px] flex items-center justify-center text-zinc-500 bg-white border border-[#D4D0C7] rounded-md hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
