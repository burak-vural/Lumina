
import React from 'react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <span className="text-2xl font-serif font-bold text-rose-500 italic tracking-tighter">Lumina</span>
            <span className="hidden sm:block ml-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Beauty & Wellness</span>
          </div>
          
          <nav className="flex space-x-1 sm:space-x-4">
            <button 
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'home' ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:text-rose-600'}`}
            >
              Ana Sayfa
            </button>
            <button 
              onClick={() => onNavigate('booking')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'booking' ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:text-rose-600'}`}
            >
              Randevu Al
            </button>
            <button 
              onClick={() => onNavigate('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'admin' ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:text-rose-600'}`}
            >
              Yönetim
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
