import { AdvisoryMember, ProductOpportunity, CouncilMeetingAta } from '@/types';
import { MOCK_ADVISORS } from '@/data/mockData';

export interface DynamicAnswer {
  advisorName: string;
  role: string;
  color: string;
  vote: 'APOIA' | 'COM CONDIÇÕES' | 'CONTRA';
  answerText: string;
  signatureQuestion: string;
}

// Function to generate dynamic advisor responses based on the EXACT user prompt
export function generateDynamicCouncilAnswers(
  userQuestion: string,
  productContext?: ProductOpportunity | null
): DynamicAnswer[] {
  const qLower = userQuestion.toLowerCase();

  // Helper for keyword detection
  const isAboutMarginOrMoney = qLower.includes('lucro') || qLower.includes('preço') || qLower.includes('margem') || qLower.includes('dinheiro') || qLower.includes('investir') || qLower.includes('custo') || qLower.includes('quanto');
  const isAboutLegalOrRules = qLower.includes('ban') || qLower.includes('regra') || qLower.includes('termo') || qLower.includes('lei') || qLower.includes('seguro') || qLower.includes('processo') || qLower.includes('recupera');
  const isAboutRiskOrFraud = qLower.includes('golpe') || qLower.includes('fornecedor') || qLower.includes('chargeback') || qLower.includes('calote') || qLower.includes('cartão') || qLower.includes('confiável');
  const isAboutSalesOrAd = qLower.includes('anúncio') || qLower.includes('vender') || qLower.includes('copy') || qLower.includes('cliente') || qLower.includes('discord') || qLower.includes('whatsapp') || qLower.includes('titulo');

  return [
    // 1. Dra. Helena (Financeiro)
    {
      advisorName: 'Dra. Helena Cordeiro',
      role: 'Financeiro & Caixa',
      color: '#D8432B',
      signatureQuestion: 'Quanto você aguenta perder sem quebrar o caixa?',
      vote: isAboutMarginOrMoney ? 'COM CONDIÇÕES' : 'APOIA',
      answerText: `Analisando sua pergunta: "${userQuestion}" → Direto ao ponto: qualquer movimento que trave mais de 20% do seu caixa em estoque por mais de 5 dias é um tiro no pé. Se for fazer isso, exija no mínimo 25% de margem líquida real descontando taxas de intermediadores!`
    },
    // 2. Dr. Rafael (Jurídico)
    {
      advisorName: 'Dr. Rafael Menezes',
      role: 'Jurídico & Compliance',
      color: '#8A8578',
      signatureQuestion: 'Isso é permitido pelas regras da plataforma e pela lei?',
      vote: isAboutLegalOrRules ? 'CONTRA' : 'COM CONDIÇÕES',
      answerText: `Sobre "${userQuestion}": Lembre-se que termos de TOS da Riot, Epic e Steam proíbem comercialização de contas sem transferência do e-mail de criação (OGE). Se você não colocar um aviso legal claro no chat do anúncio, responde por vício do produto no CDC.`
    },
    // 3. Bruno "Byte" (Automação & Dev)
    {
      advisorName: 'Bruno "Byte" Takahashi',
      role: 'Desenvolvimento & Automação',
      color: '#E0A526',
      signatureQuestion: 'Isso precisa ser construído agora ou dá para validar na mão primeiro?',
      vote: 'APOIA',
      answerText: `Respondendo: "${userQuestion}" → Não invente moda automatizando entrega agora. Teste na mão enviando o e-mail no chat do GGMAX ou WhatsApp durante 3 dias. Se validar giro, aí sim pensamos em bot.`
    },
    // 4. Prof. Ícaro (Estatística)
    {
      advisorName: 'Prof. Ícaro Valadares',
      role: 'Estatística & Projeção',
      color: '#3B82F6',
      signatureQuestion: 'Esse resultado é padrão ou foi sorte?',
      vote: 'COM CONDIÇÕES',
      answerText: `Diante de "${userQuestion}": Cuidado com o viés da pequena amostra. Três vendas rápidas não provam tendência de longo prazo. Trabalhe com margem de erro de 15% para variação de preços no final de semana.`
    },
    // 5. Marina Duarte (Marketing & Growth)
    {
      advisorName: 'Marina Duarte',
      role: 'Marketing, Vendas & Growth',
      color: '#1F6B4F',
      signatureQuestion: 'Quem exatamente compra isso e por que compraria de você?',
      vote: isAboutSalesOrAd ? 'APOIA' : 'COM CONDIÇÕES',
      answerText: `Sobre sua dúvida "${userQuestion}": Isso vende igual água se o título for matador! Exemplo: coloque "[PRONTA ENTREGA] + OGE INCLUSO + SUPORTE 24H". O público gamer compra na hora pelo sentimento de urgência e segurança.`
    },
    // 6. Seu Zé Antunes (Antifraude)
    {
      advisorName: 'Seu Zé Antunes',
      role: 'Operação & Antifraude',
      color: '#D97706',
      signatureQuestion: 'O que acontece se esse fornecedor sumir amanhã?',
      vote: isAboutRiskOrFraud ? 'CONTRA' : 'COM CONDIÇÕES',
      answerText: `Presta atenção no que perguntou: "${userQuestion}". Comprador com conta recém-criada pedindo desconto por fora é 90% de chance de calote ou chargeback de cartão clonado. Nunca entregue o item antes do status 'Aprovado'!`
    },
    // 7. Dra. Lúcia Prado (Psicologia)
    {
      advisorName: 'Dra. Lúcia Prado',
      role: 'Psicologia de Decisão & Advogada do Diabo',
      color: '#8B5CF6',
      signatureQuestion: 'Qual é a versão mais forte do argumento contrário à sua ideia?',
      vote: 'COM CONDIÇÕES',
      answerText: `Você me perguntou: "${userQuestion}". Pergunta incômoda: você quer fazer isso porque realmente os números provam ou apenas por empolgação/medo de ficar de fora (FOMO)? Escreva o pior cenário antes de decidir.`
    }
  ];
}
