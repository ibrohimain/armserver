
export interface Book {
  id: string;
  nomi: string;
  muallifi: string;
  adabiyotTuri: string;
  kafedrasi: string; 
  nashrYili: string;
  nashrJoyi: string;
  nashrHolati: string;
  muallifRuxsati: string; 
  yaratilganSana: string;
  unilibraryLink: string;
  addedBy?: string;
  oqituvchiTuri: 'JizPi o\'qituvchisi' | 'JizPi o\'qituvchisi emas';
  createdAt?: any; // Firestore timestamp
}

export type ViewType = 
  | 'dashboard' 
  | 'kafedralar' 
  | 'boshqalar' 
  | 'barcha-kitoblar' 
  | 'add-book' 
  | 'kafedra-detail' 
  | 'kafedra-teacher-selection'
  | 'boshqa-detail'
  | 'staff-room'
  | 'overall-stats';

export interface UserSession {
  uid: string;
  email: string;
  role: 'admin' | 'employee';
}

export interface CustomCategory {
  id: string;
  name: string;
}
