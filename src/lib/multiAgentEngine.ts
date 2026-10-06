import { AdvisoryMember, ProductOpportunity, CouncilMeetingAta } from '@/types';
import { MOCK_ADVISORS } from '@/data/mockData';

export interface MultiAgentEvaluationResult {
  product: ProductOpportunity;
  overallVerdict: 'INVESTIR' | 'TESTAR' | 'EVITAR';
  confidenceScore: number;
  advisors: AdvisoryMember[];
  ata: CouncilMeetingAta;
}

export function runMultiAgentCouncilEvaluation(
  product: ProductOpportunity,
  customCost?: number,
  customPrice?: number
): MultiAgentEvaluationResult {
  const cost = customCost ?? product.costBrl;
  const price = customPrice ?? product.avgPriceBrl;
  const grossMarginBrl = price - cost;
  const platformFeeBrl = price * 0.12 + 1.0;
  const netProfit = grossMarginBrl - platformFeeBrl;
  const netMarginPercent = price > 0 ? (netProfit / price) * 100 : 0;

  // 1. Dra. Helena Cordeiro (Financeiro)
  let helenaVote: 'APOIA' | 'COM CONDIÇÕES' | 'CONTRA' = 'CONTRA';
  let helenaOpinion = '';
  if (netMarginPercent >= 30) {
    helenaVote = 'APOIA';
    helenaOpinion = `Margem líquida de ${netMarginPercent.toFixed(1)}% (R$ ${netProfit.toFixed(2)}) preserva o fluxo de caixa mesmo com variações de taxa.`;
  } else if (netMarginPercent >= 15) {
    helenaVote = 'COM CONDIÇÕES';
    helenaOpinion = `Margem de ${netMarginPercent.toFixed(1)}% é aceitável, mas exige giro alto em menos de 3 dias para não travar o capital de giro.`;
  } else {
    helenaVote = 'CONTRA';
    helenaOpinion = `Margem de ${netMarginPercent.toFixed(1)}% é inaceitável. O custo de oportunidade e o risco de estorno queimam seu caixa.`;
  }

  // 2. Dr. Rafael Menezes (Jurídico)
  let rafaelVote: 'APOIA' | 'COM CONDIÇÕES' | 'CONTRA' = 'COM CONDIÇÕES';
  let rafaelOpinion = '';
  if (product.category === 'Contas') {
    rafaelOpinion = 'Vender contas pode violar Termos de Serviço se não houver transferência integral do e-mail de criação (OGE). Inclua termo de isenção de responsabilidade.';
    rafaelVote = 'COM CONDIÇÕES';
  } else {
    rafaelVote = 'APOIA';
    rafaelOpinion = 'Item digital padrão sem impedimentos legais diretos nas plataformas homologadas.';
  }

  // 3. Bruno "Byte" Takahashi (Automação & Dev)
  let byteVote: 'APOIA' | 'COM CONDIÇÕES' | 'CONTRA' = 'APOIA';
  let byteOpinion = 'Valide com estoque manual de 3 a 5 unidades antes de investir em bots de entrega automática.';

  // 4. Prof. Ícaro Valadares (Estatística & Monte Carlo)
  let icaroVote: 'APOIA' | 'COM CONDIÇÕES' | 'CONTRA' = 'COM CONDIÇÕES';
  let icaroOpinion = `Amostra de mercado de ${product.confidenceScore}% de confiança. Na simulação de Monte Carlo, se o preço cair 10%, seu retorno reduz em 35%.`;

  // 5. Marina Duarte (Marketing & Vendas)
  let marinaVote: 'APOIA' | 'COM CONDIÇÕES' | 'CONTRA' = 'APOIA';
  let marinaOpinion = `Produto em tendência ${product.demandTrend}. O gancho de anúncio para público gamer deve focar na entrega imediata em menos de 10 minutos.`;

  // 6. Seu Zé Antunes (Operação & Antifraude)
  let zeVote: 'APOIA' | 'COM CONDIÇÕES' | 'CONTRA' = product.riskLevel === 'alto' ? 'CONTRA' : 'COM CONDIÇÕES';
  let zeOpinion = `Fornecedor precisa passar pela checagem de 30 dias de histórico. Alerta para chargeback de compradores com contas recém-criadas.`;

  // 7. Dra. Lúcia Prado (Advogada do Diabo & Psicologia)
  let luciaVote: 'APOIA' | 'COM CONDIÇÕES' | 'CONTRA' = 'COM CONDIÇÕES';
  let luciaOpinion = `Cuidado com a 'ancoragem do ganho fácil'. Você está entusiasmado com o score de ${product.score}, mas desconsiderou a liquidez real de ${product.liquidityDays} dias.`;

  const updatedAdvisors: AdvisoryMember[] = [
    { ...MOCK_ADVISORS[0], vote: helenaVote, conviction: 'alto', opinion: helenaOpinion, conditionToChange: 'Margem líquida comprovada > 25%' },
    { ...MOCK_ADVISORS[1], vote: rafaelVote, conviction: 'alto', opinion: rafaelOpinion, conditionToChange: 'Anúncio com termo de isenção de responsabilidade' },
    { ...MOCK_ADVISORS[2], vote: byteVote, conviction: 'médio', opinion: byteOpinion, conditionToChange: 'Estoque inicial pequeno sem automação' },
    { ...MOCK_ADVISORS[3], vote: icaroVote, conviction: 'alto', opinion: icaroOpinion, conditionToChange: 'Amostra de vendas dos últimos 30 dias' },
    { ...MOCK_ADVISORS[4], vote: marinaVote, conviction: 'alto', opinion: marinaOpinion, conditionToChange: 'Uso do script otimizado no chat' },
    { ...MOCK_ADVISORS[5], vote: zeVote, conviction: 'alto', opinion: zeOpinion, conditionToChange: 'Checagem de reputação do fornecedor' },
    { ...MOCK_ADVISORS[6], vote: luciaVote, conviction: 'médio', opinion: luciaOpinion, conditionToChange: 'Teste Pré-Mortem concluído' }
  ];

  // Count Votes
  const apoiaCount = updatedAdvisors.filter(a => a.vote === 'APOIA').length;
  const comCondicoesCount = updatedAdvisors.filter(a => a.vote === 'COM CONDIÇÕES').length;
  const contraCount = updatedAdvisors.filter(a => a.vote === 'CONTRA').length;

  let finalVerdict: 'INVESTIR' | 'TESTAR' | 'EVITAR' = 'TESTAR';
  if (contraCount >= 3 || netMarginPercent < 10) {
    finalVerdict = 'EVITAR';
  } else if (apoiaCount >= 4 && netMarginPercent >= 25) {
    finalVerdict = 'INVESTIR';
  }

  const ata: CouncilMeetingAta = {
    id: `ata_${Date.now()}`,
    productName: product.name,
    date: new Date().toLocaleDateString('pt-BR'),
    suggestedVerdict: finalVerdict,
    votesSummary: { apoia: apoiaCount, comCondicoes: comCondicoesCount, contra: contraCount },
    mainRisks: product.riskFactors,
    requiredConditions: [
      'Margem líquida mantida acima de 20%',
      'Transferência comprovada de e-mail de criação (OGE)',
      'Fornecedor com nota 4.8+ em marketplaces'
    ],
    advisorsOpinions: updatedAdvisors.map(a => ({
      name: a.name,
      role: a.role,
      vote: a.vote || 'COM CONDIÇÕES',
      opinion: a.opinion || ''
    })),
    preMortemScenarios: [
      'Recuperação da conta pelo fornecedor após 45 dias',
      'Aumento na taxa de saque e intermediação da plataforma',
      'Saturação da oferta com robôs abaixando os preços'
    ],
    nextSteps: [
      'Gerar variações de anúncios pelo Clonador',
      'Configurar alertas de variação de preço na Watchlist',
      'Testar lote piloto com no máximo 3 unidades'
    ]
  };

  return {
    product,
    overallVerdict: finalVerdict,
    confidenceScore: product.confidenceScore,
    advisors: updatedAdvisors,
    ata
  };
}
