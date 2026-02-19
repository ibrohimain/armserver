
import React, { useState } from 'react';
import { KAFEDRALAR } from '../constants';
import { Book } from '../types';

interface Props {
  onSelect: (category: string) => void;
  books: Book[];
}

const Kafedralar: React.FC<Props> = ({ onSelect, books }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredKafedralar = KAFEDRALAR.filter(k => 
    k.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Kafedra <span className="text-blue-600">Arxivlari</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg mt-3">
            Institut kafedralari bo'yicha saralangan elektron resurslar va o'quv adabiyotlari bazasini boshqarish paneli.
          </p>
        </div>
        <div className="relative w-full lg:w-[400px] group">
          <input
            type="text"
            placeholder="Kafedrani nomi bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] shadow-sm group-hover:shadow-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-semibold text-slate-700"
          />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl opacity-30 group-hover:opacity-60 transition-opacity">🔍</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filteredKafedralar.map((kafedra) => {
          const deptBooks = books.filter(b => b.kafedrasi === kafedra);
          const count = deptBooks.length;
          const lastAdded = deptBooks.length > 0 ? deptBooks.sort((a, b) => b.yaratilganSana.localeCompare(a.yaratilganSana))[0] : null;
          
          return (
            <button
              key={kafedra}
              onClick={() => onSelect(kafedra)}
              className="group relative bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 text-left overflow-hidden flex flex-col justify-between min-h-[320px]"
            >
              {/* Abstract Background patterns */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-50/50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-9xl font-black select-none">📁</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[1.25rem] flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                    {kafedra[0]}
                  </div>
                  <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    ID: {kafedra.split(' ').map(w => w[0]).join('').slice(0, 4)}
                  </div>
                </div>
                <h3 className="font-black text-slate-800 text-xl leading-snug group-hover:text-blue-700 transition-colors">
                  {kafedra}
                </h3>
                {lastAdded && (
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">
                    Oxirgi yangilanish: {lastAdded.nomi.slice(0, 20)}...
                  </p>
                )}
              </div>

              <div className="relative z-10 mt-10">
                <div className="flex items-end justify-between border-t border-slate-50 pt-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-3xl font-black text-slate-900">{count}</span>
                      <span className="text-xs font-bold text-slate-400 uppercase">Resurs</span>
                    </div>
                    <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min((count / 30) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                    <span className="text-2xl transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredKafedralar.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <div className="text-8xl mb-6 grayscale opacity-20 animate-bounce">📁</div>
          <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Qidiruv natijasi yo'q</h3>
          <p className="text-slate-400 font-bold italic">Bunday kafedra bazada ro'yxatga olinmagan.</p>
        </div>
      )}
    </div>
  );
};

export default Kafedralar;
