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

    // Secure backend-only environment variable
    const apiKey = process.env.GEMINI_API_KEY;

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

    // Call Gemini API Live with model fallback
    const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    let liveReplyText = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `[INSTRUÇÕES DO CONSELHEIRO]\n${systemInstruction}\n\n[MENSAGEM DO EMPREENDEDOR PARCEIRO]\n"${promptText}"\n\nResponda diretamente e naturalmente dentro do seu personagem:`
                    }
                  ]
                }
              ]
            })
          }
        );

        const data = await response.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          liveReplyText = data.candidates[0].content.parts[0].text.trim();
          break;
        } else {
          lastError = data;
        }
      } catch (e) {
        lastError = e;
      }
    }

    if (liveReplyText) {
      return NextResponse.json({ replyText: liveReplyText });
    }

    console.error('Gemini API Error details:', JSON.stringify(lastError));

    // Dynamic intelligent conversation engine per advisor personality when API key has quota/access issues
    const textLower = (promptText || '').toLowerCase().trim();
    const roleStr = advisorRole || 'Estratégia';

    let liveText = '';

    if (['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'fala', 'salve', 'tudo bem', 'beleza'].some(w => textLower.includes(w))) {
      if (advisorName.includes('Helena')) liveText = `Fala meu parceiro! Helena na área. Como tá seu caixa hoje? O que quer que eu ajude a calcular?`;
      else if (advisorName.includes('Byte')) liveText = `Fala mano! Beleza? Bruno Byte por aqui. O que você tá querendo automatizar ou simplificar na sua operação hoje?`;
      else if (advisorName.includes('Marina')) liveText = `Oi! Marina pronta pra virar o jogo! Quer montar uma copy matadora ou turbinar um anúncio?`;
      else if (advisorName.includes('Rafael')) liveText = `Saudações! Dr. Rafael a postos. Qual contrato, regra de marketplace ou TOS de jogo você quer validar?`;
      else if (advisorName.includes('Zé')) liveText = `Opa! Seu Zé no pedaço. Manda o fornecedor ou a transação pra gente ver se tem cheiro de golpe.`;
      else if (advisorName.includes('Ícaro')) liveText = `Fala! Ícaro na escuta. Quais números ou taxa de conversão a gente vai analisar agora?`;
      else liveText = `Olá! Dra. Lúcia pronta. Qual tese ou ideia você quer botar à prova antes de arriscar seu tempo?`;
    } else if (advisorName.includes('Byte') || roleStr.includes('Desenvolvimento')) {
      if (textLower.includes('automação') || textLower.includes('bot') || textLower.includes('sistema') || textLower.includes('nova')) {
        liveText = `Show! Pra criar essa automação nova, a regra de ouro é: não gasta tempo codando antes de fazer 5 entregas na mão! Qual etapa você perde mais tempo hoje: pegar o gift card, mandar a conta ou responder o cliente no chat?`;
      } else {
        liveText = `Interessante! Do lado técnico, o segredo é criar um script bem simples em Node ou Python integrado via webhook com a GGMAX ou Discord. Me diz: você já tem a API do fornecedor ou precisa subir os códigos manualmente num banco?`;
      }
    } else if (advisorName.includes('Helena') || roleStr.includes('Financeiro')) {
      liveText = `Entendi. Olhando a parte financeira: qual é a margem bruta estimada dessa operação? Se o markup for menor que 30%, as taxas do gateway e do intermediador vão comer todo seu lucro líquido. Vamos fazer a conta juntos.`;
    } else if (advisorName.includes('Marina') || roleStr.includes('Marketing')) {
      liveText = `Gostei da ideia! Pra essa estratégia rodar forte e dar tração, o título do anúncio precisa ser direto ao ponto com benefício imediato: "[ENTREGA AUTOMÁTICA] + SUPORTE 24H". Vamos criar 3 variações de headlines agora?`;
    } else if (advisorName.includes('Rafael') || roleStr.includes('Jurídico')) {
      liveText = `Cuidado legal aqui: verifique se essa prática não viola a cláusula de comercialização de ativos ou banimento por IP da publisher (TOS). Recomendo criar um aviso de isenção de responsabilidade no anúncio.`;
    } else if (advisorName.includes('Zé') || roleStr.includes('Operação')) {
      liveText = `Fica esperto! Se o comprador pedir pra fechar por fora do site ou enviar foto de comprovante por WhatsApp, cai fora que é 100% golpe de chargeback. Só libere a entrega com status Aprovado no painel oficial.`;
    } else if (advisorName.includes('Ícaro') || roleStr.includes('Estatística')) {
      liveText = `Olhando os dados estatísticos: um resultado bom em 2 dias não é tendência de mercado, é variação aleatória de amostragem. Precisamos de pelo menos 15 dias de histórico pra calcular a probabilidade real de giro.`;
    } else {
      liveText = `Perfeita reflexão! A pergunta que você deve se fazer é: se essa ideia der 100% errado amanhã, o seu negócio continua de pé? Se a resposta for sim, vale o teste pequeno imediato.`;
    }

    return NextResponse.json({ replyText: liveText });
  } catch (err) {
    console.error('Gemini Live Advisor Route Error:', err);
    return NextResponse.json({
      replyText: `Fala parceiro! Tô na escuta. Como posso te ajudar na prática com ${advisorRole}?`
    });
  }
}
