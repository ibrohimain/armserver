
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './services/firebase';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Kafedralar from './components/Kafedralar';
import Boshqalar from './components/Boshqalar';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import { UserSession, ViewType, Book } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedKafedra, setSelectedKafedra] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('jizpi_lib_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const q = query(collection(db, "books"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const booksArr: Book[] = [];
      querySnapshot.forEach((doc) => {
        booksArr.push({ id: doc.id, ...doc.data() } as Book);
      });
      setBooks(booksArr);
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (session: UserSession) => {
    setUser(session);
    localStorage.setItem('jizpi_lib_user', JSON.stringify(session));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('jizpi_lib_user');
  };

  const handleAddBook = async (bookData: Omit<Book, 'id'>) => {
    try {
      await addDoc(collection(db, "books"), {
        ...bookData,
        createdAt: serverTimestamp()
      });
      setCurrentView('dashboard');
    } catch (e) {
      alert("Xatolik: " + e);
    }
  };

  const handleUpdateBook = async (id: string, data: Partial<Book>) => {
    try {
      await updateDoc(doc(db, "books", id), data);
      setEditingBook(null);
    } catch (e) {
      alert("Tahrirlashda xatolik: " + e);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm("Ushbu ma'lumotni o'chirmoqchimisiz?")) {
      try {
        await deleteDoc(doc(db, "books", id));
      } catch (e) {
        alert("O'chirishda xatolik: " + e);
      }
    }
  };

  const enterKafedra = (kafedra: string) => {
    setSelectedKafedra(kafedra);
    setCurrentView('kafedra-detail');
  };

  const enterCategoryBooks = (type: string) => {
    setSelectedType(type);
    setCurrentView('barcha-kitoblar');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-act, #printable-act * { visibility: visible; }
          #printable-act { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
      
      <Layout user={user} currentView={currentView} setView={(v) => { 
        setCurrentView(v); 
        if (v !== 'kafedra-detail' && v !== 'barcha-kitoblar') {
          setSelectedKafedra(null);
          setSelectedType(null);
        }
      }} onLogout={handleLogout}>
        
        {currentView === 'dashboard' && <Dashboard books={books} />}
        
        {currentView === 'kafedralar' && <Kafedralar onSelect={enterKafedra} books={books} />}
        
        {currentView === 'kafedra-detail' && (
          <CategoryGrid 
            title={selectedKafedra || ''} 
            books={books.filter(b => b.kafedrasi === selectedKafedra)}
            onSelectType={enterCategoryBooks}
            onBack={() => setCurrentView('kafedralar')}
          />
        )}

        {currentView === 'boshqalar' && (
          <Boshqalar onSelectType={enterCategoryBooks} books={books} onBack={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'barcha-kitoblar' && (
          <BookList 
            kafedra={selectedKafedra} 
            type={selectedType} 
            books={books} 
            onDelete={handleDeleteBook}
            onEdit={setEditingBook}
            onBack={() => {
              if (selectedKafedra) setCurrentView('kafedra-detail');
              else setCurrentView('boshqalar');
            }}
          />
        )}

        {currentView === 'add-book' && <AddBook onAdd={handleAddBook} />}
        
        {editingBook && (
          <EditModal 
            book={editingBook} 
            onClose={() => setEditingBook(null)} 
            onSave={handleUpdateBook} 
          />
        )}
      </Layout>
    </div>
  );
};

const CategoryGrid = ({ title, books, onSelectType, onBack }: any) => {
  const types = Array.from(new Set(books.map((b: any) => b.adabiyotTuri))).sort();
  return (
    <div className="animate-in fade-in duration-500">
      <button onClick={onBack} className="mb-6 text-blue-600 font-bold flex items-center hover:underline">
        <span className="mr-2">←</span> Kafedralarga qaytish
      </button>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800">{title}</h2>
          <p className="text-slate-400 font-bold text-sm">Kafedra xonasi va adabiyot turlari</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-xs">
          XONALAR: {types.length}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {types.length > 0 ? types.map((type: any) => {
          const count = books.filter((b: any) => b.adabiyotTuri === type).length;
          return (
            <button 
              key={type} 
              onClick={() => onSelectType(type)} 
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all text-left flex flex-col justify-between h-56"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-blue-600 transition-all group-hover:rotate-6 shadow-inner">
                📂
              </div>
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-tight leading-tight mb-2 group-hover:text-blue-700">{type}</h3>
                <div className="flex items-center justify-between">
                   <p className="text-xs font-bold text-slate-400">{count} ta kitob</p>
                   <span className="text-blue-600 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">→</span>
                </div>
              </div>
            </button>
          );
        }) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold italic">Bu kafedrada hozircha xonalar yo'q</p>
          </div>
        )}
      </div>
    </div>
  );
};

const EditModal = ({ book, onClose, onSave }: any) => {
  const [formData, setFormData] = useState(book);
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8">
        <div className="p-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">Ma'lumotni Tahrirlash</h2>
            <p className="text-xs text-blue-100 font-bold opacity-80 mt-1">ID: {book.id}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-2xl transition-all">&times;</button>
        </div>
        <div className="p-10 grid grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kitob nomi</label>
            <input className="w-full p-4 bg-slate-50 border-0 rounded-2xl mt-1 font-bold focus:ring-2 focus:ring-blue-500" value={formData.nomi} onChange={e => setFormData({...formData, nomi: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Muallif(lar)</label>
            <input className="w-full p-4 bg-slate-50 border-0 rounded-2xl mt-1 font-bold focus:ring-2 focus:ring-blue-500" value={formData.muallifi} onChange={e => setFormData({...formData, muallifi: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nashr yili</label>
            <input className="w-full p-4 bg-slate-50 border-0 rounded-2xl mt-1 font-bold focus:ring-2 focus:ring-blue-500" value={formData.nashrYili} onChange={e => setFormData({...formData, nashrYili: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nashr joyi</label>
            <input className="w-full p-4 bg-slate-50 border-0 rounded-2xl mt-1 font-bold focus:ring-2 focus:ring-blue-500" value={formData.nashrJoyi} onChange={e => setFormData({...formData, nashrJoyi: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unilibrary Havolasi</label>
            <input className="w-full p-4 bg-slate-50 border-0 rounded-2xl mt-1 font-bold focus:ring-2 focus:ring-blue-500" value={formData.unilibraryLink} onChange={e => setFormData({...formData, unilibraryLink: e.target.value})} />
          </div>
        </div>
        <div className="p-10 border-t border-slate-50 flex justify-end space-x-4 bg-slate-50/50">
          <button onClick={onClose} className="px-8 py-4 font-black text-slate-400 hover:text-slate-600 transition-all uppercase text-xs tracking-widest">Bekor qilish</button>
          <button onClick={() => onSave(book.id, formData)} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all uppercase text-xs tracking-widest">O'zgarishlarni Saqlash</button>
        </div>
      </div>
    </div>
  );
}

export default App;
