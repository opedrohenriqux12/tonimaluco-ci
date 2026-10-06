import { NextResponse } from 'next/server';
import { generateWithGemini, GeminiError } from '@/lib/council/gemini';
import { getPersona } from '@/lib/council/prompts/personas';
import {
  buildContents,
  buildSystemInstruction,
  type ConversationMode,
  type TranscriptEntry,
} from '@/lib/council/systemInstruction';
import { cleanReply, isPass } from '@/lib/council/sanitize';

export const maxDuration = 60;

const MAX_TRANSCRIPT = 40;
const MAX_TEXT = 8000;

/**
 * Gera UMA fala de UM conselheiro.
 * Cada chamada usa a system instruction própria do conselheiro (campo systemInstruction do Gemini)
 * e a transcrição da sala em `contents`. Não há texto pronto em nenhum caminho.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  const persona = typeof body.advisorId === 'string' ? getPersona(body.advisorId) : undefined;
  if (!persona) return NextResponse.json({ error: 'Conselheiro desconhecido.' }, { status: 400 });

  const mode: ConversationMode = body.mode === 'group' ? 'group' : 'individual';
  const participantIds = Array.isArray(body.participantIds)
    ? body.participantIds.filter((id): id is string => typeof id === 'string' && Boolean(getPersona(id)))
    : [persona.id];
  const transcript: TranscriptEntry[] = (Array.isArray(body.transcript) ? body.transcript : [])
    .filter((e): e is TranscriptEntry => Boolean(e) && typeof e.authorId === 'string' && typeof e.text === 'string')
    .slice(-MAX_TRANSCRIPT)
    .map((e) => ({ authorId: e.authorId, text: e.text.slice(0, MAX_TEXT) }));
  const mustRespond = mode === 'individual' || body.mustRespond === true;
  const round = typeof body.round === 'number' && body.round > 0 ? Math.floor(body.round) : 0;
  const agendaContext = typeof body.agendaContext === 'string' ? body.agendaContext.slice(0, 2000) : undefined;

  const contents = buildContents(transcript, persona.id, mode);
  if (!contents) {
    // Nada novo para este conselheiro responder (a última fala já é dele).
    return NextResponse.json({ passed: true });
  }

  const systemInstruction = buildSystemInstruction({
    persona,
    mode,
    participantIds,
    mustRespond,
    round,
    agendaContext,
  });

  try {
    const raw = await generateWithGemini({
      systemInstruction,
      contents,
      temperature: persona.temperature,
    });

    const text = cleanReply(raw, persona);

    if (isPass(text) || !text) {
      if (mode === 'group') return NextResponse.json({ passed: true });
      return NextResponse.json({ error: 'O modelo não devolveu uma resposta utilizável.' }, { status: 502 });
    }

    return NextResponse.json({ passed: false, text });
  } catch (err) {
    const status = err instanceof GeminiError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error(`[council/reply:${persona.id}]`, message);
    return NextResponse.json({ error: message }, { status: status >= 400 ? status : 500 });
  }
}
