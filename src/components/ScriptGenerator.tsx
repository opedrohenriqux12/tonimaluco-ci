'use client';

import React, { useState } from 'react';
import { MOCK_SCRIPTS } from '@/data/mockData';
import { SalesScript } from '@/types';
import { Copy, Check, ShieldCheck, Plus, X } from 'lucide-react';

export const ScriptGenerator: React.FC = () => {
  const [scripts, setScripts] = useState<SalesScript[]>(MOCK_SCRIPTS);
  const [selectedChannel, setSelectedChannel] = useState<string>('Todos');
  const [selectedTone, setSelectedTone] = useState<string>('Todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newObjection, setNewObjection] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newChannel, setNewChannel] = useState<'Marketplace Chat' | 'WhatsApp' | 'Discord' | 'Instagram DM'>('Marketplace Chat');
  const [newTone, setNewTone] = useState<'Gamer' | 'Direto' | 'Urgente'>('Gamer');

  const filteredScripts = scripts.filter((s) => {
    const channelMatch = selectedChannel === 'Todos' || s.channel === selectedChannel;
    const toneMatch = selectedTone === 'Todos' || s.tone === selectedTone;
    return channelMatch && toneMatch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateScript = () => {
    if (!newObjection || !newAnswer) return;
    const newScriptObj: SalesScript = {
      id: `custom_${Date.now()}`,
      title: `Resposta para: ${newObjection.slice(0, 30)}...`,
      channel: newChannel,
      tone: newTone,
      objection: newObjection,
      scriptText: newAnswer,
      successRatePercent: 85,
      tags: ['Personalizado', newChannel]
    };
    setScripts([newScriptObj, ...scripts]);
    setShowAddModal(false);
    setNewObjection('');
    setNewAnswer('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#14233B] pb-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase">
            Gerador & Biblioteca de Scripts de Alta Conversão
          </h2>
          <p className="text-sm text-[#7C8AA5]">
            Fluxos prontos para quebra de objeção, garantia e fechamento rápido no chat.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="cmd-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Criar Novo Script
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="cmd-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase font-bold text-[#7C8AA5]">
            Canal:
          </span>
          {['Todos', 'Marketplace Chat', 'WhatsApp', 'Discord', 'Instagram DM'].map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`text-xs font-mono-custom px-3 py-1 rounded-lg border transition-all ${
                selectedChannel === ch
                  ? 'bg-[#2F80FF] text-white border-[#2F80FF] font-bold'
                  : 'bg-[#0A1220] text-[#7C8AA5] border-[#14233B] hover:text-white'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-[#7C8AA5]">
            Tom:
          </span>
          {['Todos', 'Gamer', 'Direto', 'Urgente'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTone(t)}
              className={`text-xs font-mono-custom px-2.5 py-1 rounded-lg border transition-all ${
                selectedTone === t
                  ? 'bg-[#0A6CFF] text-white border-[#0A6CFF]'
                  : 'bg-[#0A1220] text-[#7C8AA5] border-[#14233B] hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Script List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScripts.map((script) => (
          <div key={script.id} className="cmd-card p-5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#14233B] pb-2 mb-2">
                <span className="text-[10px] font-mono-custom px-2 py-0.5 rounded bg-[#2F80FF] text-white font-bold uppercase">
                  {script.channel}
                </span>
                <span className="text-xs font-mono-custom text-[#22C55E] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {script.successRatePercent}% Taxa de Sucesso
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-2">
                {script.title}
              </h4>

              <div className="bg-[#0A1220] p-2.5 rounded-lg border border-[#14233B] mb-3">
                <span className="text-[10px] font-mono-custom text-[#7C8AA5] uppercase block mb-1">
                  Objeção do Cliente:
                </span>
                <p className="text-xs italic text-[#EF4444]">
                  "{script.objection}"
                </p>
              </div>

              <div className="bg-[#0E1A2E] border border-[#14233B] p-3 rounded-lg">
                <span className="text-[10px] font-mono-custom text-[#2F80FF] uppercase block font-bold mb-1">
                  Resposta Recomendada pelo Toni ({script.tone}):
                </span>
                <p className="text-xs font-mono-custom text-[#C9D3E3] whitespace-pre-wrap leading-relaxed">
                  {script.scriptText}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#14233B]">
              <div className="flex gap-1">
                {script.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-mono-custom text-[#7C8AA5] bg-[#0A1220] px-2 py-0.5 rounded border border-[#14233B]">
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleCopy(script.scriptText, script.id)}
                className="cmd-btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1"
              >
                {copiedId === script.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar Script
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Script Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="cmd-card p-6 max-w-lg w-full bg-[#0A1220] space-y-4 border border-[#14233B]">
            <div className="flex items-center justify-between border-b border-[#14233B] pb-2">
              <h3 className="text-lg font-bold uppercase text-white">
                Adicionar Novo Script à Biblioteca
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#7C8AA5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-mono-custom text-[#7C8AA5] block mb-1 uppercase">
                Objeção ou Pergunta Frequente do Cliente
              </label>
              <input
                type="text"
                value={newObjection}
                onChange={(e) => setNewObjection(e.target.value)}
                placeholder="Ex: Funciona em PS5 ou Xbox?"
                className="w-full bg-[#0E1A2E] border border-[#14233B] p-2.5 rounded-lg text-sm font-mono-custom text-white focus:outline-none focus:border-[#2F80FF]"
              />
            </div>

            <div>
              <label className="text-xs font-mono-custom text-[#7C8AA5] block mb-1 uppercase">
                Sua Resposta Consolidada
              </label>
              <textarea
                rows={3}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Escreva como você responde para fechar a venda..."
                className="w-full bg-[#0E1A2E] border border-[#14233B] p-2.5 rounded-lg text-sm font-mono-custom text-white focus:outline-none focus:border-[#2F80FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono-custom text-[#7C8AA5] block mb-1 uppercase">
                  Canal Principal
                </label>
                <select
                  value={newChannel}
                  onChange={(e: any) => setNewChannel(e.target.value)}
                  className="w-full bg-[#0E1A2E] border border-[#14233B] p-2 rounded-lg text-sm font-mono-custom text-white"
                >
                  <option value="Marketplace Chat">Marketplace Chat</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Discord">Discord</option>
                  <option value="Instagram DM">Instagram DM</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono-custom text-[#7C8AA5] block mb-1 uppercase">
                  Tom
                </label>
                <select
                  value={newTone}
                  onChange={(e: any) => setNewTone(e.target.value)}
                  className="w-full bg-[#0E1A2E] border border-[#14233B] p-2 rounded-lg text-sm font-mono-custom text-white"
                >
                  <option value="Gamer">Gamer</option>
                  <option value="Direto">Direto</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#14233B]">
              <button
                onClick={() => setShowAddModal(false)}
                className="cmd-btn-secondary px-4 py-2 text-xs font-bold uppercase"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateScript}
                className="cmd-btn-primary px-4 py-2 text-xs"
              >
                Salvar Script
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
