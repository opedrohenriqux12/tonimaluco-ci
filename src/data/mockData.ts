import { ProductOpportunity, PlatformFee, SalesScript, AdvisoryMember } from '@/types';

export const MOCK_PLATFORMS: PlatformFee[] = [
  { id: 'ggmax', name: 'GGMAX', fixedFeeBrl: 1.0, percentageFee: 12.0, withdrawalFeeBrl: 3.5 },
  { id: 'eneba', name: 'Eneba', fixedFeeBrl: 1.5, percentageFee: 14.0, withdrawalFeeBrl: 5.0 },
  { id: 'gamemarket', name: 'Gamemarket', fixedFeeBrl: 0.5, percentageFee: 10.0, withdrawalFeeBrl: 2.0 },
  { id: 'mercadolivre', name: 'Mercado Livre', fixedFeeBrl: 5.0, percentageFee: 16.0, withdrawalFeeBrl: 0.0 },
];

// Zeroed out initial products list for fresh start
export const MOCK_PRODUCTS: ProductOpportunity[] = [];

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
