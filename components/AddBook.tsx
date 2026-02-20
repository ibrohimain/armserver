
import React, { useState } from 'react';
import { Book } from '../types';
import { KAFEDRALAR, ADABIYOT_TURLARI } from '../constants';

interface AddBookProps {
  onAdd: (book: Omit<Book, 'id'>) => void;
}

const AddBook: React.FC<AddBookProps> = ({ onAdd }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nomi: '',
    muallifi: '',
    adabiyotTuri: ADABIYOT_TURLARI[0],
    kafedrasi: '',
    nashrYili: '',
    nashrJoyi: '',
    nashrHolati: 'Yaxshi',
    muallifRuxsati: 'Bor',
    oqituvchiTuri: 'JizPi o\'qituvchisi',
    unilibraryLink: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newBookData: Omit<Book, 'id'> = {
      ...formData,
      yaratilganSana: new Date().toISOString().split('T')[0],
      kafedrasi: formData.kafedrasi || 'Boshqa'
    };
    await onAdd(newBookData);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white">
          <h2 className="text-3xl font-black">Yangi Kitob Ro'yxatdan O'tkazish</h2>
          <p className="mt-2 text-blue-100 opacity-80">Ma'lumotlar Firebase bulutli bazasiga saqlanadi.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kitob Nomi</label>
            <input 
              required
              disabled={isSubmitting}
              className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-50"
              placeholder="Masalan: Transport vositalari nazariyasi"
              value={formData.nomi}
              onChange={(e) => setFormData({...formData, nomi: e.target.value})}
            />
          </div>

          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Muallif(lar)</label>
            <input 
              required
              disabled={isSubmitting}
              className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-50"
              placeholder="F.I.SH"
              value={formData.muallifi}
              onChange={(e) => setFormData({...formData, muallifi: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Adabiyot Turi</label>
            <select 
              disabled={isSubmitting}
              className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none disabled:opacity-50"
              value={formData.adabiyotTuri}
              onChange={(e) => setFormData({...formData, adabiyotTuri: e.target.value})}
            >
              {ADABIYOT_TURLARI.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kafedra</label>
            <select 
              disabled={isSubmitting}
              className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none disabled:opacity-50"
              value={formData.kafedrasi}
              onChange={(e) => setFormData({...formData, kafedrasi: e.target.value})}
            >
              <option value="">-- Kafedrani tanlang --</option>
              {KAFEDRALAR.map(k => <option key={k} value={k}>{k}</option>)}
              <option value="Boshqa">Kafedraga tegishli emas (Boshqa)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nashr Yili</label>
            <input 
              disabled={isSubmitting}
              className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-50"
              placeholder="Masalan: 2024"
              value={formData.nashrYili}
              onChange={(e) => setFormData({...formData, nashrYili: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nashr Joyi</label>
            <input 
              disabled={isSubmitting}
              className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-50"
              placeholder="Masalan: Toshkent"
              value={formData.nashrJoyi}
              onChange={(e) => setFormData({...formData, nashrJoyi: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nashr Holati</label>
            <input 
              disabled={isSubmitting}
              className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-50"
              placeholder="Masalan: Yangi / Qoniqarli"
              value={formData.nashrHolati}
              onChange={(e) => setFormData({...formData, nashrHolati: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Muallif Ruxsati</label>
            <div className="flex space-x-4 pt-2">
              {['Bor', 'Yo\'q'].map(opt => (
                <label key={opt} className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="ruxsat" 
                    disabled={isSubmitting}
                    checked={formData.muallifRuxsati === opt}
                    onChange={() => setFormData({...formData, muallifRuxsati: opt})}
                    className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500" 
                  />
                  <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Muallif Turi</label>
            <div className="flex space-x-4 pt-2">
              {['JizPi o\'qituvchisi', 'JizPi o\'qituvchisi emas'].map(opt => (
                <label key={opt} className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="oqituvchiTuri" 
                    disabled={isSubmitting}
                    checked={formData.oqituvchiTuri === opt}
                    onChange={() => setFormData({...formData, oqituvchiTuri: opt as any})}
                    className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500" 
                  />
                  <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Unilibrary Link</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔗</span>
              <input 
                required
                disabled={isSubmitting}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-50"
                placeholder="https://unilibrary.uz/view/..."
                value={formData.unilibraryLink}
                onChange={(e) => setFormData({...formData, unilibraryLink: e.target.value})}
              />
            </div>
          </div>

          <div className="col-span-2 flex justify-end pt-6">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 transition-all transform active:scale-95 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  SAQLANMOQDA...
                </>
              ) : (
                <>
                  <span className="mr-2">💾</span> BAZAGA SAQLASH
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
