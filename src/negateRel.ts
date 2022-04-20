export const negs: { [key: string]: string } = {
  '<': '≮',
  '=': '≠',
  '>': '≯',
  '∃': '∄',
  '∈': '∉',
  '∋': '∌',
  '∼': '≁',
  '≃': '≄',
  '≅': '≇',
  '≈': '≉',
  '≍': '≭',
  '≡': '≢',
  '≤': '≰',
  '≥': '≱',
  '≶': '≸',
  '≷': '≹',
  '≽': '⋡',
  '≺': '⊀',
  '≻': '⊁',
  '≼': '⋠',
  '⊂': '⊄',
  '⊃': '⊅',
  '⊆': '⊈',
  '⊇': '⊉',
  '⊑': '⋢',
  '⊒': '⋣',
};

export function TranslateNegateRel(rel: string): string | null {
  if (negs.hasOwnProperty(rel)) {
    return negs[rel];
  }
  return null;
}
