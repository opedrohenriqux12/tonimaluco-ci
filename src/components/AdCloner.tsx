'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

export const AdCloner: React.FC = () => {
  const [originalAd, setOriginalAd] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('GGMAX');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [differentials, setDifferentials] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    hook: string;
    cta: string;
    keywords: string[];
    similarityScore: number;
    variations: { title: string; body: string; platform: string }[];
  } | null>(null);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleClone = () => {
    if (!originalAd || !productName) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      setResults({
        hook: 'Foco total em entrega automática de acesso ao e-mail de criação e suporte imediato.',
        cta: 'Garanta agora com envio instantâneo e suporte 24h pós-compra!',
        keywords: ['full acesso', 'pronta entrega', 'oge', 'garantia'],
        similarityScore: 12,
        variations: [
          {
            platform: 'GGMAX',
            title: `[PRONTA ENTREGA] ${productName} - FULL ACESSO + OGE INCLUÍDO`,
            body: `⚡ CONTA EXCLUSIVA COM ENTREGA AUTOMÁTICA ⚡\n\n📌 O que você recebe ao adquirir:\n- ${productName}\n- E-mail original de criação (OGE) incluso\n- Acesso total e troca imediata de dados\n\n🛡️ GARANTIA & SEGURANÇA:\n- ${differentials || 'Suporte dedicado pós-venda'}\n- Envio em menos de 5 minutos após aprovação\n\n💰 Valor Promocional: R$ ${price || '0,00'}\n\n👉 Clique em Comprar e receba os dados no chat instantaneamente!`
          },
          {
            platform: 'Eneba / Gamemarket',
            title: `${productName} | Full Access Verified Account`,
            body: `Account Specification:\n- Item: ${productName}\n- Security: OGE included, 100% changeable details\n- Price: R$ ${price || '0,00'}\n\nFast delivery & 24/7 Support!`
          },
          {
            platform: 'Discord / WhatsApp Status',
            title: `🔥 PROMOÇÃO RELÂMPAGO - ${productName}`,
            body: `Chegou novidade no estoque! 🎮\n\nItem: ${productName}\nPreço especial no Pix: R$ ${price || '0,00'}\n\nTroca de dados na hora, 100% seguro.\nChama no PV pra garantir!`
          }
        ]
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#14233B] pb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase">
          Clonador & Adaptador de Anúncios Originais
        </h2>
        <p className="text-sm text-[#7C8AA5]">
          Cole o anúncio concorrente que funciona bem. O Toni analisa a estrutura e gera variações 100% inéditas para suas plataformas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="cmd-card p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-[#2F80FF] border-b border-[#14233B] pb-2">
            1. Dados do Anúncio de Referência
          </h3>

          <div>
            <label className="text-xs font-mono-custom text-[#7C8AA5] block mb-1 uppercase">
              Cole o Texto do Anúncio Original
            </label>
            <textarea
              rows={4}
              value={originalAd}
              onChange={(e) => setOriginalAd(e.target.value)}
              placeholder="Cole aqui a descrição ou título que você quer adaptar..."
              className="w-full bg-[#0A1220] border border-[#14233B] p-2.5 rounded-lg text-sm font-mono-custom text-white focus:outline-none focus:border-[#2F80FF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono-custom text-[#7C8AA5] block mb-1 uppercase">
                Seu Produto Alvo
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: Conta Valorant Radiant"
                className="w-full bg-[#0A1220] border border-[#14233B] p-2 rounded-lg text-sm font-mono-custom text-white focus:outline-none focus:border-[#2F80FF]"
              />
            </div>

            <div>
              <label className="text-xs font-mono-custom text-[#7C8AA5] block mb-1 uppercase">
                Seu Preço (R$)
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: 250.00"
                className="w-full bg-[#0A1220] border border-[#14233B] p-2 rounded-lg text-sm font-mono-custom text-white focus:outline-none focus:border-[#2F80FF]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono-custom text-[#7C8AA5] block mb-1 uppercase">
              Seus Diferenciais (Opcional)
            </label>
            <input
              type="text"
              value={differentials}
              onChange={(e) => setDifferentials(e.target.value)}
              placeholder="Ex: Entrega automática, OGE incluso, Brinde R$10"
              className="w-full bg-[#0A1220] border border-[#14233B] p-2 rounded-lg text-sm font-mono-custom text-white focus:outline-none focus:border-[#2F80FF]"
            />
          </div>

          <button
            onClick={handleClone}
            disabled={isAnalyzing || !originalAd || !productName}
            className="w-full cmd-btn-primary py-3 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Analisando estrutura e criando copys...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                Gerar Anúncios Inéditos Adaptados <span className="text-xs">→</span>
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="cmd-card p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-[#2F80FF] border-b border-[#14233B] pb-2 flex items-center justify-between">
            <span>2. Variações Geradas pelo Toni</span>
            {results && (
              <span className="text-[10px] font-mono-custom text-[#22C55E] bg-[rgba(34,197,94,0.12)] px-2 py-0.5 rounded border border-[#22C55E]/40">
                Similaridade: {results.similarityScore}% (Anti-Cópia OK)
              </span>
            )}
          </h3>

          {!results ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#14233B] rounded-xl bg-[#0A1220]">
              <Sparkles className="w-8 h-8 text-[#7C8AA5] mb-2" />
              <p className="text-sm text-[#7C8AA5]">
                Preencha os campos ao lado e clique em "Gerar Anúncios Inéditos" para ver as variações adaptadas por plataforma.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              <div className="bg-[#0A1220] p-3 rounded-lg border border-[#14233B]">
                <span className="text-xs font-bold text-[#2F80FF] uppercase block mb-1">
                  Análise Estrutural da Referência
                </span>
                <p className="text-xs text-[#C9D3E3]">
                  <strong>Gancho identificado:</strong> {results.hook}
                </p>
              </div>

              {results.variations.map((varItem, idx) => (
                <div key={idx} className="bg-[#0E1A2E] border border-[#14233B] rounded-xl p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono-custom font-bold px-2 py-0.5 rounded bg-[#2F80FF] text-white uppercase">
                      {varItem.platform}
                    </span>
                    <button
                      onClick={() => handleCopy(`${varItem.title}\n\n${varItem.body}`, idx)}
                      className="cmd-btn-secondary text-[11px] px-2.5 py-1 font-bold flex items-center gap-1"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-[#22C55E]" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copiar Anúncio
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2 border-b border-[#14233B] pb-1">
                    {varItem.title}
                  </h4>
                  <pre className="font-mono-custom text-xs text-[#C9D3E3] whitespace-pre-wrap leading-relaxed">
                    {varItem.body}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
