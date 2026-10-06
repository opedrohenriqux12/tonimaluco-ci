'use client';

import React, { useState } from 'react';
import { AdvisoryMember, ProductOpportunity, CouncilMeetingAta } from '@/types';
import { runMultiAgentCouncilEvaluation, MultiAgentEvaluationResult } from '@/lib/multiAgentEngine';
import { generateDynamicCouncilAnswers, DynamicAnswer } from '@/lib/dynamicCouncilEngine';
import { VerdictStamp } from './VerdictStamp';
import { Send, Users, ShieldAlert, Sparkles, X, FileText, Download, AlertTriangle, MessageSquare, ChevronDown } from 'lucide-react';
import { MOCK_ADVISORS } from '@/data/mockData';

interface AdvisoryBoardProps {
  productContext?: ProductOpportunity | null;
  onCloseProductContext?: () => void;
}

export const AdvisoryBoard: React.FC<AdvisoryBoardProps> = ({
  productContext,
  onCloseProductContext
}) => {
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>('helena');
  const [inputMessage, setInputMessage] = useState<string>('');
  
  // Direct Chat Conversation History per Advisor
  const [conversations, setConversations] = useState<
    Record<string, { sender: string; text: string; time: string; color?: string }[]>
  >({
    helena: [
      {
        sender: 'Dra. Helena Cordeiro',
        text: 'Olá! Sou a Dra. Helena. Cuido do fluxo de caixa e da sustentabilidade financeira do seu negócio. Qual investimento ou custo você quer analisar comigo agora?',
        time: '15:28',
        color: '#D8432B'
      }
    ],
    rafael: [
      {
        sender: 'Dr. Rafael Menezes',
        text: 'Saudações. Sou o Dr. Rafael. Minha responsabilidade é garantir que você não tome bans nem enfrente disputas legais ou violações de TOS nos marketplaces. Como posso ajudar?',
        time: '15:28',
        color: '#8A8578'
      }
    ],
    byte: [
      {
        sender: 'Bruno "Byte" Takahashi',
        text: 'Fala! Sou o Byte. Odeio automação desnecessária e código complexo antes de validar na mão. O que você quer operacionalizar hoje?',
        time: '15:28',
        color: '#E0A526'
      }
    ],
    icaro: [
      {
        sender: 'Prof. Ícaro Valadares',
        text: 'Olá. Sou o Prof. Ícaro. Trago números, dados de probabilidade e testes estatísticos. Qual decisão você precisa fundamentar com dados?',
        time: '15:28',
        color: '#3B82F6'
      }
    ],
    marina: [
      {
        sender: 'Marina Duarte',
        text: 'Oi! Sou a Marina. Meu foco é conversão, copy gamer e estratégias de vendas rápidas. Quer criar um gancho matador para o seu anúncio?',
        time: '15:28',
        color: '#1F6B4F'
      }
    ],
    ze: [
      {
        sender: 'Seu Zé Antunes',
        text: 'Opa, tudo certo? Sou o Seu Zé. Conheço os atalhos e os golpes desse mercado há anos. O que você quer checar pra não tomar calote?',
        time: '15:28',
        color: '#D97706'
      }
    ],
    lucia: [
      {
        sender: 'Dra. Lúcia Prado',
        text: 'Olá. Sou a Dra. Lúcia. Meu papel é ser a advogada do diabo e expor os vieses cognitivos da sua decisão. Qual ideia você quer testar comigo?',
        time: '15:28',
        color: '#8B5CF6'
      }
    ]
  });

  const selectedAdvisor = MOCK_ADVISORS.find((a) => a.id === selectedAdvisorId) || MOCK_ADVISORS[0];
  const currentChat = conversations[selectedAdvisorId] || [];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMsgText = inputMessage;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedUserChat = [
      ...currentChat,
      { sender: 'Você', text: userMsgText, time: timeNow }
    ];

    setConversations({
      ...conversations,
      [selectedAdvisorId]: updatedUserChat
    });

    setInputMessage('');

    // Dynamic Advisor Answer Engine specific to the active advisor
    setTimeout(() => {
      const answers = generateDynamicCouncilAnswers(userMsgText, productContext);
      const advisorAnswerObj = answers.find(a => a.advisorName.includes(selectedAdvisor.name.split(' ')[0])) || answers[0];

      setConversations((prev) => ({
        ...prev,
        [selectedAdvisorId]: [
          ...(prev[selectedAdvisorId] || []),
          {
            sender: selectedAdvisor.name,
            text: advisorAnswerObj.answerText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: selectedAdvisor.color
          }
        ]
      }));
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#016BFF]" />
            Chat Direto com os Conselheiros
          </h2>
          <p className="text-sm text-white/60">
            Selecione um especialista e converse em tempo real para tirar dúvidas e validar estratégias.
          </p>
        </div>
      </div>

      {/* Main Chat Layout: Left Advisor Selector Bar + Right Messaging Thread */}
      <div className="gestoria-card grid grid-cols-1 md:grid-cols-4 min-h-[550px] overflow-hidden border border-white/[0.08]">
        {/* Left Bar: Advisor Selection Cards */}
        <div className="md:col-span-1 border-r border-white/[0.08] bg-black/40 p-3 space-y-2 overflow-y-auto">
          <span className="text-[10px] font-mono-custom text-white/40 uppercase tracking-wider block px-2 mb-2">
            Escolha um Conselheiro:
          </span>
          {MOCK_ADVISORS.map((adv) => {
            const isSelected = adv.id === selectedAdvisorId;
            return (
              <button
                key={adv.id}
                onClick={() => setSelectedAdvisorId(adv.id)}
                className={`w-full text-left p-3 rounded-xl transition-all border flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#016BFF]/20 border-[#016BFF] text-white shadow-[0_4px_15px_rgba(1,107,255,0.2)]'
                    : 'bg-white/[0.02] border-white/[0.05] text-white/70 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: adv.color }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold truncate text-white">{adv.name}</h4>
                  <span className="text-[10px] text-white/50 block truncate font-mono-custom">{adv.role}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Bar: Active Conversation Window */}
        <div className="md:col-span-3 flex flex-col justify-between bg-black/20 p-6 space-y-4">
          {/* Active Advisor Info Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: selectedAdvisor.color }}
              />
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {selectedAdvisor.name}
                  <span className="text-[10px] font-mono-custom px-2 py-0.5 rounded bg-white/10 text-white/70 font-normal">
                    {selectedAdvisor.role}
                  </span>
                </h3>
                <p className="text-xs text-white/60 italic font-mono-custom">
                  "{selectedAdvisor.signatureQuestion}"
                </p>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-[350px] max-h-[420px]">
            {currentChat.map((msg, idx) => {
              const isUser = msg.sender === 'Você';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl border ${
                      isUser
                        ? 'bg-[#016BFF] text-white border-[#016BFF] rounded-br-none shadow-[0_4px_15px_rgba(1,107,255,0.3)]'
                        : 'bg-[#0A0D1D] text-white/90 border-white/10 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] font-mono-custom opacity-70 mb-1 border-b border-white/10 pb-1">
                      <strong style={{ color: isUser ? '#FFFFFF' : msg.color }}>{msg.sender}</strong>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-xs font-sans leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Chat Controls */}
          <div className="flex gap-3 pt-2 border-t border-white/[0.08]">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Enviar mensagem para ${selectedAdvisor.name}...`}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono-custom text-white focus:outline-none focus:border-[#016BFF]"
            />
            <div className="gestoria-cta-wrap">
              <button
                onClick={handleSendMessage}
                className="gestoria-cta-btn text-xs py-3 px-5"
              >
                <span>Enviar</span>
                <Send className="w-3.5 h-3.5 text-[#00D4FF]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
