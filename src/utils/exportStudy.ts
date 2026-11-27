import type { ExegesisStudy } from '../types/exegesis';

export function studyToMarkdown(study: ExegesisStudy): string {
  const lines: string[] = [];

  lines.push(`### Análisis exegético de ${study.passage}`);
  lines.push('');
  lines.push(`### I. TEXTO BASE`);
  lines.push('');
  lines.push(`Referencia: ${study.baseText.reference}. Texto crítico: ${study.baseText.criticalText}`);
  lines.push('');
  lines.push(`Unidad literaria: ${study.baseText.literaryUnit}`);
  lines.push('');

  for (const unit of study.baseText.subUnits) {
    lines.push(`- **${unit.range} (${unit.title})**: ${unit.summary}`);
  }
  lines.push('');

  lines.push(`### II. CONTEXTO DEL PASAJE`);
  lines.push('');
  lines.push(study.context.historicalAudience);
  lines.push('');
  lines.push(study.context.literarySetting);
  lines.push('');
  lines.push(study.context.narrativeFlow);
  lines.push('');

  lines.push(`### III. ANÁLISIS GRAMATICAL`);
  lines.push('');
  for (const group of study.grammaticalAnalysis) {
    lines.push(`### ${group.pericopeRange}: ${group.pericopeTitle}`);
    lines.push('');
    for (const term of group.terms) {
      lines.push(`Original: ${term.originalScript} (${term.morphology})`);
      lines.push('');
      lines.push(`Transliteración: ${term.transliteration}.`);
      lines.push('');
      lines.push(`Traducción literal: ${term.literalTranslation}`);
      lines.push('');
      lines.push(`Significado original: ${term.originalMeaning}`);
      lines.push('');
      lines.push(`Función argumental: ${term.argumentativeFunction}`);
      lines.push('');
    }
  }

  lines.push(`### IV. NARRACIÓN ARGUMENTAL CONTINUA`);
  lines.push('');
  for (const paragraph of study.continuousNarrative) {
    lines.push(paragraph);
    lines.push('');
  }

  lines.push(`### V. PRINCIPIO BÍBLICO CLAVE Y APLICACIONES`);
  lines.push('');
  lines.push(`Principio bíblico clave: ${study.keyPrincipleAndApplications.keyPrinciple}`);
  lines.push('');
  lines.push(`Hábito clave: ${study.keyPrincipleAndApplications.keyHabit}`);
  lines.push('');

  study.keyPrincipleAndApplications.applications.forEach((app, idx) => {
    lines.push(`### ${idx + 1}. Aplicación ${app.dimension.toLowerCase()}`);
    lines.push('');
    lines.push(`Acción concreta: ${app.concreteAction}`);
    lines.push('');
    lines.push(`Ejemplo práctico: ${app.practicalExample}`);
    lines.push('');
  });

  lines.push(`### VI. CUESTIONES DEBATIDAS`);
  lines.push('');
  for (const q of study.debatedQuestions) {
    lines.push(`### ${q.number}. ${q.question}`);
    lines.push('');
    for (const pos of q.positions) {
      lines.push(`**${pos.label}**`);
      lines.push('');
      lines.push(pos.summary);
      lines.push('');
      for (const arg of pos.arguments) {
        lines.push(`- ${arg}`);
      }
      lines.push('');
    }
    lines.push(`Estado del debate: ${q.debateStatus}`);
    lines.push('');
    if (q.plausibleBiblicalConclusion) {
      lines.push(`Conclusión más plausible y fiel a la Escritura: ${q.plausibleBiblicalConclusion}`);
      lines.push('');
    }
  }

  lines.push(`FUENTES: ${study.sources.join('; ')}.`);
  lines.push('');
  lines.push(`Valoración exegética final: ${study.finalAppraisal}`);
  lines.push('');

  if (study.fidelityAudit?.verified) {
    lines.push(`Auditoría de fidelidad bíblica: ${study.fidelityAudit.auditSummary}`);
    lines.push('');
  }

  return lines.join('\n');
}

export function downloadStudyMarkdown(study: ExegesisStudy): void {
  const md = studyToMarkdown(study);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const safeName = study.passage
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñ]+/gi, '-')
    .replace(/^-|-$/g, '');
  const a = document.createElement('a');
  a.href = url;
  a.download = `exegesis-${safeName}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
