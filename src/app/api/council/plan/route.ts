import { NextResponse } from 'next/server';
import { generateWithGemini, GeminiError } from '@/lib/council/gemini';
import { getPersona } from '@/lib/council/prompts/personas';
import { labelOf, type TranscriptEntry } from '@/lib/council/systemInstruction';

export const maxDuration = 60;

/**
 * Moderador da sala (modos Conselho completo e War Room).
 * Não gera fala. Só decide, a partir da última mensagem do Presidente:
 *  - order: ordem de fala, do conselheiro mais relacionado ao assunto para o menos;
 *  - mustRespond: quem foi mencionado / recebeu pergunta direta (esses sempre respondem);
 *  - debate: se o Presidente pediu explicitamente que debatam entre si.
 * Feito pelo próprio Gemini, sem lista de palavras-chave.
 */
const MODERATOR_INSTRUCTION = `Você organiza a vez de falar numa sala de conselho consultivo. Você NÃO conversa com ninguém; apenas devolve o JSON pedido.

A última fala da transcrição é a mensagem nova do Presidente. Com base nela (e no contexto anterior, se ajudar), decida:

1. "order": TODOS os ids dos participantes, do mais relacionado ao assunto da mensagem para o menos relacionado. Se a mensagem for genérica (cumprimento, algo vago), use uma ordem natural qualquer.
2. "mustRespond": ids dos conselheiros que o Presidente mencionou pelo nome, apelido ou título, ou a quem dirigiu uma pergunta diretamente nessa última mensagem. Se ele falou com o grupo todo ("pessoal", "todos", "vocês") ou com ninguém em específico, devolva lista vazia.
3. "debate": true somente se o Presidente pediu explicitamente que os conselheiros debatam, discutam entre si, rebatam uns aos outros ou algo equivalente. Caso contrário, false.`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    order: { type: 'ARRAY', items: { type: 'STRING' } },
    mustRespond: { type: 'ARRAY', items: { type: 'STRING' } },
    debate: { type: 'BOOLEAN' },
  },
  required: ['order', 'mustRespond', 'debate'],
};

export async function POST(request: Request) {
  let body: { participantIds?: unknown; transcript?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  const participantIds = Array.isArray(body.participantIds)
    ? body.participantIds.filter((id): id is string => typeof id === 'string' && Boolean(getPersona(id)))
    : [];
  const transcript = Array.isArray(body.transcript)
    ? (body.transcript as TranscriptEntry[]).filter(
        (e) => e && typeof e.authorId === 'string' && typeof e.text === 'string'
      )
    : [];

  if (participantIds.length < 2 || !transcript.length) {
    return NextResponse.json({ error: 'Informe ao menos 2 participantes e a transcrição.' }, { status: 400 });
  }

  const roster = participantIds
    .map((id) => {
      const p = getPersona(id)!;
      return `- id "${id}": ${p.name} (${p.area}); também chamado de: ${p.aliases.join(', ')}`;
    })
    .join('\n');

  const recent = transcript
    .slice(-12)
    .map((e) => `[${labelOf(e.authorId)}]: ${e.text.slice(0, 2000)}`)
    .join('\n');

  try {
    const raw = await generateWithGemini({
      systemInstruction: MODERATOR_INSTRUCTION,
      contents: [{ role: 'user', parts: [{ text: `Participantes:\n${roster}\n\nTranscrição recente:\n${recent}` }] }],
      responseSchema: RESPONSE_SCHEMA,
      maxOutputTokens: 2048,
    });

    const parsed = JSON.parse(raw) as { order?: string[]; mustRespond?: string[]; debate?: boolean };
    const valid = new Set(participantIds);

    const order = Array.from(new Set((parsed.order ?? []).filter((id) => valid.has(id))));
    for (const id of participantIds) if (!order.includes(id)) order.push(id);

    const mustRespond = Array.from(new Set((parsed.mustRespond ?? []).filter((id) => valid.has(id))));

    return NextResponse.json({ order, mustRespond, debate: parsed.debate === true });
  } catch (err) {
    const status = err instanceof GeminiError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[council/plan]', message);
    return NextResponse.json({ error: message }, { status: status >= 400 ? status : 500 });
  }
}
