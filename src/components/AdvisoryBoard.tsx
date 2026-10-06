'use client';

import React, { useState } from 'react';
import { AdvisoryMember, ProductOpportunity } from '@/types';
import { generateDynamicCouncilAnswers } from '@/lib/dynamicCouncilEngine';
import { Send, Users, ShieldAlert, Sparkles, MessageSquare, Plus, Check, UserCheck, Flame } from 'lucide-react';
import { MOCK_ADVISORS } from '@/data/mockData';

interface AdvisoryBoardProps {
  productContext?: ProductOpportunity | null;
  onCloseProductContext?: () => void;
}

export const AdvisoryBoard: React.FC<AdvisoryBoardProps> = ({
  productContext,
  onCloseProductContext
}) => {
  // Modes: 'todos' (Chat com Todos os 7), 'individual' (1-a-1), 'war_room' (War Room com selecionados)
  const [chatMode, setChatMode] = useState<'todos' | 'individual' | 'war_room'>('todos');
  
  // Active selected single advisor for 'individual' mode
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>('helena');
  
  // Active selected advisor IDs for 'war_room' mode (default: Dra. Helena & Marina Duarte)
  const [warRoomAdvisorIds, setWarRoomAdvisorIds] = useState<string[]>(['helena', 'marina']);

  const [inputMessage, setInputMessage] = useState<string>('');

  // Unified Chat Conversations History for each channel mode
  const [messages, setMessages] = useState<{
    todos: { sender: string; text: string; time: string; color?: string }[];
    war_room: { sender: string; text: string; time: string; color?: string }[];
    individual: Record<string, { sender: string; text: string; time: string; color?: string }[]>;
  }>({
    todos: [
      {
        sender: 'ToniMaluco (Presidente)',
        text: 'Bem-vindo ao Plenário do Conselho! Todos os 7 conselheiros estão ouvindo. Envie sua pergunta e veja o debate em grupo.',
        time: '15:45',
        color: '#016BFF'
      }
    ],
    war_room: [
      {
        sender: 'ToniMaluco (Presidente)',
        text: 'War Room aberta! Esta sala reúne exclusivamente os conselheiros selecionados para um alinhamento tático rápido.',
        time: '15:45',
        color: '#00D4FF'
      }
    ],
    individual: {
      helena: [{ sender: 'Dra. Helena Cordeiro', text: 'Olá! Como posso ajudar na gestão financeira e de caixa do seu investimento?', time: '15:45', color: '#D8432B' }],
      rafael: [{ sender: 'Dr. Rafael Menezes', text: 'Saudações. Qual a sua dúvida sobre Termos de Uso (TOS) ou regras legais nos marketplaces?', time: '15:45', color: '#8A8578' }],
      byte: [{ sender: 'Bruno "Byte" Takahashi', text: 'Fala! Que processo ou automação você quer validar de forma simples hoje?', time: '15:45', color: '#E0A526' }],
      icaro: [{ sender: 'Prof. Ícaro Valadares', text: 'Olá. Qual hipótese você quer testar com dados de probabilidade?', time: '15:45', color: '#3B82F6' }],
      marina: [{ sender: 'Marina Duarte', text: 'Oi! Quer criar um gancho de vendas matador ou ajustar a precificação do anúncio?', time: '15:45', color: '#1F6B4F' }],
      ze: [{ sender: 'Seu Zé Antunes', text: 'Opa! Que fornecedor ou transação você quer checar pra não tomar golpe?', time: '15:45', color: '#D97706' }],
      lucia: [{ sender: 'Dra. Lúcia Prado', text: 'Olá! Qual tese você quer colocar à prova como Advogada do Diabo?', time: '15:45', color: '#8B5CF6' }]
    }
  });

  const toggleWarRoomAdvisor = (id: string) => {
    if (warRoomAdvisorIds.includes(id)) {
      if (warRoomAdvisorIds.length <= 2) {
        alert('War Room precisa de no mínimo 2 conselheiros selecionados.');
        return;
      }
      setWarRoomAdvisorIds(warRoomAdvisorIds.filter((item) => item !== id));
    } else {
      setWarRoomAdvisorIds([...warRoomAdvisorIds, id]);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgObj = { sender: 'Você', text: userText, time: timeNow };

    setInputMessage('');

    if (chatMode === 'todos') {
      // Send message to "Todos" channel
      setMessages((prev) => ({
        ...prev,
        todos: [...prev.todos, userMsgObj]
      }));

      // All 7 advisors respond in sequence
      setTimeout(() => {
        const answers = generateDynamicCouncilAnswers(userText, productContext);
        const botAnswers = answers.map((ans) => ({
          sender: ans.advisorName,
          text: ans.answerText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          color: ans.color
        }));

        setMessages((prev) => ({
          ...prev,
          todos: [...prev.todos, ...botAnswers]
        }));
      }, 700);

    } else if (chatMode === 'war_room') {
      // Send message to "War Room" channel
      setMessages((prev) => ({
        ...prev,
        war_room: [...prev.war_room, userMsgObj]
      }));

      // Only selected War Room advisors respond
      setTimeout(() => {
        const answers = generateDynamicCouncilAnswers(userText, productContext);
        const selectedAdvisors = MOCK_ADVISORS.filter((adv) => warRoomAdvisorIds.includes(adv.id));

        const warRoomResponses = selectedAdvisors.map((adv) => {
          const ans = answers.find((a) => a.advisorName.includes(adv.name.split(' ')[0])) || answers[0];
          return {
            sender: adv.name,
            text: ans.answerText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: adv.color
          };
        });

        setMessages((prev) => ({
          ...prev,
          war_room: [...prev.war_room, ...warRoomResponses]
        }));
      }, 700);

    } else if (chatMode === 'individual') {
      // Send message to 1-on-1 advisor channel
      const selectedAdv = MOCK_ADVISORS.find((a) => a.id === selectedAdvisorId) || MOCK_ADVISORS[0];
      const currentAdvChat = messages.individual[selectedAdvisorId] || [];

      setMessages((prev) => ({
        ...prev,
        individual: {
          ...prev.individual,
          [selectedAdvisorId]: [...currentAdvChat, userMsgObj]
        }
      }));

      setTimeout(() => {
        const answers = generateDynamicCouncilAnswers(userText, productContext);
        const ans = answers.find((a) => a.advisorName.includes(selectedAdv.name.split(' ')[0])) || answers[0];

        setMessages((prev) => ({
          ...prev,
          individual: {
            ...prev.individual,
            [selectedAdvisorId]: [
              ...(prev.individual[selectedAdvisorId] || []),
              {
                sender: selectedAdv.name,
                text: ans.answerText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                color: selectedAdv.color
              }
            ]
          }
        }));
      }, 700);
    }
  };

  const currentMessages =
    chatMode === 'todos'
      ? messages.todos
      : chatMode === 'war_room'
      ? messages.war_room
      : messages.individual[selectedAdvisorId] || [];

  return (
    <div className="space-y-6">
      {/* Top Bar Header & Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase flex items-center gap-2">
            <Users className="w-6 h-6 text-[#016BFF]" />
            Conselho do ToniMaluco — Chat & War Rooms
          </h2>
          <p className="text-sm text-white/60">
            Converse com todos os 7 especialistas juntos, monte War Rooms táticas ou converse em 1-a-1.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/[0.08] gap-1">
          <button
            onClick={() => setChatMode('todos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chatMode === 'todos'
                ? 'bg-[#016BFF] text-white shadow-[0_4px_15px_rgba(1,107,255,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>Todos os 7 Conselheiros</span>
          </button>

          <button
            onClick={() => setChatMode('war_room')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chatMode === 'war_room'
                ? 'bg-[#016BFF] text-white shadow-[0_4px_15px_rgba(1,107,255,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#FFB300]" />
            <span>War Room ({warRoomAdvisorIds.length})</span>
          </button>

          <button
            onClick={() => setChatMode('individual')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chatMode === 'individual'
                ? 'bg-[#016BFF] text-white shadow-[0_4px_15px_rgba(1,107,255,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#00E676]" />
            <span>Chat 1-a-1</span>
          </button>
        </div>
      </div>

      {/* Main Chat Body Grid */}
      <div className="gestoria-card grid grid-cols-1 md:grid-cols-4 min-h-[550px] overflow-hidden border border-white/[0.08]">
        {/* Left Sidebar: Context & Selection */}
        <div className="md:col-span-1 border-r border-white/[0.08] bg-black/40 p-4 space-y-4 overflow-y-auto">
          {chatMode === 'todos' && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono-custom text-white/40 uppercase tracking-wider block">
                Integrantes da Mesa (7)
              </span>
              {MOCK_ADVISORS.map((adv) => (
                <div key={adv.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: adv.color }} />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{adv.name}</h5>
                    <span className="text-[10px] text-white/50 block truncate font-mono-custom">{adv.role}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {chatMode === 'war_room' && (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono-custom text-[#FFB300] uppercase tracking-wider block font-bold mb-1">
                  Configurar Integrantes da War Room
                </span>
                <p className="text-[11px] text-white/60">
                  Marque 2 ou mais conselheiros para debaterem exclusivamente sobre sua dúvida:
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                {MOCK_ADVISORS.map((adv) => {
                  const isChecked = warRoomAdvisorIds.includes(adv.id);
                  return (
                    <button
                      key={adv.id}
                      onClick={() => toggleWarRoomAdvisor(adv.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#FFB300]/15 border-[#FFB300] text-white font-bold'
                          : 'bg-white/[0.02] border-white/[0.05] text-white/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: adv.color }} />
                        <span className="truncate">{adv.name}</span>
                      </div>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#FFB300]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {chatMode === 'individual' && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono-custom text-white/40 uppercase tracking-wider block mb-2">
                Selecione o Conselheiro:
              </span>
              {MOCK_ADVISORS.map((adv) => {
                const isSelected = adv.id === selectedAdvisorId;
                return (
                  <button
                    key={adv.id}
                    onClick={() => setSelectedAdvisorId(adv.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#016BFF]/20 border-[#016BFF] text-white font-bold shadow-[0_4px_15px_rgba(1,107,255,0.2)]'
                        : 'bg-white/[0.02] border-white/[0.05] text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: adv.color }} />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs truncate">{adv.name}</h4>
                      <span className="text-[10px] text-white/40 block truncate font-mono-custom">{adv.role}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Content Area: Active Messages Thread */}
        <div className="md:col-span-3 flex flex-col justify-between bg-black/20 p-6 space-y-4">
          {/* Header Info Banner */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {chatMode === 'todos' && 'Plenário — Chat com os 7 Conselheiros'}
                {chatMode === 'war_room' && `War Room Ativa (${warRoomAdvisorIds.length} Conselheiros)`}
                {chatMode === 'individual' && `Conversa 1-a-1 com ${MOCK_ADVISORS.find((a) => a.id === selectedAdvisorId)?.name}`}
              </h3>
              <p className="text-xs text-white/50 font-mono-custom">
                {chatMode === 'todos' && 'Sua pergunta é respondida por cada conselheiro trazendo sua perspectiva.'}
                {chatMode === 'war_room' && 'Debate restrito apenas aos conselheiros marcados na lista ao lado.'}
                {chatMode === 'individual' && MOCK_ADVISORS.find((a) => a.id === selectedAdvisorId)?.signatureQuestion}
              </p>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-[350px] max-h-[420px]">
            {currentMessages.map((msg, idx) => {
              const isUser = msg.sender === 'Você';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl border ${
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
              placeholder={
                chatMode === 'todos'
                  ? 'Pergunte aos 7 conselheiros no plenário...'
                  : chatMode === 'war_room'
                  ? 'Pergunte na War Room tática...'
                  : `Enviar mensagem para ${MOCK_ADVISORS.find((a) => a.id === selectedAdvisorId)?.name}...`
              }
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
