import type {
  ExegesisStudy,
  GrammaticalTerm,
  LearningFlashcard,
  LearningKit,
  LearningQuestion,
} from '../types/exegesis';

function deterministicShuffle<T>(items: T[], seedStr: string): T[] {
  const arr = [...items];
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const MATEO_CURATED_QUESTIONS: LearningQuestion[] = [
  {
    id: 'mt-tf-1',
    type: 'true_false',
    prompt:
      'En Mateo 1:18, la expresión «desposada» (mnēsteutheisēs) equivalía en el judaísmo del siglo I a un simple noviazgo informal sin efectos jurídicos.',
    options: ['Verdadero', 'Falso'],
    correctIndex: 1,
    explanation:
      'Falso. En el derecho matrimonial judío del siglo I, el desposorio (erusin / kiddushin) constituía un vínculo legal formal que requería un acta de divorcio (repudio) para disolverse.',
    sectionRef: 'II. Contexto y III. Análisis gramatical (Mt 1:18)',
  },
  {
    id: 'mt-tf-2',
    type: 'true_false',
    prompt:
      'La fórmula de Mateo 1:22 («para que se cumpliese lo dicho por el Señor por medio del profeta») cita Isaías 7:14 utilizando específicamente el término griego parthenos de la Septuaginta.',
    options: ['Verdadero', 'Falso'],
    correctIndex: 0,
    explanation:
      'Verdadero. Mientras el Texto Masorético hebreo emplea ʿalmāh (mujer joven en edad fértil), la Septuaginta tradujo el término por parthenos («virgen»), lectura seguida directamente por Mateo 1:23.',
    sectionRef: 'VI. Cuestiones debatidas · Cuestión 3',
  },
  {
    id: 'mt-mc-1',
    type: 'multiple_choice',
    prompt:
      '¿Por qué Mateo organiza la genealogía de 1:1-17 en tres series simétricas de catorce generaciones?',
    options: [
      'Para destacar hitos histórico-teológicos clave (Abraham → David → Exilio → Cristo) con posible valor gemátrico del nombre David (DVD = 14).',
      'Porque el Evangelio de Lucas contiene exactamente el mismo esquema de tres series de catorce.',
      'Para demostrar que no existieron reyes entre David y el exilio en Babilonia.',
      'Porque la ley mosaica prohibía incluir más de cuarenta y dos nombres en un rollo sinagogal.',
    ],
    correctIndex: 0,
    explanation:
      'El esquema 3×14 (1:17) funciona como recurso mnemotécnico y teológico que marca la subida hacia la monarquía davídica, la caída del exilio y la restauración mesiánica en Cristo; además, las consonantes hebreas de David (דוד) suman 4+6+4 = 14.',
    sectionRef: 'I. Texto base y VI. Cuestiones debatidas · Cuestión 1',
  },
  {
    id: 'mt-mc-2',
    type: 'multiple_choice',
    prompt:
      '¿Qué papel jurídico cumple José al imponer el nombre «Jesús» al niño en Mateo 1:21 y 1:25?',
    options: [
      'Se desvincula legalmente de la custodia del niño ante el Sanedrín.',
      'Reconoce legalmente al niño como hijo suyo e incorpora a Jesús a la línea davídica.',
      'Cumple un rito exclusivamente grecorromano de adopción imperial.',
      'Anula la descendencia de Abraham mencionada en Mateo 1:1.',
    ],
    correctIndex: 1,
    explanation:
      'Al nombrar al niño siguiendo el mandato del ángel («hijo de David»), José ejerce el derecho paterno de reconocimiento legal e injerta jurídicamente a Jesús en la casa real de David.',
    sectionRef: 'IV. Narración argumental y V. Aplicaciones',
  },
  {
    id: 'mt-fb-1',
    type: 'fill_blank',
    prompt:
      'En Mateo 1:19, el adjetivo ______ describe a José como alguien fiel a la Ley de Israel que busca actuar con rectitud moral sin exponer públicamente a María.',
    options: ['dikaios (justo)', 'parthenos (virgen)', 'angelos (mensajero)', 'laos (pueblo)'],
    correctIndex: 0,
    explanation:
      'Dikaios (δίκαιος) en Mateo 1:19 articula la tensión entre la fidelidad a las exigencias legales y la compasión pastoral de evitar la infamia pública (deigmatisai).',
    sectionRef: 'III. Análisis gramatical (Mt 1:19)',
  },
];

const MATEO_CURATED_CARDS: LearningFlashcard[] = [
  {
    id: 'mt-card-emanuel',
    category: 'Teología',
    frontTitle: '¿Qué conecta teológicamente el nombre «Emanuel» (1:23) con el final del Evangelio de Mateo?',
    frontHint: 'Inclusio literaria de todo el libro',
    originalScript: 'Ἐμμανουήλ',
    transliteration: 'Emmanouēl',
    backAnswer:
      'Significa «Dios con nosotros» (heb. ʿImmānû-ʾĒl). Forma un marco literario (inclusio) con Mateo 28:20 («yo estoy con vosotros todos los días»), revelando la presencia fiel de Dios junto a su pueblo.',
    reference: 'Mateo 1:23 · Isaías 7:14',
  },
  {
    id: 'mt-card-mujeres',
    category: 'Debate',
    frontTitle: '¿Qué cuatro mujeres del Antiguo Testamento aparecen inesperadamente en la genealogía de Mateo 1?',
    frontHint: 'Mateo 1:3, 5, 6',
    backAnswer:
      'Tamar, Rahab, Rut y «la que fue mujer de Urías» (Betsabé). Su presencia resalta la acción soberana de la gracia divina en situaciones irregulares y la apertura mesiánica hacia los gentiles.',
    reference: 'Mateo 1:3-6',
  },
];

export function buildLearningKitForStudy(study: ExegesisStudy): LearningKit {
  const allTerms: { term: GrammaticalTerm; range: string }[] = study.grammaticalAnalysis.flatMap(
    (g) => g.terms.map((term) => ({ term, range: g.pericopeRange }))
  );

  // 1. Flashcards from grammatical terms
  const termCards: LearningFlashcard[] = allTerms.slice(0, 14).map(({ term, range }, idx) => ({
    id: `fc-term-${study.id}-${idx}`,
    category: 'Vocabulario',
    frontTitle: `¿Qué significa y qué función cumple «${term.transliteration}»?`,
    frontHint: `${term.grammaticalCategory} · ${term.morphology}`,
    originalScript: term.originalScript,
    transliteration: term.transliteration,
    backAnswer: `${term.literalTranslation}. ${term.argumentativeFunction}`,
    reference: `${range}${term.crossReferences[0] ? ` · ${term.crossReferences[0]}` : ''}`,
  }));

  // 2. Flashcards from context, principle & debates
  const contextCards: LearningFlashcard[] = [
    {
      id: `fc-unit-${study.id}`,
      category: 'Contexto',
      frontTitle: `¿Cuál es la unidad literaria central de ${study.passage}?`,
      frontHint: `Texto crítico: ${study.originalLanguage}`,
      backAnswer: study.baseText.literaryUnit,
      reference: study.baseText.reference,
    },
    ...study.baseText.subUnits.slice(0, 3).map((u, i) => ({
      id: `fc-sub-${study.id}-${i}`,
      category: 'Contexto' as const,
      frontTitle: `¿Qué abarca la perícopa ${u.range}: «${u.title}»?`,
      frontHint: 'Estructura del pasaje',
      backAnswer: u.summary,
      reference: u.range,
    })),
    {
      id: `fc-principle-${study.id}`,
      category: 'Teología',
      frontTitle: `¿Cuál es el principio bíblico clave que sintetiza ${study.passage}?`,
      frontHint: 'Sección V · Síntesis hermenéutica',
      backAnswer: `${study.keyPrincipleAndApplications.keyPrinciple} — Hábito operativo: ${study.keyPrincipleAndApplications.keyHabit}`,
      reference: study.passage,
    },
    ...study.debatedQuestions.slice(0, 2).map((d) => ({
      id: `fc-debate-${study.id}-${d.number}`,
      category: 'Debate' as const,
      frontTitle: d.question,
      frontHint: `Cuestión debatida #${d.number}`,
      backAnswer: d.debateStatus,
      reference: `Cuestión ${d.number}`,
    })),
  ];

  // 3. Questions: Term Match MCQs (using distractors from other terms in same study)
  const termMatchQuestions: LearningQuestion[] = [];
  if (allTerms.length >= 4) {
    allTerms.slice(0, 5).forEach(({ term, range }, idx) => {
      const distractors = deterministicShuffle(
        allTerms
          .filter((t) => t.term.transliteration !== term.transliteration)
          .map((t) => t.term.literalTranslation),
        `${study.id}-tm-${idx}`
      ).slice(0, 3);

      const rawOptions = [term.literalTranslation, ...distractors];
      const shuffledOptions = deterministicShuffle(rawOptions, `${study.id}-opt-${idx}`);
      const correctIndex = shuffledOptions.indexOf(term.literalTranslation);

      termMatchQuestions.push({
        id: `q-tm-${study.id}-${idx}`,
        type: 'term_match',
        prompt: `Selecciona la traducción literal que corresponde al término original en ${range}:`,
        originalScript: term.originalScript,
        transliteration: `${term.transliteration} (${term.morphology})`,
        options: shuffledOptions,
        correctIndex,
        explanation: `${term.originalScript} (${term.transliteration}) se traduce literalmente como «${term.literalTranslation}». ${term.argumentativeFunction}`,
        sectionRef: `III. Análisis gramatical · ${range}`,
      });
    });
  }

  // 4. Questions: Multiple Choice from sub-units, canonical links & principle
  const mcQuestions: LearningQuestion[] = [];
  if (study.baseText.subUnits.length >= 2) {
    const targetSub = study.baseText.subUnits[0];
    const otherSummaries = study.baseText.subUnits
      .slice(1, 4)
      .map((s) => `${s.title}: ${s.summary.slice(0, 110)}…`);
    while (otherSummaries.length < 3) {
      otherSummaries.push('Sección epistolar posterior dirigida exclusivamente a comunidades gentiles del siglo II.');
    }
    const correctText = `${targetSub.title}: ${targetSub.summary}`;
    const opts = deterministicShuffle([correctText, ...otherSummaries.slice(0, 3)], `${study.id}-submc`);
    mcQuestions.push({
      id: `q-mc-sub-${study.id}`,
      type: 'multiple_choice',
      prompt: `¿Qué contenido corresponde exactamente a la primera subunidad (${targetSub.range}) de ${study.passage}?`,
      options: opts,
      correctIndex: opts.indexOf(correctText),
      explanation: `La subunidad ${targetSub.range} («${targetSub.title}») abre el pasaje: ${targetSub.summary}`,
      sectionRef: 'I. Texto base',
    });
  }

  if (study.context.canonicalLinks.length >= 1) {
    const link = study.context.canonicalLinks[0];
    const distractors = [
      'Cita apócrifa del siglo III sin vínculo con las Escrituras canónicas.',
      'Polémica jurídica romana sobre impuestos provinciales en Judea.',
      'Referencia litúrgica medieval añadida por traductores latinos.',
    ];
    const opts = deterministicShuffle([link.note, ...distractors], `${study.id}-canonmc`);
    mcQuestions.push({
      id: `q-mc-canon-${study.id}`,
      type: 'multiple_choice',
      prompt: `¿Cuál es la relación canónica de ${link.reference} («${link.relation}») con ${study.passage}?`,
      options: opts,
      correctIndex: opts.indexOf(link.note),
      explanation: `${link.reference} (${link.relation}): ${link.note}`,
      sectionRef: 'II. Contexto · Vínculos canónicos',
    });
  }

  // 5. True / False generated dynamically for any study
  const tfQuestions: LearningQuestion[] = [
    {
      id: `q-tf-lang-${study.id}`,
      type: 'true_false',
      prompt: `El texto crítico de base empleado para analizar ${study.passage} corresponde a la tradición de ${study.originalLanguage} (${study.baseText.criticalText}).`,
      options: ['Verdadero', 'Falso'],
      correctIndex: 0,
      explanation: `Verdadero. Este estudio toma como texto base ${study.baseText.criticalText} en ${study.originalLanguage}.`,
      sectionRef: 'I. Texto base',
    },
    {
      id: `q-tf-principle-false-${study.id}`,
      type: 'true_false',
      prompt: `La hermenéutica aplicada en este estudio sostiene que ${study.passage} carece de vínculos con el contexto histórico original y debe interpretarse únicamente de manera alegórica libre.`,
      options: ['Verdadero', 'Falso'],
      correctIndex: 1,
      explanation: `Falso. La metodología histórico-gramatical exige evaluar la audiencia original, el texto crítico y el flujo argumental antes de formular el principio clave y sus cinco aplicaciones.`,
      sectionRef: 'II. Contexto y V. Principio clave',
    },
  ];

  // 6. Fill-in-the-blank from keyPrinciple or applications
  const fillBlankQuestions: LearningQuestion[] = [];
  if (allTerms.length >= 4) {
    const keyTerm = allTerms[Math.min(1, allTerms.length - 1)].term;
    const distractorTerms = deterministicShuffle(
      allTerms.filter((t) => t.term.transliteration !== keyTerm.transliteration),
      `${study.id}-fb`
    )
      .slice(0, 3)
      .map((t) => `${t.term.transliteration} (${t.term.literalTranslation})`);

    const correctLabel = `${keyTerm.transliteration} (${keyTerm.literalTranslation})`;
    const opts = deterministicShuffle([correctLabel, ...distractorTerms], `${study.id}-fb-opts`);
    fillBlankQuestions.push({
      id: `q-fb-${study.id}`,
      type: 'fill_blank',
      prompt: `Completa el análisis argumental del pasaje: El término original ______ cumple la función de: «${keyTerm.argumentativeFunction}».`,
      options: opts,
      correctIndex: opts.indexOf(correctLabel),
      explanation: `El término ${keyTerm.originalScript} (${keyTerm.transliteration}) se traduce «${keyTerm.literalTranslation}» y desempeña esa función exacta en el pasaje.`,
      sectionRef: 'III. Análisis gramatical',
    });
  }

  // Merge custom/AI learningKit first if present + Mateo curated items
  const customCards = study.learningKit?.flashcards ?? [];
  const customQuestions = study.learningKit?.questions ?? [];
  const isMateo = study.id === 'mateo-1-1-25-reference';

  const combinedCards = [
    ...customCards,
    ...(isMateo ? MATEO_CURATED_CARDS : []),
    ...contextCards,
    ...termCards,
  ];

  const combinedQuestions = [
    ...customQuestions,
    ...(isMateo ? MATEO_CURATED_QUESTIONS : []),
    ...tfQuestions,
    ...mcQuestions,
    ...termMatchQuestions,
    ...fillBlankQuestions,
  ];

  // Deduplicate by id
  const seenCards = new Set<string>();
  const flashcards = combinedCards.filter((c) => {
    if (seenCards.has(c.id)) return false;
    seenCards.add(c.id);
    return true;
  });

  const seenQs = new Set<string>();
  const questions = combinedQuestions.filter((q) => {
    if (seenQs.has(q.id)) return false;
    seenQs.add(q.id);
    return true;
  });

  return { flashcards, questions };
}
