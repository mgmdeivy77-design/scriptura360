import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const MODEL_NAME = process.env.GEMINI_MODEL?.trim() || 'gemini-4-hydrogen';

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en el servidor.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function handleGeminiError(res: Response, err: unknown): void {
  const message =
    err instanceof Error ? err.message : 'Error inesperado al consultar el motor exegético.';
  const statusMatch = message.match(/\b(400|401|403|404|429|500|503)\b/);
  const statusCode = statusMatch ? Number(statusMatch[1]) : 500;

  let userMessage = message;
  if (message.includes('GEMINI_API_KEY')) {
    userMessage =
      'Falta configurar GEMINI_API_KEY en las variables de entorno del servidor (Secrets o Environment Variables en Vercel).';
  } else if (
    statusCode === 403 ||
    message.includes('PERMISSION_DENIED') ||
    message.includes('API_KEY_INVALID')
  ) {
    userMessage =
      'Error de autenticación con la API de Gemini. Verifica la variable GEMINI_API_KEY en la configuración del proyecto.';
  } else if (statusCode === 404 || message.includes('NOT_FOUND')) {
    userMessage = `El modelo configurado (${MODEL_NAME}) no está disponible para esta clave API. Verifica el acceso al modelo o ajusta GEMINI_MODEL en las variables de entorno.`;
  } else if (statusCode === 429 || message.includes('RESOURCE_EXHAUSTED')) {
    userMessage = 'Se alcanzó el límite temporal de solicitudes. Intenta nuevamente en unos momentos.';
  }

  res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
    error: userMessage,
  });
}

const STUDY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    passage: { type: Type.STRING, description: 'Nombre normalizado del pasaje, ej. Romanos 3:21-26.' },
    testament: { type: Type.STRING, description: 'Debe ser exactamente "NT" o "AT".' },
    originalLanguage: {
      type: Type.STRING,
      description: 'Debe ser "Griego koiné (NA28)", "Hebreo bíblico (BHS)" o "Arameo / Hebreo (BHS)".',
    },
    readingMinutes: { type: Type.INTEGER, description: 'Minutos estimados de lectura académica (entre 8 y 20).' },
    baseText: {
      type: Type.OBJECT,
      properties: {
        reference: { type: Type.STRING },
        criticalText: {
          type: Type.STRING,
          description:
            'Edición crítica estándar (ej. Novum Testamentum Graece, Nestle-Aland 28.ª ed. [NA28] o Biblia Hebraica Stuttgartensia [BHS] y Septuaginta Rahlfs-Hanhart).',
        },
        literaryUnit: {
          type: Type.STRING,
          description: 'Explicación objetiva de la delimitación literaria del pasaje y sus subunidades estructurales.',
        },
        subUnits: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              range: { type: Type.STRING },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
            },
            required: ['range', 'title', 'summary'],
          },
        },
      },
      required: ['reference', 'criticalText', 'literaryUnit', 'subUnits'],
    },
    context: {
      type: Type.OBJECT,
      properties: {
        historicalAudience: { type: Type.STRING },
        literarySetting: { type: Type.STRING },
        narrativeFlow: { type: Type.STRING },
        canonicalLinks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              reference: { type: Type.STRING },
              relation: { type: Type.STRING },
              note: { type: Type.STRING },
            },
            required: ['reference', 'relation', 'note'],
          },
        },
        culturalFactors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              factor: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ['factor', 'explanation'],
          },
        },
      },
      required: ['historicalAudience', 'literarySetting', 'narrativeFlow', 'canonicalLinks', 'culturalFactors'],
    },
    grammaticalAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pericopeRange: { type: Type.STRING },
          pericopeTitle: { type: Type.STRING },
          terms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalScript: {
                  type: Type.STRING,
                  description: 'Texto en alfabeto griego politónico o hebreo con puntuación.',
                },
                transliteration: { type: Type.STRING },
                morphology: {
                  type: Type.STRING,
                  description: 'Análisis morfológico exacto (ej. Verbo aoristo indicativo activo 3.ª sing.).',
                },
                grammaticalCategory: {
                  type: Type.STRING,
                  description: 'Uno de: Verbo, Sustantivo, Adjetivo, Adverbio, Expresión, Título, Otro.',
                },
                literalTranslation: { type: Type.STRING },
                originalMeaning: { type: Type.STRING, description: 'Campo semántico, raíces y uso en LXX/MT/NT.' },
                argumentativeFunction: {
                  type: Type.STRING,
                  description: 'Cómo funciona este término en el argumento del pasaje.',
                },
                crossReferences: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'originalScript',
                'transliteration',
                'morphology',
                'grammaticalCategory',
                'literalTranslation',
                'originalMeaning',
                'argumentativeFunction',
                'crossReferences',
              ],
            },
          },
        },
        required: ['pericopeRange', 'pericopeTitle', 'terms'],
      },
    },
    continuousNarrative: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Mínimo 7 a 10 párrafos densos de exposición argumental continua siguiendo el texto paso a paso.',
    },
    keyPrincipleAndApplications: {
      type: Type.OBJECT,
      properties: {
        keyPrinciple: { type: Type.STRING },
        keyHabit: { type: Type.STRING },
        applications: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dimension: {
                type: Type.STRING,
                description: 'Exactamente los 5 valores en orden: Personal, Comunitaria, Educativa, Eclesial, Pastoral.',
              },
              concreteAction: { type: Type.STRING },
              practicalExample: { type: Type.STRING },
            },
            required: ['dimension', 'concreteAction', 'practicalExample'],
          },
        },
      },
      required: ['keyPrinciple', 'keyHabit', 'applications'],
    },
    debatedQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          number: { type: Type.INTEGER },
          question: { type: Type.STRING },
          positions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: 'Ej. Primera posición: ...' },
                summary: { type: Type.STRING },
                arguments: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description:
                    'Argumentos reales fundamentados explícitamente por disciplina: filológico-textual, histórico-arqueológico, filosófico-lógico, científico/natural (cuando corresponda) y teológico-canónico.',
                },
              },
              required: ['label', 'summary', 'arguments'],
            },
          },
          debateStatus: { type: Type.STRING },
          plausibleBiblicalConclusion: {
            type: Type.STRING,
            description:
              'Conclusión más plausible y estrictamente apegada al texto bíblico mismo (dejando que la Biblia se interprete a sí misma mediante pasajes paralelos), sopesando objetivamente los argumentos expuestos.',
          },
        },
        required: ['number', 'question', 'positions', 'debateStatus', 'plausibleBiblicalConclusion'],
      },
    },
    sources: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        'Ediciones críticas reales (NA28, BHS, Rahlfs-Hanhart) y comentarios exegéticos académicos reconocidos pertinentes al libro bíblico (ICC, WBC, Hermeneia, NICNT, NICOT, BECNT, Anchor Yale, etc.).',
    },
    finalAppraisal: { type: Type.STRING },
  },
  required: [
    'passage',
    'testament',
    'originalLanguage',
    'readingMinutes',
    'baseText',
    'context',
    'grammaticalAnalysis',
    'continuousNarrative',
    'keyPrincipleAndApplications',
    'debatedQuestions',
    'sources',
    'finalAppraisal',
  ],
};

const TERM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    originalScript: { type: Type.STRING },
    transliteration: { type: Type.STRING },
    lemma: { type: Type.STRING },
    morphology: { type: Type.STRING },
    literalTranslation: { type: Type.STRING },
    semanticRange: { type: Type.STRING },
    lxxOrMtComparison: { type: Type.STRING },
    syntacticRole: { type: Type.STRING },
    exegeticalSignificance: { type: Type.STRING },
    keyCrossReferences: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'originalScript',
    'transliteration',
    'lemma',
    'morphology',
    'literalTranslation',
    'semanticRange',
    'lxxOrMtComparison',
    'syntacticRole',
    'exegeticalSignificance',
    'keyCrossReferences',
  ],
};

const CONTEXT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    historicalPoliticalSetting: { type: Type.STRING },
    socioReligiousDynamics: { type: Type.STRING },
    immediateLiteraryMacroStructure: { type: Type.STRING },
    intertextualEchoes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          reference: { type: Type.STRING },
          connectionType: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ['reference', 'connectionType', 'explanation'],
      },
    },
    hermeneuticalGuardrails: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'historicalPoliticalSetting',
    'socioReligiousDynamics',
    'immediateLiteraryMacroStructure',
    'intertextualEchoes',
    'hermeneuticalGuardrails',
  ],
};

const LEARNING_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: 'Uno de: Vocabulario, Contexto, Teología, Debate.',
          },
          frontTitle: { type: Type.STRING },
          frontHint: { type: Type.STRING },
          originalScript: { type: Type.STRING },
          transliteration: { type: Type.STRING },
          backAnswer: { type: Type.STRING },
          reference: { type: Type.STRING },
        },
        required: ['category', 'frontTitle', 'frontHint', 'backAnswer', 'reference'],
      },
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            description: 'Uno de: true_false, multiple_choice, term_match, fill_blank.',
          },
          prompt: { type: Type.STRING },
          originalScript: { type: Type.STRING },
          transliteration: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Exactamente 2 opciones ["Verdadero","Falso"] para true_false, y 4 opciones para los demás tipos.',
          },
          correctIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
          sectionRef: { type: Type.STRING },
        },
        required: ['type', 'prompt', 'options', 'correctIndex', 'explanation', 'sectionRef'],
      },
    },
  },
  required: ['flashcards', 'questions'],
};

const STUDY_AUDIT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    auditSummary: {
      type: Type.STRING,
      description:
        'Resumen breve en español verificando fidelidad textual, ausencia de alucinaciones, neutralidad denominacional y analogía de la Escritura.',
    },
    principlesChecked: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    correctionsCount: { type: Type.INTEGER },
    grammaticalFixes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pericopeIndex: { type: Type.INTEGER },
          termIndex: { type: Type.INTEGER },
          correctedOriginalScript: { type: Type.STRING },
          correctedTransliteration: { type: Type.STRING },
          correctedMorphology: { type: Type.STRING },
          correctedLiteralTranslation: { type: Type.STRING },
          correctedOriginalMeaning: { type: Type.STRING },
          correctedArgumentativeFunction: { type: Type.STRING },
          correctedCrossReferences: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['pericopeIndex', 'termIndex'],
      },
    },
    narrativeFixes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          paragraphIndex: { type: Type.INTEGER },
          correctedText: { type: Type.STRING },
        },
        required: ['paragraphIndex', 'correctedText'],
      },
    },
    correctedKeyPrinciple: { type: Type.STRING },
    correctedKeyHabit: { type: Type.STRING },
    verifiedDebatedQuestions: STUDY_SCHEMA.properties.debatedQuestions,
    verifiedSources: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    verifiedFinalAppraisal: { type: Type.STRING },
  },
  required: [
    'auditSummary',
    'principlesChecked',
    'correctionsCount',
    'grammaticalFixes',
    'narrativeFixes',
    'verifiedDebatedQuestions',
    'verifiedSources',
    'verifiedFinalAppraisal',
  ],
};

const TERM_AUDIT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    auditSummary: { type: Type.STRING },
    principlesChecked: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    correctionsCount: { type: Type.INTEGER },
    verifiedAnalysis: TERM_SCHEMA,
  },
  required: ['auditSummary', 'principlesChecked', 'correctionsCount', 'verifiedAnalysis'],
};

const CONTEXT_AUDIT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    auditSummary: { type: Type.STRING },
    principlesChecked: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    correctionsCount: { type: Type.INTEGER },
    verifiedContext: CONTEXT_SCHEMA,
  },
  required: ['auditSummary', 'principlesChecked', 'correctionsCount', 'verifiedContext'],
};

const LEARNING_AUDIT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    auditSummary: { type: Type.STRING },
    principlesChecked: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    correctionsCount: { type: Type.INTEGER },
    verifiedLearningKit: LEARNING_SCHEMA,
  },
  required: ['auditSummary', 'principlesChecked', 'correctionsCount', 'verifiedLearningKit'],
};

const CORE_FIDELITY_CONSTITUTION = `Principios irrenunciables de fidelidad bíblica y hermenéutica objetiva:
1. CERO ALUCINACIONES: Nunca inventes versículos, citas textuales inexistentes, lemas griegos/hebreos ficticios ni libros o comentarios académicos inventados. Si no existe certeza absoluta sobre una cita o fuente secundaria, omítela y cíñete únicamente al texto canónico verificable.
2. LA BIBLIA SE INTERPRETA A SÍ MISMA (Analogia Scripturae): Fundamenta toda explicación doctrinal, lexical o teológica directamente en el pasaje estudiado y en textos bíblicos paralelos reales dentro del canon (AT, LXX, NT).
3. NEUTRALIDAD DENOMINACIONAL ESTRICTA: Evita cualquier sesgo confesional, sectario o apologético de parte. Menciona posturas denominacionales únicamente cuando sea estrictamente indispensable para contextualizar un debate histórico real, siempre ponderándolas con imparcialidad frente al texto bíblico mismo.
4. SOLIDEZ MULTIDISCIPLINAR EN DEBATES: En cuestiones debatidas, respalda cada posición con argumentos reales (filológicos/textuales, históricos/arqueológicos, filosóficos/lógicos, científicos/naturales cuando el pasaje toque realidad física o histórica, y teológico-canónicos) y cierra siempre con la conclusión más plausible y más fiel al conjunto de la Escritura.`;

async function auditStudyFidelity(ai: GoogleGenAI, study: Record<string, unknown>) {
  const auditResponse = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Audita con máximo rigor el siguiente estudio exegético generado sobre "${String(study.passage ?? '')}".

Verifica punto por punto:
1. Que todas las citas bíblicas, palabras en griego/hebreo, transliteraciones, morfologías y referencias cruzadas existan realmente en el texto bíblico (NA28 / BHS / LXX) y correspondan exactamente al pasaje indicado. Si detectas cualquier error o alucinación, inclúyelo en grammaticalFixes o narrativeFixes.
2. Que se cumpla estrictamente «la Biblia se interpreta a sí misma» sin extrapolaciones especulativas ni sesgos denominacionales (solo menciona tradiciones confesionales si son imprescindibles para explicar un debate real, con absoluta neutralidad).
3. Que en verifiedDebatedQuestions cada cuestión incluya argumentos reales y diferenciados (textuales, históricos, filosóficos, científicos cuando aplique y teológicos) y concluya en plausibleBiblicalConclusion con la síntesis más plausible y fiel al texto bíblico mismo.
4. Que verifiedSources contenga exclusivamente ediciones críticas y comentarios académicos reales y existentes (elimina cualquier título dudoso).

Estudio a auditar (JSON):
${JSON.stringify(study)}`,
    config: {
      systemInstruction: `Eres el auditor jefe de exégesis bíblica objetiva y verificación anti-alucinaciones. ${CORE_FIDELITY_CONSTITUTION} Devuelve únicamente JSON válido conforme al esquema de auditoría.`,
      responseMimeType: 'application/json',
      responseSchema: STUDY_AUDIT_SCHEMA,
    },
  });

  const auditRaw = (auditResponse.text ?? '').trim();
  const audit = JSON.parse(auditRaw) as {
    auditSummary: string;
    principlesChecked: string[];
    correctionsCount: number;
    grammaticalFixes?: Array<{
      pericopeIndex: number;
      termIndex: number;
      correctedOriginalScript?: string;
      correctedTransliteration?: string;
      correctedMorphology?: string;
      correctedLiteralTranslation?: string;
      correctedOriginalMeaning?: string;
      correctedArgumentativeFunction?: string;
      correctedCrossReferences?: string[];
    }>;
    narrativeFixes?: Array<{ paragraphIndex: number; correctedText: string }>;
    correctedKeyPrinciple?: string;
    correctedKeyHabit?: string;
    verifiedDebatedQuestions?: unknown[];
    verifiedSources?: string[];
    verifiedFinalAppraisal?: string;
  };

  const grammaticalAnalysis = Array.isArray(study.grammaticalAnalysis)
    ? (study.grammaticalAnalysis as Array<{ terms?: Array<Record<string, unknown>> }>)
    : [];

  for (const fix of audit.grammaticalFixes ?? []) {
    const group = grammaticalAnalysis[fix.pericopeIndex];
    const term = group?.terms?.[fix.termIndex];
    if (term) {
      if (fix.correctedOriginalScript) term.originalScript = fix.correctedOriginalScript;
      if (fix.correctedTransliteration) term.transliteration = fix.correctedTransliteration;
      if (fix.correctedMorphology) term.morphology = fix.correctedMorphology;
      if (fix.correctedLiteralTranslation) term.literalTranslation = fix.correctedLiteralTranslation;
      if (fix.correctedOriginalMeaning) term.originalMeaning = fix.correctedOriginalMeaning;
      if (fix.correctedArgumentativeFunction) {
        term.argumentativeFunction = fix.correctedArgumentativeFunction;
      }
      if (Array.isArray(fix.correctedCrossReferences) && fix.correctedCrossReferences.length > 0) {
        term.crossReferences = fix.correctedCrossReferences;
      }
    }
  }

  const continuousNarrative = Array.isArray(study.continuousNarrative)
    ? [...(study.continuousNarrative as string[])]
    : [];
  for (const nFix of audit.narrativeFixes ?? []) {
    if (
      nFix.paragraphIndex >= 0 &&
      nFix.paragraphIndex < continuousNarrative.length &&
      nFix.correctedText?.trim()
    ) {
      continuousNarrative[nFix.paragraphIndex] = nFix.correctedText;
    }
  }
  study.continuousNarrative = continuousNarrative;

  const kpa = (study.keyPrincipleAndApplications ?? {}) as Record<string, unknown>;
  if (audit.correctedKeyPrinciple?.trim()) {
    kpa.keyPrinciple = audit.correctedKeyPrinciple;
  }
  if (audit.correctedKeyHabit?.trim()) {
    kpa.keyHabit = audit.correctedKeyHabit;
  }

  if (Array.isArray(audit.verifiedDebatedQuestions) && audit.verifiedDebatedQuestions.length > 0) {
    study.debatedQuestions = audit.verifiedDebatedQuestions;
  }
  if (Array.isArray(audit.verifiedSources) && audit.verifiedSources.length > 0) {
    study.sources = audit.verifiedSources;
  }
  if (audit.verifiedFinalAppraisal?.trim()) {
    study.finalAppraisal = audit.verifiedFinalAppraisal;
  }

  study.fidelityAudit = {
    verified: true,
    principlesChecked:
      Array.isArray(audit.principlesChecked) && audit.principlesChecked.length > 0
        ? audit.principlesChecked
        : [
            'Fidelidad estricta al texto bíblico (NA28 / BHS / LXX)',
            'La Biblia se interpreta a sí misma (Analogia Scripturae)',
            'Neutralidad denominacional y exégesis objetiva',
            'Cero alucinaciones en citas, morfología y bibliografía',
          ],
    auditSummary: audit.auditSummary,
    correctionsApplied: Math.max(0, Number(audit.correctionsCount) || 0),
    auditedAt: new Date().toISOString(),
  };

  return study;
}

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.post('/api/study/generate', async (req: Request, res: Response) => {
  try {
    const { passage, applicationContext } = req.body as {
      passage?: string;
      applicationContext?: string;
    };

    if (!passage || !passage.trim()) {
      res.status(400).json({
        error: 'Debes indicar un pasaje bíblico válido (por ejemplo: Mateo 1:1-25 o Romanos 3:21-26).',
      });
      return;
    }

    const trimmedPassage = passage.trim();
    const contextInstruction =
      applicationContext && applicationContext.trim()
        ? `Para los ejemplos prácticos de la sección V (Aplicaciones), sitúalos de forma realista y respetuosa en el contexto sociocultural de: "${applicationContext.trim()}".`
        : `Para los ejemplos prácticos de la sección V (Aplicaciones), redacta ejemplos concretos, verosímiles y observables aplicables a la vida cotidiana, comunitaria, educativa, eclesial y pastoral actual.`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Elabora un estudio exegético y hermenéutico exhaustivo, objetivo y de rigor académico sobre el pasaje bíblico: "${trimmedPassage}".
${contextInstruction}

${CORE_FIDELITY_CONSTITUTION}

Requisitos metodológicos obligatorios:
1. I. TEXTO BASE: Cita el texto crítico estándar real (NA28 para NT; BHS y Septuaginta Rahlfs-Hanhart para AT) y delimita con precisión la unidad literaria y sus subunidades (2 a 4 subunidades).
2. II. CONTEXTO DEL PASAJE: Analiza audiencia original, marco histórico-literario, flujo narrativo o argumental, vínculos canónicos (dejando que la Biblia se interprete a sí misma) y factores culturales verificables.
3. III. ANÁLISIS GRAMATICAL: Agrupa por cada perícopa o subunidad e incluye en total entre 10 y 15 términos o expresiones clave reales del pasaje en su idioma original (griego koiné o hebreo/arameo bíblico). Cada entrada debe aportar escritura original, transliteración precisa, análisis morfológico exacto, traducción literal, significado original (raíz, uso en LXX/MT/NT) y función argumental dentro del pasaje.
4. IV. NARRACIÓN ARGUMENTAL CONTINUA: Desarrolla una exposición continua (mínimo 8 párrafos sustantivos) en prosa académica clara y precisa, explicando el desarrollo lógico y teológico paso a paso sin sesgos denominacionales ni sermoneo superficial, dejando que la Escritura ilumine la Escritura.
5. V. PRINCIPIO BÍBLICO CLAVE Y APLICACIONES: Formula el principio bíblico clave, el hábito clave, y exactamente las 5 aplicaciones en orden (Personal, Comunitaria, Educativa, Eclesial, Pastoral), cada una con su Acción concreta y Ejemplo práctico.
6. VI. CUESTIONES DEBATIDAS: Presenta 3 a 4 preguntas exegéticas reales sobre este pasaje. En cada cuestión expón de 2 a 3 posiciones académicas equilibradas fundamentadas en argumentos reales y etiquetados según corresponda (filológicos/textuales, históricos/arqueológicos, filosóficos/lógicos, científicos/naturales cuando aplique y teológico-canónicos). Añade un "debateStatus" imparcial y concluye SIEMPRE con "plausibleBiblicalConclusion": la conclusión más plausible, coherente y estrictamente apegada al texto bíblico mismo.
7. FUENTES Y VALORACIÓN EXEGÉTICA FINAL: Lista fuentes académicas reales y pertinentes al libro bíblico (ediciones críticas y comentarios académicos reconocidos, nunca títulos inventados) y cierra con una valoración exegética final sintética.`,
      config: {
        systemInstruction: `Eres un catedrático e investigador especialista en exégesis bíblica histórico-gramatical, filología bíblica (griego koiné, hebreo y arameo bíblicos, Septuaginta) y hermenéutica objetiva. ${CORE_FIDELITY_CONSTITUTION} Redactas en español académico sobrio, riguroso, claro e imparcial. Devuelves únicamente JSON válido ajustado al esquema solicitado.`,
        responseMimeType: 'application/json',
        responseSchema: STUDY_SCHEMA,
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      res.status(502).json({ error: 'El modelo devolvió una respuesta vacía. Intenta nuevamente.' });
      return;
    }

    const parsed = JSON.parse(rawText) as Record<string, unknown>;
    const draftStudy = {
      ...parsed,
      id: `study-${Date.now()}`,
      createdAt: new Date().toISOString(),
      applicationContextLabel: applicationContext?.trim() || undefined,
    };

    const auditedStudy = await auditStudyFidelity(ai, draftStudy);
    res.json({ study: auditedStudy });
  } catch (err) {
    handleGeminiError(res, err);
  }
});

app.post('/api/analyze/term', async (req: Request, res: Response) => {
  try {
    const { passage, term } = req.body as { passage?: string; term?: string };
    if (!passage?.trim() || !term?.trim()) {
      res.status(400).json({ error: 'Se requiere tanto el pasaje como el término o expresión a analizar.' });
      return;
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Realiza un análisis léxico-gramatical y sintáctico profundo del término o expresión "${term.trim()}" dentro del contexto específico de "${passage.trim()}".
${CORE_FIDELITY_CONSTITUTION}
Proporciona: escritura original (griego politónico o hebreo/arameo con puntuación), transliteración académica, lema léxico, morfología exacta en ese versículo, traducción literal, rango semántico, comparación con la Septuaginta (LXX) o Texto Masorético (BHS) según corresponda, función sintáctica en la oración, relevancia exegética y referencias cruzadas bíblicas reales donde la Escritura aclare ese uso.`,
      config: {
        systemInstruction: `Eres un filólogo bíblico especialista en gramática griega del Nuevo Testamento (NA28), hebreo/arameo bíblico (BHS) y Septuaginta (Rahlfs-Hanhart). ${CORE_FIDELITY_CONSTITUTION} Responde con precisión morfológica y sobriedad académica en español. Devuelve únicamente JSON válido.`,
        responseMimeType: 'application/json',
        responseSchema: TERM_SCHEMA,
      },
    });

    const rawText = (response.text ?? '').trim();
    const draftAnalysis = JSON.parse(rawText);

    const auditResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Audita estrictamente este análisis léxico para "${term.trim()}" en "${passage.trim()}". Verifica que la forma griega/hebrea, lema, morfología y citas bíblicas cruzadas sean 100% reales y fieles al texto bíblico sin sesgos denominacionales ni alucinaciones. Si algo es inexacto, corrígelo en verifiedAnalysis.
Análisis: ${JSON.stringify(draftAnalysis)}`,
      config: {
        systemInstruction: `Eres auditor de filología bíblica anti-alucinaciones. ${CORE_FIDELITY_CONSTITUTION} Devuelve únicamente JSON válido.`,
        responseMimeType: 'application/json',
        responseSchema: TERM_AUDIT_SCHEMA,
      },
    });

    const audit = JSON.parse((auditResponse.text ?? '').trim()) as {
      auditSummary: string;
      principlesChecked: string[];
      correctionsCount: number;
      verifiedAnalysis: Record<string, unknown>;
    };

    res.json({
      analysis: {
        ...audit.verifiedAnalysis,
        id: `term-${Date.now()}`,
        passage: passage.trim(),
        queryTerm: term.trim(),
        createdAt: new Date().toISOString(),
        fidelityAudit: {
          verified: true,
          principlesChecked: audit.principlesChecked,
          auditSummary: audit.auditSummary,
          correctionsApplied: Math.max(0, Number(audit.correctionsCount) || 0),
          auditedAt: new Date().toISOString(),
        },
      },
    });
  } catch (err) {
    handleGeminiError(res, err);
  }
});

app.post('/api/analyze/context', async (req: Request, res: Response) => {
  try {
    const { passage, focus } = req.body as { passage?: string; focus?: string };
    if (!passage?.trim()) {
      res.status(400).json({ error: 'Se requiere el pasaje bíblico para el análisis contextual.' });
      return;
    }

    const focusText = focus?.trim()
      ? `Enfoque o pregunta contextual específica del investigador: "${focus.trim()}".`
      : 'Ofrece un panorama completo del trasfondo histórico, sociorreligioso, literario e intertextual del pasaje.';

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Elabora un dosier de análisis contextual histórico-literario y hermenéutico para el pasaje "${passage.trim()}".
${focusText}
${CORE_FIDELITY_CONSTITUTION}
Incluye: marco histórico-político verificable, dinámicas sociales/jurídicas/religiosas de la época, ubicación en la macroestructura literaria del libro (qué precede y qué sigue al pasaje), ecos o citas intertextuales reales (AT/LXX/NT) donde la Biblia se interprete a sí misma, y 3 a 4 criterios o resguardos hermenéuticos para evitar errores anacrónicos o sesgos sectarios.`,
      config: {
        systemInstruction: `Eres un historiador del antiguo Israel, del judaísmo del Segundo Templo y del mundo grecorromano especializado en hermenéutica bíblica objetiva. ${CORE_FIDELITY_CONSTITUTION} Responde en español académico claro y sin especulaciones sin sustento histórico. Devuelve únicamente JSON válido.`,
        responseMimeType: 'application/json',
        responseSchema: CONTEXT_SCHEMA,
      },
    });

    const rawText = (response.text ?? '').trim();
    const draftContext = JSON.parse(rawText);

    const auditResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Audita este dosier contextual para "${passage.trim()}". Comprueba que ningún dato histórico, referencia intertextual ni cita bíblica sea inventada o tendenciosa, y corrige en verifiedContext cualquier detalle impreciso.
Dosier: ${JSON.stringify(draftContext)}`,
      config: {
        systemInstruction: `Eres auditor histórico-hermenéutico anti-alucinaciones. ${CORE_FIDELITY_CONSTITUTION} Devuelve únicamente JSON válido.`,
        responseMimeType: 'application/json',
        responseSchema: CONTEXT_AUDIT_SCHEMA,
      },
    });

    const audit = JSON.parse((auditResponse.text ?? '').trim()) as {
      auditSummary: string;
      principlesChecked: string[];
      correctionsCount: number;
      verifiedContext: Record<string, unknown>;
    };

    res.json({
      contextAnalysis: {
        ...audit.verifiedContext,
        id: `ctx-${Date.now()}`,
        passage: passage.trim(),
        queryFocus: focus?.trim() || 'Panorama histórico, literario e intertextual completo',
        createdAt: new Date().toISOString(),
        fidelityAudit: {
          verified: true,
          principlesChecked: audit.principlesChecked,
          auditSummary: audit.auditSummary,
          correctionsApplied: Math.max(0, Number(audit.correctionsCount) || 0),
          auditedAt: new Date().toISOString(),
        },
      },
    });
  } catch (err) {
    handleGeminiError(res, err);
  }
});

app.post('/api/study/learning', async (req: Request, res: Response) => {
  try {
    const { passage, keyPrinciple, termsSummary } = req.body as {
      passage?: string;
      keyPrinciple?: string;
      termsSummary?: string;
    };

    if (!passage?.trim()) {
      res.status(400).json({ error: 'Se requiere el pasaje bíblico para generar ejercicios.' });
      return;
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Genera un conjunto didáctico de estudio activo sobre "${passage.trim()}" fiel a la exégesis histórico-gramatical y basado exclusivamente en el texto bíblico.
${keyPrinciple ? `Principio clave del estudio: "${keyPrinciple}".` : ''}
${termsSummary ? `Términos analizados en el estudio: ${termsSummary}.` : ''}
${CORE_FIDELITY_CONSTITUTION}

Incluye:
1. 6 tarjetas didácticas (flashcards) variadas entre Vocabulario, Contexto, Teología y Debate.
2. 8 preguntas diversas:
   - 2 de tipo "true_false" (con options exactamente ["Verdadero", "Falso"], una verdadera y una falsa verosímil).
   - 3 de tipo "multiple_choice" (4 opciones plausibles, solo una correcta).
   - 2 de tipo "term_match" (evaluando significado exacto de un término griego/hebreo del pasaje, con 4 opciones).
   - 1 de tipo "fill_blank" (frase exegética con "______" para completar, con 4 opciones).
Cada pregunta debe incluir una explicación académica clara basada en la Escritura y un correctIndex 100% verificado.`,
      config: {
        systemInstruction: `Eres un profesor universitario de exégesis bíblica y pedagogía teológica. ${CORE_FIDELITY_CONSTITUTION} Redactas preguntas objetivas, claras y sin sesgos sectarios en español académico. Devuelve únicamente JSON válido conforme al esquema.`,
        responseMimeType: 'application/json',
        responseSchema: LEARNING_SCHEMA,
      },
    });

    const rawText = (response.text ?? '').trim();
    const draftLearning = JSON.parse(rawText);

    const auditResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Audita estas tarjetas y preguntas sobre "${passage.trim()}". Verifica que cada respuesta marcada como correcta (correctIndex), cada afirmación de Verdadero/Falso y cada término original sean 100% exactos según el texto bíblico, sin ambigüedades ni sesgos denominacionales. Corrige cualquier imprecisión en verifiedLearningKit.
Material: ${JSON.stringify(draftLearning)}`,
      config: {
        systemInstruction: `Eres auditor pedagógico de fidelidad bíblica anti-alucinaciones. ${CORE_FIDELITY_CONSTITUTION} Devuelve únicamente JSON válido.`,
        responseMimeType: 'application/json',
        responseSchema: LEARNING_AUDIT_SCHEMA,
      },
    });

    const audit = JSON.parse((auditResponse.text ?? '').trim()) as {
      auditSummary: string;
      principlesChecked: string[];
      correctionsCount: number;
      verifiedLearningKit: {
        flashcards?: Array<Record<string, unknown>>;
        questions?: Array<Record<string, unknown>>;
      };
    };

    const stamp = Date.now();
    const flashcards = (audit.verifiedLearningKit?.flashcards ?? []).map((c, idx) => ({
      ...c,
      id: `ai-fc-${stamp}-${idx}`,
    }));
    const questions = (audit.verifiedLearningKit?.questions ?? []).map((q, idx) => ({
      ...q,
      id: `ai-q-${stamp}-${idx}`,
    }));

    res.json({
      learningKit: {
        flashcards,
        questions,
        fidelityAudit: {
          verified: true,
          principlesChecked: audit.principlesChecked,
          auditSummary: audit.auditSummary,
          correctionsApplied: Math.max(0, Number(audit.correctionsCount) || 0),
          auditedAt: new Date().toISOString(),
        },
      },
    });
  } catch (err) {
    handleGeminiError(res, err);
  }
});

app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta de API no encontrada.' });
});

export default app;
