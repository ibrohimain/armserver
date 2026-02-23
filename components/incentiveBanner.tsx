
import React from 'react';
import { Book } from '../types';

interface IncentiveBannerProps {
  books: Book[];
  staffName: string | null;
}

const IncentiveBanner: React.FC<IncentiveBannerProps> = ({ books, staffName }) => {
  if (!staffName) return null;

  const staffBooksCount = books.filter(b => b.addedBy === staffName).length;

  let statusColor = '';
  let statusBg = '';
  let statusText = '';
  let message = '';
  let emoji = '';

  if (staffBooksCount <= 10) {
    statusColor = 'text-red-600';
    statusBg = 'bg-red-50 border-red-100';
    statusText = 'Qizil status';
    message = "Hali boshlanishi, g'ayrat qiling! Ko'proq kitob kiritishga harakat qiling.";
    emoji = '🚀';
  } else if (staffBooksCount <= 30) {
    statusColor = 'text-amber-600';
    statusBg = 'bg-amber-50 border-amber-100';
    statusText = 'Sariq status';
    message = "Yaxshi natija, to'xtab qolmang! Sizda katta salohiyat bor.";
    emoji = '⭐';
  } else if (staffBooksCount <= 50) {
    statusColor = 'text-emerald-600';
    statusBg = 'bg-emerald-50 border-emerald-100';
    statusText = 'Yashil status';
    message = "Ajoyib ish! Siz haqiqiy mutaxassissiz. Kutubxonamiz siz bilan faxrlanadi.";
    emoji = '🏆';
  } else {
    statusColor = 'text-blue-600';
    statusBg = 'bg-blue-50 border-blue-100 shadow-lg shadow-blue-500/10';
    statusText = 'Chempion status';
    message = "Siz kutubxonamiz qahramonisiz! Rekord darajadagi natija uchun rahmat.";
    emoji = '👑';
  }

  return (
    <div className={`mb-8 p-6 rounded-[2rem] border transition-all duration-500 animate-in fade-in slide-in-from-top-4 ${statusBg}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner bg-white`}>
            {emoji}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {staffName}, <span className={statusColor}>{statusText}</span>
              </h3>
            </div>
            <p className="text-slate-500 font-bold text-sm mt-1">{message}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 bg-white px-8 py-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Siz kiritgan kitoblar</p>
            <p className={`text-3xl font-black ${statusColor}`}>{staffBooksCount}</p>
          </div>
          <div className={`w-1 h-10 rounded-full ${statusColor.replace('text', 'bg')}`}></div>
        </div>
      </div>
    </div>
  );
};

export default IncentiveBanner;
