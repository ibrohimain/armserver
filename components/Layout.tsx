
import React, { useState } from 'react';
import { UserSession, ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserSession;
  selectedStaff: string | null;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, selectedStaff, currentView, setView, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'add-book', label: 'Kitob Qo\'shish', icon: '➕' },
    { id: 'kafedralar', label: 'Kafedralar', icon: '📁' },
    { id: 'boshqalar', label: 'Boshqa Adabiyotlar', icon: '📚' },
    { id: 'staff-room', label: 'Xodimlar Xonasi', icon: '🏠' },
    { id: 'overall-stats', label: 'Umumiy Statistika', icon: '📈' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8">
        <div className="flex items-center space-x-3">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-black">L</div>
           <h1 className="text-xl font-bold tracking-tight text-slate-800">JIZPI <span className="text-blue-600">LIB</span></h1>
        </div>
        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[2px]">Elektron Baza</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setView(item.id as ViewType);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className={`text-xl transition-transform group-hover:scale-110 ${currentView === item.id ? 'opacity-100' : 'opacity-60'}`}>
              {item.icon}
            </span>
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative group">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center font-black">
              {user.email[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate opacity-90">{selectedStaff || user.email}</p>
              <p className="text-[9px] uppercase tracking-widest text-blue-300 font-bold">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-3 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-xl text-xs font-bold transition-all border border-white/5"
          >
            Tizimdan Chiqish
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden min-[1000px]:flex shadow-sm z-10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 min-[1000px]:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 transition-transform duration-300 transform min-[1000px]:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 min-[1000px]:px-10">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="min-[1000px]:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <span className="text-2xl">☰</span>
            </button>
            <div>
               <h2 className="text-xl font-bold text-slate-800 capitalize">
                 {menuItems.find(m => m.id === currentView)?.label || 'Barcha Kitoblar'}
               </h2>
               <p className="text-xs text-slate-400 mt-0.5">JizPI Elektron Ma'lumotlar Bazasi</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase">{new Date().toLocaleDateString('uz-UZ', {weekday: 'long'})}</p>
              <p className="text-sm font-black text-slate-700">{new Date().toLocaleDateString('uz-UZ')}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 min-[1000px]:p-10 bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
