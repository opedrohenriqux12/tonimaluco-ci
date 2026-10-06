import { PERSONAS, type AdvisorPersona } from './prompts/personas';
import { PRESIDENT_LABEL } from './systemInstruction';

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Saída é exatamente <<PASS>> (ignorando espaços e quebras de linha)? */
export function isPass(text: string): boolean {
  return /^<<\s*PASS\s*>>$/i.test(text.replace(/\s+/g, ''));
}

/**
 * Limpeza estrutural da saída (não altera conteúdo):
 * 1. remove o próprio nome no início ("Dra. Helena:", "**[Helena]:**" etc.);
 * 2. corta tudo a partir do ponto em que o modelo começa a escrever a fala de outra pessoa;
 * 3. remove um <<PASS>> perdido no meio de uma fala real.
 */
export function cleanReply(raw: string, self: AdvisorPersona): string {
  let text = raw.trim();

  const selfAliases = [...self.aliases].sort((a, b) => b.length - a.length).map(escapeRegex);
  const selfPrefix = new RegExp(
    `^(?:\\*\\*|__)?\\[?\\s*(?:${selfAliases.join('|')})\\s*\\]?(?:\\*\\*|__)?\\s*[:：]\\s*(?:\\*\\*|__)?\\s*`,
    'i'
  );
  for (let i = 0; i < 2; i++) text = text.replace(selfPrefix, '').trim();

  const speakerLabels = [PRESIDENT_LABEL, 'Você', ...PERSONAS.flatMap((p) => p.aliases)]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex);
  const otherSpeaker = new RegExp(
    `\\n\\s*(?:\\*\\*|__)?\\[(?:${speakerLabels.join('|')})\\](?:\\*\\*|__)?\\s*:`,
    'i'
  );
  const cut = text.search(otherSpeaker);
  if (cut > 0) text = text.slice(0, cut).trim();

  if (!isPass(text)) text = text.replace(/<<\s*PASS\s*>>/gi, '').trim();
  return text;
}
