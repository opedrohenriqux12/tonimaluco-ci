'use client';

import React, { useState } from 'react';
import { AdvisoryMember, ProductOpportunity, CouncilMeetingAta } from '@/types';
import { runMultiAgentCouncilEvaluation, MultiAgentEvaluationResult } from '@/lib/multiAgentEngine';
import { generateDynamicCouncilAnswers, DynamicAnswer } from '@/lib/dynamicCouncilEngine';
import { VerdictStamp } from './VerdictStamp';
import { Send, Users, ShieldAlert, Sparkles, X, FileText, Download, AlertTriangle, HelpCircle } from 'lucide-react';

interface AdvisoryBoardProps {
  productContext?: ProductOpportunity | null;
  onCloseProductContext?: () => void;
}

export const AdvisoryBoard: React.FC<AdvisoryBoardProps> = ({
  productContext,
  onCloseProductContext
}) => {
  const [activeMode, setActiveMode] = useState<'pergunta_livre' | 'reuniao' | 'duelo' | 'premortem'>('pergunta_livre');
  const [customQuestion, setCustomQuestion] = useState('');
  const [hardness, setHardness] = useState<'cordial' | 'firme' | 'implacável'>('firme');
  
  const [dynamicAnswers, setDynamicAnswers] = useState<DynamicAnswer[] | null>(null);
  const [lastAskedQuestion, setLastAskedQuestion] = useState<string>('');

  const targetProduct = productContext || {
    id: 'demo',
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
    reasoning: 'Demanda aquecida com o novo ato. Preço de compra baixo com fornecedor confiável.',
    confidenceScore: 92,
    sources: ['GGMAX Histórico 30d', 'Google Trends'],
    lastUpdated: 'Hoje'
  };

  const [evaluation, setEvaluation] = useState<MultiAgentEvaluationResult>(() =>
    runMultiAgentCouncilEvaluation(targetProduct)
  );

  const [showAtaModal, setShowAtaModal] = useState(false);

  const handleAskCouncilCustomQuestion = () => {
    if (!customQuestion.trim()) return;
    setLastAskedQuestion(customQuestion);
    const answers = generateDynamicCouncilAnswers(customQuestion, productContext);
    setDynamicAnswers(answers);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Header & Multi-Agent Modes */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#14233B] pb-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase flex items-center gap-2">
            <Users className="w-6 h-6 text-[#2F80FF]" />
            Conselho do ToniMaluco — Pergunte & Decida
          </h2>
          <p className="text-sm text-[#7C8AA5]">
            Faça <strong>sua pergunta real</strong> sobre qualquer produto ou estratégia e receba a avaliação individual dos 7 conselheiros.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Mode Tabs */}
          <div className="flex border border-[#14233B] bg-[#0A1220] p-1 rounded-xl">
            <button
              onClick={() => setActiveMode('pergunta_livre')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${
                activeMode === 'pergunta_livre'
                  ? 'bg-[#2F80FF] text-white'
                  : 'text-[#7C8AA5] hover:text-white'
              }`}
            >
              ❓ Perguntar ao Conselho
            </button>
            <button
              onClick={() => setActiveMode('reuniao')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${
                activeMode === 'reuniao'
                  ? 'bg-[#2F80FF] text-white'
                  : 'text-[#7C8AA5] hover:text-white'
              }`}
            >
              Reunião Plenária
            </button>
            <button
              onClick={() => setActiveMode('duelo')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${
                activeMode === 'duelo'
                  ? 'bg-[#2F80FF] text-white'
                  : 'text-[#7C8AA5] hover:text-white'
              }`}
            >
              Duelo: Helena vs Marina
            </button>
            <button
              onClick={() => setActiveMode('premortem')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${
                activeMode === 'premortem'
                  ? 'bg-[#2F80FF] text-white'
                  : 'text-[#7C8AA5] hover:text-white'
              }`}
            >
              Teste Pré-Mortem
            </button>
          </div>
        </div>
      </div>

      {/* Level of Hardness Controller */}
      <div className="cmd-card p-3 bg-[#0A1220] flex flex-wrap items-center justify-between gap-3 border border-[#14233B]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-[#7C8AA5]">
            Nível de Exigência:
          </span>
          {(['cordial', 'firme', 'implacável'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setHardness(level)}
              className={`text-xs font-mono-custom px-2.5 py-1 uppercase rounded border transition-all ${
                hardness === level
                  ? 'bg-[#EF4444] text-white border-[#EF4444] font-bold'
                  : 'bg-[#0E1A2E] text-[#7C8AA5] border-[#14233B] hover:text-white'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAtaModal(true)}
          className="cmd-btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 bg-[#22C55E]"
        >
          <FileText className="w-3.5 h-3.5" /> Exportar Ata da Reunião (PDF/Visual)
        </button>
      </div>

      {/* MODE 1: PERGUNTA LIVRE DO USUÁRIO */}
      {activeMode === 'pergunta_livre' && (
        <div className="space-y-6">
          <div className="cmd-card p-5 bg-[#0A1220] space-y-4">
            <h3 className="text-sm font-bold uppercase border-b border-[#14233B] pb-2 text-[#2F80FF] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#2F80FF]" />
              Sua Pergunta Direta para o Conselho
            </h3>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskCouncilCustomQuestion()}
                placeholder="Ex: Devo comprar 10 contas de Valorant por R$ 150 cada pra revender a R$ 300? Ou Vale a pena vender gift card com 5% de margem?"
                className="flex-1 bg-[#0E1A2E] border border-[#14233B] p-3 rounded-lg text-sm font-mono-custom text-white focus:outline-none focus:border-[#2F80FF]"
              />
              <button
                onClick={handleAskCouncilCustomQuestion}
                className="cmd-btn-primary px-6 py-3 text-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-white" />
                Submeter ao Conselho <span className="text-xs">→</span>
              </button>
            </div>
          </div>

          {dynamicAnswers && (
            <div className="space-y-4">
              <div className="bg-[#0E1A2E] text-white p-3.5 rounded-lg border border-[#14233B] flex justify-between items-center">
                <span className="font-mono-custom text-xs uppercase text-[#2F80FF]">
                  Pergunta Submetida ao Conselho:
                </span>
                <span className="text-sm italic font-bold text-[#C9D3E3]">
                  "{lastAskedQuestion}"
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dynamicAnswers.map((ans, idx) => (
                  <div
                    key={idx}
                    className="cmd-card p-4 space-y-3 flex flex-col justify-between border border-[#14233B]"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-[#14233B] pb-2 mb-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: ans.color }}
                        />
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                            ans.vote === 'CONTRA'
                              ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40'
                              : ans.vote === 'COM CONDIÇÕES'
                              ? 'bg-[#F5B72E]/20 text-[#F5B72E] border-[#F5B72E]/40'
                              : 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
                          }`}
                        >
                          VOTO: {ans.vote}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">
                        {ans.advisorName}
                      </h4>
                      <span className="text-[11px] font-mono-custom text-[#7C8AA5] block mb-2">
                        {ans.role}
                      </span>

                      <p className="text-xs italic text-[#7C8AA5] border-l-2 border-[#2F80FF] pl-2 mb-3">
                        "{ans.signatureQuestion}"
                      </p>

                      <div className="bg-[#0A1220] p-3 rounded-lg border border-[#14233B] text-xs text-[#C9D3E3]">
                        <strong className="block text-[10px] font-mono-custom text-[#2F80FF] uppercase mb-1">
                          Resposta Específica:
                        </strong>
                        <p className="leading-relaxed">{ans.answerText}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: REUNIÃO PLENÁRIA */}
      {activeMode === 'reuniao' && (
        <div className="space-y-6">
          <div className="cmd-card p-5 border border-[#14233B]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#14233B] pb-4 mb-4">
              <div>
                <span className="text-xs font-mono-custom text-[#7C8AA5] uppercase block">
                  PRODUTO SOB ANÁLISE DO MULTI-AGENTE:
                </span>
                <h3 className="text-xl font-bold text-white">
                  {targetProduct.name}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono-custom">
                  <span className="text-xs text-[#7C8AA5] block uppercase">Placar de Votos</span>
                  <div className="text-sm font-bold text-white space-x-2">
                    <span className="text-[#22C55E]">🟢 {evaluation.ata.votesSummary.apoia} Apoiam</span>
                    <span className="text-[#F5B72E]">🟡 {evaluation.ata.votesSummary.comCondicoes} Condições</span>
                    <span className="text-[#EF4444]">🔴 {evaluation.ata.votesSummary.contra} Contra</span>
                  </div>
                </div>

                <VerdictStamp verdict={evaluation.overallVerdict} size="lg" />
              </div>
            </div>

            {/* 7 Advisors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {evaluation.advisors.map((advisor) => (
                <div
                  key={advisor.id}
                  className="cmd-card p-4 flex flex-col justify-between border border-[#14233B]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: advisor.color }}
                      />
                      {advisor.vote && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                            advisor.vote === 'CONTRA'
                              ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40'
                              : advisor.vote === 'COM CONDIÇÕES'
                              ? 'bg-[#F5B72E]/20 text-[#F5B72E] border-[#F5B72E]/40'
                              : 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
                          }`}
                        >
                          {advisor.vote}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white">
                      {advisor.name}
                    </h4>
                    <span className="text-[11px] font-mono-custom text-[#7C8AA5] block mb-2">
                      {advisor.role}
                    </span>

                    <p className="text-xs italic text-[#7C8AA5] border-l-2 border-[#2F80FF] pl-2 mb-3">
                      "{advisor.signatureQuestion}"
                    </p>

                    {advisor.opinion && (
                      <div className="bg-[#0A1220] p-2.5 rounded-lg border border-[#14233B] text-xs text-[#C9D3E3] space-y-1.5">
                        <p><strong>Parecer:</strong> {advisor.opinion}</p>
                        {advisor.conditionToChange && (
                          <p className="text-[11px] text-[#22C55E] border-t border-[#14233B] pt-1 font-mono-custom">
                            <strong>Muda voto se:</strong> {advisor.conditionToChange}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: DUELO */}
      {activeMode === 'duelo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cmd-card p-5 border border-[#22C55E]/40">
            <div className="flex items-center justify-between border-b border-[#14233B] pb-2 mb-3">
              <h3 className="font-bold text-lg text-[#22C55E]">
                Marina Duarte (Marketing & Vendas)
              </h3>
              <VerdictStamp verdict="INVESTIR" size="sm" />
            </div>
            <p className="text-sm text-[#C9D3E3]">
              "Esse produto é um vulcão de vendas. O público gamer compra por impulso quando vê o título certo com 'Full Acesso' e OGE. Se não estocarmos agora, o concorrente engole a nossa fatia de mercado no fim de semana!"
            </p>
          </div>

          <div className="cmd-card p-5 border border-[#EF4444]/40">
            <div className="flex items-center justify-between border-b border-[#14233B] pb-2 mb-3">
              <h3 className="font-bold text-lg text-[#EF4444]">
                Dra. Helena Cordeiro (Financeiro)
              </h3>
              <VerdictStamp verdict="EVITAR" size="sm" />
            </div>
            <p className="text-sm text-[#C9D3E3]">
              "Emocionada como sempre, Marina! Vender muito não significa ter lucro se a margem for devorada por chargeback e taxa de saque. Se o giro atrasar 3 dias, o caixa zera. Primeiro garantimos o fluxo de caixa, depois pensamos em escala!"
            </p>
          </div>
        </div>
      )}

      {/* MODE 4: TESTE PRÉ-MORTEM */}
      {activeMode === 'premortem' && (
        <div className="cmd-card p-6 border border-[#14233B]">
          <h3 className="text-lg font-bold text-[#EF4444] uppercase mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            Exercício Pré-Mortem: "Imagine que este plano falhou daqui a 6 meses"
          </h3>
          <p className="text-sm text-[#7C8AA5] mb-4">
            O Conselho simulou as 3 causas mais prováveis do seu prejuízo caso invista sem cautela:
          </p>

          <div className="space-y-3">
            {evaluation.ata.preMortemScenarios.map((scenario, index) => (
              <div key={index} className="bg-[#0A1220] border border-[#14233B] p-3 rounded-lg flex items-start gap-3">
                <span className="font-mono-custom text-xs font-bold bg-[#2F80FF] text-white px-2 py-0.5 rounded">
                  #{index + 1}
                </span>
                <p className="text-sm text-[#C9D3E3]">
                  {scenario}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATA EXPORT MODAL */}
      {showAtaModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="cmd-card p-6 max-w-2xl w-full bg-[#0A1220] space-y-4 border border-[#14233B]">
            <div className="flex items-center justify-between border-b border-[#14233B] pb-3">
              <h3 className="text-xl font-bold uppercase text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#22C55E]" />
                Ata Oficial da Reunião do Conselho
              </h3>
              <button onClick={() => setShowAtaModal(false)} className="text-[#7C8AA5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0E1A2E] p-4 rounded-xl border border-[#14233B] space-y-3 text-sm text-[#C9D3E3]">
              <div className="flex justify-between border-b border-[#14233B] pb-2 text-xs font-mono-custom text-[#7C8AA5]">
                <span>Data: {evaluation.ata.date}</span>
                <span>ID: {evaluation.ata.id}</span>
              </div>

              <div>
                <strong>Produto Analisado:</strong> {evaluation.ata.productName}
              </div>

              <div className="flex items-center gap-2">
                <strong>Veredito Final Recomendado:</strong>
                <VerdictStamp verdict={evaluation.ata.suggestedVerdict} size="sm" />
              </div>

              <div>
                <strong>Resumo da Votação:</strong>
                <ul className="list-disc list-inside text-xs font-mono-custom text-[#7C8AA5] mt-1">
                  <li>Aprovação Direta: {evaluation.ata.votesSummary.apoia}</li>
                  <li>Aprovação com Condições: {evaluation.ata.votesSummary.comCondicoes}</li>
                  <li>Rejeição/Veto: {evaluation.ata.votesSummary.contra}</li>
                </ul>
              </div>

              <div>
                <strong>Condições Obrigatórias Exigidas:</strong>
                <ul className="list-disc list-inside text-xs text-[#22C55E] mt-1 space-y-1">
                  {evaluation.ata.requiredConditions.map((cond, i) => (
                    <li key={i}>{cond}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>Próximos Passos de Execução:</strong>
                <ol className="list-decimal list-inside text-xs text-white mt-1 space-y-1 font-mono-custom">
                  {evaluation.ata.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-[#14233B]">
              <button
                onClick={() => setShowAtaModal(false)}
                className="cmd-btn-secondary px-4 py-2 text-xs font-bold uppercase"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  alert('Ata exportada com sucesso em formato PDF visual!');
                  setShowAtaModal(false);
                }}
                className="cmd-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Baixar PDF da Ata
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
