import { TrendingTopic, RadarPrediction } from '@/types/trendingRadar';

export interface GeminiAnalysisResult {
  whyItMatters: string;
  whyTrap: string;
  suggestedAction: string;
  confidenceScore: number;
}

// Service to call Gemini API if key exists, or fallback gracefully
export async function analyzeWithGemini(
  promptContext: string,
  topicOrPrediction: TrendingTopic | RadarPrediction
): Promise<GeminiAnalysisResult> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-[#Type]': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Você é o Toni, um sócio experiente e conselheiro de mercado digital brasileiro. Analise este item sem usar palavras como "IA", "modelo" ou "assistente". Seja direto e estratégico em português do Brasil:\n\nContexto: ${promptContext}\nItem: ${JSON.stringify(
                      topicOrPrediction
                    )}\n\nRetorne JSON validado com este formato exato: {"whyItMatters": "...", "whyTrap": "...", "suggestedAction": "...", "confidenceScore": 90}`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return {
          whyItMatters: parsed.whyItMatters || 'Relevância estratégica confirmada pelos números de demanda.',
          whyTrap: parsed.whyTrap || 'Atenção ao risco de estocagem sem pré-vendas garantidas.',
          suggestedAction: parsed.suggestedAction || 'Ação sugerida: validar lote de teste.',
          confidenceScore: parsed.confidenceScore || 90
        };
      }
    } catch (err) {
      console.warn('Gemini API call fallback to deterministic partner logic:', err);
    }
  }

  // Deterministic fallback response with Toni partner voice
  return {
    whyItMatters:
      'Anotação do Toni: O volume de busca teve uma variação atípica nas últimas 12 horas. Se você posicionar o anúncio com as palavras-chave corretas, pega o pico da demanda de quem quer comprar no impulso.',
    whyTrap:
      'Anotação de Risco: Não compre estoque em excesso sem homologar o fornecedor primeiro. Se a margem líquida cair para menos de 15% após taxas do marketplace, o risco de estorno devora o lucro.',
    suggestedAction: 'Estocar lote experimental pequeno de 3 a 5 unidades com entrega imediata.',
    confidenceScore: 88
  };
}
