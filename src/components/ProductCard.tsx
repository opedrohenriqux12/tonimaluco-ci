'use client';

import React, { useState } from 'react';
import { ProductOpportunity } from '@/types';
import { VerdictStamp } from './VerdictStamp';
import { ChevronDown, ChevronUp, AlertTriangle, RefreshCw, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: ProductOpportunity;
  onAskToni: (product: ProductOpportunity) => void;
  onConsultCouncil?: (product: ProductOpportunity) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAskToni, onConsultCouncil }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customCost, setCustomCost] = useState(product.costBrl);
  const [customPrice, setCustomPrice] = useState(product.avgPriceBrl);
  const [customPlatformFee, setCustomPlatformFee] = useState(12);

  const grossRevenue = customPrice;
  const platformFeeAmount = (grossRevenue * (customPlatformFee / 100)) + 1.0;
  const netProfit = grossRevenue - customCost - platformFeeAmount;
  const marginPercent = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  let liveVerdict: 'INVESTIR' | 'TESTAR' | 'EVITAR' = 'TESTAR';
  if (marginPercent >= 25 && product.riskLevel !== 'alto') {
    liveVerdict = 'INVESTIR';
  } else if (marginPercent < 10 || product.riskLevel === 'alto') {
    liveVerdict = 'EVITAR';
  }

  const scoreColor = liveVerdict === 'INVESTIR' ? '#00E676' : liveVerdict === 'TESTAR' ? '#FFB300' : '#FF5252';

  return (
    <motion.div
      layout
      className="gestoria-card p-6 mb-4 relative"
    >
      {/* Gestoria Glass Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex-1 min-w-[240px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono-custom px-2.5 py-0.5 rounded-full bg-[rgba(1,107,255,0.12)] text-[#00D4FF] border border-[rgba(0,212,255,0.25)] font-semibold uppercase">
              {product.game}
            </span>
            <span className="text-xs text-white/50">
              {product.category}
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white font-sans">
            {product.name}
          </h3>
        </div>

        {/* Gestoria Score & Verdict Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-white/[0.03] px-3.5 py-2 rounded-2xl border border-white/[0.08]">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-9 h-9 transform -rotate-90">
                <circle cx="18" cy="18" r="14" stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="transparent" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  stroke={scoreColor}
                  strokeWidth="3"
                  strokeDasharray={88}
                  strokeDashoffset={88 - (88 * product.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute font-mono-custom text-xs font-bold text-white">
                {product.score}
              </span>
            </div>
            <VerdictStamp verdict={liveVerdict} size="sm" />
          </div>
        </div>
      </div>

      {/* Main Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono-custom text-white/50 block uppercase tracking-wider mb-1">Preço Médio</span>
          <span className="text-lg font-mono-custom font-bold text-white">
            R$ {customPrice.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-mono-custom text-white/50 block uppercase tracking-wider mb-1">Margem Líquida</span>
          <span className={`text-lg font-mono-custom font-bold ${marginPercent >= 20 ? 'text-[#00E676]' : marginPercent > 10 ? 'text-[#FFB300]' : 'text-[#FF5252]'}`}>
            {marginPercent.toFixed(1)}% <span className="text-xs font-normal text-white/60">(R$ {netProfit.toFixed(2)})</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] font-mono-custom text-white/50 block uppercase tracking-wider mb-1">Concorrência</span>
          <span className="text-sm font-semibold text-white uppercase">
            {product.competitionLevel.replace('_', ' ')}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-mono-custom text-white/50 block uppercase tracking-wider mb-1">Liquidez Média</span>
          <span className="text-sm font-mono-custom font-semibold text-white">
            ~{product.liquidityDays} dias
          </span>
        </div>
      </div>

      {/* Anotações do Toni (Gestoria Light Blue Tint Box) */}
      <div className="pt-3 pb-2 my-2 bg-[rgba(1,107,255,0.06)] p-3.5 rounded-xl border-l-4 border-[#016BFF] border border-[rgba(1,107,255,0.15)]">
        <p className="text-xs text-white/80 leading-relaxed font-sans">
          <strong className="text-xs font-mono-custom text-[#00D4FF] uppercase mr-2 font-bold">
            Anotação do Toni:
          </strong>
          {product.reasoning}
        </p>
      </div>

      {/* Action CTA Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="gestoria-cta-wrap">
          <button
            onClick={() => onAskToni(product)}
            className="gestoria-cta-btn text-xs py-2 px-5"
          >
            <span>Consultar no Conselho</span>
            <ArrowUpRight className="w-4 h-4 text-[#00D4FF]" />
          </button>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-mono-custom text-[#00D4FF] hover:underline flex items-center gap-1"
        >
          {isExpanded ? (
            <>Ocultar Simulador <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Simular Custos & "Por que investir?" <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      </div>

      {/* Expanded Interactive Simulator Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/[0.08] bg-black/40 p-4 rounded-xl space-y-4"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00D4FF] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#00D4FF]" />
              Simulador "E Se?" (Ajuste em tempo real)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-mono-custom text-white/50 block mb-1">
                  Seu Custo (R$)
                </label>
                <input
                  type="number"
                  value={customCost}
                  onChange={(e) => setCustomCost(Number(e.target.value))}
                  className="w-full bg-[#05060F] border border-white/[0.1] p-2.5 rounded-xl text-sm font-mono-custom text-white focus:outline-none focus:border-[#016BFF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono-custom text-white/50 block mb-1">
                  Seu Preço Venda (R$)
                </label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full bg-[#05060F] border border-white/[0.1] p-2.5 rounded-xl text-sm font-mono-custom text-white focus:outline-none focus:border-[#016BFF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono-custom text-white/50 block mb-1">
                  Taxa Plataforma (%)
                </label>
                <input
                  type="number"
                  value={customPlatformFee}
                  onChange={(e) => setCustomPlatformFee(Number(e.target.value))}
                  className="w-full bg-[#05060F] border border-white/[0.1] p-2.5 rounded-xl text-sm font-mono-custom text-white focus:outline-none focus:border-[#016BFF]"
                />
              </div>
            </div>

            <div className="bg-[#05060F] border border-white/[0.08] p-3 rounded-xl">
              <span className="text-[11px] font-bold text-[#FF5252] uppercase flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Fatores de Risco
              </span>
              <ul className="list-disc list-inside text-xs text-white/70 space-y-1">
                {product.riskFactors.map((risk, idx) => (
                  <li key={idx}>{risk}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between text-[11px] font-mono-custom text-white/40 pt-2 border-t border-white/[0.08]">
              <span>Confiança: {product.confidenceScore}%</span>
              <span>Fontes: {product.sources.join(', ')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
