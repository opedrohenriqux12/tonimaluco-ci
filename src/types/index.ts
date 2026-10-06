export interface ProductOpportunity {
  id: string;
  name: string;
  category: 'Contas' | 'Moedas' | 'Skins' | 'Gift Cards' | 'Serviços';
  game: string;
  score: number; // 0-100
  verdict: 'INVESTIR' | 'TESTAR' | 'EVITAR';
  avgPriceBrl: number;
  estimatedMarginPercent: number;
  netProfitBrl: number;
  costBrl: number;
  demandTrend: 'subindo' | 'estavel' | 'caindo';
  competitionLevel: 'baixa' | 'media' | 'alta' | 'guerra_de_preco';
  liquidityDays: number;
  riskLevel: 'baixo' | 'medio' | 'alto';
  riskFactors: string[];
  reasoning: string;
  confidenceScore: number; // 0-100
  sources: string[];
  lastUpdated: string;
}

export interface PlatformFee {
  id: string;
  name: string;
  fixedFeeBrl: number;
  percentageFee: number;
  withdrawalFeeBrl: number;
}

export interface SalesScript {
  id: string;
  title: string;
  channel: 'Marketplace Chat' | 'WhatsApp' | 'Discord' | 'Instagram DM';
  tone: 'Gamer' | 'Direto' | 'Urgente';
  objection: string;
  scriptText: string;
  successRatePercent: number;
  tags: string[];
}

export interface AdvisoryMember {
  id: string;
  name: string;
  role: string;
  personality: string;
  signatureQuestion: string;
  color: string;
  hardnessLevel?: 'cordial' | 'firme' | 'implacável';
  vote?: 'APOIA' | 'COM CONDIÇÕES' | 'CONTRA';
  conviction?: 'baixo' | 'médio' | 'alto';
  opinion?: string;
  conditionToChange?: string;
  keyRiskAlert?: string;
  sourceCited?: string;
}

export interface CouncilMeetingAta {
  id: string;
  productName: string;
  date: string;
  suggestedVerdict: 'INVESTIR' | 'TESTAR' | 'EVITAR';
  votesSummary: { apoia: number; comCondicoes: number; contra: number };
  mainRisks: string[];
  requiredConditions: string[];
  advisorsOpinions: { name: string; role: string; vote: string; opinion: string }[];
  preMortemScenarios: string[];
  nextSteps: string[];
}
