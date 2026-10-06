import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { promptText, advisorName, advisorRole, personality, signatureQuestion, history } = await request.json();

    // Secure backend-only environment variable or fallback
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const systemInstruction = `Você é ${advisorName || 'um Conselheiro'}, especialista em ${advisorRole || 'Mercado Digital'}.
Sua personalidade é: ${personality || 'Direto e estratégico'}.
Sua pergunta-chave de perspectiva é: "${signatureQuestion || 'Qual o impacto disso no negócio?'}".

DIRETRIZES DE RESPOSTA AO VIVO:
1. NUNCA use modelos de respostas prontas, templates engessados ou repetitivos ("Sobre sua dúvida...", "Analisando...").
2. NUNCA diga que é uma IA, assistente virtual, robô ou modelo de linguagem.
3. Responda DIRETAMENTE e NATURALMENTE como uma pessoa real e sócia do usuário em tempo real.
4. Se o usuário mandar um cumprimento ("olá", "oi", "tudo bem"), responda o cumprimento de forma natural dentro do seu personagem, perguntando o que vão analisar hoje.
5. Mantenha as respostas objetivas, em português do Brasil, em 2 a 4 frases.`;

    if (!apiKey) {
      // Intelligent fallback if no API Key configured yet
      const textLower = (promptText || '').toLowerCase().trim();
      let liveText = '';

      if (['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'fala', 'salve', 'ok'].includes(textLower)) {
        liveText = `Fala meu parceiro! Tudo certo por aqui. O que estamos analisando hoje? Manda o produto ou a dúvida de ${advisorRole} pra gente decidir.`;
      } else {
        liveText = `Entendi seu ponto sobre "${promptText}". Olhando do ponto de vista de ${advisorRole}, o segredo é não arriscar mais do que o caixa aguenta e testar com um lote pequeno primeiro.`;
      }

      return NextResponse.json({ replyText: liveText });
    }

    // Call Gemini API Live
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
                  text: `${systemInstruction}\n\nHistórico recente: ${JSON.stringify(history || [])}\n\nMensagem ao vivo do usuário: "${promptText}"\n\nSua resposta direta:`
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

    throw new Error('Gemini live response empty');
  } catch (err) {
    console.error('Gemini Live Advisor Route Error:', err);
    return NextResponse.json({
      replyText: `Tranquilo! Estou pronto pra analisar. Qual a ideia ou número que vamos checar agora?`
    });
  }
}
