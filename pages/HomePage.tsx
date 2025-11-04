
import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
  linkLabel: string;
}> = ({ icon, title, description, linkTo, linkLabel }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 border-b-4 border-gray-200 hover:border-stone-400">
      <div className="text-white bg-teal-500 p-4 rounded-full mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      <Link
        to={linkTo}
        className="mt-auto bg-teal-600 text-white font-bold py-2 px-5 rounded-full hover:bg-teal-700 transition-colors duration-300 inline-block"
      >
        {linkLabel}
      </Link>
    </div>
  );
};

const HomePage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center bg-white p-10 rounded-2xl shadow-xl animate-boing-in">
        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-4">
          Data Menunjukkan 87% Mahasiswa Merasa Salah Pilih Jurusan
        </h2>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Masa Depan Anda Bukan Permainan Untung-untungan
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          Memilih jurusan kuliah adalah langkah awal yang menentukan perjalanan karir Anda. Pilihan yang kurang tepat dapat menyebabkan penyesalan, serta membuang waktu dan biaya.
        </p>
        <p className="text-lg text-gray-700 font-semibold max-w-3xl mx-auto mb-8">
          Jurusanku hadir untuk menjadi panduan Anda. Kami membantu Anda mengenali potensi diri untuk merencanakan jalur karir yang lebih terarah dan sesuai impian.
        </p>
        <Link
          to="/tes-minat"
          className="bg-stone-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-stone-600 transition-transform transform hover:scale-105 duration-300 inline-block shadow-lg"
        >
          Mulai Kenali Diri Anda
        </Link>
      </section>

      {/* Features Section */}
      <section className="animate-boing-in" style={{ animationDelay: '150ms' }}>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            title="Info Jurusan"
            description="Dapatkan informasi lengkap mengenai ratusan jurusan, mulai dari kurikulum, prospek karir, hingga estimasi pendapatan."
            linkTo="/jurusan"
            linkLabel="Lihat Jurusan"
          />
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2 1M4 7l2-1M4 7v2.5M12 21.5v-2.5M12 18.5l-2 1m2-1l2 1" /></svg>}
            title="Tes Minat Bakat"
            description="Ikuti tes minat bakat yang dirancang untuk membantu mengungkap potensi tersembunyi dan memahami tipe kepribadian Anda."
            linkTo="/tes-minat"
            linkLabel="Ikuti Tes"
          />
          <FeatureCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
            title="Konsultasi AI"
            description="Masih ragu? Diskusikan hasil tes Anda dengan konsultan AI kami untuk mendapatkan wawasan dan rekomendasi yang lebih personal."
            linkTo="/konsultasi"
            linkLabel="Mulai Konsultasi"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;