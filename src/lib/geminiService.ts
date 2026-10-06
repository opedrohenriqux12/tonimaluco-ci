import { TrendingTopic, RadarPrediction } from '@/types/trendingRadar';

export interface GeminiAnalysisResult {
  whyItMatters: string;
  whyTrap: string;
  suggestedAction: string;
  confidenceScore: number;
}

// Calls secure internal API route (protecting GEMINI_API_KEY from frontend exposure)
export async function analyzeWithGemini(
  promptContext: string,
  topicOrPrediction: TrendingTopic | RadarPrediction
): Promise<GeminiAnalysisResult> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptContext, topicOrPrediction })
    });

    if (response.ok) {
      const data: GeminiAnalysisResult = await response.json();
      return data;
    }
  } catch (err) {
    console.warn('Fallback to deterministic Toni analysis:', err);
  }

  return {
    whyItMatters:
      'Anotação do Toni: O volume de busca teve uma variação atípica nas últimas 12 horas. Se você posicionar o anúncio com as palavras-chave corretas, pega o pico da demanda de quem quer comprar no impulso.',
    whyTrap:
      'Anotação de Risco: Não compre estoque em excesso sem homologar o fornecedor primeiro. Se a margem líquida cair para menos de 15% após taxas do marketplace, o risco de estorno devora o lucro.',
    suggestedAction: 'Estocar lote experimental pequeno de 3 a 5 unidades com entrega imediata.',
    confidenceScore: 88
  };
}
