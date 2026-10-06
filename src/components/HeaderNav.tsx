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
  Sparkles
} from 'lucide-react';

interface HeaderNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onOpenCommandPalette?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenCommandPalette
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Central de Decisão' },
    { id: 'cloner', label: 'Anúncios' },
    { id: 'scripts', label: 'Scripts' },
    { id: 'trending', label: 'Tendências' },
    { id: 'radar', label: 'Radar' },
    { id: 'conselho', label: 'Conselho' },
    { id: 'calculator', label: 'Calculadora' },
    { id: 'watchlist', label: 'Watchlist' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#05060F]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-[1240px] mx-auto px-6 h-[72px] flex items-center justify-between gap-6">
        {/* Gestoria Style Brand Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="text-2xl font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
            Toni<span className="text-[#016BFF]">Maluco</span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(1,107,255,0.12)] text-[#00D4FF] border border-[rgba(0,212,255,0.3)]">
              C.I
            </span>
          </span>
        </div>

        {/* Gestoria Floating Pill Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-full border border-white/[0.08]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-[#016BFF] shadow-[0_4px_20px_rgba(1,107,255,0.4)] font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Gestoria Animated Gradient Border CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>Buscar...</span>
            <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/80">
              ⌘K
            </kbd>
          </button>

          <div className="gestoria-cta-wrap">
            <button
              onClick={() => setActiveTab('conselho')}
              className="gestoria-cta-btn"
            >
              <span>Consultar Conselho</span>
              <ArrowRight className="w-4 h-4 text-[#00D4FF]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
