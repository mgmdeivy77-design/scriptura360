import React, { useState } from 'react';
import { BookOpen, Loader2, X } from 'lucide-react';
import type { ExegesisStudy } from '../types/exegesis';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { postApiJson } from '../utils/api';

interface StudyGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudyGenerated: (study: ExegesisStudy) => void;
}

const PRESET_PASSAGES = [
  'Romanos 3:21-26',
  'Salmo 23:1-6',
  'Juan 1:1-18',
  'Filipenses 2:5-11',
  'Isaías 53:1-12',
  'Génesis 12:1-9',
];

export const StudyGeneratorModal: React.FC<StudyGeneratorModalProps> = ({
  isOpen,
  onClose,
  onStudyGenerated,
}) => {
  const isOnline = useOnlineStatus();
  const [passage, setPassage] = useState('');
  const [applicationContext, setApplicationContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passage.trim()) {
      setError('Ingresa una cita o perícopa bíblica para analizar.');
      return;
    }
    if (!isOnline) {
      setError('No hay conexión a internet. Conéctate para generar un nuevo estudio; tus estudios guardados siguen disponibles sin conexión.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await postApiJson<{ study: ExegesisStudy }>(
        '/api/study/generate',
        {
          passage: passage.trim(),
          applicationContext: applicationContext.trim() || undefined,
        },
        'No se pudo generar el estudio exegético.'
      );
      onStudyGenerated(data.study);
      setPassage('');
      setApplicationContext('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/45 backdrop-blur-[1px] p-0 md:p-4 no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="generate-study-title"
    >
      <div className="w-full max-w-xl rounded-t-2xl md:rounded-lg bg-[#FAF9F6] border border-[#E4E1DA] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E1DA] bg-white">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[#1E3A8A]" aria-hidden="true" />
            <h2 id="generate-study-title" className="font-display text-2xl font-semibold text-zinc-900">
              Generar estudio exegético
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar ventana"
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-zinc-500 hover:text-zinc-900 disabled:opacity-40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="passage-input" className="block text-sm font-medium text-zinc-800 mb-1.5">
              Pasaje bíblico o perícopa
            </label>
            <input
              id="passage-input"
              type="text"
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              disabled={loading}
              placeholder="Ej. Romanos 3:21-26, Salmo 23:1-6, Marcos 4:35-41"
              className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-white border border-[#D4D0C7] rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
            />
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-500">Sugerencias:</span>
              {PRESET_PASSAGES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  disabled={loading}
                  onClick={() => setPassage(preset)}
                  className="px-2.5 py-1 text-xs font-medium text-zinc-700 bg-white border border-[#E4E1DA] rounded-md hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="context-input" className="block text-sm font-medium text-zinc-800 mb-1.5">
              Contexto para aplicaciones prácticas <span className="text-zinc-400 font-normal">(opcional)</span>
            </label>
            <input
              id="context-input"
              type="text"
              value={applicationContext}
              onChange={(e) => setApplicationContext(e.target.value)}
              disabled={loading}
              placeholder="Ej. Congregación urbana en Madrid, estudiantes universitarios, familia..."
              className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-white border border-[#D4D0C7] rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
            />
            <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed text-justify">
              🛡️ Cada estudio sigue las 6 secciones exegéticas (Texto Base NA28/BHS, Contexto, Gramática, Narración Argumental, Principio y 5 Aplicaciones, y Cuestiones Debatidas) y pasa por una auditoría automática de fidelidad bíblica («la Biblia se interpreta a sí misma») sin sesgos denominacionales.
            </p>
          </div>

          {error && (
            <div role="alert" className="p-3.5 rounded-md border border-red-200 bg-red-50 text-xs text-red-900 leading-relaxed">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E4E1DA]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="min-h-[44px] px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 rounded-md hover:bg-[#F3F1EC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !passage.trim()}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 text-sm font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Elaborando y auditando exégesis…</span>
                </>
              ) : (
                <span>📜 Generar estudio</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
