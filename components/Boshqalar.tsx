
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Book, CustomCategory } from '../types';
import { ADABIYOT_TURLARI } from '../constants';

interface Props {
  onSelectType: (type: string) => void;
  books: Book[];
  onBack: () => void;
}

const Boshqalar: React.FC<Props> = ({ onSelectType, books, onBack }) => {
  const [customCats, setCustomCats] = useState<CustomCategory[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    const q = query(collection(db, "custom_categories"));
    return onSnapshot(q, (snap) => {
      const cats: CustomCategory[] = [];
      snap.forEach(doc => cats.push({ id: doc.id, name: doc.data().name }));
      setCustomCats(cats);
    });
  }, []);

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await addDoc(collection(db, "custom_categories"), { name: newCatName });
      setNewCatName('');
      setShowAdd(false);
    } catch (e) {
      alert("Xato: " + e);
    }
  };

  const otherBooks = books.filter(b => b.kafedrasi === 'Boshqa' || !b.kafedrasi);
  
  const allCategories = Array.from(new Set([
    ...ADABIYOT_TURLARI.filter(t => !['Darslik', 'O\'quv qo\'llanma'].includes(t)),
    ...customCats.map(c => c.name)
  ])).sort();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <button onClick={onBack} className="flex items-center text-blue-600 font-bold hover:underline mb-2">
            <span className="mr-2">←</span> Dashboardga qaytish
          </button>
          <h2 className="text-3xl font-black text-slate-800">Boshqa Adabiyotlar</h2>
          <div className="flex items-center space-x-4 mt-2">
            <p className="text-slate-500 font-bold text-sm">Umumiy kataloglar va maxsus xonalar</p>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                {allCategories.length} KATALOG
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                {otherBooks.length} JAMI KITOB
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center shadow-xl shadow-blue-500/20"
        >
          <span className="mr-2 text-lg">➕</span> Yangi Katalog
        </button>
      </div>

      {showAdd && (
        <div className="mb-10 p-8 bg-white border border-blue-100 rounded-[2.5rem] shadow-xl shadow-blue-500/5 flex flex-col md:flex-row items-center gap-4 animate-in slide-in-from-top-4">
          <div className="flex-1 relative w-full">
            <input 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-0 focus:ring-2 focus:ring-blue-500 font-bold"
              placeholder="Masalan: Ilmiy-ommabop, Lug'atlar..."
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button onClick={addCategory} className="flex-1 md:flex-none px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-widest">QO'SHISH</button>
            <button onClick={() => setShowAdd(false)} className="px-6 py-4 text-slate-400 font-black text-xs tracking-widest">BEKOR QILISH</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allCategories.map((cat, idx) => {
          const count = otherBooks.filter(b => b.adabiyotTuri === cat).length;
          return (
            <button
              key={idx}
              onClick={() => onSelectType(cat)}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all text-left flex flex-col justify-between h-56"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-blue-600 transition-all group-hover:rotate-6 shadow-inner">
                📁
              </div>
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-tight leading-tight mb-2 group-hover:text-blue-700">{cat}</h3>
                <div className="flex items-center justify-between">
                   <p className="text-xs font-bold text-slate-400">{count} ta manba</p>
                   <span className="text-blue-600 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">→</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Boshqalar;
