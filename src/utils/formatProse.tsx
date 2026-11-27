import React from 'react';

/**
 * Enhances scholarly prose readability by emphasizing biblical references
 * (e.g. "Génesis 12:1-3", "2 Samuel 7:12-16", "Mateo 1:18-25") and
 * quoted expressions («...») without altering the underlying text.
 */
const CITATION_OR_QUOTE_REGEX =
  /(«[^»]+»|\b(?:[123]\s+)?(?:Génesis|Éxodo|Levítico|Números|Deuteronomio|Josué|Jueces|Rut|Samuel|Reyes|Crónicas|Esdras|Nehemías|Ester|Job|Salmo|Salmos|Proverbios|Eclesiastés|Cantares|Isaías|Jeremías|Lamentaciones|Ezequiel|Daniel|Oseas|Joel|Amós|Abdías|Jonás|Miqueas|Nahúm|Habacuc|Sofonías|Hageo|Zacarías|Malaquías|Mateo|Marcos|Lucas|Juan|Hechos|Romanos|Corintios|Gálatas|Efesios|Filipenses|Colosenses|Tesalonicenses|Timoteo|Tito|Filemón|Hebreos|Santiago|Pedro|Judas|Apocalipsis)\s+\d+(?::\d+(?:[-–]\d+(?:,\s*\d+)*)?)?(?:[-–]\d+)?)/g;

export function renderFormattedProse(text: string): React.ReactNode {
  if (!text) return null;
  const parts = text.split(CITATION_OR_QUOTE_REGEX);

  return parts.map((part, index) => {
    if (!part) return null;
    if (part.startsWith('«') && part.endsWith('»')) {
      return (
        <strong key={index} className="font-semibold text-zinc-950">
          {part}
        </strong>
      );
    }
    if (CITATION_OR_QUOTE_REGEX.test(part)) {
      CITATION_OR_QUOTE_REGEX.lastIndex = 0;
      return (
        <strong key={index} className="font-semibold text-[#1E3A8A]">
          {part}
        </strong>
      );
    }
    CITATION_OR_QUOTE_REGEX.lastIndex = 0;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
