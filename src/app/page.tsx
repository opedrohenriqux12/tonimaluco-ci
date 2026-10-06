'use client';

import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '@/data/mockData';
import { ProductOpportunity } from '@/types';
import { SidebarNav } from '@/components/SidebarNav';
import { ProductCard } from '@/components/ProductCard';
import { AdCloner } from '@/components/AdCloner';
import { ScriptGenerator } from '@/components/ScriptGenerator';
import { AdvisoryBoard } from '@/components/AdvisoryBoard';
import { TrendingModule } from '@/components/TrendingModule';
import { RadarModule } from '@/components/RadarModule';
import { TrendingTopic, RadarPrediction } from '@/types/trendingRadar';
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Award,
  Search,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cloner' | 'scripts' | 'trending' | 'radar' | 'conselho' | 'calculator' | 'watchlist'>('trending');
  const [products, setProducts] = useState<ProductOpportunity[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('Todos');
  const [activeProductContext, setActiveProductContext] = useState<ProductOpportunity | null>(null);
  const [adContextTitle, setAdContextTitle] = useState<string>('');

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.game.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchesVerdict = selectedVerdict === 'Todos' || p.verdict === selectedVerdict;
    return matchesSearch && matchesCategory && matchesVerdict;
  });

  const totalMarginBrl = products.reduce((acc, p) => acc + p.netProfitBrl, 0);
  const avgScore = Math.round(products.reduce((acc, p) => acc + p.score, 0) / products.length);
  const investingCount = products.filter((p) => p.verdict === 'INVESTIR').length;

  const handleAskToni = (product: ProductOpportunity) => {
    setActiveProductContext(product);
    setActiveTab('conselho');
  };

  const handleTransformTrendingToOpportunity = (topic: TrendingTopic) => {
    const newOpportunity: ProductOpportunity = {
      id: `opp_${Date.now()}`,
      name: topic.title,
      category: topic.niche === 'games' ? 'Contas' : topic.niche === 'gift_cards' ? 'Gift Cards' : 'Serviços',
      game: topic.title.split(' ')[0] || 'Gaming',
      score: topic.scoreTendencia,
      verdict: topic.scoreTendencia >= 80 ? 'INVESTIR' : topic.scoreTendencia >= 50 ? 'TESTAR' : 'EVITAR',
      avgPriceBrl: 220.0,
      costBrl: 120.0,
      estimatedMarginPercent: 35.0,
      netProfitBrl: 77.0,
      demandTrend: topic.crescimentoPct >= 0 ? 'subindo' : 'caindo',
      competitionLevel: topic.stage === 'NO_PICO' ? 'alta' : 'media',
      liquidityDays: 1.5,
      riskLevel: topic.classification === 'ESPECULACAO' ? 'alto' : 'medio',
      riskFactors: [topic.whyTrap],
      reasoning: topic.suggestedAction,
      confidenceScore: topic.confidenceScore,
      sources: topic.sources,
      lastUpdated: 'Hoje'
    };

    setProducts([newOpportunity, ...products]);
    setActiveTab('dashboard');
  };

  const handleTransformRadarToOpportunity = (pred: RadarPrediction) => {
    const newOpportunity: ProductOpportunity = {
      id: `opp_radar_${Date.now()}`,
      name: pred.title,
      category: 'Contas',
      game: pred.title.split(' ')[0] || 'Radar',
      score: pred.probabilityPercent,
      verdict: pred.scenarios.base.projectedVerdict,
      avgPriceBrl: 300.0,
      costBrl: 180.0,
      estimatedMarginPercent: pred.scenarios.base.projectedNetMargin,
      netProfitBrl: 90.0,
      demandTrend: 'subindo',
      competitionLevel: 'baixa',
      liquidityDays: 2.0,
      riskLevel: pred.rumorStatus === 'NÃO CONFIRMADO' ? 'alto' : 'baixo',
      riskFactors: pred.reevaluationTriggers,
      reasoning: pred.premisses.join(' | '),
      confidenceScore: pred.confidenceScore,
      sources: pred.sources,
      lastUpdated: 'Hoje'
    };

    setProducts([newOpportunity, ...products]);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#05060F] text-white font-sans flex relative selection:bg-[#016BFF] selection:text-white">
      {/* Gestoria Radial Orbs */}
      <div className="gestoria-orb-1" />
      <div className="gestoria-orb-2" />

      {/* LEFT SIDEBAR NAVIGATION */}
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Hero Section */}
        <section className="px-8 pt-8 pb-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(1,107,255,0.1)] border border-[rgba(0,212,255,0.25)] text-xs font-semibold text-[#00D4FF]">
              <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-ping" />
              <span>PLATAFORMA DE INTELIGÊNCIA ESTRATÉGICA DIGITAL</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Decida com <span className="bg-gradient-to-r from-[#016BFF] via-[#00D4FF] to-[#7B61FF] bg-clip-text text-transparent">dados reais</span> se vale investir.
            </h1>
          </div>
        </section>

        {/* Main Content Body */}
        <main className="p-8 relative z-10 flex-1">
          {/* TAB 1: CENTRAL DE DECISÃO */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Top Stat Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="gestoria-card p-5">
                  <span className="text-[11px] font-mono-custom text-white/50 uppercase block mb-1">
                    Lucro Estimado Mês
                  </span>
                  <span className="text-3xl font-mono-custom font-extrabold text-[#00E676]">
                    R$ {totalMarginBrl.toFixed(2)}
                  </span>
                  <span className="text-xs text-white/40 block mt-1">
                    Margem real pós-taxas
                  </span>
                </div>

                <div className="gestoria-card p-5">
                  <span className="text-[11px] font-mono-custom text-white/50 uppercase block mb-1">
                    Score Médio Portfólio
                  </span>
                  <span className="text-3xl font-mono-custom font-extrabold text-white">
                    {avgScore} / 100
                  </span>
                  <span className="text-xs text-[#00E676] block mt-1">
                    Saúde excelente de catálogo
                  </span>
                </div>

                <div className="gestoria-card p-5">
                  <span className="text-[11px] font-mono-custom text-white/50 uppercase block mb-1">
                    Produtos Recomendados
                  </span>
                  <span className="text-3xl font-mono-custom font-extrabold text-[#00E676]">
                    {investingCount} Oportunidades
                  </span>
                  <span className="text-xs text-white/40 block mt-1">
                    Veredito verde confirmado
                  </span>
                </div>

                <div className="gestoria-card p-5">
                  <span className="text-[11px] font-mono-custom text-white/50 uppercase block mb-1">
                    Alertas Ativos
                  </span>
                  <span className="text-3xl font-mono-custom font-extrabold text-[#FF5252]">
                    1 Alerta de Risco
                  </span>
                  <span className="text-xs text-[#FF5252] block mt-1">
                    Fortnite em desvalorização
                  </span>
                </div>
              </div>

              {/* Filter Toolbar */}
              <div className="gestoria-card p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-[260px] relative">
                  <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar produto ou jogo (ex: Valorant, Roblox, Gift Card)..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs font-mono-custom text-white focus:outline-none focus:border-[#016BFF]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/50 uppercase font-semibold">Categoria:</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl p-2 text-xs font-mono-custom text-white"
                    >
                      <option value="Todas">Todas</option>
                      <option value="Contas">Contas</option>
                      <option value="Gift Cards">Gift Cards</option>
                      <option value="Serviços">Serviços</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/50 uppercase font-semibold">Veredito:</span>
                    <select
                      value={selectedVerdict}
                      onChange={(e) => setSelectedVerdict(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl p-2 text-xs font-mono-custom text-white"
                    >
                      <option value="Todos">Todos</option>
                      <option value="INVESTIR">INVESTIR</option>
                      <option value="TESTAR">TESTAR</option>
                      <option value="EVITAR">EVITAR</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAskToni={handleAskToni}
                    onConsultCouncil={handleAskToni}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TENDÊNCIAS (FUNCIONAL) */}
          {activeTab === 'trending' && (
            <TrendingModule
              onTransformToOpportunity={handleTransformTrendingToOpportunity}
              onConsultCouncil={(topicName) => setActiveTab('conselho')}
              onCreateAd={(topicName) => {
                setAdContextTitle(topicName);
                setActiveTab('cloner');
              }}
            />
          )}

          {/* TAB 3: RADAR DE TENDÊNCIAS (FUNCIONAL) */}
          {activeTab === 'radar' && (
            <RadarModule
              onConsultCouncil={(predictionTitle) => setActiveTab('conselho')}
              onTransformToOpportunity={handleTransformRadarToOpportunity}
            />
          )}

          {/* TAB 4: CLONADOR DE ANÚNCIOS */}
          {activeTab === 'cloner' && <AdCloner />}

          {/* TAB 5: SCRIPTS DE VENDA */}
          {activeTab === 'scripts' && <ScriptGenerator />}

          {/* TAB 6: CONSELHO DO TONIMALUCO */}
          {activeTab === 'conselho' && (
            <AdvisoryBoard
              productContext={activeProductContext}
              onCloseProductContext={() => setActiveProductContext(null)}
            />
          )}

          {/* PLACEHOLDERS FOR CALCULATOR & WATCHLIST */}
          {(activeTab === 'calculator' || activeTab === 'watchlist') && (
            <div className="gestoria-card p-10 text-center space-y-4">
              <Sparkles className="w-10 h-10 text-[#00D4FF] mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-white">
                Módulo <span className="text-[#00D4FF] uppercase">{activeTab}</span> em Breve
              </h3>
              <p className="text-sm text-white/60 max-w-md mx-auto">
                Este módulo de apoio está sendo atualizado. Utilize o Dashboard, Tendências ou o Radar.
              </p>
              <div className="gestoria-cta-wrap">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="gestoria-cta-btn text-xs py-2.5 px-5"
                >
                  Voltar para Central de Decisão
                </button>
              </div>
            </div>
          )}

          {/* Rodapé Obrigatório de Conformidade */}
          <footer className="mt-12 pt-4 border-t border-white/[0.08] text-center text-xs text-white/40 font-mono-custom space-y-1">
            <p>Análises são estimativas para apoio à decisão, não garantia de resultado nem aconselhamento financeiro.</p>
            <p className="text-[10px] text-white/20">ToniMaluco C.I • Dados de Exemplo (Mock Engine Ativo)</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
