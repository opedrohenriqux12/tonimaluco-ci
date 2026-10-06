import { BASE_PROMPT } from './prompts/basePrompt';
import { PROJECT_CONTEXT } from './prompts/projectContext';
import { getPersona, type AdvisorPersona } from './prompts/personas';
import type { GeminiContent } from './gemini';

export type ConversationMode = 'individual' | 'group';

/** Uma fala da sala. authorId = 'user' (Presidente) ou id de conselheiro. */
export interface TranscriptEntry {
  authorId: string;
  text: string;
}

export const PRESIDENT_LABEL = 'Presidente';
export const PASS_TOKEN = '<<PASS>>';

export function labelOf(authorId: string): string {
  if (authorId === 'user') return PRESIDENT_LABEL;
  return getPersona(authorId)?.name ?? authorId;
}

interface BuildArgs {
  persona: AdvisorPersona;
  mode: ConversationMode;
  participantIds: string[];
  mustRespond: boolean;
  round: number;
  agendaContext?: string;
}

/**
 * Monta a system instruction: prompt-base + contexto do projeto + persona + situação da conversa.
 * A "situação" só descreve a estrutura da sala (quem está, como as falas chegam, se pode passar a vez).
 * Ela não dita conteúdo de resposta.
 */
export function buildSystemInstruction({
  persona,
  mode,
  participantIds,
  mustRespond,
  round,
  agendaContext,
}: BuildArgs): string {
  const projectContext = PROJECT_CONTEXT.trim()
    ? PROJECT_CONTEXT.trim()
    : '(Ainda não preenchido pelo Presidente. Não presuma detalhes do negócio; se precisar deles para responder bem, pergunte.)';

  const blocks: string[] = [
    BASE_PROMPT,
    `[CONTEXTO DO PROJETO]\n${projectContext}`,
    `[SEU PERSONAGEM]\n${persona.instruction}`,
  ];

  if (agendaContext?.trim()) {
    blocks.push(
      `[PAUTA ABERTA PELO PRESIDENTE]\nO Presidente abriu esta conversa a partir do item abaixo. Use como contexto quando for relevante.\n${agendaContext.trim()}`
    );
  }

  const situation: string[] = [];
  if (mode === 'individual') {
    situation.push(
      'Esta é uma conversa a dois, só entre você e o Presidente. Responda sempre; aqui não existe passar a vez.'
    );
  } else {
    const others = participantIds
      .filter((id) => id !== persona.id)
      .map((id) => getPersona(id))
      .filter((p): p is AdvisorPersona => Boolean(p))
      .map((p) => `${p.name} (${p.area})`);

    situation.push(
      `Você está numa sala com o Presidente e com estes conselheiros: ${others.join('; ')}.`,
      'As falas dos outros chegam rotuladas no formato [Nome]: texto. Suas próprias falas anteriores aparecem como suas respostas.',
      'Escreva somente a sua fala, sem rótulo e sem seu nome no início. Nunca escreva falas do Presidente nem de outros conselheiros.'
    );

    if (round > 0) {
      situation.push(
        'O Presidente pediu que o conselho debata. Esta é uma rodada de réplica: reaja ao que os colegas disseram (concorde, discorde, complemente ou questione, citando o nome). Não repita o que você já disse.',
        `Se não tiver réplica relevante, responda exatamente ${PASS_TOKEN}`
      );
    } else if (mustRespond) {
      situation.push(
        `O Presidente se dirigiu diretamente a você na última mensagem. Responda; não use ${PASS_TOKEN}.`
      );
    } else {
      situation.push(
        `Ninguém se dirigiu especificamente a você. Fale só se tiver algo relevante e novo a acrescentar ao que já foi dito; caso contrário, responda exatamente ${PASS_TOKEN}`
      );
    }
  }

  blocks.push(`[SITUAÇÃO DESTA CONVERSA]\n${situation.join('\n')}`);
  return blocks.join('\n\n');
}

/**
 * Converte a transcrição em `contents` do Gemini do ponto de vista de um conselheiro:
 * - falas dele → role "model" (sem rótulo)
 * - falas de qualquer outro → role "user"; em grupo, rotuladas com [Nome]:
 * Turnos consecutivos do mesmo papel são agrupados.
 * Retorna null se não houver nada novo para ele responder (última fala é dele).
 */
export function buildContents(
  transcript: TranscriptEntry[],
  selfId: string,
  mode: ConversationMode
): GeminiContent[] | null {
  const turns: GeminiContent[] = [];

  for (const entry of transcript) {
    const isSelf = entry.authorId === selfId;
    const role: GeminiContent['role'] = isSelf ? 'model' : 'user';
    const text = isSelf || mode === 'individual' ? entry.text : `[${labelOf(entry.authorId)}]: ${entry.text}`;
    const last = turns[turns.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += `\n\n${text}`;
    } else {
      turns.push({ role, parts: [{ text }] });
    }
  }

  while (turns.length && turns[0].role === 'model') turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== 'user') return null;
  return turns;
}
