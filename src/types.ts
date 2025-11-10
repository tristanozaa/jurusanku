export interface MataKuliah {
  nama: string;
  deskripsi: string;
  youtubeLink?: string;
}

export interface Jurusan {
  id: string;
  nama: string;
  fakultas: string;
  deskripsi: string;
  kurikulum: Record<string, MataKuliah[]>;
  gajiRataRata: number;
  jumlahLapanganPekerjaan: number;
  proyeksiPertumbuhan: number;
  waktuDapatKerjaBulan: number;
  kategori: 'Saintek' | 'Soshum';
}

export interface InterestQuestion {
  id: number;
  text: string;
  type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'; // RIASEC Model
  imageUrl?: string;
}

export interface InterestResult {
  profile: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  id: string; // Supabase User ID
  email: string | undefined;
  subscription_status: 'free' | 'premium';
}
