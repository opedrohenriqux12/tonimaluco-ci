/**
 * Orquestrador de turnos do conselho (roda no navegador; sem imports para poder ser
 * reutilizado também no script de testes de aceitação via Node).
 *
 * Regras:
 * - Individual: 1 chamada ao conselheiro selecionado, com o histórico próprio dele.
 * - Grupo (Conselho completo / War Room):
 *     1. moderador decide ordem (mais relacionado primeiro), quem foi chamado e se pediu debate;
 *     2. cada conselheiro é chamado em sequência, lendo a transcrição atualizada
 *        (inclusive o que os colegas acabaram de dizer nesta rodada);
 *     3. <<PASS>> é descartado; quem foi chamado diretamente é instruído a responder;
 *     4. rodadas extras de réplica só se o Presidente pediu debate (máx. 2, para quando ninguém tem réplica).
 */

export interface RoomMessage {
  id: string;
  /** 'user' = Presidente; id do conselheiro; ou 'system' para avisos da interface. */
  authorId: string;
  text: string;
  time: string;
  kind?: 'error' | 'status';
}

export interface TurnCallbacks {
  onTyping: (advisorId: string | null) => void;
  onMessage: (msg: RoomMessage) => void;
}

export interface TurnOptions {
  /** Base da URL da API. Vazio no navegador; URL absoluta nos testes. */
  baseUrl?: string;
  agendaContext?: string;
}

export interface GroupTurnResult {
  spoke: number;
  passed: string[];
  errors: number;
  plan: { order: string[]; mustRespond: string[]; debate: boolean; planError?: string };
}

const MAX_DEBATE_ROUNDS = 2;

let counter = 0;
const newId = () => `m_${Date.now().toString(36)}_${(counter++).toString(36)}`;
const nowTime = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export function makeMessage(authorId: string, text: string, kind?: RoomMessage['kind']): RoomMessage {
  return { id: newId(), authorId, text, time: nowTime(), kind };
}

/** Só falas reais entram na transcrição enviada ao modelo (avisos/erros da interface ficam de fora). */
function toTranscript(messages: RoomMessage[]) {
  return messages.filter((m) => !m.kind && m.authorId !== 'system').map((m) => ({ authorId: m.authorId, text: m.text }));
}

async function postJson(url: string, payload: unknown): Promise<{ ok: boolean; data: any }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function runIndividualTurn(
  advisorId: string,
  history: RoomMessage[],
  callbacks: TurnCallbacks,
  options: TurnOptions = {}
): Promise<RoomMessage | null> {
  callbacks.onTyping(advisorId);
  try {
    const { ok, data } = await postJson(`${options.baseUrl ?? ''}/api/council/reply`, {
      advisorId,
      mode: 'individual',
      participantIds: [advisorId],
      transcript: toTranscript(history),
      agendaContext: options.agendaContext,
    });
    if (!ok || !data?.text) {
      callbacks.onMessage(makeMessage('system', data?.error || 'Falha ao obter resposta.', 'error'));
      return null;
    }
    const msg = makeMessage(advisorId, data.text);
    callbacks.onMessage(msg);
    return msg;
  } catch (err) {
    callbacks.onMessage(makeMessage('system', `Falha de rede: ${(err as Error).message}`, 'error'));
    return null;
  } finally {
    callbacks.onTyping(null);
  }
}

export async function runGroupTurn(
  participantIds: string[],
  history: RoomMessage[],
  callbacks: TurnCallbacks,
  options: TurnOptions = {}
): Promise<GroupTurnResult> {
  const base = options.baseUrl ?? '';
  const transcript = toTranscript(history);
  const result: GroupTurnResult = {
    spoke: 0,
    passed: [],
    errors: 0,
    plan: { order: [...participantIds], mustRespond: [], debate: false },
  };

  // 1. Moderador. Se falhar, segue com a ordem da sala e ninguém obrigado (não afeta o conteúdo das falas).
  try {
    const { ok, data } = await postJson(`${base}/api/council/plan`, { participantIds, transcript });
    if (ok && Array.isArray(data?.order)) {
      result.plan = { order: data.order, mustRespond: data.mustRespond ?? [], debate: data.debate === true };
    } else {
      result.plan.planError = data?.error || 'moderador indisponível';
    }
  } catch (err) {
    result.plan.planError = (err as Error).message;
  }

  const totalRounds = 1 + (result.plan.debate ? MAX_DEBATE_ROUNDS : 0);

  for (let round = 0; round < totalRounds; round++) {
    let spokeThisRound = 0;

    for (const advisorId of result.plan.order) {
      if (round > 0 && transcript[transcript.length - 1]?.authorId === advisorId) continue;

      callbacks.onTyping(advisorId);
      try {
        const { ok, data } = await postJson(`${base}/api/council/reply`, {
          advisorId,
          mode: 'group',
          participantIds,
          transcript,
          mustRespond: round === 0 && result.plan.mustRespond.includes(advisorId),
          round,
          agendaContext: options.agendaContext,
        });

        if (!ok) {
          result.errors++;
          callbacks.onMessage(makeMessage('system', data?.error || 'Falha ao obter resposta.', 'error'));
          continue;
        }
        if (data?.passed || !data?.text) {
          if (round === 0) result.passed.push(advisorId);
          continue;
        }

        const msg = makeMessage(advisorId, data.text);
        transcript.push({ authorId: advisorId, text: data.text });
        callbacks.onMessage(msg);
        result.spoke++;
        spokeThisRound++;
      } catch (err) {
        result.errors++;
        callbacks.onMessage(makeMessage('system', `Falha de rede: ${(err as Error).message}`, 'error'));
      }
    }

    if (round > 0 && spokeThisRound === 0) break;
  }

  callbacks.onTyping(null);
  return result;
}
