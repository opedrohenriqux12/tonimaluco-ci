'use client';

import React, { useState } from 'react';
import { MOCK_TRENDING_TOPICS } from '@/data/trendingRadarMock';
import { TrendingTopic, TopicClassification } from '@/types/trendingRadar';
import { analyzeWithGemini } from '@/lib/geminiService';
import {
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Pin,
  Check,
  Users,
  Megaphone,
  Eye,
  Plus,
  Info,
  AlertTriangle,
  Flame,
  Zap,
  Maximize2,
  Minimize2,
  X,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendingModuleProps {
  onTransformToOpportunity: (topic: TrendingTopic) => void;
  onConsultCouncil: (topicName: string) => void;
  onCreateAd: (topicName: string) => void;
}

export const TrendingModule: React.FC<TrendingModuleProps> = ({
  onTransformToOpportunity,
  onConsultCouncil,
  onCreateAd
}) => {
  const [topics, setTopics] = useState<TrendingTopic[]>(MOCK_TRENDING_TOPICS);
  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'mapa_calor' | 'minha_fila'>('feed');
  const [selectedNiche, setSelectedNiche] = useState<string>('todos');
  const [selectedRegion, setSelectedRegion] = useState<string>('todas');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('hoje');
  const [minConfidence, setMinConfidence] = useState<number>(0);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [selectedScoreCalculation, setSelectedScoreCalculation] = useState<TrendingTopic | null>(null);
  const [isTickerExpanded, setIsTickerExpanded] = useState<boolean>(false);

  // Live filtering
  const filteredTopics = topics.filter((t) => {
    const matchNiche = selectedNiche === 'todos' || t.niche === selectedNiche;
    const matchRegion = selectedRegion === 'todas' || t.region === selectedRegion;
    const matchConf = t.confidenceScore >= minConfidence;
    return matchNiche && matchRegion && matchConf;
  });

  const pinnedTopics = topics.filter((t) => pinnedIds.includes(t.id));

  const togglePin = (id: string) => {
    if (pinnedIds.includes(id)) {
      setPinnedIds(pinnedIds.filter((p) => p !== id));
    } else {
      setPinnedIds([...pinnedIds, id]);
    }
  };

  const getClassificationStyle = (type: TopicClassification) => {
    if (type === 'FATO') return 'border-2 border-white bg-white/5 text-white';
    if (type === 'ESTIMATIVA') return 'border-2 border-dashed border-[#016BFF] bg-[#016BFF]/10 text-[#00D4FF]';
    return 'border-2 border-dotted border-[#FFB300] bg-[#FFB300]/10 text-[#FFB300]';
  };

  return (
    <div className="space-y-6">
      {/* Top Live Ticker Tape Bar */}
      <div className="bg-black/60 border border-white/10 rounded-2xl p-2.5 overflow-hidden backdrop-blur-xl flex items-center gap-3 relative shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FF5252]/10 border border-[#FF5252]/30 text-xs font-bold text-[#FF5252] shrink-0 z-10">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5252] animate-ping" />
          <span>AO VIVO</span>
          <span className="text-white/40 font-mono-custom text-[10px] hidden sm:inline">14:55</span>
        </div>

        {/* Continuous Smooth Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative cursor-pointer group" onClick={() => setIsTickerExpanded(true)}>
          <div className="animate-marquee flex items-center gap-8 text-xs font-mono-custom">
            {[...topics, ...topics].map((t, idx) => (
              <div key={`${t.id}-${idx}`} className="inline-flex items-center gap-2.5 shrink-0 px-2 py-1 rounded-lg hover:bg-white/5 transition-all">
                <span className="font-bold text-white text-xs">{t.title}</span>
                <span className={`flex items-center font-bold text-xs ${t.crescimentoPct >= 0 ? 'text-[#00E676]' : 'text-[#FF5252]'}`}>
                  {t.crescimentoPct >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {t.crescimentoPct}%
                </span>
                <span className="text-[10px] text-white/40 font-mono-custom px-1.5 py-0.5 rounded bg-white/5">{t.volume.toLocaleString('pt-BR')} buscas</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expand Live Events Button */}
        <button
          onClick={() => setIsTickerExpanded(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#016BFF]/20 border border-[#016BFF]/50 text-[#00D4FF] hover:bg-[#016BFF] hover:text-white transition-all text-xs font-bold shrink-0 z-10"
          title="Expandir Eventos Ao Vivo"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Expandir Ao Vivo</span>
        </button>
      </div>

      {/* Sub Tabs Header & Filters */}
      <div className="gestoria-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.08]">
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSubTab === 'feed'
                ? 'bg-[#016BFF] text-white font-bold shadow-[0_4px_15px_rgba(1,107,255,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Feed de Tópicos
          </button>
          <button
            onClick={() => setActiveSubTab('mapa_calor')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSubTab === 'mapa_calor'
                ? 'bg-[#016BFF] text-white font-bold shadow-[0_4px_15px_rgba(1,107,255,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Mapa de Calor
          </button>
          <button
            onClick={() => setActiveSubTab('minha_fila')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSubTab === 'minha_fila'
                ? 'bg-[#016BFF] text-white font-bold shadow-[0_4px_15px_rgba(1,107,255,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Minha Fila ({pinnedIds.length})
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-white/50 font-semibold">Nicho:</span>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl p-1.5 font-mono-custom text-white"
            >
              <option value="todos">Todos</option>
              <option value="games">Games</option>
              <option value="streaming">Streaming</option>
              <option value="gift_cards">Gift Cards</option>
              <option value="services">Serviços</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-white/50 font-semibold">Região:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl p-1.5 font-mono-custom text-white"
            >
              <option value="todas">Todas</option>
              <option value="Brasil">Brasil</option>
              <option value="Global">Global</option>
            </select>
          </div>
        </div>
      </div>

      {/* SUB TAB 1: FEED DE TÓPICOS */}
      {activeSubTab === 'feed' && (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTopics.map((topic) => (
              <motion.div
                key={topic.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="gestoria-card p-6 space-y-4 relative"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Classification Badge (FATO / ESTIMATIVA / ESPECULACAO) */}
                      <span className={`px-2.5 py-0.5 rounded-full font-mono-custom font-bold text-[10px] ${getClassificationStyle(topic.classification)}`}>
                        {topic.classification}
                      </span>
                      <span className="text-white/40 font-mono-custom">
                        Origem: <strong className="text-white">{topic.source}</strong> ({topic.ageHours}h atrás)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/70 font-mono-custom uppercase">
                        {topic.stage}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {topic.title}
                    </h3>
                  </div>

                  {/* Score de Tendência Ring */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedScoreCalculation(topic)}
                      className="flex items-center gap-2.5 bg-white/[0.03] px-3.5 py-2 rounded-2xl border border-white/[0.08] hover:border-[#016BFF] transition-all cursor-pointer"
                    >
                      <div className="text-right">
                        <span className="text-[10px] text-white/40 block font-mono-custom uppercase">Score Tendência</span>
                        <span className="text-base font-extrabold font-mono-custom text-[#00D4FF]">{topic.scoreTendencia}/100</span>
                      </div>
                      <Info className="w-4 h-4 text-[#00D4FF]" />
                    </button>

                    <button
                      onClick={() => togglePin(topic.id)}
                      className={`p-2 rounded-xl border transition-all ${
                        pinnedIds.includes(topic.id)
                          ? 'bg-[#016BFF] text-white border-[#016BFF]'
                          : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
                      }`}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metrics & Sparkline Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 border-b border-white/[0.08]">
                  <div>
                    <span className="text-[11px] font-mono-custom text-white/40 block uppercase">Volume de Busca</span>
                    <span className="text-base font-mono-custom font-bold text-white">
                      {topic.volume.toLocaleString('pt-BR')} buscas
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono-custom text-white/40 block uppercase">Variação %</span>
                    <span className={`text-base font-mono-custom font-bold ${topic.crescimentoPct >= 0 ? 'text-[#00E676]' : 'text-[#FF5252]'}`}>
                      {topic.crescimentoPct >= 0 ? '+' : ''}{topic.crescimentoPct}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono-custom text-white/40 block uppercase">Impacto Estimado</span>
                    <span className="text-xs font-semibold text-[#00D4FF] uppercase">
                      {topic.impactLevel} ({topic.impactRange})
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono-custom text-white/40 block uppercase">Produtos Afetados</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {topic.relatedProducts.map((prod, i) => (
                        <span key={i} className="text-[10px] font-mono-custom px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/80">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ação Sugerida pelo Toni */}
                <div className="bg-[rgba(1,107,255,0.06)] p-3.5 rounded-xl border-l-4 border-[#016BFF] border border-[rgba(1,107,255,0.15)] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono-custom text-[#00D4FF] uppercase font-bold block">
                      Ação Sugerida pelo Toni:
                    </span>
                    <p className="text-xs text-white/90 font-medium">
                      "{topic.suggestedAction}"
                    </p>
                  </div>

                  <button
                    onClick={() => setExpandedTopicId(expandedTopicId === topic.id ? null : topic.id)}
                    className="text-xs font-mono-custom text-[#00D4FF] hover:underline shrink-0"
                  >
                    {expandedTopicId === topic.id ? 'Ocultar Detalhes' : 'Ver Anotação do Toni'}
                  </button>
                </div>

                {/* Expanded Anotação do Toni (Por que importa / Por que armadilha) */}
                {expandedTopicId === topic.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-black/50 p-4 rounded-xl border border-white/[0.08] space-y-3 text-xs"
                  >
                    <div>
                      <strong className="text-[#00E676] block mb-1">Por que isso importa:</strong>
                      <p className="text-white/80">{topic.whyItMatters}</p>
                    </div>
                    <div>
                      <strong className="text-[#FF5252] block mb-1">Por que pode ser armadilha:</strong>
                      <p className="text-white/80">{topic.whyTrap}</p>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap gap-2">
                    <div className="gestoria-cta-wrap">
                      <button
                        onClick={() => onTransformToOpportunity(topic)}
                        className="gestoria-cta-btn text-xs py-2 px-4"
                      >
                        <span>Transformar em Oportunidade</span>
                        <Zap className="w-3.5 h-3.5 text-[#00D4FF]" />
                      </button>
                    </div>

                    <button
                      onClick={() => onConsultCouncil(topic.title)}
                      className="px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-white flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-[#00D4FF]" />
                      Convocar Conselho
                    </button>

                    <button
                      onClick={() => onCreateAd(topic.title)}
                      className="px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-white flex items-center gap-1.5"
                    >
                      <Megaphone className="w-3.5 h-3.5 text-[#00D4FF]" />
                      Criar Anúncio
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* SUB TAB 2: MAPA DE CALOR */}
      {activeSubTab === 'mapa_calor' && (
        <div className="gestoria-card p-6 space-y-4">
          <h3 className="text-lg font-bold text-white uppercase border-b border-white/[0.08] pb-2">
            Mapa de Calor de Tendências (Nicho vs Período)
          </h3>
          <p className="text-xs text-white/60">
            Clique em uma célula para aplicar o filtro cruzado direto no feed de oportunidades.
          </p>

          <div className="grid grid-cols-4 gap-3 pt-2">
            {['Games', 'Streaming', 'Gift Cards', 'Serviços'].map((nicho, i) => (
              <div
                key={nicho}
                onClick={() => {
                  setSelectedNiche(nicho.toLowerCase().replace(' ', '_'));
                  setActiveSubTab('feed');
                }}
                className="bg-[rgba(1,107,255,0.15)] border border-[rgba(1,107,255,0.4)] p-6 rounded-2xl text-center cursor-pointer hover:scale-105 transition-all"
              >
                <span className="text-xs font-mono-custom text-white/50 block uppercase mb-1">{nicho}</span>
                <span className="text-2xl font-extrabold text-[#00D4FF] font-mono-custom">
                  {85 - i * 12}%
                </span>
                <span className="text-[10px] text-[#00E676] block mt-1">Alta Intensidade</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: MINHA FILA */}
      {activeSubTab === 'minha_fila' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white uppercase">Minha Fila de Tópicos Fixados</h3>
          {pinnedTopics.length === 0 ? (
            <div className="gestoria-card p-8 text-center text-xs text-white/50">
              Nenhum tópico fixado na sua fila ainda. Clique no ícone de alfinete nos cards para fixar.
            </div>
          ) : (
            pinnedTopics.map((t) => (
              <div key={t.id} className="gestoria-card p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">{t.title}</h4>
                  <span className="text-xs text-[#00D4FF] font-mono-custom">Score: {t.scoreTendencia}/100</span>
                </div>
                <button
                  onClick={() => togglePin(t.id)}
                  className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold"
                >
                  Remover
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Expandido de Eventos Ao Vivo */}
      {isTickerExpanded && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 z-50 overflow-y-auto">
          <div className="gestoria-card p-6 md:p-8 max-w-5xl w-full space-y-6 max-h-[90vh] flex flex-col border border-white/20 shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5252]/10 border border-[#FF5252]/30 text-xs font-bold text-[#FF5252]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5252] animate-ping" />
                  <span>MONITOR DE EVENTOS AO VIVO</span>
                </div>
                <span className="text-xs text-white/50 hidden sm:inline">({topics.length} eventos rastreados)</span>
              </div>
              <button
                onClick={() => setIsTickerExpanded(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Grid of All Live Events */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#016BFF]/40 transition-all space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <span className={`px-2 py-0.5 rounded font-mono-custom text-[10px] font-bold ${getClassificationStyle(t.classification)}`}>
                          {t.classification}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-tight">{t.title}</h4>
                      </div>
                      <span
                        className={`inline-flex items-center text-sm font-mono-custom font-extrabold ${
                          t.crescimentoPct >= 0 ? 'text-[#00E676]' : 'text-[#FF5252]'
                        }`}
                      >
                        {t.crescimentoPct >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {t.crescimentoPct}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono-custom border-t border-white/5 pt-2 text-white/60">
                      <div>
                        <span className="block text-white/30 text-[9px]">VOLUME</span>
                        <strong className="text-white">{t.volume.toLocaleString('pt-BR')}</strong>
                      </div>
                      <div>
                        <span className="block text-white/30 text-[9px]">IMPACTO</span>
                        <strong className="text-[#00D4FF]">{t.impactLevel}</strong>
                      </div>
                      <div>
                        <span className="block text-white/30 text-[9px]">ORIGEM</span>
                        <strong className="text-white/80">{t.source}</strong>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          setIsTickerExpanded(false);
                          onTransformToOpportunity(t);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-[#016BFF]/20 hover:bg-[#016BFF] text-[#00D4FF] hover:text-white border border-[#016BFF]/40 text-xs font-bold transition-all text-center"
                      >
                        Criar Oportunidade
                      </button>
                      <button
                        onClick={() => {
                          setIsTickerExpanded(false);
                          onConsultCouncil(t.title);
                        }}
                        className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium border border-white/10"
                      >
                        Conselho
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setIsTickerExpanded(false)}
                className="px-6 py-2.5 rounded-full bg-[#016BFF] text-white text-xs font-bold shadow-[0_4px_20px_rgba(1,107,255,0.4)] hover:scale-105 transition-all"
              >
                Fechar Monitor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Transparência Score Cálculo */}
      {selectedScoreCalculation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="gestoria-card p-6 max-w-md w-full space-y-4">
            <h4 className="text-base font-bold text-white uppercase border-b border-white/[0.08] pb-2">
              Cálculo Transparente do Score de Tendência
            </h4>
            <div className="space-y-2 text-xs font-mono-custom text-white/80">
              <div className="flex justify-between"><span>Crescimento Recente (30%):</span> <span>+{selectedScoreCalculation.crescimentoPct}%</span></div>
              <div className="flex justify-between"><span>Volume Absoluto (20%):</span> <span>{selectedScoreCalculation.volume}</span></div>
              <div className="flex justify-between"><span>Relevância Catálogo (20%):</span> <span>Alta</span></div>
              <div className="flex justify-between"><span>Frescor/Idade (15%):</span> <span>{selectedScoreCalculation.ageHours}h</span></div>
              <div className="flex justify-between"><span>Confiabilidade Fonte (15%):</span> <span>{selectedScoreCalculation.confidenceScore}%</span></div>
            </div>
            <button
              onClick={() => setSelectedScoreCalculation(null)}
              className="w-full cmd-btn-primary py-2 text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
