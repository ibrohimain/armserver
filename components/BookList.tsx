
import React, { useState } from 'react';
import { Book } from '../types';

interface Props {
  kafedra?: string | null;
  type?: string | null;
  books: Book[];
  onDelete: (id: string) => void;
  onEdit: (book: Book) => void;
  onBack: () => void;
}

const BookList: React.FC<Props> = ({ kafedra, type, books, onDelete, onEdit, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books
    .filter(b => {
      const matchesSearch = b.nomi.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.muallifi.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesKafedra = !kafedra || b.kafedrasi === kafedra;
      const matchesType = !type || b.adabiyotTuri === type;
      
      return matchesSearch && matchesKafedra && matchesType;
    })
    .sort((a, b) => a.nomi.localeCompare(b.nomi));

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    // UTF-8 BOM qo'shish (Excel o'zbek/kirill harflarini to'g'ri o'qishi uchun)
    const BOM = "\uFEFF";
    
    // Sarlavhalar (tartibli)
    const headers = [
      "T/R", 
      "KAFEDRA", 
      "ADABIYOT TURI", 
      "KITOB NOMI", 
      "MUALLIFLAR", 
      "NASHR YILI", 
      "NASHR JOYI", 
      "HOLATI", 
      "UNILIBRARY HAVOLASI"
    ];

    // Ma'lumotlarni qatorlarga taxlash
    const rows = filteredBooks.map((b, i) => [
      i + 1,
      `"${(b.kafedrasi || 'Boshqa').replace(/"/g, '""')}"`,
      `"${b.adabiyotTuri.replace(/"/g, '""')}"`,
      `"${b.nomi.replace(/"/g, '""')}"`,
      `"${b.muallifi.replace(/"/g, '""')}"`,
      b.nashrYili,
      `"${b.nashrJoyi.replace(/"/g, '""')}"`,
      `"${b.nashrHolati.replace(/"/g, '""')}"`,
      b.unilibraryLink
    ]);

    // CSV formatini yig'ish (Semicolon or Comma separator)
    // Excel ko'p hollarda semicolon ';' ni yaxshi tushunadi, lekin standard CSV ','
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    // Fayl nomini chiroyli va tushunarli qilish
    const fileName = `${(kafedra || 'Umumiy').replace(/\s+/g, '_')}_${(type || 'Barchasi').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Print View (Hidden on Screen) */}
      <div className="hidden print:block p-10 bg-white text-black" id="printable-act">
        <div className="text-center mb-10 border-b-[3px] border-slate-900 pb-6">
          <h1 className="text-2xl font-black uppercase tracking-tight">Jizzax Politexnika Instituti</h1>
          <p className="text-sm font-bold mt-1 text-slate-500">Elektron kutubxona ma'lumotlar bazasi</p>
          <h2 className="text-xl font-black mt-4 bg-slate-900 text-white inline-block px-6 py-2 rounded-lg">ADABIYOTLAR RO'YXATI (AKT №____)</h2>
          <div className="flex justify-between mt-6 text-[11px] font-black uppercase tracking-widest text-slate-600">
            <span>Kafedra: {kafedra || 'Umumiy'}</span>
            <span>Tur: {type || 'Barchasi'}</span>
            <span>Sana: {new Date().toLocaleDateString('uz-UZ')}</span>
          </div>
        </div>
        <table className="w-full border-collapse border-2 border-slate-900 text-[10px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="border-2 border-slate-900 p-2 w-10">№</th>
              <th className="border-2 border-slate-900 p-2 text-left">Kitob Nomi</th>
              <th className="border-2 border-slate-900 p-2 text-left">Muallifi</th>
              <th className="border-2 border-slate-900 p-2">Yili</th>
              <th className="border-2 border-slate-900 p-2">Nashr Joyi</th>
              <th className="border-2 border-slate-900 p-2">Unilibrary Link</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book, index) => (
              <tr key={book.id}>
                <td className="border-2 border-slate-900 p-2 text-center font-bold">{index + 1}</td>
                <td className="border-2 border-slate-900 p-2 font-black">{book.nomi}</td>
                <td className="border-2 border-slate-900 p-2">{book.muallifi}</td>
                <td className="border-2 border-slate-900 p-2 text-center">{book.nashrYili}</td>
                <td className="border-2 border-slate-900 p-2">{book.nashrJoyi}</td>
                <td className="border-2 border-slate-900 p-2 text-[8px] break-all">{book.unilibraryLink}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-16 grid grid-cols-2 gap-20 px-10 font-black uppercase text-[10px]">
          <div className="border-t-2 border-slate-900 pt-2 text-center">Mas'ul xodim: _________________</div>
          <div className="border-t-2 border-slate-900 pt-2 text-center">Bo'lim boshlig'i: _________________</div>
        </div>
      </div>

      {/* Screen UI */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 print:hidden">
        <div className="flex flex-col space-y-2">
          <button onClick={onBack} className="flex items-center text-blue-600 font-black hover:text-blue-800 mb-2 transition-all group">
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Orqaga qaytish
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-10 bg-blue-600 rounded-full"></div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                {kafedra || 'Katalog'} <span className="text-blue-600">/ {type || 'Barchasi'}</span>
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[2px] mt-1.5">Jami ro'yxatda: {filteredBooks.length} ta</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <button 
            onClick={handleExportExcel}
            className="flex-1 md:flex-none px-8 py-4 bg-emerald-600 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group"
          >
            <span className="mr-3 text-xl group-hover:rotate-12 transition-transform">📊</span> EXCEL YUKLASH
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group"
          >
            <span className="mr-3 text-xl group-hover:rotate-[-12deg] transition-transform">🖨️</span> AKT TAYYORLASH
          </button>
          <div className="relative flex-1 min-w-[320px]">
            <input
              type="text"
              placeholder="Muallif yoki kitob nomi bilan filtrlash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all font-semibold"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-30">🔍</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            <thead className="bg-slate-50/80 text-slate-400 font-black uppercase tracking-[2px] text-[10px]">
              <tr>
                <th className="px-10 py-6 border-b border-slate-100">№</th>
                <th className="px-10 py-6 border-b border-slate-100">Asosiy ma'lumotlar</th>
                <th className="px-10 py-6 border-b border-slate-100">Nashriyot</th>
                <th className="px-10 py-6 border-b border-slate-100 text-center">Unilibrary</th>
                <th className="px-10 py-6 border-b border-slate-100 text-center">Boshqaruv</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBooks.map((book, index) => (
                <tr key={book.id} className="hover:bg-blue-50/40 transition-all group">
                  <td className="px-10 py-8 font-black text-slate-300 text-lg">{(index + 1).toString().padStart(2, '0')}</td>
                  <td className="px-10 py-8">
                    <p className="font-black text-slate-900 leading-tight mb-1 group-hover:text-blue-700 transition-colors text-lg tracking-tight">{book.nomi}</p>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest flex items-center">
                      <span className="mr-2">👤</span> {book.muallifi}
                    </p>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col space-y-1.5">
                      <span className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black w-fit uppercase tracking-wider">{book.nashrYili} YIL</span>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center">
                        <span className="mr-1.5">📍</span> {book.nashrJoyi}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <a href={book.unilibraryLink} target="_blank" rel="noopener noreferrer" 
                       className="inline-flex w-14 h-14 items-center justify-center bg-white border border-slate-100 text-slate-900 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-200 group-hover:scale-110">
                      <span className="text-2xl">📚</span>
                    </a>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => onEdit(book)} 
                        className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                        title="Tahrirlash"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => onDelete(book.id)} 
                        className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="O'chirish"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBooks.length === 0 && (
            <div className="p-40 text-center bg-white">
              <div className="text-8xl mb-8 grayscale opacity-10 animate-pulse">📚</div>
              <h3 className="text-2xl font-black text-slate-300 uppercase tracking-[4px]">Ma'lumot topilmadi</h3>
              <p className="text-slate-300 font-bold mt-2">Qidiruv kriteriyalarini o'zgartirib ko'ring</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookList;
