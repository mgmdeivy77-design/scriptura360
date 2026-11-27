import type { ExegesisStudy } from '../types/exegesis';

export const MATEO_1_SAMPLE_STUDY: ExegesisStudy = {
  id: 'mateo-1-1-25-reference',
  passage: 'Mateo 1:1-25',
  testament: 'NT',
  originalLanguage: 'Griego koiné (NA28)',
  createdAt: '2026-11-27T04:27:00.000Z',
  readingMinutes: 14,
  applicationContextLabel: 'Estudio base de referencia',
  baseText: {
    reference: 'Mateo 1:1-25',
    criticalText: 'Novum Testamentum Graece, Nestle-Aland, 28.ª edición (NA28).',
    literaryUnit:
      'El pasaje constituye la introducción genealógica y narrativa del Evangelio de Mateo. Está compuesto por dos unidades estrechamente relacionadas: la genealogía de Jesús (1:1-17) y el relato de su concepción y nacimiento desde la perspectiva de José (1:18-25). Ambas presentan a Jesús como el Mesías esperado, descendiente de Abraham y David, cuya llegada representa el cumplimiento de las promesas y las Escrituras de Israel. La primera unidad establece su identidad mediante la genealogía, la historia del pueblo y la continuidad de las promesas divinas. La segunda explica las circunstancias extraordinarias de su concepción, la función de José, el significado del nombre Jesús y la relación del nacimiento con la profecía de Emanuel.',
    subUnits: [
      {
        range: 'Mateo 1:1-17',
        title: 'La identidad de Jesús y su relación con la historia de Israel',
        summary:
          'Genealogía estructurada en tres series de catorce generaciones desde Abraham hasta Cristo, destacando la línea davídica, la ruptura del exilio babilónico y la inclusión de cuatro mujeres del AT.',
      },
      {
        range: 'Mateo 1:18-19',
        title: 'La concepción de Jesús y la situación de José',
        summary:
          'Presentación del desposorio legal entre María y José, la intervención del Espíritu Santo y el dilema ético-jurídico de José como hombre justo.',
      },
      {
        range: 'Mateo 1:20-21',
        title: 'La intervención divina y la misión del niño',
        summary:
          'Revelación angélica mediante un sueño dirigida a José como «hijo de David», explicando el origen divino de la concepción y el nombre salvífico de Jesús.',
      },
      {
        range: 'Mateo 1:22-23',
        title: 'El cumplimiento de las Escrituras',
        summary:
          'Fórmula mateana de cumplimiento que conecta el nacimiento con Isaías 7:14 según la tradición textual de la Septuaginta e introduce el título teológico Emanuel.',
      },
      {
        range: 'Mateo 1:24-25',
        title: 'La obediencia de José y el nacimiento de Jesús',
        summary:
          'Ejecución concreta de la instrucción recibida: recepción matrimonial de María, abstinencia sexual hasta el parto e imposición legal del nombre Jesús.',
      },
    ],
  },
  context: {
    historicalAudience:
      'El Evangelio de Mateo comienza dirigiéndose a lectores familiarizados con las Escrituras de Israel, sus promesas y sus expectativas mesiánicas. Aunque la identidad precisa del autor y las circunstancias de composición son objeto de discusión académica, el evangelio presenta una perspectiva profundamente vinculada con la historia de Israel y utiliza repetidamente las Escrituras para explicar la identidad y misión de Jesús.',
    literarySetting:
      'En este contexto, Mateo 1:1-17 no funciona simplemente como un registro familiar: establece desde el principio que Jesús pertenece a la historia de las promesas hechas a Abraham y a David. La genealogía recorre generaciones, incluye acontecimientos decisivos como la deportación a Babilonia y organiza la historia en tres grupos de catorce generaciones.',
    narrativeFlow:
      'A continuación, Mateo 1:18-25 explica cómo ocurrió el nacimiento de Jesús y responde a una cuestión que la genealogía, por sí sola, no puede resolver: cómo puede Jesús ser presentado como descendiente de David si su concepción no procede de una relación sexual entre José y María. El relato presenta a José como descendiente de David, comprometido matrimonialmente con María y enfrentado a una situación que amenaza con romper el compromiso. La intervención divina mediante un sueño le comunica que la concepción procede del Espíritu Santo y le ordena recibir a María y poner al niño el nombre de Jesús. El relato concluye relacionando el nacimiento con Isaías 7:14 y mostrando que José obedece la instrucción recibida.',
    canonicalLinks: [
      {
        reference: 'Génesis 2:4; 5:1 (LXX)',
        relation: 'Eco introductorio',
        note: 'La fórmula griega «biblos geneseōs» remite al lenguaje septuagintal de los orígenes y las generaciones patriarcales.',
      },
      {
        reference: 'Génesis 12:1-3; 22:17-18',
        relation: 'Promesa abrahámica',
        note: 'Fundamenta la bendición universal prometida a todas las familias de la tierra en la descendencia de Abraham.',
      },
      {
        reference: '2 Samuel 7:12-16',
        relation: 'Pacto davídico',
        note: 'Establece la expectativa de una dinastía permanente vinculada al linaje real de David.',
      },
      {
        reference: 'Isaías 7:1-17 (esp. 7:14)',
        relation: 'Cita profética / Tipología',
        note: 'Señal de Emanuel en la crisis política del rey Acaz en Judá, reinterpretada cristológicamente en Mateo.',
      },
      {
        reference: 'Deuteronomio 20:7; 22:23-24',
        relation: 'Marco jurídico del desposorio',
        note: 'Explica el estatuto legal vinculante del compromiso matrimonial judío previo a la convivencia.',
      },
    ],
    culturalFactors: [
      {
        factor: 'Desposorio judío del siglo I (erusin / kiddushin)',
        explanation:
          'Constituía un compromiso legalmente vinculante aunque la pareja aún no conviviera; su disolución exigía un acta formal semejante al divorcio.',
      },
      {
        factor: 'Gematria del nombre David (D-W-D)',
        explanation:
          'En la interpretación judía antigua existían equivalencias numéricas entre letras y cifras; las consonantes de David (ד-ו-ד) suman 4 + 6 + 4 = 14.',
      },
      {
        factor: 'Imposición del nombre y paternidad legal',
        explanation:
          'Al recibir a María y nombrar al niño, José ejercía un acto jurídico de reconocimiento paterno que integraba legítimamente a Jesús en la casa de David.',
      },
    ],
  },
  grammaticalAnalysis: [
    {
      pericopeRange: 'Mateo 1:1-17',
      pericopeTitle: 'La identidad de Jesús y su relación con la historia de Israel',
      terms: [
        {
          originalScript: 'βίβλος γενέσεως',
          transliteration: 'biblos geneseōs',
          morphology: 'Sustantivo nom. fem. sing. + sustantivo gen. fem. sing.',
          grammaticalCategory: 'Expresión',
          literalTranslation: 'Libro del origen, registro de genealogía o relato de los comienzos.',
          originalMeaning:
            'Biblos designa un libro o documento escrito; genesis se relaciona con origen, nacimiento, generación o comienzo. La expresión recuerda el lenguaje de Génesis 2:4 y 5:1 en la Septuaginta, donde se utiliza para introducir relatos sobre los orígenes y las generaciones. Su utilización en Mateo establece una posible conexión literaria con el lenguaje de los comienzos bíblicos.',
          argumentativeFunction:
            'La expresión introduce algo más que una lista de antepasados. Presenta la llegada de Jesús como un acontecimiento que debe entenderse dentro de la historia de los orígenes y las promesas de Israel. También anticipa que el relato del nacimiento, en los versículos 18-25, explicará un nuevo comienzo que no puede comprenderse únicamente mediante la genealogía humana.',
          crossReferences: ['Génesis 2:4 (LXX)', 'Génesis 5:1 (LXX)'],
        },
        {
          originalScript: 'Χριστός',
          transliteration: 'Christos',
          morphology: 'Sustantivo / adjetivo verbal nominativo masculino singular',
          grammaticalCategory: 'Título',
          literalTranslation: 'Ungido; el consagrado para una función especial.',
          originalMeaning:
            'Procede del verbo griego chriō, ungir, y corresponde al hebreo Mashiach. En la tradición de Israel, la unción estaba asociada con la designación de reyes, sacerdotes y, en determinados contextos, profetas. La expectativa de un gobernante davídico se encuentra en 2 Samuel 7:12-16, Isaías 11:1-5 y Jeremías 23:5-6.',
          argumentativeFunction:
            'El título aparece desde la primera línea para establecer cómo debe interpretarse todo lo que sigue. Mateo no presenta simplemente la historia de un personaje religioso importante, sino la llegada de aquel que cumple la expectativa mesiánica. La genealogía y el nacimiento se convierten en argumentos que explican por qué Jesús es presentado como el Cristo.',
          crossReferences: ['2 Samuel 7:12-16', 'Isaías 11:1-5', 'Jeremías 23:5-6'],
        },
        {
          originalScript: 'υἱός',
          transliteration: 'huios',
          morphology: 'Sustantivo genitivo/nominativo masculino singular',
          grammaticalCategory: 'Sustantivo',
          literalTranslation: 'Hijo; descendiente; perteneciente a una línea familiar.',
          originalMeaning:
            'El término puede expresar filiación biológica, descendencia genealógica o pertenencia a una relación familiar y representativa. En las genealogías bíblicas, la expresión «hijo de» no siempre indica una relación inmediata entre padre e hijo; puede resumir varias generaciones. En 2 Samuel 7:12-14, la descendencia de David se relaciona con la promesa de una dinastía permanente.',
          argumentativeFunction:
            'La repetición de «hijo de David» e «hijo de Abraham» sitúa a Jesús dentro de dos líneas fundamentales de la historia de Israel: la promesa de bendición universal relacionada con Abraham y la promesa de gobierno vinculada con David. Mateo establece así dos dimensiones de la identidad mesiánica: pertenencia a la historia del pueblo y legitimidad real.',
          crossReferences: ['2 Samuel 7:12-14', 'Génesis 12:1-3'],
        },
        {
          originalScript: 'γεννάω (ἐγέννησεν)',
          transliteration: 'gennaō',
          morphology: 'Verbo aoristo indicativo activo, 3.ª persona singular',
          grammaticalCategory: 'Verbo',
          literalTranslation: 'Engendrar, generar o dar origen a una descendencia.',
          originalMeaning:
            'Es un verbo utilizado en genealogías para describir la relación de generación entre antepasados y descendientes. Aparece frecuentemente en la Septuaginta, especialmente en Génesis 5 y 10, y en las genealogías de 1 Crónicas 1–9. Puede describir una relación genealógica sin precisar necesariamente que cada generación sea inmediatamente consecutiva.',
          argumentativeFunction:
            'La repetición del verbo crea un ritmo que conecta a Jesús con la historia de Israel. Cada generación forma parte de una continuidad histórica que conduce hacia el Mesías. Sin embargo, Mateo introduce una modificación significativa en el versículo 16: cambia la estructura habitual de la genealogía para distinguir la relación de José con Jesús de las relaciones de generación anteriores.',
          crossReferences: ['Génesis 5 (LXX)', '1 Crónicas 1–9', 'Mateo 1:16'],
        },
        {
          originalScript: 'μετοικεσία',
          transliteration: 'metoikesia',
          morphology: 'Sustantivo genitivo/acusativo femenino singular',
          grammaticalCategory: 'Sustantivo',
          literalTranslation: 'Deportación, traslado de población o desplazamiento forzado.',
          originalMeaning:
            'El término se relaciona con el traslado de personas fuera de su territorio de origen. En Mateo 1:11-12 se utiliza para referirse a la deportación a Babilonia. El acontecimiento histórico está relacionado con la caída de Jerusalén en 586 a. C. y la pérdida de la independencia política del reino de Judá. El lenguaje de la deportación aparece también en 2 Reyes 24–25 y 2 Crónicas 36:17-21.',
          argumentativeFunction:
            'La deportación funciona como un punto de ruptura dentro de la genealogía. Mateo no organiza la historia únicamente alrededor de los reyes y sus descendientes, sino que identifica el exilio como un acontecimiento decisivo que marca el deterioro de la monarquía y la situación de Israel. La llegada de Jesús aparece después de esa ruptura, vinculando su nacimiento con la esperanza de restauración.',
          crossReferences: ['2 Reyes 24–25', '2 Crónicas 36:17-21'],
        },
        {
          originalScript: 'γενεαί',
          transliteration: 'geneai',
          morphology: 'Sustantivo nominativo femenino plural',
          grammaticalCategory: 'Sustantivo',
          literalTranslation: 'Generaciones, linajes o grupos generacionales.',
          originalMeaning:
            'El término puede designar una generación de personas o un período histórico asociado con determinados descendientes. En Mateo 1:17 organiza la genealogía en tres conjuntos de catorce generaciones. En Mateo 24:34 también aparece para referirse a una generación dentro de un contexto escatológico.',
          argumentativeFunction:
            'La división en tres períodos convierte la genealogía en una interpretación organizada de la historia: desde Abraham hasta David, desde David hasta la deportación y desde la deportación hasta Cristo. El énfasis no está solamente en la cantidad de nombres, sino en presentar a Jesús como el punto culminante de una historia dirigida hacia el cumplimiento de las promesas.',
          crossReferences: ['Mateo 1:17', 'Mateo 24:34'],
        },
        {
          originalScript: 'δέκα τέσσαρες',
          transliteration: 'deka tessares',
          morphology: 'Numeral cardinal indeclinable',
          grammaticalCategory: 'Expresión',
          literalTranslation: 'Catorce.',
          originalMeaning:
            'Es la expresión numérica utilizada para indicar catorce unidades. En la interpretación judía antigua existían prácticas de equivalencia numérica entre letras y números, conocidas posteriormente como gematria. El nombre hebreo David, escrito con las consonantes D-W-D, suma catorce mediante sus valores numéricos: 4 + 6 + 4.',
          argumentativeFunction:
            'La repetición del número catorce probablemente enfatiza la centralidad de David y la naturaleza davídica del Mesías. Mateo organiza selectivamente la genealogía para construir una estructura memorable y teológicamente significativa. No debe confundirse esta organización literaria con una afirmación de que la lista contiene todos los antepasados biológicos sin omisiones.',
          crossReferences: ['Mateo 1:17'],
        },
      ],
    },
    {
      pericopeRange: 'Mateo 1:18-19',
      pericopeTitle: 'La concepción de Jesús y la situación de José',
      terms: [
        {
          originalScript: 'μνηστευθείσης',
          transliteration: 'mnēsteutheisēs',
          morphology: 'Participio aoristo pasivo genitivo femenino singular',
          grammaticalCategory: 'Verbo',
          literalTranslation: 'Habiendo sido comprometida matrimonialmente o estando desposada.',
          originalMeaning:
            'Procede de mnēsteuō, verbo relacionado con el compromiso matrimonial. En el judaísmo del siglo I, el desposorio constituía un compromiso legalmente vinculante, aunque la pareja todavía no hubiera comenzado la convivencia matrimonial. Su disolución requería un procedimiento semejante al divorcio. Deuteronomio 20:7 y 22:23-24 reflejan la importancia jurídica de esta condición.',
          argumentativeFunction:
            'El término explica por qué José es llamado esposo de María antes de que ambos vivieran juntos. La situación no se presenta como un noviazgo informal, sino como un vínculo matrimonial jurídicamente reconocido. Esto hace comprensible la decisión de José de considerar la separación y establece la importancia de la intervención divina posterior.',
          crossReferences: ['Deuteronomio 20:7', 'Deuteronomio 22:23-24'],
        },
        {
          originalScript: 'πνεύματος ἁγίου',
          transliteration: 'pneumatos hagiou',
          morphology: 'Sustantivo genitivo neutro singular + adjetivo genitivo neutro singular',
          grammaticalCategory: 'Expresión',
          literalTranslation: 'Espíritu Santo.',
          originalMeaning:
            'La expresión identifica al Espíritu de Dios como agente de la concepción de Jesús. En la tradición bíblica, el Espíritu está asociado con la acción creadora y capacitadora de Dios (Génesis 1:2; Salmo 104:30). En Lucas 1:35 aparece también relacionado directamente con la concepción de Jesús. Mateo presenta esta acción como una intervención divina extraordinaria, no como resultado de una relación humana.',
          argumentativeFunction:
            'La expresión establece desde el principio la explicación que gobierna todo el relato: la concepción de Jesús procede de Dios. De esta manera, Mateo distingue la paternidad legal de José de la generación física de Jesús y prepara la explicación de por qué José debe recibir a María y reconocer al niño como suyo dentro de la familia.',
          crossReferences: ['Génesis 1:2', 'Salmo 104:30', 'Lucas 1:35'],
        },
        {
          originalScript: 'δίκαιος',
          transliteration: 'dikaios',
          morphology: 'Adjetivo nominativo masculino singular',
          grammaticalCategory: 'Adjetivo',
          literalTranslation: 'Justo, recto o conforme a lo que corresponde.',
          originalMeaning:
            'El término pertenece al campo de la justicia, la rectitud y la conducta conforme a las exigencias de Dios. En el Antiguo Testamento griego se utiliza para traducir diferentes expresiones hebreas relacionadas con la justicia y la fidelidad. En Mateo 5:20, la justicia aparece como una exigencia central del discipulado; en Mateo 23:23 se relaciona con la justicia, la misericordia y la fidelidad.',
          argumentativeFunction:
            'La caracterización de José como justo establece el marco moral desde el cual debe interpretarse su reacción. Mateo no lo presenta como alguien que busca venganza o exposición pública, sino como una persona que intenta actuar conforme a su comprensión de la justicia y la responsabilidad. El versículo siguiente muestra cómo esa justicia se expresa mediante la decisión de no exponer públicamente a María.',
          crossReferences: ['Mateo 5:20', 'Mateo 23:23'],
        },
        {
          originalScript: 'ἀπολῦσαι (ἀπολύω)',
          transliteration: 'apoluo',
          morphology: 'Verbo infinitivo aoristo activo',
          grammaticalCategory: 'Verbo',
          literalTranslation: 'Soltar, liberar, despedir o divorciar.',
          originalMeaning:
            'El verbo posee varios significados según el contexto. Puede referirse a liberar a una persona, despedirla o disolver un vínculo matrimonial. En Mateo 5:31-32 y 19:3-9 se utiliza en discusiones sobre el divorcio. En Mateo 1:19 su sentido es jurídico y matrimonial.',
          argumentativeFunction:
            'El término muestra que José considera una decisión legal concreta ante la situación de María. Su justicia no elimina la posibilidad de separación, pero el modo en que piensa ejecutarla revela una preocupación por no añadir humillación pública a una situación que él todavía no comprende.',
          crossReferences: ['Mateo 5:31-32', 'Mateo 19:3-9'],
        },
        {
          originalScript: 'λάθρᾳ',
          transliteration: 'lathra',
          morphology: 'Adverbio de modo',
          grammaticalCategory: 'Adverbio',
          literalTranslation: 'Secretamente, en privado o sin exposición pública.',
          originalMeaning:
            'Es un adverbio que describe algo realizado de manera oculta o discreta. En Mateo 2:7 aparece cuando Herodes llama secretamente a los magos. El término puede expresar discreción, ocultamiento o ausencia de publicidad.',
          argumentativeFunction:
            'La palabra introduce una dimensión importante del carácter de José: incluso antes de recibir la revelación divina, su intención es evitar la exposición pública de María. La narración contrasta así una respuesta que podría haber producido vergüenza y consecuencias sociales con una conducta moderada y considerada.',
          crossReferences: ['Mateo 2:7'],
        },
      ],
    },
    {
      pericopeRange: 'Mateo 1:20-21',
      pericopeTitle: 'La intervención divina y la misión del niño',
      terms: [
        {
          originalScript: 'κατ’ ὄναρ',
          transliteration: "kat' onar",
          morphology: 'Locución preposicional (κατά + acusativo neutro singular)',
          grammaticalCategory: 'Expresión',
          literalTranslation: 'En un sueño o mediante un sueño.',
          originalMeaning:
            'La expresión describe una forma de comunicación divina que aparece frecuentemente en la literatura bíblica. En Génesis 20:3, 28:12 y 31:11, Dios comunica información mediante sueños. En Mateo 2:12-13, 19 y 22, los sueños vuelven a desempeñar una función importante en la protección y orientación de la familia de Jesús.',
          argumentativeFunction:
            'El sueño introduce una revelación que modifica la interpretación de José sobre lo sucedido. Lo que él consideraba una situación matrimonial inexplicable recibe ahora una explicación divina. La narración utiliza este recurso para mostrar que la decisión correcta no puede establecerse únicamente a partir de la información inicialmente disponible.',
          crossReferences: ['Génesis 20:3; 28:12; 31:11', 'Mateo 2:12-13, 19, 22'],
        },
        {
          originalScript: 'υἱὸς Δαυίδ',
          transliteration: 'huios David',
          morphology: 'Sustantivo vocativo masculino singular + nombre propio indeclinable',
          grammaticalCategory: 'Título',
          literalTranslation: 'Hijo de David.',
          originalMeaning:
            'Es una expresión de identidad dinástica y mesiánica. La promesa de 2 Samuel 7:12-16 establece una relación especial entre Dios, David y su descendencia real. En Mateo 9:27 y 21:9, la expresión también aparece aplicada a Jesús.',
          argumentativeFunction:
            'La identificación de José como hijo de David no es un detalle genealógico secundario. La revelación se dirige a él precisamente en relación con su posición dentro de la línea davídica. Al recibir a María y reconocer legalmente al niño mediante la imposición del nombre, José desempeña un papel decisivo en la presentación de Jesús como heredero de la casa de David.',
          crossReferences: ['2 Samuel 7:12-16', 'Mateo 9:27', 'Mateo 21:9'],
        },
        {
          originalScript: 'σώσει (σῴζω)',
          transliteration: 'sōzō',
          morphology: 'Verbo futuro indicativo activo, 3.ª persona singular',
          grammaticalCategory: 'Verbo',
          literalTranslation: 'Salvar, rescatar, liberar o preservar.',
          originalMeaning:
            'El verbo tiene un campo semántico amplio y puede referirse a rescate físico, protección o salvación espiritual. En el Antiguo Testamento griego aparece para describir las intervenciones liberadoras de Dios, como en Éxodo 14:13. En Mateo 8:25 se utiliza cuando los discípulos piden a Jesús que los salve de la tormenta; en 9:21-22 aparece en relación con la sanidad de una mujer.',
          argumentativeFunction:
            'En Mateo 1:21 el verbo define la misión de Jesús: salvar a su pueblo de sus pecados. La salvación se presenta desde el principio como algo más profundo que la liberación de una potencia política o de una dificultad externa. El problema que Jesús viene a enfrentar está relacionado con el pecado y sus consecuencias en la relación entre Dios y su pueblo.',
          crossReferences: ['Éxodo 14:13 (LXX)', 'Mateo 8:25', 'Mateo 9:21-22'],
        },
        {
          originalScript: 'ἁμαρτιῶν (ἁμαρτία)',
          transliteration: 'hamartia',
          morphology: 'Sustantivo genitivo femenino plural',
          grammaticalCategory: 'Sustantivo',
          literalTranslation: 'Pecado, error o desviación de lo correcto.',
          originalMeaning:
            "El término pertenece al vocabulario bíblico de la transgresión y la condición de separación respecto de la voluntad de Dios. En la Septuaginta traduce frecuentemente el hebreo chatta't, relacionado con el pecado. En Mateo 3:6 aparece en el contexto de la confesión de pecados; en 26:28 se relaciona con el perdón de los pecados mediante la sangre del pacto.",
          argumentativeFunction:
            'El plural «pecados» especifica el problema del que Jesús viene a salvar. La misión mesiánica no se reduce a restaurar la monarquía davídica o mejorar la situación social de Israel. Su alcance incluye el problema moral y espiritual que afecta al pueblo y que requiere una intervención divina.',
          crossReferences: ['Mateo 3:6', 'Mateo 26:28'],
        },
      ],
    },
    {
      pericopeRange: 'Mateo 1:22-23',
      pericopeTitle: 'El cumplimiento de las Escrituras',
      terms: [
        {
          originalScript: 'πληρωθῇ (πληρόω)',
          transliteration: 'plēroō',
          morphology: 'Verbo subjuntivo aoristo pasivo, 3.ª persona singular',
          grammaticalCategory: 'Verbo',
          literalTranslation: 'Llenar, completar, cumplir o llevar a su plenitud.',
          originalMeaning:
            'El verbo puede expresar la acción de llenar algo o alcanzar la realización de una expectativa, promesa o palabra. Mateo lo utiliza frecuentemente para relacionar los acontecimientos de la vida de Jesús con las Escrituras de Israel. Aparece también en Mateo 2:15, 2:17 y 4:14.',
          argumentativeFunction:
            'La expresión introduce una interpretación teológica del nacimiento: el acontecimiento no es presentado como un hecho aislado, sino como parte del cumplimiento de la historia y las promesas de Dios. Mateo interpreta la vida de Jesús mediante la relación entre acontecimientos y Escrituras.',
          crossReferences: ['Mateo 2:15', 'Mateo 2:17', 'Mateo 4:14'],
        },
        {
          originalScript: 'παρθένος',
          transliteration: 'parthenos',
          morphology: 'Sustantivo nominativo femenino singular',
          grammaticalCategory: 'Sustantivo',
          literalTranslation: 'Virgen o joven mujer sexualmente no casada, según el contexto.',
          originalMeaning:
            'En el griego antiguo, el término suele designar a una mujer virgen, aunque su utilización puede variar según el contexto literario. En la Septuaginta aparece en Génesis 24:43 para referirse a Rebeca y en Isaías 7:14 para traducir el hebreo almah. La diferencia entre ambos términos es importante: almah designa a una mujer joven en edad matrimonial y no constituye, por sí sola, un término técnico inequívoco para virginidad; parthenos tiene una asociación más directa con la virginidad en su uso habitual.',
          argumentativeFunction:
            'En Mateo 1:23, el término conecta la concepción de Jesús con la interpretación griega de Isaías 7:14. Dentro de la narración, confirma que el nacimiento es presentado como resultado de una intervención extraordinaria de Dios y no de una relación sexual entre María y José.',
          crossReferences: ['Isaías 7:14 (LXX / BHS)', 'Génesis 24:43 (LXX)'],
        },
        {
          originalScript: 'Ἐμμανουήλ',
          transliteration: 'Emmanouēl',
          morphology: 'Nombre propio teofórico transliterado del hebreo (עִמָּנוּ אֵל)',
          grammaticalCategory: 'Título',
          literalTranslation: 'Dios con nosotros.',
          originalMeaning:
            'Procede del hebreo Immanu El, una expresión compuesta por «con nosotros» y «Dios». En Isaías 7:14 funciona como nombre-señal dentro de una situación de crisis política que afecta a Acaz y al reino de Judá. En Mateo, el nombre adquiere una aplicación cristológica relacionada con la presencia de Dios en la persona de Jesús.',
          argumentativeFunction:
            'Emanuel interpreta el significado teológico del nacimiento. Mientras el nombre Jesús identifica su misión salvadora, Emanuel comunica quién está presente en ese acontecimiento: Dios con su pueblo. Ambos nombres no compiten entre sí; presentan dimensiones complementarias de la identidad y misión de Jesús.',
          crossReferences: ['Isaías 7:14', 'Isaías 8:8, 10', 'Mateo 28:20'],
        },
      ],
    },
    {
      pericopeRange: 'Mateo 1:24-25',
      pericopeTitle: 'La obediencia de José y el nacimiento de Jesús',
      terms: [
        {
          originalScript: 'παρέλαβεν',
          transliteration: 'parelaben',
          morphology: 'Verbo aoristo indicativo activo, 3.ª persona singular (de παραλαμβάνω)',
          grammaticalCategory: 'Verbo',
          literalTranslation: 'Recibió, tomó consigo o acogió.',
          originalMeaning:
            'Procede de paralambanō, verbo que puede expresar recibir a alguien, llevarlo consigo o incorporarlo a una relación. En Mateo 2:13 y 2:21 aparece cuando José recibe al niño y a su madre para trasladarlos a Egipto y posteriormente regresar.',
          argumentativeFunction:
            'El verbo expresa que José no se limita a aceptar intelectualmente la revelación recibida. Actúa conforme a ella, recibe a María y asume la responsabilidad familiar que le corresponde. La obediencia se manifiesta mediante una decisión concreta.',
          crossReferences: ['Mateo 2:13', 'Mateo 2:21'],
        },
        {
          originalScript: 'ἐγίνωσκεν',
          transliteration: 'eginōsken',
          morphology: 'Verbo imperfecto indicativo activo, 3.ª persona singular (de γινώσκω)',
          grammaticalCategory: 'Verbo',
          literalTranslation: 'Conocía; mantenía relaciones sexuales, según el contexto.',
          originalMeaning:
            'Es una forma del verbo ginōskō, cuyo significado general es conocer. En la tradición bíblica, «conocer» puede funcionar como expresión eufemística para referirse a las relaciones sexuales. Génesis 4:1 utiliza esta construcción cuando Adán conoce a Eva y ella concibe. El mismo uso aparece en Jueces 11:39.',
          argumentativeFunction:
            'La expresión establece que José no mantuvo relaciones sexuales con María antes del nacimiento de Jesús. De este modo, Mateo reafirma la explicación inicial de la concepción por obra del Espíritu Santo y cierra cualquier interpretación que atribuya el embarazo a una relación sexual matrimonial entre ambos.',
          crossReferences: ['Génesis 4:1', 'Jueces 11:39'],
        },
        {
          originalScript: 'πρωτότοκος',
          transliteration: 'prōtotokos',
          morphology: 'Adjetivo nominativo/acusativo masculino singular (variante textual evaluada en NA28)',
          grammaticalCategory: 'Adjetivo',
          literalTranslation: 'Primogénito; el primero en nacer.',
          originalMeaning:
            'El término designa al primer hijo nacido dentro de una familia y, en la tradición israelita, también posee implicaciones jurídicas y hereditarias. Éxodo 13:2 establece la consagración del primogénito; Deuteronomio 21:17 reconoce sus derechos hereditarios. El término no significa necesariamente que el individuo sea el único hijo.',
          argumentativeFunction:
            'La referencia al primogénito sitúa a Jesús dentro de las categorías familiares y legales de Israel. La expresión refuerza su condición de hijo reconocido en el marco de la familia de José, aunque el texto no desarrolla aquí la cuestión de los posibles hermanos posteriores de Jesús.',
          crossReferences: ['Éxodo 13:2', 'Deuteronomio 21:17', 'Lucas 2:7'],
        },
        {
          originalScript: 'ἐκάλεσεν',
          transliteration: 'ekalesen',
          morphology: 'Verbo aoristo indicativo activo, 3.ª persona singular (de καλέω / ἐπικαλέω)',
          grammaticalCategory: 'Verbo',
          literalTranslation: 'Llamó, dio el nombre o nombró.',
          originalMeaning:
            'Procede de kaleō / epikaleō, que puede significar llamar a alguien por un nombre o invocar. En las narraciones bíblicas, la imposición del nombre puede expresar identidad, propósito o reconocimiento familiar. En Génesis 17:19, Dios ordena que Isaac reciba un nombre específico; en Lucas 1:13, se comunica a Zacarías el nombre que deberá dar a su hijo.',
          argumentativeFunction:
            'José cumple la instrucción recibida al ponerle al niño el nombre de Jesús. Este acto confirma su obediencia y su aceptación de la responsabilidad familiar. Además, conecta el relato del nacimiento con la explicación mesiánica del versículo 21: el nombre expresa la misión para la cual ha venido el niño.',
          crossReferences: ['Génesis 17:19', 'Lucas 1:13'],
        },
      ],
    },
  ],
  continuousNarrative: [
    'Mateo comienza su Evangelio con una decisión que puede parecer extraña para un lector moderno: antes de contar lo que Jesús hizo, presenta de dónde viene. No comienza describiendo milagros, enseñanzas o acontecimientos extraordinarios, sino relacionando a Jesús con una historia que llevaba siglos desarrollándose. Para comprender por qué hace esto, hay que recordar que las promesas de Dios a Israel estaban profundamente vinculadas con dos figuras: Abraham y David.',
    'A Abraham, Dios le había prometido que haría de él una gran nación y que por medio de su descendencia serían bendecidas todas las familias de la tierra (Génesis 12:1-3; 22:17-18). A David le había prometido que su descendencia tendría continuidad y que su reino sería establecido (2 Samuel 7:12-16). Estas dos promesas representan dimensiones complementarias de la esperanza de Israel: la bendición para los pueblos y la llegada de un gobernante legítimo. Por eso Mateo comienza identificando a Jesús como descendiente de Abraham y de David: está estableciendo que la historia de Jesús pertenece a la historia de las promesas de Dios.',
    'La genealogía avanza desde Abraham hasta David, continúa por los reyes de Judá, atraviesa la deportación a Babilonia y llega finalmente a José. En ese recorrido aparecen períodos de crecimiento, estabilidad, fracaso y pérdida. Abraham representa el comienzo de la historia patriarcal; David representa el establecimiento de la monarquía; la deportación representa una de las mayores crisis de Israel. Esto es importante porque la historia de Israel no había seguido una línea de progreso humano constante: había habido desobediencia, conflictos internos, idolatría, injusticias y pérdida de la independencia nacional. Sin embargo, el nacimiento de Jesús aparece como la continuación de esa historia que, según Mateo, encuentra en él su culminación.',
    'La organización en tres grupos de catorce generaciones refuerza esa interpretación. Es posible que Mateo utilice el valor numérico del nombre David en hebreo, cuyas consonantes suman catorce. No obstante, la genealogía no es un registro exhaustivo en el sentido moderno: Mateo selecciona nombres y omite algunos antepasados conocidos por otras genealogías del Antiguo Testamento. Su propósito es presentar una interpretación organizada de la historia. Asimismo, resulta llamativa la inclusión de cuatro mujeres: Tamar (Génesis 38), Rahab (Josué 2), Rut (Rut 1–4) y la mujer de Urías, Betsabé (2 Samuel 11–12). Sería incorrecto reducir a estas mujeres a una sola categoría moral; lo que tienen en común es que sus historias muestran la complejidad real de la línea de la que procede Jesús y la presencia de mujeres extranjeras o vinculadas con pueblos no israelitas.',
    'La genealogía culmina con una modificación muy importante en el versículo 16: durante toda la lista se repite que un antepasado engendra al siguiente, pero al llegar a José, Mateo no dice que José engendró a Jesús, sino que lo identifica como esposo de María, de quien nació Jesús, llamado el Cristo. Esta construcción griega distingue deliberadamente la relación de José con Jesús de las generaciones anteriores y prepara el segundo movimiento del capítulo.',
    'En el contexto judío de aquella época, el compromiso matrimonial entre María y José tenía reconocimiento jurídico y su disolución requería una separación legal. Por eso, cuando José descubre que María está embarazada antes de comenzar la convivencia matrimonial, la situación representa un problema serio. Desde su perspectiva inicial, el embarazo podía interpretarse como evidencia de una infidelidad, mientras que Mateo proporciona al lector una información que José todavía no posee: María ha concebido por obra del Espíritu Santo. Descrito como un hombre justo, José decide no exponer públicamente a María y piensa resolver el asunto discretamente, evitando convertir la situación en un espectáculo humillante.',
    'Antes de ejecutar su decisión, recibe una revelación mediante un sueño. El ángel del Señor le comunica que no debe temer recibir a María como esposa, porque lo concebido en ella procede del Espíritu Santo, y le ordena poner al niño el nombre de Jesús, porque él salvará a su pueblo de sus pecados. La expectativa de un descendiente de David podía llevar a pensar principalmente en un gobernante que restauraría la independencia política de Israel; sin embargo, Mateo establece desde el comienzo que el problema fundamental que Jesús viene a enfrentar está relacionado con la condición moral y espiritual del pueblo y la necesidad de reconciliación con Dios.',
    'Después de explicar la misión de Jesús, Mateo relaciona el acontecimiento con Isaías 7:14: la joven concebirá y dará a luz un hijo, y será llamado Emanuel, que significa Dios con nosotros. En el contexto original de Isaías, el profeta se dirigía al rey Acaz durante una crisis política en Judá, donde el texto hebreo emplea almah y la Septuaginta traduce parthenos. Mateo utiliza la versión griega para presentar en Jesús una realización más plena de la presencia de Dios con su pueblo. Así, Jesús expresa lo que viene a hacer (salvar) y Emanuel expresa el significado de su presencia (Dios con nosotros).',
    'Finalmente, José despierta y obedece exactamente lo ordenado: recibe a María como esposa, no mantiene relaciones sexuales con ella hasta que nace Jesús e impone al niño el nombre indicado por el ángel. De este modo, José, descendiente de David, otorga a Jesús reconocimiento legal dentro de su familia, conectando la identidad davídica del Mesías con la historia de su nacimiento sin atribuir a José la paternidad biológica. Para el lector actual, el argumento impide idealizar la historia humana y confronta la fe con la necesidad de comprender la misión profunda de Jesús y responder a la voluntad de Dios con decisiones concretas.',
  ],
  keyPrincipleAndApplications: {
    keyPrinciple:
      'Dios desarrolla su propósito redentor a través de la historia humana y cumple sus promesas mediante Jesucristo, cuya misión es salvar a su pueblo del pecado y manifestar la presencia de Dios entre ellos.',
    keyHabit:
      'Cada día, antes de tomar una decisión importante, identifica qué principio bíblico debe orientar tu conducta y realiza una acción concreta coherente con él, aunque contradiga tus preferencias o planes iniciales.',
    applications: [
      {
        dimension: 'Personal',
        concreteAction:
          'Dedica diez minutos diarios a examinar una conducta, actitud o decisión que necesites corregir. Identifica si el problema está relacionado con orgullo, egoísmo, falta de honestidad, resentimiento o alguna otra conducta contraria a la voluntad de Dios. Establece una acción de corrección y, cuando corresponda, busca reparar el daño.',
        practicalExample:
          'Si en Santo Domingo has tenido un conflicto con un compañero de trabajo y reconoces que tu reacción estuvo motivada por orgullo, no te limites a orar para que mejore la relación. Reconoce tu responsabilidad, conversa con esa persona y ofrece disculpas por aquello que hiciste incorrectamente. La salvación del pecado debe tener consecuencias observables en la manera de relacionarte.',
      },
      {
        dimension: 'Comunitaria',
        concreteAction:
          'Una vez al mes, identifica una necesidad de tu comunidad y participa en una iniciativa que permita atenderla de manera organizada, sin discriminación ni favoritismos.',
        practicalExample:
          'Si en un sector de San Cristóbal existen familias haitianas y dominicanas con necesidades económicas, procura que una iniciativa comunitaria de ayuda considere las necesidades reales de ambas poblaciones. La historia de las mujeres extranjeras incorporadas a la genealogía recuerda que el propósito de Dios no debe confundirse con una visión excluyente de la pertenencia al pueblo de Dios.',
      },
      {
        dimension: 'Educativa',
        concreteAction:
          'Una vez por semana, enseña a tus hijos o estudiantes a distinguir entre información, interpretación y decisión. Presenta una situación, pídeles que identifiquen qué saben realmente, qué están suponiendo y qué deberían hacer responsablemente.',
        practicalExample:
          'Si uno de tus hijos llega a casa afirmando que un compañero lo traicionó, antes de tomar partido ayúdalo a identificar qué ocurrió, qué información tiene y qué está interpretando. Enséñale a no condenar a alguien basándose exclusivamente en conclusiones precipitadas. La situación de José muestra la importancia de actuar con responsabilidad y consideración cuando todavía no se conoce toda la realidad.',
      },
      {
        dimension: 'Eclesial',
        concreteAction:
          'Una vez por trimestre, evalúa con el liderazgo de la congregación si la enseñanza, los programas y las actividades están ayudando a las personas a comprender la misión de Cristo y a experimentar cambios concretos relacionados con el pecado, la reconciliación y la obediencia.',
        practicalExample:
          'Una iglesia de Santo Domingo puede revisar su programa de discipulado y comprobar si los participantes están creciendo en honestidad, responsabilidad familiar, integridad financiera y reconciliación interpersonal. No debe medir el éxito únicamente por la cantidad de asistentes, bautismos o actividades realizadas, sino también por el desarrollo de una vida coherente con el evangelio.',
      },
      {
        dimension: 'Pastoral',
        concreteAction:
          'Cuando acompañes a una persona que enfrenta una situación familiar compleja, escucha sin precipitarte a emitir juicios, distingue los hechos de las interpretaciones y ayúdala a identificar decisiones bíblicamente responsables. Evita confundir la compasión con la aprobación de conductas incorrectas.',
        practicalExample:
          'Si una mujer de una congregación en Santiago llega a la iglesia embarazada y sin estar casada, evita que los líderes la expongan públicamente o permitan que la comunidad la humille. Investiga lo necesario con discreción, ofrece acompañamiento espiritual y práctico, protege su dignidad y examina la situación con justicia. La conducta de José muestra que la justicia no tiene por qué convertirse en humillación pública.',
      },
    ],
  },
      debatedQuestions: [
    {
      number: 1,
      question:
        '¿La genealogía de Mateo es un registro histórico exhaustivo o una construcción genealógica organizada con un propósito teológico?',
      positions: [
        {
          label: 'Primera posición: genealogía histórica selectiva con propósito documental',
          summary:
            'Esta interpretación sostiene que Mateo preserva un registro real de antepasados de Jesús, pero selecciona generaciones representativas para organizarlas en tres series de catorce.',
          arguments: [
            'Argumento histórico-filológico: En el hebreo y griego bíblicos, «engendrar» (yalad / gennaō) designa con frecuencia ascendencia dinástica o abuelo-nieto (cf. Mateo 1:8 frente a 1 Crónicas 3:11-12, donde se omiten Ocozías, Joás y Amasías).',
            'Argumento textual-canónico: Mateo se apoya en registros canónicos verificables del Antiguo Testamento, particularmente Rut 4:18-22 y 1 Crónicas 1–3.',
            'Argumento lógico: La omisión selectiva de eslabones intermedios era una convención historiográfica conocida en la Antigüedad y no convierte en ficticios los nombres registrados.',
          ],
        },
        {
          label: 'Segunda posición: estructura literario-teológica predominante sobre el archivo civil',
          summary:
            'Otros investigadores destacan que la simetría numérica, las omisiones intencionales y la selección de personajes indican que Mateo interpreta la historia de Israel desde una perspectiva mesiánica.',
          arguments: [
            'Argumento literario-matemático: La simetría estricta de 3 × 14 generaciones (Mateo 1:17) —cuando la última serie suma trece nombres si no se cuenta dos veces a Jeconías o a David/Cristo— y la gematría hebrea de David (דוד = 4+6+4 = 14) priorizan el mensaje teológico.',
            'Argumento comparativo sinóptico: La comparación con Lucas 3:23-38 evidencia discrepancias en los nombres desde David hasta José (Salomón en Mateo frente a Natán en Lucas), apuntando a líneas jurídicas o enfoques literarios distintos.',
          ],
        },
      ],
      debateStatus:
        'Existe consenso académico en que Mateo selecciona y organiza deliberadamente el material genealógico. Permanece abierto cómo armonizar exactamente sus diferencias puntuales respecto a Lucas 3:23-38 (línea real-legal frente a línea biológica o linaje materno).',
      plausibleBiblicalConclusion:
        'La conclusión más plausible y fiel al texto bíblico es que ambas dimensiones coexisten sin contradicción: Mateo emplea genealogías canónicas reales del Antiguo Testamento (Rut 4; 1 Crónicas 1–3), pero aplica el recurso bíblico legítimo de la compresión genealógica (telescopaje) para estructurar teológicamente la historia de salvación en torno a Abraham, David y el Mesías. La Biblia misma confirma en 1 Crónicas 3 y Esdras 7:1-5 que las genealogías abreviadas servían para demostrar legitimidad de linaje y pacto, no para elaborar árboles biológicos exhaustivos.',
    },
    {
      number: 2,
      question: '¿Por qué Mateo incluye a Tamar, Rahab, Rut y la mujer de Urías en la genealogía?',
      positions: [
        {
          label: 'Primera posición: destacar la intervención divina en circunstancias familiares irregulares',
          summary:
            'Las cuatro mujeres aparecen porque sus relatos veterotestamentarios contienen rupturas de las expectativas sociales o jurídicas habituales, anticipando la concepción singular de María.',
          arguments: [
            'Argumento narrativo-teológico: En Génesis 38 (Tamar), Josué 2 (Rahab), Rut 3–4 (Rut) y 2 Samuel 11 (Betsabé), Dios preserva la promesa mesiánica a través de situaciones complejas, preparando al lector para la obra del Espíritu en Mateo 1:18-20.',
          ],
        },
        {
          label: 'Segunda posición: anticipar la apertura mesiánica hacia los gentiles',
          summary:
            'Subraya el origen no israelita o la vinculación extranjera de estas figuras (Rahab cananea, Rut moabita, Tamar probablemente cananea y Betsabé esposa de Urías el heteo).',
          arguments: [
            'Argumento canónico intra-mateano: La propia estructura de Mateo conecta la promesa hecha a Abraham («en ti serán benditas todas las familias de la tierra», Génesis 12:3) con el mandato final a «todas las naciones» en Mateo 28:19.',
          ],
        },
        {
          label: 'Tercera posición: resaltar la fe activa e iniciativa de mujeres clave en la promesa',
          summary:
            'Considera que estas mujeres desempeñaron un papel decisivo para la continuidad de la línea davídica frente a la pasividad o falla de los varones correspondientes.',
          arguments: [
            'Argumento ético-textual: Génesis 38:26 declara a Tamar «más justa» que Judá; Josué 2:9-11 y Hebreos 11:31 destacan la fe de Rahab; y Rut 3:11 califica a Rut como «mujer virtuosa».',
          ],
        },
      ],
      debateStatus:
        'No existe consenso en reducir su presencia a un único motivo exclusivo, pues los textos bíblicos del Antiguo Testamento que Mateo presupone respaldan simultáneamente varios énfasis complementarios.',
      plausibleBiblicalConclusion:
        'Dejando que la Escritura interprete a la Escritura, la conclusión más sólida es integradora: Mateo incluye a estas cuatro mujeres —cuyas historias conoce el lector por Génesis 38, Josué 2, Rut y 2 Samuel 11— para mostrar que la fidelidad del pacto divino (1) no queda anulada por crisis morales o irregularidades humanas, (2) trasciende fronteras étnicas anticipando la salvación universal (Isaías 49:6; Mateo 28:19) y (3) prepara teológicamente al lector para aceptar la intervención soberana de Dios en el nacimiento de Jesús mediante María.',
    },
    {
      number: 3,
      question: '¿Isaías 7:14 originalmente profetizaba un nacimiento virginal del Mesías?',
      positions: [
        {
          label: 'Primera posición: profecía mesiánica directa del nacimiento virginal',
          summary:
            'Considera que Isaías 7:14 anunciaba desde su origen una señal sobrenatural única que se cumple literalmente en la concepción virginal de Jesús.',
          arguments: [
            'Argumento filológico-textual: La Septuaginta (LXX), redactada por eruditos judíos siglos antes de Cristo, tradujo el hebreo ʿalmāh por parthenos («virgen»), término que Mateo 1:23 adopta textualmente.',
            'Argumento lógico-teológico: La señal ofrecida por Dios en Isaías 7:11 («pide para ti señal, ya sea en lo profundo o en lo alto») requería un signo extraordinario superior a un nacimiento común.',
          ],
        },
        {
          label: 'Segunda posición: referente histórico inmediato en tiempos del rey Acaz',
          summary:
            'Destaca que Isaías 7:14 responde a la crisis siro-efraimita del siglo VIII a. C., donde el nacimiento cercano de un niño servía como reloj profético para la liberación de Judá.',
          arguments: [
            'Argumento lingüístico-hebreo: En el Antiguo Testamento, ʿalmāh (Génesis 24:43; Éxodo 2:8; Salmo 68:25; Proverbios 30:19) designa a una mujer joven en edad núbil, mientras que betûlāh es el término específico para virginidad biológica.',
            'Argumento histórico-contextual: Isaías 7:15-16 exige que antes de que el niño sepa desechar lo malo y escoger lo bueno, los dos reyes enemigos (Rezín y Peka) hayan caído.',
          ],
        },
        {
          label: 'Tercera posición: cumplimiento tipológico y de plenitud progresiva (doble horizonte)',
          summary:
            'Sostiene que Isaías 7:14 tuvo una señal histórica inicial bajo Acaz, pero su sentido teológico pleno («Dios con nosotros», cf. Isaías 8:8, 10; 9:6) halla realización definitiva en el Mesías.',
          arguments: [
            'Argumento canónico y hermenéutico: El propio Evangelio de Mateo emplea «cumplirse» (plēroō) en Mateo 2:15 (citando Oseas 11:1) para referirse a patrones histórico-redentores de Israel recapitulados en Jesús.',
            'Argumento científico-histórico sobre el texto: Desde la biología humana ordinaria, toda concepción requiere fecundación natural; precisamente por ello Mateo 1:18-25 no afirma un fenómeno natural ordinario, sino que atribuye explícitamente la concepción de María a la acción creadora directa del Espíritu Santo.',
          ],
        },
      ],
      debateStatus:
        'Existe consenso en interpretar Isaías 7:14 primeramente en la crisis histórica de Acaz. Persiste la discusión entre quienes ven una profecía directa exclusivamente mesiánica y quienes observan un cumplimiento tipológico-progresivo apoyado en la Septuaginta.',
      plausibleBiblicalConclusion:
        'La conclusión más plausible y fiel al conjunto de la Biblia es la lectura de plenitud tipológica (tercera posición): en su contexto inmediato de Isaías 7:14-16, la promesa dio una señal temporal concreta al rey Acaz vinculada a la preservación de la casa de David; sin embargo, dentro del propio libro de Isaías (7:14; 8:8-10; 9:6-7; 11:1) la figura de Emanuel crece hacia una esperanza mesiánica definitiva. Así, Mateo —guiado por la lectura de la Septuaginta (parthenos) y por el hecho histórico-narrativo de que José «no la conoció» hasta el nacimiento (Mateo 1:25)— reconoce en la concepción por el Espíritu Santo la realización suprema e irrepetible de «Dios con nosotros».',
    },
    {
      number: 4,
      question: '¿Qué significa que José fuera justo y quisiera divorciarse de María discretamente?',
      positions: [
        {
          label: 'Primera posición: justicia como obediencia estricta a la Ley de Moisés',
          summary:
            'José entiende que, al aparecer María embarazada durante el desposorio, la fidelidad a la Torá (Deuteronomio 22:23-24; 24:1) le impide consumar el matrimonio y exige una separación legal.',
          arguments: [
            'Argumento jurídico-bíblico: En el Antiguo Testamento y en el judaísmo del siglo I, el término dikaios (heb. ṣaddîq) designa ante todo a quien ajusta su conducta a las ordenanzas del pacto.',
          ],
        },
        {
          label: 'Segunda posición: justicia unida a la compasión y prudencia moral',
          summary:
            'Combina el apego a la ley con la decisión deliberada de no exponer a María al escándalo ni al oprobio público (lathra apolysai autēn).',
          arguments: [
            'Argumento intrabíblico y ético-filosófico: Mateo 23:23 y Miqueas 6:8 integran la justicia (krisis / mišpāṭ) con la misericordia (eleos / ḥesed), mostrando que la rectitud bíblica no busca la destrucción del prójimo sino el bien moral proporcional.',
          ],
        },
        {
          label: 'Tercera posición: justicia verificada en la obediencia a la revelación divina',
          summary:
            'La rectitud de José se demuestra plenamente cuando, tras recibir la aclaración angélica, abandona su plan previo y cumple exactamente el mandato del Señor (Mateo 1:24).',
          arguments: [
            'Argumento narrativo-teológico: Como Abraham en Génesis 15:6 y 22:1-18, la justicia bíblica responde con fe obediente cuando Dios revela su propósito más allá de la apariencia humana.',
          ],
        },
      ],
      debateStatus:
        'Los comentaristas debaten cuál matiz enfatiza primero Mateo 1:19 (fidelidad legal frente a clemencia), aunque la mayoría reconoce que ambos sentidos convergen en el relato.',
      plausibleBiblicalConclusion:
        'A la luz de toda la Escritura (Deuteronomio 24:1; Miqueas 6:8; Mateo 1:19-24; Mateo 23:23), la conclusión más coherente es que Mateo describe en José la síntesis bíblica de la justicia integral: antes de recibir la revelación, actúa conforme a la Ley sin ceder a la venganza pública (combinando rectitud jurídica y misericordia); y una vez instruido por Dios en sueños, su justicia se manifiesta como obediencia inmediata, acogiendo a María y reconociendo legalmente a Jesús.',
    },
  ],
  sources: [
    'Novum Testamentum Graece, Nestle-Aland, 28.ª ed. (NA28)',
    'Biblia Hebraica Stuttgartensia (BHS), Isaías 7:14',
    'Septuaginta, Rahlfs-Hanhart',
    'W. D. Davies y Dale C. Allison Jr., Gospel of Matthew (ICC, vol. 1, 1988)',
    'Donald A. Hagner, The Gospel According to Matthew (WBC, vol. 1, 1993)',
    'Ulrich Luz, Matthew (Hermeneia, vol. 1, 2007)',
    'Craig S. Keener, The Gospel of Matthew (1999)',
    'R. T. France, The Gospel of Matthew (NICNT, 2007)',
    'Amy-Jill Levine y Marc Zvi Brettler (eds.), The Jewish Annotated New Testament, 3.ª ed. (2025)',
    'Benjamin L. Gladd, Handbook on the Gospels (2021)',
  ],
  finalAppraisal:
    'Mateo 1:1-25 no presenta el nacimiento de Jesús como un acontecimiento aislado ni como una simple historia familiar. Construye un argumento sobre la continuidad de las promesas de Dios, la identidad mesiánica de Jesús y la naturaleza de su misión. La genealogía demuestra su vinculación con la historia de Abraham y David; el relato de José explica su nacimiento extraordinario; y los nombres Jesús y Emanuel condensan su misión salvadora y el significado de su presencia. El capítulo establece desde el comienzo que la respuesta adecuada ante esta intervención divina no es solamente reconocer quién es Jesús, sino comprender por qué vino y responder a su propósito.',
  fidelityAudit: {
    verified: true,
    principlesChecked: [
      'Basado estrictamente en NA28, BHS y LXX sin añadir citas ficticias',
      'La Biblia se interpreta a sí misma (Analogia Scripturae: Rut 4, 1 Crónicas 1-3, Isaías 7-11)',
      'Neutralidad confesional y exégesis histórico-gramatical objetiva',
      'Cuestiones debatidas con argumentos filológicos, históricos, filosóficos, científicos y teológicos + conclusión bíblica plausible',
    ],
    auditSummary:
      'Auditoría exegética verificada: todas las referencias griegas y hebreas, vínculos intertextuales y conclusiones de debate se ajustan fielmente al texto bíblico canónico sin sesgos denominacionales.',
    correctionsApplied: 0,
    auditedAt: '2026-11-27T04:27:00.000Z',
  },
};
