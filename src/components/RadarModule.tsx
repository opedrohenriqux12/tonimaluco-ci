'use client';

import React, { useState } from 'react';
import {
  MOCK_RADAR_PREDICTIONS,
  MOCK_WEAK_SIGNALS,
  MOCK_RADAR_EVENTS,
  MOCK_HISTORICAL_ACCURACY
} from '@/data/trendingRadarMock';
import { Horizon, RadarPrediction } from '@/types/trendingRadar';
import { VerdictStamp } from './VerdictStamp';
import {
  Calendar,
  Radio,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Zap,
  Users,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RadarModuleProps {
  onConsultCouncil: (predictionTitle: string) => void;
  onTransformToOpportunity: (prediction: RadarPrediction) => void;
}

export const RadarModule: React.FC<RadarModuleProps> = ({
  onConsultCouncil,
  onTransformToOpportunity
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'previsoes' | 'calendario' | 'sinais' | 'cenarios' | 'historico'>('previsoes');
  const [selectedHorizon, setSelectedHorizon] = useState<Horizon>('CURTO');
  const [selectedScenario, setSelectedScenario] = useState<'otimista' | 'base' | 'pessimista'>('base');

  // Interactive Scenario Slider State
  const [customPriceChange, setCustomPriceChange] = useState(-15);
  const [customVolumeChange, setCustomVolumeChange] = useState(15);
  const [customPlatformFee, setCustomPlatformFee] = useState(12);

  // Live Scenario Recalculations
  const basePrice = 200;
  const simulatedPrice = basePrice * (1 + customPriceChange / 100);
  const platformFeeAmount = simulatedPrice * (customPlatformFee / 100);
  const simulatedCost = 110;
  const netMargin = simulatedPrice - simulatedCost - platformFeeAmount;
  const marginPercent = simulatedPrice > 0 ? (netMargin / simulatedPrice) * 100 : 0;

  let liveVerdict: 'INVESTIR' | 'TESTAR' | 'EVITAR' = 'TESTAR';
  if (marginPercent >= 25) liveVerdict = 'INVESTIR';
  else if (marginPercent < 10) liveVerdict = 'EVITAR';

  return (
    <div className="space-y-6">
      {/* Top Horizon Selector Always Visible */}
      <div className="gestoria-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-custom text-white/50 uppercase font-bold">Horizonte Temporal:</span>
          {(['CURTO', 'MÉDIO', 'LONGO'] as Horizon[]).map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHorizon(h)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono-custom transition-all ${
                selectedHorizon === h
                  ? 'bg-[#016BFF] text-white shadow-[0_4px_15px_rgba(1,107,255,0.4)]'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {h} {h === 'CURTO' ? '(7-14d)' : h === 'MÉDIO' ? '(1-3m)' : '(6-12m)'}
            </button>
          ))}
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.08]">
          <button
            onClick={() => setActiveSubTab('previsoes')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSubTab === 'previsoes' ? 'bg-[#016BFF] text-white font-bold' : 'text-white/60'
            }`}
          >
            Previsões
          </button>
          <button
            onClick={() => setActiveSubTab('calendario')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSubTab === 'calendario' ? 'bg-[#016BFF] text-white font-bold' : 'text-white/60'
            }`}
          >
            Calendário
          </button>
          <button
            onClick={() => setActiveSubTab('sinais')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSubTab === 'sinais' ? 'bg-[#016BFF] text-white font-bold' : 'text-white/60'
            }`}
          >
            Sinais Fracos
          </button>
          <button
            onClick={() => setActiveSubTab('cenarios')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSubTab === 'cenarios' ? 'bg-[#016BFF] text-white font-bold' : 'text-white/60'
            }`}
          >
            Simulador Cenários
          </button>
          <button
            onClick={() => setActiveSubTab('historico')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSubTab === 'historico' ? 'bg-[#016BFF] text-white font-bold' : 'text-white/60'
            }`}
          >
            Histórico de Acertos
          </button>
        </div>
      </div>

      {/* SUB TAB 1: PREVISÕES */}
      {activeSubTab === 'previsoes' && (
        <div className="space-y-6">
          {MOCK_RADAR_PREDICTIONS.map((pred) => (
            <div key={pred.id} className="gestoria-card p-6 space-y-5 border-2 border-white/10">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono-custom px-2.5 py-0.5 rounded-full bg-[#016BFF]/20 text-[#00D4FF] font-bold">
                      {pred.horizon} PRAZO
                    </span>
                    <span
                      className={`text-[10px] font-mono-custom px-2.5 py-0.5 rounded-full font-bold border ${
                        pred.rumorStatus === 'CONFIRMADO'
                          ? 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/30'
                          : 'bg-[#FFB300]/10 text-[#FFB300] border-[#FFB300]/30'
                      }`}
                    >
                      {pred.rumorStatus}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{pred.title}</h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-white/40 block font-mono-custom uppercase">Probabilidade Calculada</span>
                  <span className="text-2xl font-extrabold font-mono-custom text-[#00E676]">
                    {pred.probabilityPercent}% <span className="text-xs text-white/50 font-normal">({pred.probabilityInterval})</span>
                  </span>
                </div>
              </div>

              {/* Timeline Entry and Exit Windows Visualizer */}
              <div className="bg-black/50 p-4 rounded-2xl border border-white/[0.08] space-y-3">
                <span className="text-xs font-mono-custom text-[#00D4FF] uppercase font-bold block">
                  Linha do Tempo Estratégica — Janelas de Entrada e Saída
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#00E676]/10 border border-[#00E676]/30 p-3 rounded-xl">
                    <strong className="text-xs text-[#00E676] block mb-1">🟢 {pred.entryWindow.label}</strong>
                    <span className="text-xs text-white/80">Dias {pred.entryWindow.startDay} ao {pred.entryWindow.endDay}: Custo baixo, mercado sem saturação.</span>
                  </div>

                  <div className="bg-[#FF5252]/10 border border-[#FF5252]/30 p-3 rounded-xl">
                    <strong className="text-xs text-[#FF5252] block mb-1">🔴 {pred.exitWindow.label}</strong>
                    <span className="text-xs text-white/80">Dias {pred.exitWindow.startDay} ao {pred.exitWindow.endDay}: Saída total antes do estouro da bolha.</span>
                  </div>
                </div>
              </div>

              {/* Premisses & Reevaluation Triggers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  <strong className="text-white block mb-1">Premissas Explícitas:</strong>
                  <ul className="list-disc list-inside text-white/70 space-y-1">
                    {pred.premisses.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  <strong className="text-[#FF5252] block mb-1">Gatilhos de Reavaliação (Invalidação):</strong>
                  <ul className="list-disc list-inside text-white/70 space-y-1">
                    {pred.reevaluationTriggers.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.08]">
                <div className="flex gap-2">
                  <div className="gestoria-cta-wrap">
                    <button
                      onClick={() => onTransformToOpportunity(pred)}
                      className="gestoria-cta-btn text-xs py-2 px-4"
                    >
                      <span>Transformar em Oportunidade</span>
                      <Zap className="w-3.5 h-3.5 text-[#00D4FF]" />
                    </button>
                  </div>
                  <button
                    onClick={() => onConsultCouncil(pred.title)}
                    className="px-3.5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-white flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-[#00D4FF]" />
                    Convocar Conselho
                  </button>
                </div>

                <div className="text-xs font-mono-custom text-white/40">
                  Amostra: {pred.sampleSize} eventos passados comparáveis
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB TAB 2: CALENDÁRIO DE EVENTOS */}
      {activeSubTab === 'calendario' && (
        <div className="gestoria-card p-6 space-y-4">
          <h3 className="text-lg font-bold text-white uppercase border-b border-white/[0.08] pb-2">
            Calendário de Eventos que Movem a Demanda
          </h3>
          <div className="space-y-3">
            {MOCK_RADAR_EVENTS.map((ev) => (
              <div key={ev.id} className="bg-black/40 p-4 rounded-xl border border-white/10 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono-custom px-2 py-0.5 rounded bg-[#016BFF]/20 text-[#00D4FF] font-bold">
                      {ev.date}
                    </span>
                    <span className="text-[10px] font-mono-custom px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                      {ev.certainty}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base">{ev.title}</h4>
                  <span className="text-xs text-white/60">Impacto: {ev.expectedImpact}</span>
                </div>

                <div className="bg-[#016BFF]/10 p-2.5 rounded-xl border border-[#016BFF]/30 text-xs font-mono-custom text-[#00D4FF]">
                  🎯 Janela Sugerida: {ev.suggestedWindow}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: SINAIS FRACOS */}
      {activeSubTab === 'sinais' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white uppercase">Detecção de Sinais Fracos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_WEAK_SIGNALS.map((s) => (
              <div key={s.id} className="gestoria-card p-5 space-y-3 border-2 border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-custom px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                    {s.niche}
                  </span>
                  <span
                    className={`text-[10px] font-mono-custom px-2 py-0.5 rounded font-bold border ${
                      s.rumorStatus === 'CONFIRMADO'
                        ? 'bg-[#00E676]/20 text-[#00E676] border-[#00E676]/40'
                        : 'bg-[#FFB300]/20 text-[#FFB300] border-[#FFB300]/40'
                    }`}
                  >
                    {s.rumorStatus}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm">{s.title}</h4>
                <p className="text-xs text-white/70">{s.details}</p>

                <div className="text-[11px] font-mono-custom text-white/40 pt-2 border-t border-white/[0.08]">
                  Observação: {s.observationDays} dias | {s.independentSourcesCount} fontes
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: SIMULADOR DE CENÁRIOS */}
      {activeSubTab === 'cenarios' && (
        <div className="gestoria-card p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
            <h3 className="text-lg font-bold text-white uppercase">
              Simulador "E Se?" (Otimista / Base / Pessimista)
            </h3>
            <VerdictStamp verdict={liveVerdict} size="lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono-custom text-white/50 block mb-1">Variação Preço (%): {customPriceChange}%</label>
              <input
                type="range"
                min="-50"
                max="50"
                value={customPriceChange}
                onChange={(e) => setCustomPriceChange(Number(e.target.value))}
                className="w-full accent-[#016BFF]"
              />
            </div>
            <div>
              <label className="text-xs font-mono-custom text-white/50 block mb-1">Variação Volume (%): {customVolumeChange}%</label>
              <input
                type="range"
                min="-50"
                max="100"
                value={customVolumeChange}
                onChange={(e) => setCustomVolumeChange(Number(e.target.value))}
                className="w-full accent-[#016BFF]"
              />
            </div>
            <div>
              <label className="text-xs font-mono-custom text-white/50 block mb-1">Taxa Plataforma (%): {customPlatformFee}%</label>
              <input
                type="range"
                min="5"
                max="25"
                value={customPlatformFee}
                onChange={(e) => setCustomPlatformFee(Number(e.target.value))}
                className="w-full accent-[#016BFF]"
              />
            </div>
          </div>

          <div className="bg-black/50 p-4 rounded-2xl border border-white/10 grid grid-cols-2 md:grid-cols-3 gap-4 text-center font-mono-custom">
            <div>
              <span className="text-xs text-white/40 block">PREÇO RECALCULADO</span>
              <span className="text-xl font-bold text-white">R$ {simulatedPrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-xs text-white/40 block">MARGEM LÍQUIDA LÍQUIDA</span>
              <span className={`text-xl font-bold ${marginPercent >= 20 ? 'text-[#00E676]' : 'text-[#FF5252]'}`}>
                {marginPercent.toFixed(1)}% (R$ {netMargin.toFixed(2)})
              </span>
            </div>
            <div>
              <span className="text-xs text-white/40 block">TAXA DEDUZIDA</span>
              <span className="text-xl font-bold text-white/80">R$ {platformFeeAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 5: HISTÓRICO DE ACERTOS (BRIER SCORE) */}
      {activeSubTab === 'historico' && (
        <div className="gestoria-card p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
            <h3 className="text-lg font-bold text-white uppercase">
              Histórico de Acertos & Calibração do Algoritmo (30 Previsões Passadas)
            </h3>
            <span className="text-xs font-mono-custom px-3 py-1 bg-[#00E676]/10 text-[#00E676] rounded-full border border-[#00E676]/30 font-bold">
              Brier Score Geral: 0.12 (Excelente Calibração)
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {MOCK_HISTORICAL_ACCURACY.map((h) => (
              <div key={h.id} className="bg-black/40 p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono-custom">
                <div>
                  <span className="font-bold text-white block">{h.predictionTitle}</span>
                  <span className="text-white/50">Previsto: {h.predictedOutcome} | Ocorrido: {h.actualOutcome}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold px-2 py-0.5 rounded ${h.isHit ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-[#FF5252]/20 text-[#FF5252]'}`}>
                    {h.isHit ? 'ACERTO' : 'ERRO'}
                  </span>
                  <span className="text-[10px] text-white/40 block mt-0.5">Brier: {h.brierScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
