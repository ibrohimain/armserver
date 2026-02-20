
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Book } from '../types';
import { ADABIYOT_TURLARI, KAFEDRALAR } from '../constants';

interface DashboardProps {
  books: Book[];
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f97316'];

const Dashboard: React.FC<DashboardProps> = ({ books }) => {
  // Count by Type
  const typeCounts = ADABIYOT_TURLARI.map(type => ({
    name: type,
    value: books.filter(b => b.adabiyotTuri === type).length
  })).sort((a, b) => b.value - a.value);

  // Count by Department (for chart)
  const deptCounts = KAFEDRALAR.map(dept => ({
    name: dept.split(' ').map(w => w[0]).join(''), // Short initials for chart axis
    full: dept,
    value: books.filter(b => b.kafedrasi === dept).length
  })).filter(d => d.value > 0);

  // Count by Author Type
  const authorTypeCounts = [
    { name: 'JizPi o\'qituvchisi', value: books.filter(b => (b.oqituvchiTuri || 'JizPi o\'qituvchisi') === 'JizPi o\'qituvchisi').length },
    { name: 'Boshqa mualliflar', value: books.filter(b => b.oqituvchiTuri === 'JizPi o\'qituvchisi emas').length }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest relative">Jami Kitoblar</p>
          <h3 className="text-4xl font-black text-slate-800 mt-2 relative">{books.length.toLocaleString()}</h3>
          <div className="mt-4 flex items-center text-xs text-blue-600 font-bold relative">
            <span className="mr-1">📈</span> Bazaning umumiy hajmi
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mualliflar Kesimi</p>
          <div className="mt-2 space-y-1">
            {authorTypeCounts.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 truncate max-w-[100px]">{item.name}</span>
                <span className={`text-sm font-black ${idx === 0 ? 'text-blue-600' : 'text-slate-800'}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {typeCounts.slice(0, 2).map((item, idx) => (
          <div key={item.name} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.name}</p>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{item.value.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Salfatli: {books.length > 0 ? ((item.value / books.length) * 100).toFixed(1) : 0}%</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
            Kafedralar Kesimi (Kitoblar Soni)
          </h4>
          <div className="h-80">
            {deptCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptCounts}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 rounded-xl shadow-xl border-0">
                          <p className="text-xs font-bold text-slate-800">{payload[0].payload.full}</p>
                          <p className="text-sm font-black text-blue-600 mt-1">{payload[0].value} ta kitob</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">Ma'lumotlar mavjud emas</div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Turlar Taqsimoti</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={typeCounts.filter(t => t.value > 0)} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {typeCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {typeCounts.filter(t => t.value > 0).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: COLORS[idx % COLORS.length]}}></span>
                  <span className="truncate max-w-[140px] font-medium">{item.name}</span>
                </div>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
