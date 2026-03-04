
import React from 'react';
import { Book } from '../types';
import { STAFF_NAMES } from '../constants';

interface StaffRoomProps {
  books: Book[];
  onDelete: (id: string) => void;
  onEdit: (book: Book) => void;
}

const StaffRoom: React.FC<StaffRoomProps> = ({ books, onDelete, onEdit }) => {
  const [selectedStaff, setSelectedStaff] = React.useState<string | null>(null);
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
      types: typeCounts,
      allBooks: staffBooks
    };
  }).sort((a, b) => b.totalToday - a.totalToday);

  if (selectedStaff) {
    const staff = staffStats.find(s => s.name === selectedStaff);
    const staffBooks = staff?.allBooks || [];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSelectedStaff(null)}
              className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              ←
            </button>
            <div>
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{selectedStaff}</h2>
              <p className="text-slate-400 font-bold text-sm">Xodim tomonidan kiritilgan barcha adabiyotlar</p>
            </div>
          </div>
          <div className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/30">
            JAMI: {staffBooks.length} TA
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
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
                {staffBooks.map((book, index) => (
                  <tr key={book.id} className="hover:bg-blue-50/40 transition-all group">
                    <td className="px-10 py-8 font-black text-slate-300 text-lg">{(index + 1).toString().padStart(2, '0')}</td>
                    <td className="px-10 py-8">
                      <p className="font-black text-slate-900 leading-tight mb-1 group-hover:text-blue-700 transition-colors text-lg tracking-tight">{book.nomi}</p>
                      <p className="text-xs text-slate-400 font-black uppercase tracking-widest flex items-center">
                        <span className="mr-2">📁</span> {book.adabiyotTuri}
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
            {staffBooks.length === 0 && (
              <div className="p-40 text-center bg-white">
                <div className="text-8xl mb-8 grayscale opacity-10 animate-pulse">📚</div>
                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-[4px]">Ma'lumot topilmadi</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
          <div key={staff.name} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
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

            <div className="space-y-4 flex-1">
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
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase">Umumiy kiritilgan:</span>
                <span className="text-lg font-black text-slate-800">{staff.totalAllTime} ta</span>
              </div>
              <button 
                onClick={() => setSelectedStaff(staff.name)}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10"
              >
                Kitoblarni ko'rish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffRoom;
