import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let promptText = '';
  let advisorName = '';
  let advisorRole = '';
  let signatureQuestion = '';

  try {
    const body = await request.json();
    promptText = body.promptText || '';
    advisorName = body.advisorName || 'Conselheiro';
    advisorRole = body.advisorRole || 'Mercado Digital';
    signatureQuestion = body.signatureQuestion || 'Qual o impacto disso no negócio?';

    // Secure backend-only environment variable or fallback
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const systemInstruction = `Você é ${advisorName}, especialista em ${advisorRole}.
Sua personalidade é: ${body.personality || 'Direto e estratégico'}.
Sua pergunta-chave de perspectiva é: "${signatureQuestion}".

DIRETRIZES DE RESPOSTA AO VIVO:
1. NUNCA use modelos de respostas prontas, templates engessados ou repetitivos ("Sobre sua dúvida...", "Analisando...").
2. NUNCA diga que é uma IA, assistente virtual, robô ou modelo de linguagem.
3. Responda DIRETAMENTE e NATURALMENTE como uma pessoa real e sócia do usuário em tempo real.
4. Se o usuário mandar um cumprimento ("olá", "oi", "tudo bem"), responda o cumprimento de forma natural dentro do seu personagem, perguntando o que vão analisar hoje.
5. Mantenha as respostas objetivas, em português do Brasil, em 2 a 4 frases.`;

    if (!apiKey) {
      // Intelligent specialized fallback per advisor role when no API Key is set
      const textLower = (promptText || '').toLowerCase().trim();
      const roleStr = advisorRole || 'Estratégia';
      const questionStr = signatureQuestion || 'Qual o impacto no negócio?';

      let liveText = '';

      if (['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'fala', 'salve', 'ok'].includes(textLower)) {
        liveText = `Fala, parceiro! Na área como especialista em ${roleStr}. Vamos avaliar o que hoje? Lembre-se: ${questionStr}`;
      } else if (advisorRole?.includes('Financeiro') || advisorName?.includes('Helena')) {
        liveText = `Olhando como Financeira: sobre "${promptText}", verifique se isso compromete mais de 15% do seu caixa livre. Se o ROI estimado for menor que 20%, nem entre na operação. ${questionStr}`;
      } else if (advisorRole?.includes('Jurídico') || advisorName?.includes('Rafael')) {
        liveText = `Ponto crítico de Compliance: para "${promptText}", tome cuidado com os Termos de Serviço (TOS) da publisher e proteção contra sanções. Sempre documente o comprovante no chat. ${questionStr}`;
      } else if (advisorRole?.includes('Desenvolvimento') || advisorName?.includes('Byte')) {
        liveText = `Visão Técnica: em relação a "${promptText}", não crie automação complexa agora. Faça o processo manual nas primeiras 5 vendas para mapear onde o cliente trava. ${questionStr}`;
      } else if (advisorRole?.includes('Estatística') || advisorName?.includes('Ícaro')) {
        liveText = `Análise de Dados: sobre "${promptText}", cuidado com amostragem pequena. Precisamos de histórico de pelo menos 14 dias antes de projetar margem ou volume constante. ${questionStr}`;
      } else if (advisorRole?.includes('Marketing') || advisorName?.includes('Marina')) {
        liveText = `Visão de Vendas & Growth: para "${promptText}", foque num título com gatilhos de urgência e prova social! Destaque entrega imediata e garantia no anúncio. ${questionStr}`;
      } else if (advisorRole?.includes('Operação') || advisorName?.includes('Zé')) {
        liveText = `Alerta Antifraude: sobre "${promptText}", atente-se a contas recém-criadas ou pedidos fora da plataforma. Nunca envie o produto sem aprovação confirmada no painel! ${questionStr}`;
      } else if (advisorRole?.includes('Psicologia') || advisorName?.includes('Lúcia')) {
        liveText = `Advogada do Diabo: sobre "${promptText}", pergunto: você está tomando essa decisão por números reais ou movido pelo medo de perder a onda (FOMO)? ${questionStr}`;
      } else {
        liveText = `Sob a perspectiva de ${roleStr}: para "${promptText}", analise riscos e valide em lote menor. ${questionStr}`;
      }

      return NextResponse.json({ replyText: liveText });
    }

    // Call Gemini API Live (v1beta gemini-1.5-flash or gemini-2.0-flash)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemInstruction}\n\nMensagem ao vivo do usuário: "${promptText}"\n\nSua resposta direta:`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const liveReplyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (liveReplyText) {
      return NextResponse.json({ replyText: liveReplyText.trim() });
    }

    console.error('Gemini API Error details:', JSON.stringify(data));
    throw new Error('Gemini API return format mismatch');
  } catch (err) {
    console.error('Gemini Live Advisor Route Error:', err);
    
    const roleStr = advisorRole || 'Conselho';
    const questionStr = signatureQuestion || 'Qual o impacto disso no negócio?';
    
    return NextResponse.json({
      replyText: `Analisando sob a perspectiva de ${roleStr}: em relação a "${promptText}", precisamos agir com cautela. ${questionStr}`
    });
  }
}
