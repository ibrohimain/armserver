
import React from 'react';
import { STAFF_NAMES } from '../constants';

interface StaffSelectionProps {
  onSelect: (name: string) => void;
}

const StaffSelection: React.FC<StaffSelectionProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 bg-blue-600 text-white text-center">
          <h1 className="text-3xl font-black italic">XODIMNI TANLANG</h1>
          <p className="mt-2 text-blue-100 opacity-80">Platformada ishlash uchun ismingizni tanlang</p>
        </div>
        
        <div className="p-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {STAFF_NAMES.map((name) => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className="p-6 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-2xl text-center transition-all group active:scale-95"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors text-xl">
                👤
              </div>
              <span className="font-bold text-slate-700 group-hover:text-blue-700">{name}</span>
            </button>
          ))}
        </div>
        
        <div className="p-6 bg-slate-50 text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">JizPI Elektron Kutubxona Tizimi</p>
        </div>
      </div>
    </div>
  );
};

export default StaffSelection;
