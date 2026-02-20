
import React from 'react';
import { Book } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface OverallStatsProps {
  books: Book[];
}

const OverallStats: React.FC<OverallStatsProps> = ({ books }) => {
  // Process data for growth chart
  const processGrowthData = () => {
    const dailyCounts: Record<string, number> = {};
    
    books.forEach(book => {
      if (!book.createdAt) return;
      const date = book.createdAt.toDate ? book.createdAt.toDate() : new Date(book.createdAt);
      const dateStr = date.toLocaleDateString('uz-UZ');
      dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
    });

    // Sort dates and calculate cumulative sum
    const sortedDates = Object.keys(dailyCounts).sort((a, b) => {
      const dateA = new Date(a.split('.').reverse().join('-'));
      const dateB = new Date(b.split('.').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });

    let cumulative = 0;
    return sortedDates.map(date => {
      cumulative += dailyCounts[date];
      return {
        date,
        count: dailyCounts[date],
        total: cumulative
      };
    });
  };

  const chartData = processGrowthData();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800">UMUMIY STATISTIKA</h2>
          <p className="text-slate-400 font-bold text-sm">Tizimdagi barcha ma'lumotlar tahlili</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Jami kitoblar</p>
          <h3 className="text-5xl font-black text-slate-800">{books.length}</h3>
          <div className="mt-4 h-1 w-12 bg-blue-600 rounded-full"></div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bugun qo'shildi</p>
          <h3 className="text-5xl font-black text-emerald-600">
            {books.filter(b => {
              if (!b.createdAt) return false;
              const date = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
              return date.toDateString() === new Date().toDateString();
            }).length}
          </h3>
          <div className="mt-4 h-1 w-12 bg-emerald-600 rounded-full"></div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Xodimlar soni</p>
          <h3 className="text-5xl font-black text-orange-600">
            {new Set(books.map(b => b.addedBy).filter(Boolean)).size}
          </h3>
          <div className="mt-4 h-1 w-12 bg-orange-600 rounded-full"></div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center">
          <span className="mr-3">📈</span> KUNLIK O'SISH DINAMIKASI
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#fff',
                  padding: '12px'
                }}
                itemStyle={{color: '#fff', fontWeight: 'bold'}}
                labelStyle={{color: '#94a3b8', marginBottom: '4px'}}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#2563eb" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                name="Jami kitoblar"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverallStats;
