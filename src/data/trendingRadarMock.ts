import {
  TrendingTopic,
  WeakSignal,
  RadarEvent,
  RadarPrediction,
  HistoricalAccuracy
} from '@/types/trendingRadar';

export const MOCK_TRENDING_TOPICS: TrendingTopic[] = [
  {
    id: 't1',
    title: 'Lançamento Global da Temporada V4 in-game Blox Fruits',
    source: 'Twitch / YouTube Gaming Feed',
    ageHours: 4,
    volume: 142000,
    crescimentoPct: 48.5,
    stage: 'NASCENDO',
    relatedProducts: ['Conta Roblox Blox Fruits Level Max', 'Kitsune Fruit Physical Key'],
    impactLevel: 'alto',
    impactRange: '+40% a +65% em vendas',
    scoreTendencia: 94,
    classification: 'FATO',
    suggestedAction: 'Estocar contas com V4 despertada antes do final de semana.',
    whyItMatters: 'O pico de busca de jovens no Brasil triplica nas primeiras 72 horas pós-update.',
    whyTrap: 'Se o fornecedor entregar contas sem pin resetado, o número de tickets no chat estoura.',
    niche: 'games',
    region: 'Brasil',
    confidenceScore: 96,
    sources: ['Twitch API v2', 'Google Trends BR', 'Discord Oficial Blox'],
    sparklineData: [20, 35, 45, 60, 85, 120, 180]
  },
  {
    id: 't2',
    title: 'Novo Ato de Valorant & Coleção de Vandal Saqueadora 2.0',
    source: 'Riot Games Official Feed',
    ageHours: 12,
    volume: 89000,
    crescimentoPct: 28.2,
    stage: 'ACELERANDO',
    relatedProducts: ['Conta Valorant Radiant/Imortal', 'Gift Card Riot Points R$ 100'],
    impactLevel: 'alto',
    impactRange: '+25% a +40% em buscas',
    scoreTendencia: 88,
    classification: 'FATO',
    suggestedAction: 'Criar anúncio focado no pase de batalha e skins OGE.',
    whyItMatters: 'Jogadores buscam comprar contas já ranqueadas para jogar no novo ato no primeiro dia.',
    whyTrap: 'Contas sem o e-mail de criação (OGE) sofrem recuperação frequente.',
    niche: 'games',
    region: 'Global',
    confidenceScore: 92,
    sources: ['Riot Games News Feed', 'Valorant Tracker API'],
    sparklineData: [40, 50, 55, 70, 90, 110, 130]
  },
  {
    id: 't3',
    title: 'Rumor: Promoção de Primavera Steam com Gift Cards com 15% Desconto',
    source: 'Forum Leaks Reddit / X',
    ageHours: 2,
    volume: 34000,
    crescimentoPct: 62.1,
    stage: 'NASCENDO',
    relatedProducts: ['Steam Wallet Gift Card R$ 100', 'Chave Global Steam'],
    impactLevel: 'medio',
    impactRange: '+15% a +30% volume',
    scoreTendencia: 72,
    classification: 'ESPECULACAO',
    suggestedAction: 'Aguardar confirmação oficial da Valve antes de fazer compra massiva.',
    whyItMatters: 'Descontos na Steam aquecem a venda de saldos por vendedores intermediários.',
    whyTrap: 'Se a promoção não se confirmar, você fica com estoque travado com margem de 4%.',
    niche: 'gift_cards',
    region: 'Global',
    confidenceScore: 55,
    sources: ['SteamDB Leaks', 'Twitter/X Community'],
    sparklineData: [10, 15, 25, 40, 70, 95, 120]
  },
  {
    id: 't4',
    title: 'Saturação de Vendedores de Passe Fortnite por Presente 3 Dias',
    source: 'GGMAX & Gamemarket Feed',
    ageHours: 48,
    volume: 12000,
    crescimentoPct: -18.4,
    stage: 'ESFRIANDO',
    relatedProducts: ['Passe de Batalha Fortnite Presente'],
    impactLevel: 'baixo',
    impactRange: '-20% em preço unitário',
    scoreTendencia: 31,
    classification: 'ESTIMATIVA',
    suggestedAction: 'Evitar novos lotes. Margem líquida caiu para menos de R$ 3,00.',
    whyItMatters: 'A exigência de 3 dias de amizade esgota a paciência dos clientes novos.',
    whyTrap: 'Alta taxa de reclamações e disputas no chat por demora na entrega.',
    niche: 'gift_cards',
    region: 'Brasil',
    confidenceScore: 89,
    sources: ['Marketplace Data Analytics'],
    sparklineData: [100, 95, 80, 65, 50, 40, 30]
  }
];

// Generate 21 additional mock trending topics to complete 25 as required
for (let i = 5; i <= 25; i++) {
  MOCK_TRENDING_TOPICS.push({
    id: `t${i}`,
    title: `Tópico de Mercado Exemplo #${i}: Evento & Lançamento Digital Gaming`,
    source: i % 2 === 0 ? 'Twitch Analytics' : 'Google Trends BR',
    ageHours: i * 3,
    volume: 15000 + i * 2500,
    crescimentoPct: Math.round((Math.sin(i) * 35 + 15) * 10) / 10,
    stage: i % 4 === 0 ? 'NASCENDO' : i % 4 === 1 ? 'ACELERANDO' : i % 4 === 2 ? 'NO_PICO' : 'ESFRIANDO',
    relatedProducts: [`Item Digital Gaming #${i}`, `Gift Card Promo #${i}`],
    impactLevel: i % 3 === 0 ? 'alto' : i % 3 === 1 ? 'medio' : 'baixo',
    impactRange: `+${10 + i}% a +${25 + i}%`,
    scoreTendencia: Math.min(98, Math.max(25, 50 + Math.floor(Math.sin(i) * 40))),
    classification: i % 3 === 0 ? 'FATO' : i % 3 === 1 ? 'ESTIMATIVA' : 'ESPECULACAO',
    suggestedAction: `Ação recomendada pelo Toni para o tópico #${i}: monitorar concorrência no GGMAX.`,
    whyItMatters: `Análise estratégica do Toni sobre por que o movimento #${i} afeta o mercado.`,
    whyTrap: `Aviso de risco do Toni para o tópico #${i}: não estocar em excesso sem pré-vendas.`,
    niche: i % 5 === 0 ? 'games' : i % 5 === 1 ? 'streaming' : i % 5 === 2 ? 'softwares' : i % 5 === 3 ? 'gift_cards' : 'redes_sociais',
    region: i % 2 === 0 ? 'Brasil' : 'Global',
    confidenceScore: 70 + (i % 25),
    sources: ['Feed Público de Notícias', 'Analytics GGMAX'],
    sparklineData: [10, 20, 30, 40, 35, 50, 65]
  });
}

export const MOCK_WEAK_SIGNALS: WeakSignal[] = [
  {
    id: 'ws1',
    title: 'Aumento anormal de wishlists para DLC de GTA VI',
    intensity: 'alta',
    observationDays: 14,
    independentSourcesCount: 5,
    rumorStatus: 'NÃO CONFIRMADO',
    niche: 'Games',
    details: 'Vazamentos em fóruns chineses mostram movimentação nas APIs de lojas de chaves digitais.'
  },
  {
    id: 'ws2',
    title: 'Mudança na política de taxas da Epic Games Store para Gift Cards',
    intensity: 'media',
    observationDays: 7,
    independentSourcesCount: 3,
    rumorStatus: 'CONFIRMADO',
    niche: 'Gift Cards',
    details: 'Comunicado oficial aos distribuidores autorizados prevê reajuste na taxa de saque.'
  },
  {
    id: 'ws3',
    title: 'Rumor de banamento em massa de contas Roblox com pin de e-mail temporário',
    intensity: 'alta',
    observationDays: 3,
    independentSourcesCount: 2,
    rumorStatus: 'NÃO CONFIRMADO',
    niche: 'Contas',
    details: 'Relatos no Discord de vendedores de contas sobre nova varredura de antifraude.'
  }
];

export const MOCK_RADAR_EVENTS: RadarEvent[] = [
  {
    id: 'ev1',
    title: 'Black Friday antecipada de Gift Cards Steam & Playstation',
    date: '15 de Novembro de 2026',
    certainty: 'CONFIRMADA',
    horizon: 'CURTO',
    affectedProducts: ['Gift Card PSN R$ 100', 'Steam Wallet'],
    expectedImpact: 'Aumento de 80% na demanda por saldos digitais',
    suggestedWindow: 'Comprar estoque entre 01 e 05 de Novembro'
  },
  {
    id: 'ev2',
    title: 'Lançamento da nova expansão in-game de World of Warcraft',
    date: '10 de Dezembro de 2026',
    certainty: 'ESTIMADA',
    horizon: 'MÉDIO',
    affectedProducts: ['WoW Gold', 'Time Card 30 dias'],
    expectedImpact: 'Dobro de procura por moedas virtuais',
    suggestedWindow: 'Entrar 15 dias antes, sair no dia do lançamento'
  }
];

export const MOCK_RADAR_PREDICTIONS: RadarPrediction[] = [
  {
    id: 'p1',
    title: 'Queda de 25% no preço de contas Valorant sem e-mail de criação (OGE)',
    horizon: 'CURTO',
    probabilityPercent: 85,
    probabilityInterval: '80% - 90%',
    impactDemandRange: 'Alta procura por contas seguras',
    impactPriceRange: 'Preço cai de R$ 420 para R$ 315',
    entryWindow: { startDay: 1, endDay: 5, label: 'Janela de Entrada: Compra de Lote Barato' },
    exitWindow: { startDay: 10, endDay: 14, label: 'Janela de Saída: Liquidação antes do novo ato' },
    premisses: [
      'Riot Games endureceu a checagem de IP na alteração de e-mail.',
      'Compradores do GGMAX estão exigindo comprovante OGE com prioridade.'
    ],
    reevaluationTriggers: [
      'Se a Riot adiou o update de segurança.',
      'Se surgirem ferramentas de verificação automatizadas.'
    ],
    confidenceScore: 91,
    sources: ['Riot Games Terms', 'GGMAX Historical Prices'],
    sampleSize: 450,
    rumorStatus: 'CONFIRMADO',
    scenarios: {
      otimista: {
        priceChangePct: 10,
        volumeChangePct: 40,
        platformFeePct: 12,
        supplierDelayDays: 1,
        projectedNetMargin: 42.5,
        projectedScore: 92,
        projectedVerdict: 'INVESTIR'
      },
      base: {
        priceChangePct: -15,
        volumeChangePct: 15,
        platformFeePct: 12,
        supplierDelayDays: 2,
        projectedNetMargin: 28.0,
        projectedScore: 82,
        projectedVerdict: 'INVESTIR'
      },
      pessimista: {
        priceChangePct: -35,
        volumeChangePct: -10,
        platformFeePct: 14,
        supplierDelayDays: 5,
        projectedNetMargin: 8.5,
        projectedScore: 35,
        projectedVerdict: 'EVITAR'
      }
    }
  }
];

// Generate 30 past predictions for Historical Accuracy / Brier Score Calibration
export const MOCK_HISTORICAL_ACCURACY: HistoricalAccuracy[] = Array.from({ length: 30 }, (_, i) => ({
  id: `hist_${i + 1}`,
  predictionTitle: `Previsão de Mercado Passada #${i + 1}: Variação em Itens Gaming`,
  predictedOutcome: `Subida de ${10 + (i % 20)}% na demanda`,
  actualOutcome: i % 5 === 0 ? `Queda inesperada de 5%` : `Subida real de ${12 + (i % 18)}%`,
  brierScore: i % 5 === 0 ? 0.42 : 0.08, // Low brier score = accurate prediction
  isHit: i % 5 !== 0,
  category: i % 2 === 0 ? 'Contas' : 'Gift Cards',
  horizon: i % 3 === 0 ? 'CURTO' : i % 3 === 1 ? 'MÉDIO' : 'LONGO'
}));
