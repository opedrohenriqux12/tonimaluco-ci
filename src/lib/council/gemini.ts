/**
 * Cliente Gemini — SOMENTE servidor (lê process.env.GEMINI_API_KEY).
 *
 * Não existe fallback de texto aqui: se o Gemini falhar, o erro sobe com a mensagem real
 * para a rota, que devolve HTTP de erro. A interface mostra a falha como falha, em vez de
 * mascarar com uma frase pronta (foi isso que escondeu o 404 de modelo descontinuado).
 */

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/** Modelo configurável por env (GEMINI_MODEL) sem precisar mexer no código. */
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

export interface GeminiContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GenerateOptions {
  systemInstruction: string;
  contents: GeminiContent[];
  temperature?: number;
  maxOutputTokens?: number;
  /** Quando presente, força saída JSON com o schema informado. */
  responseSchema?: Record<string, unknown>;
}

export class GeminiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface GeminiPart {
  text?: string;
  thought?: boolean;
}

export async function generateWithGemini(opts: GenerateOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError('GEMINI_API_KEY não está configurada no servidor.', 500);
  }

  const generationConfig: Record<string, unknown> = {
    // Teto alto de propósito: o tamanho curto vem do prompt, não de truncar a saída.
    maxOutputTokens: opts.maxOutputTokens ?? 8192,
    thinkingConfig: { thinkingLevel: process.env.GEMINI_THINKING_LEVEL || 'low' },
  };
  if (opts.temperature !== undefined) generationConfig.temperature = opts.temperature;
  if (opts.responseSchema) {
    generationConfig.responseMimeType = 'application/json';
    generationConfig.responseSchema = opts.responseSchema;
  }

  const res = await fetch(`${API_BASE}/${GEMINI_MODEL}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Chave no header (não na URL) para não aparecer em logs de requisição.
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.systemInstruction }] },
      contents: opts.contents,
      generationConfig,
    }),
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.error?.message || `HTTP ${res.status}`;
    throw new GeminiError(`Gemini (${GEMINI_MODEL}): ${msg}`, res.status);
  }

  const candidate = data?.candidates?.[0];
  const parts: GeminiPart[] = candidate?.content?.parts ?? [];
  const text = parts
    .filter((p) => !p.thought && typeof p.text === 'string')
    .map((p) => p.text)
    .join('');

  if (!text.trim()) {
    const reason = candidate?.finishReason ?? data?.promptFeedback?.blockReason ?? 'desconhecido';
    throw new GeminiError(`Gemini (${GEMINI_MODEL}) devolveu resposta vazia (motivo: ${reason}).`, 502);
  }

  return text;
}
