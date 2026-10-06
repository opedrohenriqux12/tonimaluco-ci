'use client';

import React from 'react';
import {
  LayoutDashboard,
  Megaphone,
  MessageSquareCode,
  TrendingUp,
  Radar,
  Users,
  Calculator,
  Eye,
  Search,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onOpenCommandPalette?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenCommandPalette
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Central de Decisão', icon: LayoutDashboard },
    { id: 'cloner', label: 'Anúncios', icon: Megaphone },
    { id: 'scripts', label: 'Scripts', icon: MessageSquareCode },
    { id: 'trending', label: 'Tendências', icon: TrendingUp },
    { id: 'radar', label: 'Radar', icon: Radar },
    { id: 'conselho', label: 'Conselho', icon: Users },
    { id: 'calculator', label: 'Calculadora', icon: Calculator },
    { id: 'watchlist', label: 'Watchlist', icon: Eye }
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#05060F]/90 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col justify-between p-5 z-50 shrink-0">
      <div className="space-y-6">
        {/* Gestoria Style Brand Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer pt-2 px-2"
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="text-2xl font-extrabold tracking-tight text-white font-sans flex items-center gap-1.5">
            Toni<span className="text-[#016BFF]">Maluco</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(1,107,255,0.12)] text-[#00D4FF] border border-[rgba(0,212,255,0.3)]">
              C.I
            </span>
          </span>
        </div>

        {/* Global Search Bar Button */}
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white text-xs transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#00D4FF]" />
            <span>Buscar no C.I...</span>
          </div>
          <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/80">
            ⌘K
          </kbd>
        </button>

        {/* Left Vertical Menu Options */}
        <nav className="space-y-1.5">
          <span className="text-[10px] font-mono-custom text-white/40 uppercase tracking-widest px-3 block mb-2">
            Navegação Principal
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-[#016BFF] shadow-[0_4px_25px_rgba(1,107,255,0.4)] font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#00D4FF]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-4 border-t border-white/[0.08]">
        <div className="gestoria-cta-wrap w-full">
          <button
            onClick={() => setActiveTab('conselho')}
            className="gestoria-cta-btn w-full justify-between text-xs py-3 px-4"
          >
            <span>Consultar Conselho</span>
            <ArrowRight className="w-4 h-4 text-[#00D4FF]" />
          </button>
        </div>
      </div>
    </aside>
  );
};
