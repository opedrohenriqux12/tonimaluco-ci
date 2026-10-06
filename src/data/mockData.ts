import { ProductOpportunity, PlatformFee, SalesScript, AdvisoryMember } from '@/types';

export const MOCK_PLATFORMS: PlatformFee[] = [
  { id: 'ggmax', name: 'GGMAX', fixedFeeBrl: 1.0, percentageFee: 12.0, withdrawalFeeBrl: 3.5 },
  { id: 'eneba', name: 'Eneba', fixedFeeBrl: 1.5, percentageFee: 14.0, withdrawalFeeBrl: 5.0 },
  { id: 'gamemarket', name: 'Gamemarket', fixedFeeBrl: 0.5, percentageFee: 10.0, withdrawalFeeBrl: 2.0 },
  { id: 'mercadolivre', name: 'Mercado Livre', fixedFeeBrl: 5.0, percentageFee: 16.0, withdrawalFeeBrl: 0.0 },
];

export const MOCK_PRODUCTS: ProductOpportunity[] = [
  {
    id: '1',
    name: 'Conta Valorant Imortal III (Full Acesso + Vandal Saqueadora)',
    category: 'Contas',
    game: 'Valorant',
    score: 88,
    verdict: 'INVESTIR',
    avgPriceBrl: 420.0,
    costBrl: 210.0,
    estimatedMarginPercent: 36.5,
    netProfitBrl: 153.3,
    demandTrend: 'subindo',
    competitionLevel: 'media',
    liquidityDays: 2.4,
    riskLevel: 'medio',
    riskFactors: ['Risco de recuperação pelo dono original', 'Verificação de dados do e-mail inicial (OGE)'],
    reasoning: 'Demanda aquecida com o novo ato. Preço de compra baixo com fornecedor confiável. Margem líquida superior a 35% após taxas do GGMAX.',
    confidenceScore: 92,
    sources: ['GGMAX Histórico 30d', 'Google Trends (Valorant Contas)', 'Comunidade Discord GG'],
    lastUpdated: 'Hoje às 14:15'
  },
  {
    id: '2',
    name: 'Chave Global Steam Wallet R$ 100',
    category: 'Gift Cards',
    game: 'Steam',
    score: 64,
    verdict: 'TESTAR',
    avgPriceBrl: 96.0,
    costBrl: 82.0,
    estimatedMarginPercent: 4.8,
    netProfitBrl: 4.6,
    demandTrend: 'estavel',
    competitionLevel: 'guerra_de_preco',
    liquidityDays: 0.3,
    riskLevel: 'baixo',
    riskFactors: ['Margem muito apertada', 'Guerra de centavos entre robôs de preço'],
    reasoning: 'Gira no mesmo dia, porém a margem unitária é baixa. Vale apenas para giro de caixa alto ou se tiver taxa promocional.',
    confidenceScore: 85,
    sources: ['Eneba API', 'Gamemarket Feed'],
    lastUpdated: 'Hoje às 13:40'
  },
  {
    id: '3',
    name: 'Conta Roblox Blox Fruits (Max Level + V4 Despertada + Kitsune)',
    category: 'Contas',
    game: 'Roblox',
    score: 94,
    verdict: 'INVESTIR',
    avgPriceBrl: 185.0,
    costBrl: 65.0,
    estimatedMarginPercent: 51.2,
    netProfitBrl: 94.7,
    demandTrend: 'subindo',
    competitionLevel: 'baixa',
    liquidityDays: 1.1,
    riskLevel: 'baixo',
    riskFactors: ['Verificação de pin de segurança in-game'],
    reasoning: 'Item com procura explosiva entre público jovem. Alta liquidez e excelente margem bruta. Baixo índice de disputa pós-venda se entregue com e-mail limpo.',
    confidenceScore: 95,
    sources: ['GGMAX Trends', 'Busca Interna Discord'],
    lastUpdated: 'Hoje às 14:00'
  },
  {
    id: '4',
    name: 'Passe de Batalha Fortnite (Entrega via Presente 3 dias)',
    category: 'Serviços',
    game: 'Fortnite',
    score: 32,
    verdict: 'EVITAR',
    avgPriceBrl: 38.0,
    costBrl: 28.0,
    estimatedMarginPercent: 8.5,
    netProfitBrl: 3.2,
    demandTrend: 'caindo',
    competitionLevel: 'alta',
    liquidityDays: 5.2,
    riskLevel: 'alto',
    riskFactors: ['Exige 3 dias de amizade na Epic', 'Risco de chargeback do V-Bucks original', 'Reclamações por demora'],
    reasoning: 'Tempo de espera de 3 dias estagna seu capital de giro. A margem de R$ 3,20 não compensa a dor de cabeça e suporte constante.',
    confidenceScore: 90,
    sources: ['Epic Games Policy', 'Feedback Usuários GGMAX'],
    lastUpdated: 'Hoje às 11:20'
  }
];

export const MOCK_SCRIPTS: SalesScript[] = [
  {
    id: 's1',
    title: 'Garantia de Segurança & Troca de E-mail (Contas)',
    channel: 'Marketplace Chat',
    tone: 'Gamer',
    objection: 'É seguro? O dono não vai recuperar a conta depois?',
    scriptText: 'Salve meu mano! Totalmente seguro. A conta vem com acesso total ao e-mail de criação (OGE). Você altera a senha, ativa o 2FA e troca os dados na hora. Te dou suporte passo a passo de 15min e garantia de 30 dias com substituição imediata no chat.',
    successRatePercent: 94,
    tags: ['Segurança', 'Garantia', 'Contas']
  },
  {
    id: 's2',
    title: 'Desconto por Pix Direto no WhatsApp/Discord',
    channel: 'WhatsApp',
    tone: 'Direto',
    objection: 'Faz um preço melhor se for à vista?',
    scriptText: 'Consigo sim! Como fora do marketplace não pago a taxa de 12%, repasso esse desconto direto pra você. O valor cai de R$ 185 pra R$ 162 no Pix. Envio imediato assim que confirmar o comprovante.',
    successRatePercent: 88,
    tags: ['Desconto', 'Pix', 'Fechamento']
  }
];

// Complete 7 Multi-Agent Advisors Specification as requested in Prompt Section 3.7
export const MOCK_ADVISORS: AdvisoryMember[] = [
  {
    id: 'helena',
    name: 'Dra. Helena Cordeiro',
    role: 'Financeiro & Caixa',
    personality: 'Cética, seca, obcecada por caixa e margem líquida real.',
    signatureQuestion: 'Quanto você aguenta perder sem quebrar o caixa?',
    color: '#D8432B',
    hardnessLevel: 'implacável'
  },
  {
    id: 'rafael',
    name: 'Dr. Rafael Menezes',
    role: 'Jurídico & Compliance',
    personality: 'Cauteloso, preciso, calmo e focado nos Termos de Uso.',
    signatureQuestion: 'Isso é permitido pelas regras da plataforma e pela lei? Onde está escrito?',
    color: '#8A8578',
    hardnessLevel: 'firme'
  },
  {
    id: 'byte',
    name: 'Bruno "Byte" Takahashi',
    role: 'Desenvolvimento & Automação',
    personality: 'Pragmático, direto, odeia complexidade inútil.',
    signatureQuestion: 'Isso precisa ser construído agora ou dá para validar na mão primeiro?',
    color: '#E0A526',
    hardnessLevel: 'firme'
  },
  {
    id: 'icaro',
    name: 'Prof. Ícaro Valadares',
    role: 'Matemática & Estatística',
    personality: 'Analítico, paciente, ácido com números mal usados.',
    signatureQuestion: 'Esse resultado é padrão ou foi sorte? Qual o tamanho da amostra?',
    color: '#3B82F6',
    hardnessLevel: 'implacável'
  },
  {
    id: 'marina',
    name: 'Marina Duarte',
    role: 'Marketing, Vendas & Growth',
    personality: 'Enérgica, criativa, orientada a conversão e copy.',
    signatureQuestion: 'Quem exatamente compra isso e por que compraria de você e não do vizinho?',
    color: '#1F6B4F',
    hardnessLevel: 'cordial'
  },
  {
    id: 'ze',
    name: 'Seu Zé Antunes',
    role: 'Operação, Risco & Antifraude',
    personality: 'Veterano de mercado, desconfiado, fala simples.',
    signatureQuestion: 'O que acontece se esse fornecedor sumir amanhã?',
    color: '#D97706',
    hardnessLevel: 'implacável'
  },
  {
    id: 'lucia',
    name: 'Dra. Lúcia Prado',
    role: 'Psicologia de Decisão & Advogada do Diabo',
    personality: 'Provocadora, curiosa, incômoda com vieses cognitivos.',
    signatureQuestion: 'Qual é a versão mais forte do argumento contrário à sua ideia?',
    color: '#8B5CF6',
    hardnessLevel: 'implacável'
  }
];
