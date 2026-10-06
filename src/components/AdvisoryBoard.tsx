'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ProductOpportunity } from '@/types';
import { Send, Users, MessageSquare, Check, Flame, AlertTriangle, X, Trash2 } from 'lucide-react';
import { MOCK_ADVISORS } from '@/data/mockData';
import {
  makeMessage,
  runGroupTurn,
  runIndividualTurn,
  type RoomMessage,
} from '@/lib/council/orchestrator';

interface AdvisoryBoardProps {
  productContext?: ProductOpportunity | null;
  onCloseProductContext?: () => void;
}

type ChatMode = 'todos' | 'war_room' | 'individual';

interface Rooms {
  todos: RoomMessage[];
  war_room: RoomMessage[];
  individual: Record<string, RoomMessage[]>;
}

const ALL_IDS = MOCK_ADVISORS.map((a) => a.id);
const advisorById = (id: string) => MOCK_ADVISORS.find((a) => a.id === id);

/** Resumo do produto que originou a conversa (vai como pauta para os conselheiros). */
function describeProduct(p: ProductOpportunity): string {
  return [
    `Produto: ${p.name} (${p.category}, ${p.game})`,
    `Custo: R$ ${p.costBrl.toFixed(2)} | Preço médio: R$ ${p.avgPriceBrl.toFixed(2)} | Margem estimada: ${p.estimatedMarginPercent}%`,
    `Demanda: ${p.demandTrend} | Concorrência: ${p.competitionLevel} | Liquidez: ${p.liquidityDays} dias | Risco: ${p.riskLevel}`,
    p.riskFactors?.length ? `Fatores de risco: ${p.riskFactors.join('; ')}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/** Renderização leve: quebras de linha preservadas e **negrito**. */
function renderText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith('**') && chunk.endsWith('**') ? <strong key={i}>{chunk.slice(2, -2)}</strong> : <React.Fragment key={i}>{chunk}</React.Fragment>
  );
}

export const AdvisoryBoard: React.FC<AdvisoryBoardProps> = ({ productContext, onCloseProductContext }) => {
  const [chatMode, setChatMode] = useState<ChatMode>('todos');
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>('helena');
  const [warRoomAdvisorIds, setWarRoomAdvisorIds] = useState<string[]>(['helena', 'marina']);
  const [inputMessage, setInputMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [typingId, setTypingId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Rooms>({ todos: [], war_room: [], individual: {} });
  const feedRef = useRef<HTMLDivElement>(null);

  const agendaContext = productContext ? describeProduct(productContext) : undefined;

  const currentMessages =
    chatMode === 'todos' ? rooms.todos : chatMode === 'war_room' ? rooms.war_room : rooms.individual[selectedAdvisorId] || [];

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  }, [currentMessages.length, typingId]);

  const toggleWarRoomAdvisor = (id: string) => {
    if (busy) return;
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

  /** Anexa mensagem na sala de origem (mesmo que o usuário troque de aba durante a rodada). */
  const appendTo = (mode: ChatMode, advisorId: string, msg: RoomMessage) => {
    setRooms((prev) => {
      if (mode === 'individual') {
        return { ...prev, individual: { ...prev.individual, [advisorId]: [...(prev.individual[advisorId] || []), msg] } };
      }
      return { ...prev, [mode]: [...prev[mode], msg] };
    });
  };

  const clearCurrentRoom = () => {
    if (busy) return;
    setRooms((prev) =>
      chatMode === 'individual'
        ? { ...prev, individual: { ...prev.individual, [selectedAdvisorId]: [] } }
        : { ...prev, [chatMode]: [] }
    );
  };

  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text || busy) return;

    const mode = chatMode;
    const advisorId = selectedAdvisorId;
    const userMsg = makeMessage('user', text);
    const history = [...currentMessages, userMsg];

    setInputMessage('');
    setBusy(true);
    appendTo(mode, advisorId, userMsg);

    const callbacks = {
      onTyping: setTypingId,
      onMessage: (msg: RoomMessage) => appendTo(mode, advisorId, msg),
    };

    try {
      if (mode === 'individual') {
        await runIndividualTurn(advisorId, history, callbacks, { agendaContext });
      } else {
        const participants = mode === 'todos' ? ALL_IDS : warRoomAdvisorIds;
        const result = await runGroupTurn(participants, history, callbacks, { agendaContext });
        if (result.spoke === 0 && result.errors === 0) {
          appendTo(mode, advisorId, makeMessage('system', 'Ninguém da mesa teve algo a acrescentar.', 'status'));
        }
      }
    } finally {
      setTypingId(null);
      setBusy(false);
    }
  };

  const selectedAdvisor = advisorById(selectedAdvisorId);
  const typingAdvisor = typingId ? advisorById(typingId) : null;

  return (
    <div className="space-y-6">
      {/* Top Bar Header & Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase flex items-center gap-2">
            <Users className="w-6 h-6 text-[#016BFF]" />
            Conselho do ToniMaluco — Chat &amp; War Rooms
          </h2>
          <p className="text-sm text-white/60">
            Converse com todos os 7 especialistas juntos, monte War Rooms táticas ou converse em 1-a-1.
          </p>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/[0.08] gap-1">
          {(
            [
              { key: 'todos', label: 'Todos os 7 Conselheiros', icon: <Users className="w-3.5 h-3.5 text-[#00D4FF]" /> },
              { key: 'war_room', label: `War Room (${warRoomAdvisorIds.length})`, icon: <Flame className="w-3.5 h-3.5 text-[#FFB300]" /> },
              { key: 'individual', label: 'Chat 1-a-1', icon: <MessageSquare className="w-3.5 h-3.5 text-[#00E676]" /> },
            ] as { key: ChatMode; label: string; icon: React.ReactNode }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setChatMode(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                chatMode === tab.key
                  ? 'bg-[#016BFF] text-white shadow-[0_4px_15px_rgba(1,107,255,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pauta aberta a partir de um produto */}
      {productContext && (
        <div className="flex items-start justify-between gap-3 p-3 rounded-xl border border-[#016BFF]/40 bg-[#016BFF]/10 text-xs text-white/80">
          <div>
            <span className="font-bold text-[#00D4FF] block mb-0.5">Pauta em discussão: {productContext.name}</span>
            Os conselheiros recebem os dados deste produto como contexto.
          </div>
          {onCloseProductContext && (
            <button onClick={onCloseProductContext} className="text-white/60 hover:text-white" title="Encerrar pauta">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Main Chat Body Grid */}
      <div className="gestoria-card grid grid-cols-1 md:grid-cols-4 min-h-[550px] overflow-hidden border border-white/[0.08]">
        {/* Left Sidebar */}
        <div className="md:col-span-1 border-r border-white/[0.08] bg-black/40 p-4 space-y-4 overflow-y-auto">
          {chatMode === 'todos' && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono-custom text-white/40 uppercase tracking-wider block">
                Integrantes da Mesa (7)
              </span>
              {MOCK_ADVISORS.map((adv) => (
                <div
                  key={adv.id}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                    typingId === adv.id ? 'bg-white/[0.06] border-white/20' : 'bg-white/[0.02] border-white/[0.05]'
                  }`}
                >
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
                <p className="text-[11px] text-white/60">Marque 2 ou mais conselheiros para debaterem exclusivamente sobre sua dúvida:</p>
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

        {/* Right Content Area */}
        <div className="md:col-span-3 flex flex-col justify-between bg-black/20 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {chatMode === 'todos' && 'Plenário — Chat com os 7 Conselheiros'}
                {chatMode === 'war_room' && `War Room Ativa (${warRoomAdvisorIds.length} Conselheiros)`}
                {chatMode === 'individual' && `Conversa 1-a-1 com ${selectedAdvisor?.name}`}
              </h3>
              <p className="text-xs text-white/50 font-mono-custom">
                {chatMode === 'todos' && 'Fala quem tem algo relevante a dizer. Mencione alguém pelo nome para chamá-lo.'}
                {chatMode === 'war_room' && 'Debate restrito aos conselheiros marcados. Peça "debatam" para rodadas de réplica.'}
                {chatMode === 'individual' && selectedAdvisor?.role}
              </p>
            </div>
            <button
              onClick={clearCurrentRoom}
              disabled={busy || currentMessages.length === 0}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Limpar esta conversa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div ref={feedRef} className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-[350px] max-h-[420px]">
            {currentMessages.length === 0 && !typingId && (
              <div className="h-full min-h-[300px] flex items-center justify-center text-xs text-white/30 font-mono-custom text-center px-6">
                {chatMode === 'individual'
                  ? `Comece a conversa com ${selectedAdvisor?.name}.`
                  : 'Mande uma mensagem para a mesa.'}
              </div>
            )}

            {currentMessages.map((msg) => {
              if (msg.kind) {
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 text-[11px] font-mono-custom px-3 py-2 rounded-lg ${
                      msg.kind === 'error' ? 'text-[#FF8A80] bg-[#FF5252]/10 border border-[#FF5252]/30' : 'text-white/40'
                    }`}
                  >
                    {msg.kind === 'error' && <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />}
                    <span>{msg.text}</span>
                  </div>
                );
              }

              const isUser = msg.authorId === 'user';
              const adv = isUser ? null : advisorById(msg.authorId);
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl border ${
                      isUser
                        ? 'bg-[#016BFF] text-white border-[#016BFF] rounded-br-none shadow-[0_4px_15px_rgba(1,107,255,0.3)]'
                        : 'bg-[#0A0D1D] text-white/90 border-white/10 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] font-mono-custom opacity-70 mb-1 border-b border-white/10 pb-1">
                      <strong style={{ color: isUser ? '#FFFFFF' : adv?.color }}>{isUser ? 'Você' : adv?.name}</strong>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-xs font-sans leading-relaxed whitespace-pre-wrap">{renderText(msg.text)}</p>
                  </div>
                </div>
              );
            })}

            {typingAdvisor && (
              <div className="flex items-center gap-2 text-[11px] font-mono-custom text-white/50 px-1">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: typingAdvisor.color }} />
                {typingAdvisor.name} está pensando…
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-3 pt-2 border-t border-white/[0.08]">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={busy}
              placeholder={
                busy
                  ? 'Aguardando o conselho…'
                  : chatMode === 'todos'
                  ? 'Fale com a mesa…'
                  : chatMode === 'war_room'
                  ? 'Fale com a War Room…'
                  : `Mensagem para ${selectedAdvisor?.name}…`
              }
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono-custom text-white focus:outline-none focus:border-[#016BFF] disabled:opacity-50"
            />
            <div className="gestoria-cta-wrap">
              <button onClick={handleSendMessage} disabled={busy} className="gestoria-cta-btn text-xs py-3 px-5 disabled:opacity-50">
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
