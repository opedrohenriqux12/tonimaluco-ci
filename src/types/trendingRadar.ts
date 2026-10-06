export type TopicClassification = 'FATO' | 'ESTIMATIVA' | 'ESPECULACAO';
export type TopicStage = 'NASCENDO' | 'ACELERANDO' | 'NO_PICO' | 'ESFRIANDO';
export type ImpactLevel = 'baixo' | 'medio' | 'alto';
export type Horizon = 'CURTO' | 'MÉDIO' | 'LONGO';
export type RumorStatus = 'CONFIRMADO' | 'NÃO CONFIRMADO';
export type DateCertainty = 'CONFIRMADA' | 'ESTIMADA' | 'RUMOR';

export interface TrendingTopic {
  id: string;
  title: string;
  source: string;
  ageHours: number;
  volume: number;
  crescimentoPct: number;
  stage: TopicStage;
  relatedProducts: string[];
  impactLevel: ImpactLevel;
  impactRange: string;
  scoreTendencia: number; // 0-100
  classification: TopicClassification;
  suggestedAction: string;
  whyItMatters: string;
  whyTrap: string;
  niche: 'games' | 'streaming' | 'softwares' | 'gift_cards' | 'redes_sociais';
  region: 'Brasil' | 'Global';
  confidenceScore: number;
  sources: string[];
  sparklineData: number[];
  isPinned?: boolean;
}

export interface WeakSignal {
  id: string;
  title: string;
  intensity: 'baixa' | 'media' | 'alta';
  observationDays: number;
  independentSourcesCount: number;
  rumorStatus: RumorStatus;
  niche: string;
  details: string;
}

export interface RadarEvent {
  id: string;
  title: string;
  date: string;
  certainty: DateCertainty;
  horizon: Horizon;
  affectedProducts: string[];
  expectedImpact: string;
  suggestedWindow: string;
}

export interface ScenarioDefinition {
  priceChangePct: number;
  volumeChangePct: number;
  platformFeePct: number;
  supplierDelayDays: number;
  projectedNetMargin: number;
  projectedScore: number;
  projectedVerdict: 'INVESTIR' | 'TESTAR' | 'EVITAR';
}

export interface RadarPrediction {
  id: string;
  title: string;
  horizon: Horizon;
  probabilityPercent: number;
  probabilityInterval: string;
  impactDemandRange: string;
  impactPriceRange: string;
  entryWindow: { startDay: number; endDay: number; label: string };
  exitWindow: { startDay: number; endDay: number; label: string };
  premisses: string[];
  reevaluationTriggers: string[];
  confidenceScore: number;
  sources: string[];
  sampleSize: number;
  rumorStatus: RumorStatus;
  scenarios: {
    otimista: ScenarioDefinition;
    base: ScenarioDefinition;
    pessimista: ScenarioDefinition;
  };
}

export interface HistoricalAccuracy {
  id: string;
  predictionTitle: string;
  predictedOutcome: string;
  actualOutcome: string;
  brierScore: number;
  isHit: boolean;
  category: string;
  horizon: Horizon;
}
