
import React from 'react';
import { Book } from '../types';

interface IncentiveBannerProps {
  books: Book[];
  staffName: string | null;
}

const IncentiveBanner: React.FC<IncentiveBannerProps> = ({ books, staffName }) => {
  if (!staffName) return null;

  const today = new Date().toISOString().split('T')[0];
  const staffTodayBooks = books.filter(b => b.addedBy === staffName && b.yaratilganSana === today);
  const staffBooksCount = staffTodayBooks.length;

  const redMessages = [
    "Bugungi ishni boshlash eng qiyini, siz buni uddaladingiz! Davom eting.",
    "Kunlik maqsad sari birinchi qadamlar! Har bir kitob - bu g'alaba.",
    "Bugun g'ayratingiz baland ko'rinadi, ko'proq kitob kiritishga harakat qiling!",
    "Kutubxonamiz rivojiga bugungi hissangizni qo'shishni boshlaganingizdan xursandmiz.",
    "G'ayratli bo'ling, bugungi 100 talik marraga oz qoldi!"
  ];

  const yellowMessages = [
    "Bugun ajoyib natija ko'rsatyapsiz, to'xtab qolmang!",
    "Bugun 100 tadan oshdingiz, bu hayratlanarli! Mehnatingiz tahsinga loyiq.",
    "Sariq status - bugungi professionallik belgisi. Siz buni uddalayapsiz!",
    "Kutubxonamiz xazinasi bugun sizning mehnatingiz bilan boyimoqda. Rahmat!",
    "Yana bir oz harakat qilsangiz, bugungi yashil status sizniki!"
  ];

  const greenMessages = [
    "Bugun haqiqiy rekord o'rnatdingiz! Siz haqiqiy mutaxassissiz.",
    "Bir kunda 200 dan oshiq kitob! Siz bugungi kun qahramonisiz.",
    "Bugungi yashil status - bu eng yuqori daraja! Mehnatingiz beqiyos.",
    "Bugungi tezligingiz va aniqligingiz hammaga namuna bo'la oladi.",
    "Siz bugun kutubxona rivojining asosiy ustunisiz. Yashasin chempion!"
  ];

  let statusColor = '';
  let statusBg = '';
  let statusText = '';
  let message = '';
  let emoji = '';

  if (staffBooksCount < 100) {
    statusColor = 'text-red-600';
    statusBg = 'bg-red-50 border-red-100';
    statusText = 'Qizil status';
    message = redMessages[staffBooksCount % 5];
    emoji = '🚀';
  } else if (staffBooksCount < 200) {
    statusColor = 'text-amber-600';
    statusBg = 'bg-amber-50 border-amber-100';
    statusText = 'Sariq status';
    message = yellowMessages[staffBooksCount % 5];
    emoji = '⭐';
  } else {
    statusColor = 'text-emerald-600';
    statusBg = 'bg-emerald-50 border-emerald-100 shadow-lg shadow-emerald-500/10';
    statusText = 'Yashil status';
    message = greenMessages[staffBooksCount % 5];
    emoji = '🏆';
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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bugun kiritgan kitoblaringiz</p>
            <p className={`text-3xl font-black ${statusColor}`}>{staffBooksCount}</p>
          </div>
          <div className={`w-1 h-10 rounded-full ${statusColor.replace('text', 'bg')}`}></div>
        </div>
      </div>
    </div>
  );
};

export default IncentiveBanner;
