
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { JURUSAN_DATA } from '../constants';
import { Jurusan, MataKuliah } from '../types';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const JurusanCard: React.FC<{ jurusan: Jurusan; onSelect: (jurusan: Jurusan) => void; index: number }> = ({ jurusan, onSelect, index }) => (
  <div
    onClick={() => onSelect(jurusan)}
    className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl hover:border-teal-500 border-2 border-transparent transition-all duration-300 transform hover:-translate-y-1 flex flex-col animate-boing-in border-b-4 border-gray-200 hover:border-b-teal-500"
    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
  >
    <h3 className="text-xl font-bold text-teal-600">{jurusan.nama}</h3>
    <p className="text-gray-500 text-xs uppercase font-semibold mb-2">{jurusan.fakultas}</p>
    <p className="text-gray-500 text-sm mb-2">{jurusan.kategori}</p>
    <p className="text-gray-700 text-sm line-clamp-3 flex-grow">{jurusan.deskripsi}</p>
  </div>
);

const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(angka);
}

const PremiumDataBlock: React.FC<{ jurusan: Jurusan }> = ({ jurusan }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-100 p-3 rounded-lg"><strong>Proyeksi Pertumbuhan Karir:</strong> {jurusan.proyeksiPertumbuhan}%/tahun</div>
        <div className="bg-gray-100 p-3 rounded-lg"><strong>Jumlah Lapangan Kerja:</strong> {jurusan.jumlahLapanganPekerjaan.toLocaleString('id-ID')}</div>
        <div className="bg-gray-100 p-3 rounded-lg"><strong>Waktu Rata-Rata Dapat Kerja:</strong> {jurusan.waktuDapatKerjaBulan} bulan</div>
    </div>
);


const PremiumLock: React.FC = () => (
    <div className="relative blur-sm select-none">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 p-3 rounded-lg"><strong>Proyeksi Pertumbuhan Karir:</strong> 12%/tahun</div>
            <div className="bg-gray-100 p-3 rounded-lg"><strong>Jumlah Lapangan Kerja:</strong> 150.000</div>
            <div className="bg-gray-100 p-3 rounded-lg"><strong>Waktu Rata-Rata Dapat Kerja:</strong> 5 bulan</div>
        </div>
    </div>
);


const JurusanModal: React.FC<{ jurusan: Jurusan; onClose: () => void }> = ({ jurusan, onClose }) => {
    const { currentUser } = useAppContext();
    const isPremium = currentUser?.subscription_status === 'premium';
    const [selectedMatkul, setSelectedMatkul] = useState<MataKuliah | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ top: number, left: number } | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const handleMatkulClick = (matkul: MataKuliah, event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (selectedMatkul?.nama === matkul.nama) {
        setSelectedMatkul(null);
        setPopupPosition(null);
        return;
      }
      
      const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
      const popoverWidth = 320; // Tailwind's max-w-xs
      const popoverHeight = 150; // Estimated height
      const margin = 8;

      let top = buttonRect.bottom + margin;
      let left = buttonRect.left;

      // Adjust left position to prevent overflow
      if (left + popoverWidth > window.innerWidth) {
        left = window.innerWidth - popoverWidth - margin;
      }
      
      // Adjust top position if it overflows at the bottom
      if (top + popoverHeight > window.innerHeight) {
        top = buttonRect.top - popoverHeight - margin;
      }

      setSelectedMatkul(matkul);
      setPopupPosition({ top, left });
    };
    
     useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setSelectedMatkul(null);
                setPopupPosition(null);
            }
        };

        if (selectedMatkul && popupPosition) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [selectedMatkul, popupPosition]);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-teal-700">{jurusan.nama}</h2>
              <p className="text-gray-600 font-medium">{jurusan.fakultas}</p>
              <p className="text-gray-500 mb-4">{jurusan.kategori}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
          </div>
          <p className="text-gray-700 mb-6">{jurusan.deskripsi}</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Gambaran Mata Kuliah</h4>
              <div className="space-y-3">
                {Object.entries(jurusan.kurikulum).map(([semester, matkuls]) => (
                  <div key={semester}>
                    <p className="font-bold text-gray-700">{semester}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {matkuls.map((item, index) => {
                        return (
                           <button 
                            key={index}
                            onClick={(e) => handleMatkulClick(item, e)}
                            className={`text-left text-sm font-medium px-3 py-1 rounded-full transition-all duration-200 ${selectedMatkul?.nama === item.nama ? 'bg-teal-600 text-white scale-105' : 'bg-teal-100 text-teal-800 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500'}`}
                           >
                            {item.nama}
                           </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
                 <h4 className="font-semibold text-lg text-gray-800 mb-2">Prospek Karir & Pendapatan</h4>
                 <div className="bg-green-100 p-3 rounded-lg text-sm mb-4">
                    <strong>Estimasi Gaji Awal:</strong> {formatRupiah(jurusan.gajiRataRata)}/bulan
                 </div>
                 <div className="relative">
                    {isPremium ? (
                        <PremiumDataBlock jurusan={jurusan} />
                    ) : (
                        <>
                            <PremiumLock />
                            <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/80 rounded-lg">
                               <div className="text-center p-4">
                                   <h4 className="font-bold text-lg text-stone-600">Fitur Premium</h4>
                                   <p className="text-gray-700 mb-3 text-sm max-w-sm">Upgrade untuk melihat data eksklusif: Proyeksi Karir, Jumlah Lowongan, dan estimasi waktu mendapat kerja.</p>
                                   <Link to="/account" onClick={onClose} className="bg-stone-500 text-white font-bold py-2 px-4 rounded-full hover:bg-stone-600 transition-colors">
                                      Buka Fitur Premium
                                   </Link>
                               </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

          </div>
        </div>
      </div>
      
       {selectedMatkul && popupPosition && (
        <div
          ref={popoverRef}
          style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
          className="fixed z-[60] w-full max-w-xs bg-white rounded-lg shadow-2xl border border-gray-200 p-4 animate-fade-in-up"
        >
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-bold text-gray-800 text-base">{selectedMatkul.nama}</h5>
            <button 
              onClick={() => { setSelectedMatkul(null); setPopupPosition(null); }} 
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
          <p className="text-sm text-gray-600">{selectedMatkul.deskripsi}</p>
          {selectedMatkul.youtubeLink && (
            <a 
                href={selectedMatkul.youtubeLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-2 inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
            >
                <svg className="h-5 w-5 mr-1.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M21.582,6.186C21.328,5.242,20.758,4.672,19.814,4.418C18.109,4,12,4,12,4S5.891,4,4.186,4.418C3.242,4.672,2.672,5.242,2.418,6.186C2,7.891,2,12,2,12s0,4.109,0.418,5.814c0.254,0.944,0.824,1.514,1.768,1.768C5.891,20,12,20,12,20s6.109,0,7.814-0.418c0.944-0.254,1.514-0.824,1.768-1.768C22,16.109,22,12,22,12S22,7.891,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"></path>
                </svg>
                Tonton di YouTube
            </a>
          )}
        </div>
      )}
    </div>
  );
};


const JurusanPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Saintek' | 'Soshum'>('All');
  const [selectedFakultas, setSelectedFakultas] = useState('All');
  const [selectedJurusan, setSelectedJurusan] = useState<Jurusan | null>(null);

  const faculties = useMemo(() => ['All', ...[...new Set(JURUSAN_DATA.map(j => j.fakultas))].sort()], []);

  const filteredJurusan = JURUSAN_DATA.filter(j => {
    const matchesSearch = j.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || j.kategori === selectedCategory;
    const matchesFakultas = selectedFakultas === 'All' || j.fakultas === selectedFakultas;
    return matchesSearch && matchesCategory && matchesFakultas;
  });
  
  return (
    <div className="space-y-8">
      <div className="text-center animate-boing-in">
        <h1 className="text-4xl font-extrabold">Eksplorasi Ratusan Jurusan Kuliah</h1>
        <p className="text-gray-600 mt-2">Temukan informasi lengkap mengenai jurusan impian Anda untuk keputusan yang lebih matang.</p>
      </div>

      <div className="sticky top-16 bg-stone-50/80 backdrop-blur-md py-4 z-10 space-y-4 animate-boing-in" style={{animationDelay: '100ms'}}>
        <input
            type="text"
            placeholder="Cari nama jurusan, contoh: 'Psikologi'..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm text-gray-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-col md:flex-row gap-4">
            <select
              className="w-full md:w-2/3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white shadow-sm"
              value={selectedFakultas}
              onChange={e => setSelectedFakultas(e.target.value)}
            >
              <option value="All">Semua Fakultas</option>
              {faculties.filter(f => f !== 'All').map(fak => (
                <option key={fak} value={fak}>{fak}</option>
              ))}
            </select>

            <div className="flex-grow flex items-center bg-white border border-gray-300 rounded-xl p-1 shadow-sm">
                {(['All', 'Saintek', 'Soshum'] as const).map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${selectedCategory === cat ? 'bg-teal-600 text-white shadow' : 'text-gray-600 hover:bg-teal-50'}`}
                >
                    {cat === 'All' ? 'Semua' : cat}
                </button>
                ))}
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJurusan.length > 0 ? (
            filteredJurusan.map((jurusan, index) => (
              <JurusanCard key={jurusan.id} jurusan={jurusan} onSelect={setSelectedJurusan} index={index} />
            ))
        ) : (
            <p className="text-center text-gray-500 col-span-full py-10">Maaf, jurusan yang Anda cari tidak ditemukan. Coba kata kunci lain.</p>
        )}
      </div>

      {selectedJurusan && (
        <JurusanModal jurusan={selectedJurusan} onClose={() => setSelectedJurusan(null)} />
      )}
    </div>
  );
};

export default JurusanPage;