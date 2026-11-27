import React, { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import type { ContextLayerResult, ExegesisStudy } from '../types/exegesis';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { postApiJson } from '../utils/api';

interface ContextualWorkbenchProps {
  study: ExegesisStudy;
  cachedContextAnalyses: ContextLayerResult[];
  onSaveContextAnalysis: (result: ContextLayerResult) => void;
}

type ContextLayerTab = 'historical' | 'literary' | 'canonical' | 'cultural';

const QUICK_PROMPTS = [
  'Instituciones jurídicas y costumbres sociales relevantes en este pasaje',
  'Diálogo textual entre el hebreo (BHS), la Septuaginta (LXX) y el texto citado',
  'Estructura literaria inmediata: ¿qué precede y qué sigue al pasaje?',
];

export const ContextualWorkbench: React.FC<ContextualWorkbenchProps> = ({
  study,
  cachedContextAnalyses,
  onSaveContextAnalysis,
}) => {
  const isOnline = useOnlineStatus();
  const [activeLayer, setActiveLayer] = useState<ContextLayerTab>('historical');
  const [focusQuery, setFocusQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDossier, setActiveDossier] = useState<ContextLayerResult | null>(() => {
    return cachedContextAnalyses.find((c) => c.passage === study.passage) ?? null;
  });

  const runContextQuery = async (focusText: string) => {
    if (!isOnline) {
      setError('Sin conexión a internet. Puedes revisar las capas del estudio y los dosieres guardados localmente.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await postApiJson<{ contextAnalysis: ContextLayerResult }>(
        '/api/analyze/context',
        {
          passage: study.passage,
          focus: focusText.trim() || undefined,
        },
        'No se pudo generar el dosier contextual.'
      );
      const result = data.contextAnalysis;
      onSaveContextAnalysis(result);
      setActiveDossier(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const passageDossiers = cachedContextAnalyses.filter((c) => c.passage === study.passage);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E4E1DA] pb-6">
        <div className="text-xs uppercase tracking-widest text-zinc-500">
          🧭 Herramienta hermenéutica · {study.passage}
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-zinc-900">
          Análisis contextual e intertextual
        </h1>
        <p className="mt-2 text-sm text-zinc-600 max-w-2xl leading-relaxed text-justify">
          Examina las cuatro dimensiones objetivas del contexto bíblico —audiencia histórica, estructura literaria, vínculos canónicos y factores socioculturales— o formula una consulta contextual específica.
        </p>
      </div>

      {/* 4-Layer Context Explorer */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F3F1EC] border border-[#E4E1DA] rounded-md w-fit">
          {(
            [
              { id: 'historical', label: '🏛️ Audiencia e historia' },
              { id: 'literary', label: '📜 Estructura literaria' },
              { id: 'canonical', label: '🔗 Intertextualidad' },
              { id: 'cultural', label: '🏺 Factores culturales' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveLayer(tab.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeLayer === tab.id
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-[#E4E1DA] rounded-md p-6">
          {activeLayer === 'historical' && (
            <div className="space-y-5 max-w-prose">
              <div>
                <h2 className="font-display text-2xl font-semibold text-zinc-900">
                  Audiencia original y horizonte histórico
                </h2>
                <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
                  {study.context.historicalAudience}
                </p>
              </div>
              <div className="pt-4 border-t border-[#E4E1DA]">
                <h3 className="text-sm font-semibold text-zinc-900">Marco narrativo y propósito</h3>
                <p className="mt-2 text-sm text-zinc-700 leading-relaxed">{study.context.narrativeFlow}</p>
              </div>
            </div>
          )}

          {activeLayer === 'literary' && (
            <div className="space-y-5">
              <div className="max-w-prose">
                <h2 className="font-display text-2xl font-semibold text-zinc-900">
                  Delimitación literaria y perícopas
                </h2>
                <p className="mt-3 text-sm text-zinc-700 leading-relaxed">{study.context.literarySetting}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {study.baseText.subUnits.map((unit, idx) => (
                  <div key={unit.range} className="p-4 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md">
                    <div className="font-mono-data text-xs font-medium text-[#1E3A8A]">
                      0{idx + 1} · {unit.range}
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-zinc-900">{unit.title}</h3>
                    <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed">{unit.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeLayer === 'canonical' && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-semibold text-zinc-900">
                Mapa de vínculos canónicos y citas
              </h2>
              <div className="divide-y divide-[#E4E1DA] border-t border-[#E4E1DA]">
                {study.context.canonicalLinks.map((link, idx) => (
                  <div key={idx} className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline">
                    <div className="sm:col-span-3 font-mono-data text-xs font-medium text-[#1E3A8A]">
                      {link.reference}
                    </div>
                    <div className="sm:col-span-3 text-xs font-semibold text-zinc-900">
                      {link.relation}
                    </div>
                    <div className="sm:col-span-6 text-sm text-zinc-700 leading-relaxed text-justify">{link.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeLayer === 'cultural' && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-semibold text-zinc-900">
                Factores socioculturales, jurídicos y lingüísticos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {study.context.culturalFactors.map((cf, idx) => (
                  <div key={idx} className="p-4 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md space-y-1.5">
                    <h3 className="text-sm font-semibold text-zinc-900">{cf.factor}</h3>
                    <p className="text-sm text-zinc-700 leading-relaxed">{cf.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Targeted Contextual Research Tool */}
      <section className="p-5 sm:p-6 bg-white border border-[#E4E1DA] rounded-md space-y-5">
        <div>
          <h2 className="font-display text-2xl font-semibold text-zinc-900">
            Consultor contextual dirigido
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Genera un dosier histórico-hermenéutico específico sobre el entorno político, social o literario de {study.passage}.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runContextQuery(focusQuery);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={focusQuery}
              onChange={(e) => setFocusQuery(e.target.value)}
              placeholder="Ej. ¿Cómo funcionaba el desposorio en el judaísmo del siglo I?"
              className="w-full min-h-[44px] pl-10 pr-4 py-2 text-sm bg-[#FAF9F6] border border-[#D4D0C7] rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#1E3A8A]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 text-sm font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Investigando contexto…</span>
              </>
            ) : (
              <span>Generar dosier contextual</span>
            )}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500">Consultas sugeridas:</span>
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              type="button"
              disabled={loading}
              onClick={() => {
                setFocusQuery(q);
                runContextQuery(q);
              }}
              className="px-2.5 py-1 text-xs text-zinc-700 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md hover:border-[#1E3A8A] transition-colors text-left cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-md border border-red-200 bg-red-50 text-xs text-red-900">
            {error}
          </div>
        )}

        {activeDossier && (
          <div className="pt-5 border-t border-[#E4E1DA] space-y-5">
            <div className="text-xs uppercase tracking-widest font-semibold text-[#1E3A8A]">
              Dosier: {activeDossier.queryFocus}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md space-y-1.5">
                <h3 className="font-semibold text-zinc-900">Marco histórico-político</h3>
                <p className="text-zinc-700 leading-relaxed">{activeDossier.historicalPoliticalSetting}</p>
              </div>
              <div className="p-4 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md space-y-1.5">
                <h3 className="font-semibold text-zinc-900">Dinámicas sociales y religiosas</h3>
                <p className="text-zinc-700 leading-relaxed">{activeDossier.socioReligiousDynamics}</p>
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md space-y-1.5 text-sm">
              <h3 className="font-semibold text-zinc-900">Macroestructura literaria inmediata</h3>
              <p className="text-zinc-700 leading-relaxed">{activeDossier.immediateLiteraryMacroStructure}</p>
            </div>

            {activeDossier.intertextualEchoes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-zinc-900">Ecos e intertextualidad</h3>
                <div className="divide-y divide-[#E4E1DA] border border-[#E4E1DA] rounded-md bg-[#FAF9F6]">
                  {activeDossier.intertextualEchoes.map((echo, idx) => (
                    <div key={idx} className="p-3.5 text-sm">
                      <span className="font-mono-data text-xs font-medium text-[#1E3A8A]">
                        {echo.reference}
                      </span>
                      <span className="mx-2 text-zinc-400">·</span>
                      <span className="font-medium text-zinc-900">{echo.connectionType}</span>
                      <p className="mt-1 text-zinc-700 text-xs leading-relaxed">{echo.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeDossier.hermeneuticalGuardrails.length > 0 && (
              <div className="p-4 bg-[#F3F1EC] border border-[#E4E1DA] rounded-md space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-700">
                  Resguardos hermenéuticos (qué evitar al interpretar)
                </h3>
                <ul className="space-y-1.5 text-sm text-zinc-800 list-disc list-inside">
                  {activeDossier.hermeneuticalGuardrails.map((guard, idx) => (
                    <li key={idx}>{guard}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {passageDossiers.length > 0 && (
          <div className="pt-3 border-t border-[#E4E1DA] flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500">Dosieres guardados sin conexión:</span>
            {passageDossiers.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveDossier(d)}
                className="px-2.5 py-1 text-xs font-medium text-zinc-700 bg-[#FAF9F6] border border-[#E4E1DA] rounded-md hover:border-[#1E3A8A] truncate max-w-[260px] cursor-pointer"
              >
                {d.queryFocus}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
