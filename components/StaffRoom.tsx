
import React from 'react';
import { Book } from '../types';
import { STAFF_NAMES } from '../constants';

interface StaffRoomProps {
  books: Book[];
}

const StaffRoom: React.FC<StaffRoomProps> = ({ books }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const staffStats = STAFF_NAMES.map(name => {
    const staffBooks = books.filter(b => b.addedBy === name);
    
    // Filter for today
    const todayBooks = staffBooks.filter(b => {
      if (!b.createdAt) return false;
      const date = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return date >= today;
    });

    // Group by type
    const typeCounts: Record<string, number> = {};
    todayBooks.forEach(b => {
      typeCounts[b.adabiyotTuri] = (typeCounts[b.adabiyotTuri] || 0) + 1;
    });

    return {
      name,
      totalToday: todayBooks.length,
      totalAllTime: staffBooks.length,
      types: typeCounts
    };
  }).sort((a, b) => b.totalToday - a.totalToday);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800">XODIMLAR XONASI</h2>
          <p className="text-slate-400 font-bold text-sm">Bugungi ish faoliyati va statistika</p>
        </div>
        <div className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/30">
          BUGUN: {new Date().toLocaleDateString('uz-UZ')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {staffStats.map((staff) => (
          <div key={staff.name} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                  👤
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">{staff.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kutubxona xodimi</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-blue-600">{staff.totalToday}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Bugun kiritildi</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-bold text-slate-500 mb-2 px-2">
                <span>Adabiyot turi</span>
                <span>Soni</span>
              </div>
              <div className="space-y-2">
                {Object.entries(staff.types).length > 0 ? (
                  Object.entries(staff.types).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <span className="font-bold text-slate-700">{type}</span>
                      <span className="px-3 py-1 bg-white rounded-lg font-black text-blue-600 shadow-sm">{count}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-300 font-bold italic">
                    Bugun hali kitob kiritilmadi
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-dashed border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Umumiy kiritilgan:</span>
              <span className="text-lg font-black text-slate-800">{staff.totalAllTime} ta</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffRoom;
