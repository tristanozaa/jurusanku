import { Jurusan, InterestQuestion, InterestResult, MataKuliah } from './types';

// Helper function to create a URL-friendly slug
const createId = (name: string) => {
    return name
        .toLowerCase()
        .replace(/ & /g, ' dan ')
        .replace(/[().,]/g, '')
        .replace(/ /g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

// Helper function to convert ALL CAPS to Title Case
const toTitleCase = (str: string): string => {
  const smallWords = /^(dan|&|di|dalam|atau|untuk|dan|kota|wilayah)$/i;
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Handle acronyms like MIPA, ISIPOL, etc.
      if (word.length <= 4 && word === word.toUpperCase()) return word;
      if (word.includes('.')) return word.toUpperCase(); // For SOS.EK.
      if (index > 0 && smallWords.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

// --- EMBEDDED CURRICULUM DATA ---
// Data lengkap untuk 20 jurusan, 8 matkul per semester (Sem 1-6)
const allKurikulum: Record<string, Record<string, MataKuliah[]>> = {
  // === SAINTEK ===
  'teknologi-informasi': {
    "Semester 1": [
      { nama: "Kalkulus I", deskripsi: "Mempelajari konsep dasar turunan, integral, dan limit yang esensial untuk pemikiran komputasi." },
      { nama: "Fisika Dasar I", deskripsi: "Memahami prinsip-prinsip mekanika, panas, dan bunyi yang mendasari berbagai teknologi." },
      { nama: "Dasar Pemrograman", deskripsi: "Pengenalan logika pemrograman, variabel, kontrol alur, dan fungsi menggunakan bahasa Python." },
      { nama: "Logika Informatika", deskripsi: "Mempelajari dasar-dasar logika proposisional dan predikat sebagai fondasi penalaran dalam komputasi." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
      { nama: "Bahasa Indonesia", deskripsi: "Mengembangkan keterampilan berbahasa Indonesia yang baik dan benar untuk penulisan karya ilmiah." },
      { nama: "Pengantar Teknologi Informasi", deskripsi: "Gambaran umum tentang peran dan dampak teknologi informasi dalam berbagai bidang." },
    ],
    "Semester 2": [
      { nama: "Kalkulus II", deskripsi: "Lanjutan dari Kalkulus I, membahas integral lipat, barisan, dan deret tak hingga." },
      { nama: "Aljabar Linear", deskripsi: "Studi tentang vektor, matriks, dan ruang linear yang sangat penting untuk grafika komputer dan machine learning." },
      { nama: "Struktur Data & Algoritma", deskripsi: "Mempelajari cara mengorganisir data (seperti array, list, tree) dan algoritma efisien untuk memanipulasinya." },
      { nama: "Sistem Digital", deskripsi: "Memahami gerbang logika, sirkuit kombinasional dan sekuensial yang menjadi dasar komputer." },
      { nama: "Bahasa Inggris", deskripsi: "Meningkatkan kemampuan berbahasa Inggris, terutama dalam membaca literatur akademik." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara serta wawasan kebangsaan." },
      { nama: "Statistika Dasar", deskripsi: "Mempelajari metode pengumpulan, analisis, interpretasi, dan presentasi data." },
      { nama: "Praktikum Dasar Pemrograman", deskripsi: "Implementasi praktis konsep-konsep yang dipelajari dalam mata kuliah Dasar Pemrograman." },
    ],
    "Semester 3": [
      { nama: "Pemrograman Berorientasi Objek", deskripsi: "Mempelajari paradigma pemrograman berbasis objek (class, inheritance, polymorphism) menggunakan Java." },
      { nama: "Jaringan Komputer", deskripsi: "Mempelajari konsep dasar jaringan, model OSI, TCP/IP, dan protokol komunikasi data." },
      { nama: "Arsitektur Komputer", deskripsi: "Mempelajari organisasi dan desain fundamental dari sistem komputer, dari CPU hingga memori." },
      { nama: "Matematika Diskret", deskripsi: "Fondasi matematika untuk ilmu komputer, meliputi logika, teori himpunan, graf, dan kombinatorika." },
      { nama: "Basis Data", deskripsi: "Mempelajari desain, implementasi, dan manajemen sistem basis data relasional menggunakan SQL." },
      { nama: "Sistem Operasi", deskripsi: "Mempelajari cara kerja sistem operasi dalam mengelola sumber daya perangkat keras dan perangkat lunak." },
      { nama: "Desain Antarmuka Pengguna", deskripsi: "Prinsip-prinsip desain antarmuka (UI) dan pengalaman pengguna (UX) untuk aplikasi yang efektif." },
      { nama: "Praktikum Struktur Data", deskripsi: "Latihan praktis implementasi berbagai struktur data dan algoritma." },
    ],
    "Semester 4": [
      { nama: "Rekayasa Perangkat Lunak", deskripsi: "Mempelajari metodologi pengembangan perangkat lunak, mulai dari analisis kebutuhan hingga pemeliharaan." },
      { nama: "Pengembangan Aplikasi Web", deskripsi: "Mempelajari teknologi front-end (HTML, CSS, JavaScript) dan back-end untuk membangun aplikasi web." },
      { nama: "Kecerdasan Buatan", deskripsi: "Pengenalan konsep-konsep dasar AI, seperti search algorithms, machine learning, dan neural networks." },
      { nama: "Keamanan Informasi", deskripsi: "Mempelajari prinsip dan praktik untuk melindungi sistem informasi dari serangan dan ancaman." },
      { nama: "Interaksi Manusia dan Komputer", deskripsi: "Studi tentang bagaimana manusia berinteraksi dengan komputer dan cara merancang teknologi yang mudah digunakan." },
      { nama: "Analisis Algoritma", deskripsi: "Menganalisis efisiensi algoritma dari segi waktu dan penggunaan memori." },
      { nama: "Praktikum Jaringan Komputer", deskripsi: "Konfigurasi dan simulasi jaringan komputer menggunakan perangkat lunak." },
      { nama: "Praktikum Basis Data", deskripsi: "Latihan perancangan dan implementasi basis data menggunakan SQL dan DBMS." },
    ],
    "Semester 5": [
      { nama: "Manajemen Proyek TI", deskripsi: "Mempelajari perencanaan, pelaksanaan, dan pengelolaan proyek-proyek di bidang teknologi informasi." },
      { nama: "Data Mining", deskripsi: "Teknik untuk menemukan pola dan pengetahuan yang tersembunyi dari kumpulan data yang besar." },
      { nama: "Pemrograman Mobile", deskripsi: "Pengembangan aplikasi untuk platform mobile seperti Android atau iOS." },
      { nama: "Sistem Terdistribusi", deskripsi: "Konsep dan desain sistem yang komponennya terletak di komputer jaringan yang berbeda." },
      { nama: "Metodologi Penelitian", deskripsi: "Mempelajari pendekatan dan teknik dalam merancang dan melaksanakan penelitian ilmiah." },
      { nama: "Etika Profesi TI", deskripsi: "Membahas isu-isu etis dan profesional dalam penggunaan dan pengembangan teknologi informasi." },
      { nama: "Mata Kuliah Pilihan: Cloud Computing", deskripsi: "Mata kuliah pilihan yang berfokus pada peminatan spesifik seperti komputasi awan." },
      { nama: "Proyek Mini Perangkat Lunak", deskripsi: "Pengembangan proyek perangkat lunak skala kecil dalam tim." },
    ],
    "Semester 6": [
      { nama: "Kewirausahaan", deskripsi: "Mempelajari konsep dasar dan praktik dalam memulai dan mengembangkan bisnis berbasis teknologi." },
      { nama: "Manajemen Layanan TI", deskripsi: "Kerangka kerja untuk mengelola penyediaan layanan TI yang berkualitas kepada pelanggan." },
      { nama: "Big Data Technologies", deskripsi: "Pengenalan teknologi dan platform untuk memproses dan menganalisis set data yang sangat besar." },
      { nama: "Jaminan Kualitas Perangkat Lunak", deskripsi: "Teknik dan metode untuk memastikan perangkat lunak yang dikembangkan memenuhi standar kualitas." },
      { nama: "Mata Kuliah Pilihan: IoT", deskripsi: "Mata kuliah pilihan lanjutan sesuai dengan jalur karir yang diminati." },
      { nama: "Mata Kuliah Pilihan: Game Development", deskripsi: "Mata kuliah pilihan lanjutan untuk pengembangan game." },
      { nama: "Mata Kuliah Pilihan: Cyber Security", deskripsi: "Mata kuliah pilihan lanjutan di bidang keamanan siber." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Program magang di industri untuk mendapatkan pengalaman kerja nyata." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat, mengaplikasikan ilmu untuk memecahkan masalah nyata." },
      { nama: "Seminar Proposal Tugas Akhir", deskripsi: "Presentasi dan diskusi proposal penelitian untuk tugas akhir." }
    ],
    "Semester 8": [
      { nama: "Skripsi/Tugas Akhir", deskripsi: "Karya ilmiah mandiri berupa penelitian atau pengembangan proyek sebagai syarat kelulusan." }
    ]
  },
  'ilmu-komputer': {
    "Semester 1": [
      { nama: "Dasar Pemrograman", deskripsi: "Pengenalan logika pemrograman, variabel, kontrol alur, dan fungsi menggunakan bahasa seperti Python atau C++." },
      { nama: "Matematika Diskret", deskripsi: "Fondasi matematika untuk ilmu komputer, meliputi logika, teori himpunan, graf, dan kombinatorika." },
      { nama: "Sistem Digital", deskripsi: "Memahami gerbang logika, sirkuit kombinasional dan sekuensial yang menjadi dasar komputer." },
      { nama: "Kalkulus I", deskripsi: "Mempelajari konsep dasar turunan, integral, dan limit." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
      { nama: "Bahasa Indonesia", deskripsi: "Mengembangkan keterampilan berbahasa Indonesia yang baik dan benar untuk penulisan karya ilmiah." },
      { nama: "Pengantar Ilmu Komputer", deskripsi: "Memberikan gambaran luas tentang disiplin ilmu komputer, sejarah, dan sub-bidangnya." },
    ],
    "Semester 2": [
      { nama: "Struktur Data & Algoritma", deskripsi: "Mempelajari cara mengorganisir data (seperti array, list, tree) dan algoritma efisien untuk memanipulasinya." },
      { nama: "Arsitektur Komputer", deskripsi: "Mempelajari organisasi dan desain fundamental dari sistem komputer, dari CPU hingga memori." },
      { nama: "Aljabar Linear", deskripsi: "Studi tentang vektor, matriks, dan ruang linear yang sangat penting untuk grafika komputer dan machine learning." },
      { nama: "Bahasa Inggris", deskripsi: "Meningkatkan kemampuan berbahasa Inggris, terutama dalam membaca literatur akademik." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara serta wawasan kebangsaan." },
      { nama: "Statistika Dasar", deskripsi: "Mempelajari metode pengumpulan, analisis, interpretasi, dan presentasi data." },
      { nama: "Praktikum Dasar Pemrograman", deskripsi: "Implementasi praktis konsep-konsep yang dipelajari dalam mata kuliah Dasar Pemrograman." },
      { nama: "Fisika Dasar I", deskripsi: "Memahami prinsip-prinsip mekanika, panas, dan bunyi." },
    ],
    "Semester 3": [
      { nama: "Pemrograman Berorientasi Objek", deskripsi: "Mempelajari paradigma pemrograman berbasis objek (class, inheritance, polymorphism) menggunakan Java." },
      { nama: "Teori Bahasa dan Automata", deskripsi: "Mempelajari model komputasi formal seperti finite automata dan Turing machine." },
      { nama: "Sistem Operasi", deskripsi: "Mempelajari cara kerja sistem operasi dalam mengelola sumber daya perangkat keras dan perangkat lunak." },
      { nama: "Basis Data", deskripsi: "Mempelajari desain, implementasi, dan manajemen sistem basis data relasional menggunakan SQL." },
      { nama: "Metode Numerik", deskripsi: "Mempelajari algoritma untuk menyelesaikan masalah matematika secara numerik dengan komputer." },
      { nama: "Jaringan Komputer", deskripsi: "Mempelajari konsep dasar jaringan, model OSI, TCP/IP, dan protokol komunikasi data." },
      { nama: "Praktikum Struktur Data", deskripsi: "Latihan praktis implementasi berbagai struktur data dan algoritma." },
      { nama: "Desain dan Analisis Algoritma", deskripsi: "Menganalisis dan merancang algoritma yang efisien dan benar." },
    ],
    "Semester 4": [
      { nama: "Rekayasa Perangkat Lunak", deskripsi: "Mempelajari metodologi pengembangan perangkat lunak, mulai dari analisis kebutuhan hingga pemeliharaan." },
      { nama: "Kecerdasan Buatan", deskripsi: "Pengenalan konsep-konsep dasar AI, seperti search algorithms, machine learning, dan neural networks." },
      { nama: "Grafika Komputer", deskripsi: "Mempelajari teknik dan algoritma untuk menghasilkan gambar dan animasi menggunakan komputer." },
      { nama: "Teori Komputasi", deskripsi: "Mengkaji batasan dari apa yang bisa dihitung oleh komputer secara teoretis." },
      { nama: "Keamanan Informasi", deskripsi: "Mempelajari prinsip dan praktik untuk melindungi sistem informasi dari serangan dan ancaman." },
      { nama: "Praktikum Jaringan Komputer", deskripsi: "Konfigurasi dan simulasi jaringan komputer menggunakan perangkat lunak." },
      { nama: "Praktikum Basis Data", deskripsi: "Latihan perancangan dan implementasi basis data menggunakan SQL dan DBMS." },
      { nama: "Pemrograman Web", deskripsi: "Pengenalan teknologi front-end (HTML, CSS, JS) dan back-end untuk aplikasi web." },
    ],
    "Semester 5": [
      { nama: "Machine Learning", deskripsi: "Studi tentang algoritma yang memungkinkan komputer belajar dari data tanpa diprogram secara eksplisit." },
      { nama: "Kriptografi", deskripsi: "Mempelajari teknik enkripsi dan dekripsi untuk mengamankan komunikasi." },
      { nama: "Sistem Paralel dan Terdistribusi", deskripsi: "Konsep dan desain sistem yang menggunakan banyak prosesor atau komputer untuk menyelesaikan masalah." },
      { nama: "Metodologi Penelitian", deskripsi: "Mempelajari pendekatan dan teknik dalam merancang dan melaksanakan penelitian ilmiah." },
      { nama: "Interaksi Manusia dan Komputer", deskripsi: "Studi tentang bagaimana manusia berinteraksi dengan komputer dan cara merancang teknologi yang mudah digunakan." },
      { nama: "Mata Kuliah Pilihan: Visi Komputer", deskripsi: "Mata kuliah pilihan yang berfokus pada bagaimana komputer dapat 'melihat' dan menginterpretasi gambar." },
      { nama: "Mata Kuliah Pilihan: NLP", deskripsi: "Mata kuliah pilihan yang berfokus pada pemrosesan bahasa alami oleh komputer." },
      { nama: "Proyek Perangkat Lunak", deskripsi: "Pengembangan proyek perangkat lunak yang kompleks dalam sebuah tim." },
    ],
    "Semester 6": [
      { nama: "Kompilator", deskripsi: "Mempelajari desain dan implementasi kompilator, program yang menerjemahkan kode sumber ke kode mesin." },
      { nama: "Deep Learning", deskripsi: "Cabang dari machine learning yang menggunakan jaringan saraf tiruan dengan banyak lapisan." },
      { nama: "Etika Profesi", deskripsi: "Membahas isu-isu etis dan profesional dalam bidang ilmu komputer." },
      { nama: "Kewirausahaan", deskripsi: "Mempelajari konsep dasar dan praktik dalam memulai dan mengembangkan bisnis berbasis teknologi." },
      { nama: "Mata Kuliah Pilihan: Robotika", deskripsi: "Mata kuliah pilihan lanjutan yang mempelajari desain dan kontrol robot." },
      { nama: "Mata Kuliah Pilihan: Bioinformatika", deskripsi: "Penerapan teknik komputasi untuk menganalisis data biologis." },
      { nama: "Mata Kuliah Pilihan: Data Science", deskripsi: "Mata kuliah pilihan lanjutan untuk ilmu data." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Program magang di industri untuk mendapatkan pengalaman kerja nyata." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat, mengaplikasikan ilmu untuk memecahkan masalah nyata." },
      { nama: "Seminar Proposal Tugas Akhir", deskripsi: "Presentasi dan diskusi proposal penelitian untuk tugas akhir." }
    ],
    "Semester 8": [
      { nama: "Skripsi/Tugas Akhir", deskripsi: "Karya ilmiah mandiri berupa penelitian atau pengembangan proyek sebagai syarat kelulusan." }
    ]
  },
  'teknik-sipil': {
    "Semester 1": [
      { nama: "Kalkulus I", deskripsi: "Mempelajari konsep dasar turunan, integral, dan limit." },
      { nama: "Fisika Dasar I", deskripsi: "Memahami prinsip-prinsip mekanika, panas, dan bunyi." },
      { nama: "Kimia Dasar", deskripsi: "Mempelajari struktur atom, ikatan kimia, dan stoikiometri." },
      { nama: "Gambar Teknik", deskripsi: "Mempelajari cara membuat dan membaca gambar teknis yang menjadi bahasa universal dalam rekayasa." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
      { nama: "Bahasa Indonesia", deskripsi: "Mengembangkan keterampilan berbahasa Indonesia yang baik dan benar." },
      { nama: "Pengantar Teknik Sipil", deskripsi: "Memberikan gambaran umum tentang ruang lingkup dan profesi di bidang teknik sipil." },
    ],
    "Semester 2": [
      { nama: "Kalkulus II", deskripsi: "Lanjutan dari Kalkulus I, membahas integral lipat, barisan, dan deret tak hingga." },
      { nama: "Fisika Dasar II", deskripsi: "Membahas konsep kelistrikan, kemagnetan, dan optik." },
      { nama: "Mekanika Teknik (Statika)", deskripsi: "Menganalisis gaya-gaya pada struktur yang berada dalam keadaan diam (statis)." },
      { nama: "Ilmu Ukur Tanah", deskripsi: "Mempelajari teknik-teknik pengukuran dan pemetaan permukaan bumi." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Bahasa Inggris", deskripsi: "Meningkatkan kemampuan berbahasa Inggris untuk konteks teknis." },
      { nama: "Geologi Teknik", deskripsi: "Penerapan ilmu geologi untuk keperluan rekayasa sipil." },
      { nama: "Praktikum Ilmu Ukur Tanah", deskripsi: "Latihan praktis menggunakan alat-alat survei dan pemetaan." },
    ],
    "Semester 3": [
      { nama: "Mekanika Bahan", deskripsi: "Mempelajari perilaku material solid yang mengalami tegangan dan regangan." },
      { nama: "Struktur Beton Bertulang I", deskripsi: "Prinsip dasar perancangan elemen-elemen struktur beton seperti balok dan kolom." },
      { nama: "Mekanika Fluida", deskripsi: "Mempelajari perilaku fluida (cair dan gas) yang penting untuk desain sistem pengairan." },
      { nama: "Rekayasa Transportasi", deskripsi: "Pengantar perencanaan, desain, dan operasi sistem transportasi." },
      { nama: "Statistika dan Probabilitas", deskripsi: "Penerapan statistika untuk analisis data dalam rekayasa sipil." },
      { nama: "Analisis Struktur I", deskripsi: "Menganalisis gaya dalam dan deformasi pada struktur statis tertentu." },
      { nama: "Teknologi Bahan Konstruksi", deskripsi: "Mempelajari sifat dan pengujian material konstruksi seperti beton, baja, dan aspal." },
      { nama: "Praktikum Mekanika Fluida", deskripsi: "Eksperimen untuk memahami prinsip-prinsip dasar aliran fluida." },
    ],
    "Semester 4": [
      { nama: "Struktur Baja I", deskripsi: "Prinsip dasar perancangan elemen-elemen struktur baja." },
      { nama: "Hidrolika Saluran Terbuka", deskripsi: "Mempelajari aliran air pada saluran seperti sungai dan kanal." },
      { nama: "Mekanika Tanah I", deskripsi: "Mempelajari sifat-sifat fisis dan mekanis tanah." },
      { nama: "Rekayasa Lalu Lintas", deskripsi: "Menganalisis karakteristik dan pengendalian arus lalu lintas." },
      { nama: "Hidrologi", deskripsi: "Studi tentang siklus air dan distribusinya di bumi." },
      { nama: "Metode Numerik", deskripsi: "Penerapan metode numerik untuk menyelesaikan masalah rekayasa sipil." },
      { nama: "Praktikum Mekanika Tanah", deskripsi: "Pengujian laboratorium untuk menentukan sifat-sifat tanah." },
      { nama: "Struktur Kayu", deskripsi: "Prinsip dasar perancangan elemen-elemen struktur kayu." },
    ],
    "Semester 5": [
      { nama: "Struktur Beton Bertulang II", deskripsi: "Perancangan lanjutan struktur beton, termasuk pelat dan fondasi." },
      { nama: "Rekayasa Pondasi I", deskripsi: "Analisis dan desain fondasi dangkal untuk menopang struktur." },
      { nama: "Manajemen Konstruksi", deskripsi: "Aspek perencanaan, penjadwalan, dan pengendalian sumber daya dalam proyek konstruksi." },
      { nama: "Bangunan Air", deskripsi: "Perancangan struktur hidraulik seperti bendungan, bendung, dan irigasi." },
      { nama: "Perancangan Perkerasan Jalan", deskripsi: "Desain struktur perkerasan lentur dan kaku untuk jalan raya." },
      { nama: "Metodologi Penelitian", deskripsi: "Mempelajari pendekatan dan teknik dalam merancang penelitian." },
      { nama: "Ekonomi Teknik", deskripsi: "Analisis keekonomian proyek-proyek rekayasa." },
      { nama: "Mata Kuliah Pilihan: Struktur", deskripsi: "Mata kuliah pilihan yang berfokus pada peminatan struktur." },
    ],
    "Semester 6": [
      { nama: "Rekayasa Gempa", deskripsi: "Mempelajari perilaku struktur terhadap beban gempa dan cara perancangannya." },
      { nama: "Struktur Jembatan", deskripsi: "Analisis dan desain berbagai tipe struktur jembatan." },
      { nama: "Drainase Perkotaan", deskripsi: "Perancangan sistem penyaluran air hujan di kawasan perkotaan." },
      { nama: "Kewirausahaan", deskripsi: "Mempelajari konsep dasar dalam memulai dan mengelola bisnis di bidang konstruksi." },
      { nama: "Etika Profesi", deskripsi: "Membahas isu-isu etis dan tanggung jawab profesional insinyur sipil." },
      { nama: "Mata Kuliah Pilihan: Transportasi", deskripsi: "Mata kuliah pilihan lanjutan sesuai minat transportasi." },
      { nama: "Mata Kuliah Pilihan: Keairan", deskripsi: "Mata kuliah pilihan lanjutan sesuai minat keairan." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Program magang di perusahaan konstruksi atau konsultan." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat di daerah tertentu." },
      { nama: "Perancangan Tugas Akhir", deskripsi: "Proses merancang proyek komprehensif sebagai tugas akhir." }
    ],
    "Semester 8": [
      { nama: "Skripsi/Tugas Akhir", deskripsi: "Laporan tertulis dari hasil perancangan atau penelitian sebagai syarat kelulusan." }
    ]
  },
  'pendidikan-dokter': {
    "Semester 1": [
        { nama: "Biologi Sel dan Molekuler", deskripsi: "Dasar-dasar biologi pada tingkat seluler dan molekuler sebagai fondasi ilmu kedokteran." },
        { nama: "Kimia Kedokteran", deskripsi: "Prinsip kimia organik dan anorganik yang relevan dengan proses biologis tubuh manusia." },
        { nama: "Fisika Kedokteran", deskripsi: "Aplikasi prinsip-prinsip fisika dalam instrumen medis dan fungsi tubuh." },
        { nama: "Anatomi Dasar", deskripsi: "Pengenalan struktur kasar tubuh manusia dan terminologi anatomi." },
        { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
        { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
        { nama: "Bahasa Indonesia", deskripsi: "Keterampilan komunikasi dan penulisan ilmiah dalam Bahasa Indonesia." },
        { nama: "Bahasa Inggris Kedokteran", deskripsi: "Fokus pada literatur medis dan komunikasi dalam Bahasa Inggris." }
    ],
    "Semester 2": [
        { nama: "Histologi", deskripsi: "Studi tentang struktur mikroskopis jaringan tubuh manusia." },
        { nama: "Biokimia", deskripsi: "Mempelajari reaksi kimia yang terjadi dalam organisme hidup, metabolisme, dan enzim." },
        { nama: "Fisiologi Dasar", deskripsi: "Mempelajari fungsi normal sistem organ tubuh manusia." },
        { nama: "Genetika Kedokteran", deskripsi: "Prinsip pewarisan sifat dan peran gen dalam penyakit." },
        { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
        { nama: "Ilmu Kesehatan Masyarakat", deskripsi: "Pengantar konsep kesehatan pada tingkat populasi." },
        { nama: "Keterampilan Klinis Dasar I", deskripsi: "Latihan anamnesis dan pemeriksaan fisik dasar pada manekin." },
        { nama: "Etika Kedokteran dan Hukum", deskripsi: "Dasar-dasar etika profesi dan aspek hukum dalam praktik kedokteran." }
    ],
    "Semester 3": [
        { nama: "Anatomi Lanjutan", deskripsi: "Studi anatomi mendalam per sistem organ dengan diseksi kadaver." },
        { nama: "Fisiologi Lanjutan", deskripsi: "Studi fisiologi mendalam per sistem organ." },
        { nama: "Patologi Anatomi Dasar", deskripsi: "Mempelajari perubahan struktural pada sel dan jaringan akibat penyakit." },
        { nama: "Mikrobiologi Kedokteran", deskripsi: "Studi tentang bakteri, virus, jamur, dan parasit penyebab penyakit." },
        { nama: "Farmakologi Dasar", deskripsi: "Prinsip dasar cara kerja obat di dalam tubuh (farmakokinetik dan farmakodinamik)." },
        { nama: "Parasitologi", deskripsi: "Mempelajari parasit manusia dan penyakit yang ditimbulkannya." },
        { nama: "Sistem Kardiovaskular", deskripsi: "Blok terintegrasi yang membahas anatomi, fisiologi, dan penyakit jantung dan pembuluh darah." },
        { nama: "Keterampilan Klinis Dasar II", deskripsi: "Latihan keterampilan seperti injeksi, pemasangan infus, dan penjahitan luka." }
    ],
    "Semester 4": [
        { nama: "Patologi Klinik Dasar", deskripsi: "Interpretasi hasil pemeriksaan laboratorium (darah, urin, dll) untuk diagnosis." },
        { nama: "Imunologi", deskripsi: "Mempelajari sistem kekebalan tubuh dan gangguannya." },
        { nama: "Radiologi Dasar", deskripsi: "Pengenalan dan interpretasi dasar foto Rontgen, CT scan, dan USG." },
        { nama: "Gizi Kedokteran", deskripsi: "Peran nutrisi dalam kesehatan dan penyakit." },
        { nama: "Sistem Respirasi", deskripsi: "Blok terintegrasi mengenai sistem pernapasan." },
        { nama: "Sistem Gastrointestinal", deskripsi: "Blok terintegrasi mengenai sistem pencernaan." },
        { nama: "Sistem Endokrin & Metabolisme", deskripsi: "Blok terintegrasi mengenai sistem hormon dan metabolisme." },
        { nama: "Metodologi Penelitian Kedokteran", deskripsi: "Cara merancang dan melakukan penelitian di bidang kesehatan." }
    ],
    "Semester 5": [
        { nama: "Sistem Urogenital", deskripsi: "Blok terintegrasi mengenai sistem kemih dan reproduksi." },
        { nama: "Sistem Muskuloskeletal", deskripsi: "Blok terintegrasi mengenai sistem otot dan rangka." },
        { nama: "Sistem Saraf dan Perilaku", deskripsi: "Blok terintegrasi mengenai otak, saraf, dan dasar-dasar psikiatri." },
        { nama: "Sistem Hematologi & Onkologi", deskripsi: "Blok terintegrasi mengenai darah dan kanker." },
        { nama: "Kesehatan Kulit dan Jaringan Lunak", deskripsi: "Blok mengenai penyakit kulit dan kelamin." },
        { nama: "Tumbuh Kembang", deskripsi: "Mempelajari proses tumbuh kembang normal dari bayi hingga remaja." },
        { nama: "Kedokteran Tropis", deskripsi: "Fokus pada penyakit infeksi yang umum di daerah tropis." },
        { nama: "Keterampilan Klinis Lanjutan", deskripsi: "Latihan keterampilan yang lebih kompleks seperti resusitasi jantung paru." }
    ],
    "Semester 6": [
        { nama: "Kesehatan Mata", deskripsi: "Blok terintegrasi mengenai mata dan gangguannya." },
        { nama: "Kesehatan THT", deskripsi: "Blok terintegrasi mengenai Telinga, Hidung, Tenggorok." },
        { nama: "Kedokteran Forensik", deskripsi: "Aplikasi ilmu kedokteran untuk kepentingan hukum." },
        { nama: "Kedokteran Komunitas", deskripsi: "Penerapan ilmu kesehatan masyarakat di lapangan." },
        { nama: "Geriatri", deskripsi: "Ilmu kesehatan yang berfokus pada populasi lanjut usia." },
        { nama: "Kedokteran Okupasi", deskripsi: "Kesehatan yang berkaitan dengan pekerjaan." },
        { nama: "Kegawatdaruratan Medis", deskripsi: "Penanganan kasus-kasus gawat darurat." },
        { nama: "Persiapan Kepaniteraan Klinik", deskripsi: "Pembekalan komprehensif sebelum memasuki tahap profesi di rumah sakit." }
    ],
    "Semester 7": [
        { nama: "Kepaniteraan Klinik (Co-ass) I", deskripsi: "Stase di berbagai departemen di rumah sakit (misal: Ilmu Penyakit Dalam, Bedah)." },
        { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian masyarakat di bidang kesehatan." }
    ],
    "Semester 8": [
        { nama: "Kepaniteraan Klinik (Co-ass) II", deskripsi: "Lanjutan stase di departemen lain (misal: Anak, Obstetri & Ginekologi, Saraf)." },
        { nama: "Skripsi", deskripsi: "Penelitian ilmiah sebagai syarat kelulusan Sarjana Kedokteran." }
    ]
  },
  'farmasi': {
    "Semester 1": [
      { nama: "Kimia Dasar", deskripsi: "Mempelajari struktur atom, ikatan kimia, stoikiometri, dan termodinamika." },
      { nama: "Biologi Sel dan Molekuler", deskripsi: "Dasar-dasar biologi pada tingkat seluler dan molekuler." },
      { nama: "Fisika Dasar", deskripsi: "Prinsip-prinsip fisika yang relevan dengan ilmu farmasi." },
      { nama: "Matematika Farmasi", deskripsi: "Aplikasi matematika dalam perhitungan dosis dan formulasi sediaan." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
      { nama: "Bahasa Indonesia", deskripsi: "Keterampilan komunikasi dan penulisan ilmiah." },
      { nama: "Pengantar Ilmu Farmasi", deskripsi: "Gambaran umum tentang ruang lingkup profesi dan sejarah kefarmasian." },
    ],
    "Semester 2": [
      { nama: "Kimia Organik Farmasi", deskripsi: "Studi tentang senyawa karbon yang menjadi dasar molekul obat." },
      { nama: "Anatomi dan Fisiologi Manusia", deskripsi: "Mempelajari struktur dan fungsi normal tubuh manusia." },
      { nama: "Botani Farmasi", deskripsi: "Mempelajari tumbuhan yang berpotensi sebagai sumber bahan obat." },
      { nama: "Farmasetika Dasar", deskripsi: "Ilmu tentang seni dan teknik merancang bentuk sediaan obat." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Bahasa Inggris Farmasi", deskripsi: "Fokus pada literatur kefarmasian dan komunikasi dalam Bahasa Inggris." },
      { nama: "Statistika Farmasi", deskripsi: "Penerapan statistika dalam penelitian dan quality control." },
      { nama: "Praktikum Kimia Dasar", deskripsi: "Latihan laboratorium untuk memperkuat konsep kimia dasar." },
    ],
    "Semester 3": [
      { nama: "Kimia Analisis Farmasi", deskripsi: "Metode kualitatif dan kuantitatif untuk identifikasi dan penetapan kadar zat kimia." },
      { nama: "Biokimia", deskripsi: "Mempelajari proses kimia yang terjadi dalam tubuh sebagai target kerja obat." },
      { nama: "Farmakologi dan Toksikologi I", deskripsi: "Mempelajari mekanisme aksi obat (farmakodinamik) dan nasib obat dalam tubuh (farmakokinetik)." },
      { nama: "Teknologi Sediaan Solida", deskripsi: "Formulasi dan produksi sediaan padat seperti tablet, kapsul, dan pulveres." },
      { nama: "Mikrobiologi Farmasi", deskripsi: "Studi mikroorganisme yang relevan dengan penyakit dan sterilisasi produk farmasi." },
      { nama: "Farmakognosi", deskripsi: "Ilmu tentang obat yang berasal dari bahan alam (tumbuhan, hewan)." },
      { nama: "Praktikum Kimia Organik", deskripsi: "Sintesis dan identifikasi senyawa organik di laboratorium." },
      { nama: "Praktikum Farmasetika Dasar", deskripsi: "Latihan meracik dan membuat sediaan obat sederhana." },
    ],
    "Semester 4": [
      { nama: "Kimia Medisinal", deskripsi: "Hubungan antara struktur kimia molekul obat dengan aktivitas biologisnya." },
      { nama: "Farmakologi dan Toksikologi II", deskripsi: "Lanjutan farmakologi sistem organ dan pengantar toksikologi." },
      { nama: "Teknologi Sediaan Likuida & Semisolida", deskripsi: "Formulasi sediaan cair (sirup, eliksir) dan setengah padat (krim, salep)." },
      { nama: "Imunologi dan Virologi", deskripsi: "Mempelajari sistem imun dan virus sebagai dasar pengembangan vaksin dan antivirus." },
      { nama: "Analisis Instrumental", deskripsi: "Penggunaan instrumen modern (seperti HPLC, Spektrofotometer) dalam analisis farmasi." },
      { nama: "Patofisiologi", deskripsi: "Mempelajari mekanisme terjadinya penyakit sebagai dasar terapi obat." },
      { nama: "Praktikum Farmakognosi", deskripsi: "Identifikasi dan analisis simplisia bahan alam." },
      { nama: "Praktikum Teknologi Sediaan Solida", deskripsi: "Latihan pembuatan dan evaluasi tablet dan kapsul." },
    ],
    "Semester 5": [
      { nama: "Biofarmasetika", deskripsi: "Mempelajari bagaimana bentuk sediaan mempengaruhi absorpsi dan ketersediaan hayati obat." },
      { nama: "Farmakoterapi", deskripsi: "Pemilihan dan penggunaan obat yang rasional untuk terapi penyakit." },
      { nama: "Teknologi Sediaan Steril", deskripsi: "Formulasi dan pembuatan sediaan steril seperti injeksi dan tetes mata." },
      { nama: "Fitokimia", deskripsi: "Isolasi dan identifikasi senyawa kimia dari tumbuhan obat." },
      { nama: "Manajemen dan Pemasaran Farmasi", deskripsi: "Aspek bisnis dan manajemen dalam industri dan pelayanan farmasi." },
      { nama: "Metodologi Penelitian", deskripsi: "Cara merancang dan melakukan penelitian di bidang farmasi." },
      { nama: "Praktikum Farmakologi", deskripsi: "Eksperimen pada hewan coba untuk mengamati efek obat." },
      { nama: "Praktikum Fitokimia", deskripsi: "Latihan isolasi dan identifikasi senyawa aktif dari simplisia." },
    ],
    "Semester 6": [
      { nama: "Farmasi Klinik dan Komunitas", deskripsi: "Penerapan ilmu farmasi dalam pelayanan pasien di rumah sakit dan apotek." },
      { nama: "Analisis Sediaan Farmasi", deskripsi: "Kontrol kualitas dan analisis produk jadi sediaan farmasi." },
      { nama: "Bioteknologi Farmasi", deskripsi: "Produksi obat menggunakan teknologi rekayasa genetika dan sel." },
      { nama: "Kosmetologi", deskripsi: "Ilmu tentang formulasi dan evaluasi sediaan kosmetik." },
      { nama: "Peraturan dan Etika Farmasi", deskripsi: "Undang-undang dan kode etik yang mengatur praktik kefarmasian." },
      { nama: "Mata Kuliah Pilihan: Farmasi Industri", deskripsi: "Peminatan yang berfokus pada proses produksi skala industri." },
      { nama: "Mata Kuliah Pilihan: Bahan Alam", deskripsi: "Peminatan yang mendalami pengembangan obat herbal." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Program magang di apotek, rumah sakit, atau industri farmasi." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat di bidang kesehatan dan farmasi." },
      { nama: "Seminar Proposal Skripsi", deskripsi: "Presentasi rencana penelitian untuk tugas akhir." }
    ],
    "Semester 8": [
      { nama: "Skripsi", deskripsi: "Karya ilmiah hasil penelitian mandiri sebagai syarat kelulusan Sarjana Farmasi." }
    ]
  },
  'arsitektur': {
    "Semester 1": [
      { nama: "Gambar Teknik", deskripsi: "Dasar-dasar proyeksi, skala, dan representasi objek teknis secara dua dimensi." },
      { nama: "Estetika Bentuk Dasar", deskripsi: "Eksplorasi prinsip-prinsip komposisi, bentuk, ruang, warna, dan tekstur." },
      { nama: "Pengantar Arsitektur", deskripsi: "Gambaran umum tentang ruang lingkup, sejarah, dan profesi arsitektur." },
      { nama: "Kalkulus I", deskripsi: "Dasar-dasar matematika untuk perhitungan dalam perancangan." },
      { nama: "Fisika Dasar", deskripsi: "Konsep dasar mekanika dan statika benda sebagai fondasi ilmu struktur." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
      { nama: "Bahasa Indonesia", deskripsi: "Pengembangan kemampuan komunikasi dan penulisan akademik." }
    ],
    "Semester 2": [
      { nama: "Studio Perancangan Arsitektur 1", deskripsi: "Latihan perancangan objek arsitektur sederhana dengan fungsi tunggal." },
      { nama: "Struktur dan Konstruksi Bangunan 1", deskripsi: "Pengenalan sistem struktur dan material bangunan sederhana (kayu, bata)." },
      { nama: "Sejarah Arsitektur Dunia", deskripsi: "Studi perkembangan arsitektur dari zaman prasejarah hingga pra-modern." },
      { nama: "Mekanika Teknik", deskripsi: "Analisis gaya, momen, dan keseimbangan pada struktur statis." },
      { nama: "Bahasa Inggris", deskripsi: "Kemampuan membaca dan memahami literatur arsitektur internasional." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Fisika Bangunan", deskripsi: "Studi tentang aspek termal, akustik, dan pencahayaan alami pada bangunan." },
      { nama: "Gambar Arsitektur Digital 2D", deskripsi: "Penggunaan perangkat lunak CAD untuk membuat gambar kerja arsitektur." }
    ],
    "Semester 3": [
      { nama: "Studio Perancangan Arsitektur 2", deskripsi: "Perancangan bangunan dengan fungsi lebih kompleks, seperti rumah tinggal." },
      { nama: "Struktur dan Konstruksi Bangunan 2", deskripsi: "Studi tentang sistem struktur beton bertulang dan baja ringan." },
      { nama: "Teori dan Metode Perancangan", deskripsi: "Mempelajari berbagai pendekatan dan metodologi dalam proses desain arsitektur." },
      { nama: "Utilitas Bangunan", deskripsi: "Studi tentang sistem mekanikal, elektrikal, dan plumbing (MEP) pada bangunan." },
      { nama: "Arsitektur Vernakular Indonesia", deskripsi: "Kajian tentang arsitektur tradisional di berbagai daerah di Indonesia." },
      { nama: "Bahan Bangunan", deskripsi: "Mempelajari sifat, karakteristik, dan aplikasi berbagai material konstruksi." },
      { nama: "Pemodelan 3D Arsitektur", deskripsi: "Penggunaan perangkat lunak untuk membuat model tiga dimensi dan visualisasi." },
      { nama: "Ekologi Arsitektur", deskripsi: "Prinsip-prinsip desain yang berwawasan lingkungan dan berkelanjutan." }
    ],
    "Semester 4": [
      { nama: "Studio Perancangan Arsitektur 3", deskripsi: "Perancangan bangunan publik skala kecil, seperti perpustakaan atau galeri." },
      { nama: "Struktur dan Konstruksi Bangunan 3", deskripsi: "Studi sistem struktur bentang lebar dan bangunan bertingkat." },
      { nama: "Sejarah Arsitektur Modern", deskripsi: "Studi perkembangan arsitektur dari revolusi industri hingga saat ini." },
      { nama: "Perumahan dan Permukiman", deskripsi: "Kajian tentang isu-isu dan perencanaan kawasan perumahan." },
      { nama: "Kritik Arsitektur", deskripsi: "Dasar-dasar teori dan metode dalam menganalisis dan menilai karya arsitektur." },
      { nama: "Manajemen Konstruksi", deskripsi: "Pengantar perencanaan, penjadwalan, dan pengelolaan proyek konstruksi." },
      { nama: "Praktikum Struktur", deskripsi: "Eksperimen dan pengujian model struktur di laboratorium." },
      { nama: "Arsitektur Perilaku", deskripsi: "Studi tentang hubungan antara perilaku manusia dengan lingkungan binaan." }
    ],
    "Semester 5": [
      { nama: "Studio Perancangan Arsitektur 4", deskripsi: "Perancangan bangunan fungsi campuran (mixed-use) di konteks urban." },
      { nama: "Perancangan Kota", deskripsi: "Prinsip-prinsip dan elemen-elemen dalam perancangan ruang-ruang kota." },
      { nama: "Arsitektur Tropis", deskripsi: "Desain arsitektur yang merespon kondisi iklim tropis." },
      { nama: "Metodologi Penelitian Arsitektur", deskripsi: "Langkah-langkah dalam merumuskan dan melaksanakan penelitian di bidang arsitektur." },
      { nama: "Estimasi Biaya Proyek", deskripsi: "Teknik perhitungan Rencana Anggaran Biaya (RAB) untuk proyek konstruksi." },
      { nama: "Hukum dan Pranata Pembangunan", deskripsi: "Mempelajari peraturan dan perizinan terkait pembangunan." },
      { nama: "Mata Kuliah Pilihan: Desain Interior", deskripsi: "Peminatan yang mendalami perancangan ruang dalam." },
      { nama: "Mata Kuliah Pilihan: Arsitektur Digital", deskripsi: "Peminatan yang mendalami teknik desain parametrik dan komputasi." }
    ],
    "Semester 6": [
      { nama: "Studio Perancangan Arsitektur 5", deskripsi: "Tugas perancangan komprehensif yang mengintegrasikan semua aspek pengetahuan." },
      { nama: "Konservasi Arsitektur", deskripsi: "Teori dan praktik pelestarian bangunan-bangunan bersejarah." },
      { nama: "Praktik Profesional Arsitek", deskripsi: "Membahas etika, standar, dan seluk beluk profesi arsitek." },
      { nama: "Kewirausahaan", deskripsi: "Mempelajari konsep memulai dan mengelola biro arsitektur." },
      { nama: "Mata Kuliah Pilihan: Lansekap", deskripsi: "Peminatan yang mendalami perancangan ruang luar dan taman." },
      { nama: "Mata Kuliah Pilihan: Real Estate", deskripsi: "Peminatan yang mempelajari aspek pengembangan properti." },
      { nama: "Seminar Arsitektur", deskripsi: "Presentasi dan diskusi mengenai isu-isu terkini dalam arsitektur." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Program magang di biro konsultan arsitek atau kontraktor." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian masyarakat terkait lingkungan binaan." },
      { nama: "Proposal Tugas Akhir", deskripsi: "Penyusunan dan presentasi usulan konsep dan program untuk tugas akhir." }
    ],
    "Semester 8": [
      { nama: "Tugas Akhir", deskripsi: "Karya perancangan arsitektur yang komprehensif dan mandiri sebagai syarat kelulusan." }
    ]
  },
  'statistika': {
    "Semester 1": [
        { nama: "Kalkulus I", deskripsi: "Mempelajari konsep dasar turunan, integral, dan limit yang menjadi fondasi teori statistika." },
        { nama: "Pengantar Metode Statistika", deskripsi: "Gambaran umum tentang statistika deskriptif, penyajian data, dan konsep dasar probabilitas." },
        { nama: "Aljabar Linear Elementer", deskripsi: "Studi tentang vektor, matriks, dan ruang linear yang penting untuk model multivariat." },
        { nama: "Dasar-Dasar Pemrograman", deskripsi: "Pengenalan logika pemrograman, variabel, dan kontrol alur, seringkali menggunakan R atau Python." },
        { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
        { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
        { nama: "Bahasa Indonesia", deskripsi: "Mengembangkan keterampilan penulisan laporan dan karya ilmiah yang efektif." },
        { nama: "Pengantar Filsafat Ilmu", deskripsi: "Memahami hakikat ilmu pengetahuan dan cara berpikir ilmiah." }
    ],
    "Semester 2": [
        { nama: "Kalkulus II", deskripsi: "Lanjutan dari Kalkulus I, membahas integral lipat, barisan, dan deret tak hingga." },
        { nama: "Teori Peluang", deskripsi: "Fondasi matematis dari ketidakpastian, mempelajari peubah acak dan distribusi peluang." },
        { nama: "Metode Statistika", deskripsi: "Fokus pada statistika inferensial, termasuk estimasi titik, selang kepercayaan, dan uji hipotesis." },
        { nama: "Struktur Data", deskripsi: "Mempelajari cara mengorganisir dan menyimpan data secara efisien untuk analisis komputasi." },
        { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara serta wawasan kebangsaan." },
        { nama: "Bahasa Inggris", deskripsi: "Meningkatkan kemampuan membaca dan memahami literatur statistika internasional." },
        { nama: "Metode Numerik", deskripsi: "Mempelajari algoritma untuk menyelesaikan masalah matematika secara numerik dengan komputer." },
        { nama: "Praktikum Dasar Pemrograman Statistika", deskripsi: "Implementasi praktis konsep pemrograman untuk analisis data dasar." }
    ],
    "Semester 3": [
      { nama: "Analisis Regresi", deskripsi: "Mempelajari teknik untuk memodelkan hubungan antara satu variabel dependen dengan satu atau lebih variabel independen." },
      { nama: "Statistika Matematika I", deskripsi: "Pendekatan teoritis yang lebih dalam mengenai distribusi peluang dan fungsi peubah acak." },
      { nama: "Metode Survei Sampel", deskripsi: "Mempelajari teknik penarikan sampel yang efisien dan cara menganalisis data dari survei." },
      { nama: "Basis Data", deskripsi: "Mempelajari desain, implementasi, dan manajemen sistem basis data menggunakan SQL." },
      { nama: "Kalkulus Peubah Banyak", deskripsi: "Ekstensi dari kalkulus ke fungsi dengan beberapa variabel, penting untuk optimisasi." },
      { nama: "Studi Kasus Statistika", deskripsi: "Analisis masalah dunia nyata menggunakan metode statistika yang telah dipelajari." },
      { nama: "Praktikum Metode Statistika", deskripsi: "Latihan penggunaan perangkat lunak statistika (spt. SPSS, R) untuk melakukan uji hipotesis." },
      { nama: "Pengantar Proses Stokastik", deskripsi: "Mempelajari model matematika untuk sistem yang berkembang secara acak dari waktu ke waktu." }
    ],
    "Semester 4": [
      { nama: "Rancangan Percobaan", deskripsi: "Mempelajari cara merancang eksperimen yang valid secara statistik untuk membandingkan perlakuan." },
      { nama: "Statistika Matematika II", deskripsi: "Fokus pada teori estimasi, pengujian hipotesis, dan statistika cukup." },
      { nama: "Analisis Data Kategori", deskripsi: "Teknik khusus untuk menganalisis data yang berbentuk kategori atau kualitatif." },
      { nama: "Analisis Runtun Waktu", deskripsi: "Metode untuk menganalisis dan meramalkan data yang dikumpulkan dari waktu ke waktu (time series)." },
      { nama: "Analisis Multivariat", deskripsi: "Teknik untuk menganalisis data di mana ada beberapa variabel pengukuran pada setiap observasi." },
      { nama: "Komputasi Statistika", deskripsi: "Mempelajari algoritma komputasi yang intensif seperti simulasi Monte Carlo dan Bootstrap." },
      { nama: "Praktikum Analisis Regresi", deskripsi: "Penerapan analisis regresi pada berbagai set data menggunakan perangkat lunak." },
      { nama: "Praktikum Rancangan Percobaan", deskripsi: "Latihan merancang dan menganalisis data dari berbagai jenis percobaan." }
    ],
    "Semester 5": [
      { nama: "Metode Statistika Nonparametrik", deskripsi: "Uji statistik yang tidak bergantung pada asumsi distribusi data tertentu." },
      { nama: "Pengantar Data Mining", deskripsi: "Teknik untuk menemukan pola dan pengetahuan dari kumpulan data yang sangat besar." },
      { nama: "Statistika Bayes", deskripsi: "Pendekatan lain dalam inferensi statistik yang menggabungkan bukti sebelumnya dengan data." },
      { nama: "Metodologi Penelitian", deskripsi: "Langkah-langkah sistematis dalam merancang dan melaksanakan suatu penelitian ilmiah." },
      { nama: "Teknik Simulasi", deskripsi: "Penggunaan komputer untuk meniru sistem nyata dan mempelajari perilakunya." },
      { nama: "Mata Kuliah Pilihan: Aktuaria", deskripsi: "Peminatan yang menerapkan statistika dalam manajemen risiko dan asuransi." },
      { nama: "Mata Kuliah Pilihan: Biostatistika", deskripsi: "Penerapan statistika dalam bidang biologi dan kesehatan masyarakat." },
      { nama: "Proyek Analisis Data", deskripsi: "Mengerjakan proyek analisis data yang komprehensif secara berkelompok." }
    ],
    "Semester 6": [
      { nama: "Model Linier Terapan", deskripsi: "Studi lebih lanjut tentang model regresi, ANOVA, dan ANCOVA." },
      { nama: "Machine Learning", deskripsi: "Mempelajari algoritma yang memungkinkan komputer belajar dari data, seperti klasifikasi dan clustering." },
      { nama: "Konsultasi Statistika", deskripsi: "Mempelajari cara berinteraksi dengan klien dan memberikan solusi statistik untuk masalah mereka." },
      { nama: "Visualisasi Data", deskripsi: "Prinsip dan teknik untuk menyajikan data secara visual agar mudah dipahami." },
      { nama: "Etika Profesi", deskripsi: "Membahas tanggung jawab etis dalam pengumpulan, analisis, dan penyajian data." },
      { nama: "Mata Kuliah Pilihan: Ekonometrika", deskripsi: "Penerapan metode statistik pada data ekonomi." },
      { nama: "Mata Kuliah Pilihan: Statistika Spasial", deskripsi: "Analisis data yang memiliki komponen geografis." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Magang di lembaga survei, perusahaan riset, atau divisi analisis data." }
    ],
    "Semester 7": [
        { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat, seringkali terkait dengan survei atau analisis data desa." },
        { nama: "Seminar Proposal Skripsi", deskripsi: "Presentasi rencana penelitian ilmiah untuk tugas akhir." }
    ],
    "Semester 8": [
        { nama: "Skripsi", deskripsi: "Karya ilmiah hasil penelitian atau analisis data mandiri sebagai syarat kelulusan." }
    ]
  },
  'biologi': {
    "Semester 1": [
      { nama: "Biologi Dasar", deskripsi: "Pengenalan konsep fundamental biologi, meliputi sel, genetika, evolusi, dan ekologi." },
      { nama: "Kimia Dasar", deskripsi: "Mempelajari struktur atom, ikatan kimia, stoikiometri, dan termodinamika." },
      { nama: "Fisika Dasar I", deskripsi: "Memahami prinsip-prinsip mekanika, panas, dan bunyi." },
      { nama: "Kalkulus I", deskripsi: "Mempelajari konsep dasar turunan, integral, dan limit." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
      { nama: "Bahasa Indonesia", deskripsi: "Mengembangkan keterampilan berbahasa Indonesia yang baik dan benar." },
      { nama: "Bahasa Inggris", deskripsi: "Meningkatkan kemampuan berbahasa Inggris untuk literatur ilmiah." },
    ],
    "Semester 2": [
      { nama: "Struktur Tumbuhan", deskripsi: "Mempelajari anatomi dan morfologi berbagai kelompok tumbuhan." },
      { nama: "Struktur Hewan", deskripsi: "Mempelajari anatomi dan morfologi berbagai kelompok hewan." },
      { nama: "Genetika Dasar", deskripsi: "Mempelajari prinsip-prinsip pewarisan sifat dan molekuler genetika." },
      { nama: "Biokimia", deskripsi: "Mempelajari proses kimia yang terjadi di dalam tubuh makhluk hidup." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Ekologi Umum", deskripsi: "Mempelajari interaksi antara organisme dan lingkungannya." },
      { nama: "Statistika Dasar", deskripsi: "Mempelajari metode pengumpulan, analisis, dan interpretasi data biologis." },
      { nama: "Praktikum Biologi Dasar", deskripsi: "Kegiatan laboratorium untuk memperkuat pemahaman konsep biologi dasar." },
    ],
    "Semester 3": [
      { nama: "Mikrobiologi", deskripsi: "Studi tentang mikroorganisme seperti bakteri, virus, jamur, dan protista." },
      { nama: "Fisiologi Tumbuhan", deskripsi: "Mempelajari fungsi-fungsi vital pada tumbuhan, seperti fotosintesis dan respirasi." },
      { nama: "Biologi Sel dan Molekuler", deskripsi: "Mengkaji sel sebagai unit dasar kehidupan pada tingkat molekuler." },
      { nama: "Evolusi", deskripsi: "Mempelajari mekanisme dan sejarah perubahan spesies dari waktu ke waktu." },
      { nama: "Fisiologi Hewan", deskripsi: "Mempelajari fungsi-fungsi normal dari sistem organ tubuh hewan." },
      { nama: "Metodologi Penelitian", deskripsi: "Mempelajari pendekatan dan teknik dalam merancang penelitian biologi." },
      { nama: "Praktikum Genetika", deskripsi: "Eksperimen laboratorium terkait pewarisan sifat dan analisis DNA." },
      { nama: "Bioinformatika", deskripsi: "Penggunaan komputasi untuk menganalisis data biologis yang kompleks." },
    ],
    "Semester 4": [
      { nama: "Ekologi Tumbuhan", deskripsi: "Studi tentang hubungan antara tumbuhan dengan lingkungannya." },
      { nama: "Ekologi Hewan", deskripsi: "Studi tentang hubungan antara hewan dengan lingkungannya." },
      { nama: "Genetika Populasi", deskripsi: "Mempelajari distribusi dan perubahan frekuensi alel dalam suatu populasi." },
      { nama: "Bioteknologi", deskripsi: "Pemanfaatan organisme hidup atau produknya untuk keperluan manusia." },
      { nama: "Biologi Perkembangan", deskripsi: "Mempelajari proses pertumbuhan dan perkembangan organisme dari zigot hingga dewasa." },
      { nama: "Taksonomi Tumbuhan", deskripsi: "Ilmu tentang klasifikasi dan penamaan tumbuhan." },
      { nama: "Taksonomi Hewan", deskripsi: "Ilmu tentang klasifikasi dan penamaan hewan." },
      { nama: "Praktikum Fisiologi", deskripsi: "Eksperimen laboratorium untuk mengamati fungsi organ tumbuhan dan hewan." },
    ],
    "Semester 5": [
      { nama: "Konservasi Sumber Daya Alam", deskripsi: "Mempelajari prinsip dan praktik pengelolaan dan perlindungan keanekaragaman hayati." },
      { nama: "Ekologi Perairan", deskripsi: "Studi tentang ekosistem di perairan tawar dan laut." },
      { nama: "Virologi", deskripsi: "Cabang mikrobiologi yang mempelajari virus secara mendalam." },
      { nama: "Imunologi", deskripsi: "Mempelajari sistem kekebalan tubuh organisme." },
      { nama: "Kewirausahaan", deskripsi: "Mempelajari konsep dasar dalam memulai bisnis berbasis biologi." },
      { nama: "Mata Kuliah Pilihan: Botani Ekonomi", deskripsi: "Peminatan yang mempelajari pemanfaatan tumbuhan secara ekonomis." },
      { nama: "Mata Kuliah Pilihan: Entomologi", deskripsi: "Peminatan yang mendalami ilmu tentang serangga." },
      { nama: "Seminar", deskripsi: "Presentasi dan diskusi topik-topik terkini di bidang biologi." },
    ],
    "Semester 6": [
      { nama: "Analisis Vegetasi", deskripsi: "Metode kuantitatif untuk mempelajari komunitas tumbuhan." },
      { nama: "Perilaku Hewan (Etologi)", deskripsi: "Studi ilmiah tentang perilaku hewan di lingkungan alaminya." },
      { nama: "Biologi Kelautan", deskripsi: "Mempelajari kehidupan dan ekosistem di lautan." },
      { nama: "Toksikologi Lingkungan", deskripsi: "Mengkaji dampak zat beracun terhadap organisme dan ekosistem." },
      { nama: "Mata Kuliah Pilihan: Genetika Molekuler", deskripsi: "Peminatan yang mendalami analisis DNA dan rekayasa genetika." },
      { nama: "Mata Kuliah Pilihan: Ekofisiologi", deskripsi: "Peminatan yang mempelajari adaptasi fisiologis organisme terhadap lingkungan." },
      { nama: "Mata Kuliah Pilihan: Ornitologi", deskripsi: "Peminatan yang mempelajari tentang burung." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Magang di lembaga penelitian, konservasi, atau industri." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat." },
      { nama: "Proposal Skripsi", deskripsi: "Penyusunan dan presentasi rencana penelitian untuk skripsi." }
    ],
    "Semester 8": [
      { nama: "Skripsi", deskripsi: "Karya ilmiah hasil penelitian mandiri sebagai syarat kelulusan." }
    ]
  },
  'teknik-mesin': {
      "Semester 1": [
        { nama: "Kalkulus I", deskripsi: "Mempelajari konsep dasar turunan, integral, dan limit." },
        { nama: "Fisika Dasar I", deskripsi: "Memahami prinsip-prinsip mekanika, panas, dan bunyi." },
        { nama: "Kimia Dasar", deskripsi: "Mempelajari struktur atom, ikatan kimia, dan stoikiometri." },
        { nama: "Gambar Teknik", deskripsi: "Mempelajari cara membuat dan membaca gambar teknis mesin." },
        { nama: "Pengantar Teknik Mesin", deskripsi: "Gambaran umum tentang ruang lingkup dan profesi teknik mesin." },
        { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
        { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara." },
        { nama: "Bahasa Indonesia", deskripsi: "Mengembangkan keterampilan berbahasa Indonesia." },
      ],
      "Semester 2": [
        { nama: "Kalkulus II", deskripsi: "Lanjutan Kalkulus I, membahas integral lipat dan deret." },
        { nama: "Fisika Dasar II", deskripsi: "Membahas konsep kelistrikan, kemagnetan, dan optik." },
        { nama: "Statika Struktur", deskripsi: "Analisis gaya pada struktur statis." },
        { nama: "Material Teknik", deskripsi: "Mempelajari sifat-sifat material logam dan non-logam." },
        { nama: "Proses Manufaktur I", deskripsi: "Pengenalan proses permesinan seperti bubut dan frais." },
        { nama: "Termodinamika I", deskripsi: "Mempelajari hukum-hukum termodinamika dan siklus energi." },
        { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
        { nama: "Bahasa Inggris", deskripsi: "Meningkatkan kemampuan berbahasa Inggris teknis." },
      ],
      "Semester 3": [
        { nama: "Mekanika Kekuatan Material", deskripsi: "Mempelajari perilaku material solid yang mengalami tegangan dan regangan." },
        { nama: "Dinamika Teknik", deskripsi: "Mempelajari gerak benda dan gaya yang menyebabkannya." },
        { nama: "Mekanika Fluida I", deskripsi: "Mempelajari sifat dan perilaku fluida." },
        { nama: "Elemen Mesin I", deskripsi: "Perancangan komponen dasar mesin seperti poros dan pasak." },
        { nama: "Metrologi Industri", deskripsi: "Ilmu tentang pengukuran dan kalibrasi alat ukur." },
        { nama: "Matematika Teknik", deskripsi: "Penerapan matematika lanjut untuk masalah rekayasa." },
        { nama: "Praktikum Proses Manufaktur", deskripsi: "Latihan praktis menggunakan mesin-mesin produksi." },
        { nama: "Menggambar Mesin", deskripsi: "Penggunaan software CAD untuk menggambar komponen mesin." },
      ],
      "Semester 4": [
        { nama: "Perpindahan Panas I", deskripsi: "Studi tentang mekanisme perpindahan panas: konduksi, konveksi, radiasi." },
        { nama: "Elemen Mesin II", deskripsi: "Perancangan lanjutan elemen mesin seperti roda gigi dan bantalan." },
        { nama: "Getaran Mekanis", deskripsi: "Analisis getaran pada sistem mekanis." },
        { nama: "Teknik Tenaga Listrik", deskripsi: "Dasar-dasar sistem kelistrikan dan motor listrik." },
        { nama: "Metode Numerik", deskripsi: "Penyelesaian masalah rekayasa menggunakan metode numerik." },
        { nama: "Teknik Kendali", deskripsi: "Mempelajari sistem kontrol otomatis." },
        { nama: "Praktikum Fenomena Dasar Mesin", deskripsi: "Eksperimen laboratorium untuk mekanika fluida dan termodinamika." },
        { nama: "Proses Manufaktur II", deskripsi: "Mempelajari proses manufaktur non-konvensional." },
      ],
      "Semester 5": [
        { nama: "Perancangan Teknik", deskripsi: "Proses merancang produk mesin dari konsep hingga detail." },
        { nama: "Motor Bakar", deskripsi: "Mempelajari prinsip kerja dan performa mesin pembakaran dalam." },
        { nama: "Mesin Fluida", deskripsi: "Studi tentang pompa, kompresor, dan turbin." },
        { nama: "Ekonomi Teknik", deskripsi: "Analisis keekonomian proyek-proyek rekayasa." },
        { nama: "Metodologi Penelitian", deskripsi: "Mempelajari cara merancang dan melaksanakan penelitian." },
        { nama: "Mata Kuliah Pilihan: Konversi Energi", deskripsi: "Peminatan pada sistem pembangkit listrik." },
        { nama: "Mata Kuliah Pilihan: Mekatronika", deskripsi: "Integrasi mekanika, elektronika, dan komputer." },
        { nama: "Proyek Perancangan", deskripsi: "Mengerjakan proyek perancangan mesin dalam tim." },
      ],
      "Semester 6": [
        { nama: "Manajemen Industri", deskripsi: "Prinsip-prinsip manajemen dalam lingkungan industri." },
        { nama: "Kewirausahaan", deskripsi: "Mempelajari konsep memulai bisnis berbasis teknologi." },
        { nama: "Etika Profesi", deskripsi: "Membahas tanggung jawab etis insinyur." },
        { nama: "Keselamatan dan Kesehatan Kerja", deskripsi: "Prinsip-prinsip K3 di industri." },
        { nama: "Mata Kuliah Pilihan: Teknik Pendingin", deskripsi: "Peminatan pada sistem refrigerasi dan AC." },
        { nama: "Mata Kuliah Pilihan: Otomasi Industri", deskripsi: "Peminatan pada sistem otomasi pabrik." },
        { nama: "Mata Kuliah Pilihan: Material Komposit", deskripsi: "Peminatan pada material rekayasa modern." },
        { nama: "Kerja Praktik/Magang", deskripsi: "Magang di industri manufaktur atau rekayasa." }
      ],
      "Semester 7": [
        { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat." },
        { nama: "Seminar Proposal Tugas Akhir", deskripsi: "Presentasi rencana penelitian untuk tugas akhir." }
      ],
      "Semester 8": [
        { nama: "Skripsi/Tugas Akhir", deskripsi: "Karya ilmiah hasil penelitian atau perancangan mandiri." }
      ]
    },
    'kehutanan': {
      "Semester 1": [
        { nama: "Biologi Dasar", deskripsi: "Pengenalan konsep fundamental biologi." },
        { nama: "Kimia Dasar", deskripsi: "Mempelajari struktur atom, ikatan kimia, dan stoikiometri." },
        { nama: "Fisika Dasar", deskripsi: "Memahami prinsip-prinsip fisika dasar." },
        { nama: "Matematika Dasar", deskripsi: "Mempelajari konsep dasar kalkulus dan aljabar." },
        { nama: "Pengantar Ilmu Kehutanan", deskripsi: "Gambaran umum tentang ruang lingkup kehutanan." },
        { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib." },
        { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara." },
        { nama: "Bahasa Indonesia", deskripsi: "Mengembangkan keterampilan berbahasa Indonesia." },
      ],
      "Semester 2": [
        { nama: "Dendrologi", deskripsi: "Ilmu tentang pengenalan pohon." },
        { nama: "Ekologi Hutan", deskripsi: "Mempelajari interaksi organisme hutan dengan lingkungannya." },
        { nama: "Ilmu Tanah Hutan", deskripsi: "Mempelajari sifat dan karakteristik tanah hutan." },
        { nama: "Statistika Kehutanan", deskripsi: "Penerapan statistika dalam bidang kehutanan." },
        { nama: "Ilmu Ukur Kayu", deskripsi: "Teknik pengukuran volume dan kualitas kayu." },
        { nama: "Botani Hutan", deskripsi: "Mempelajari tumbuhan hutan secara mendalam." },
        { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
        { nama: "Bahasa Inggris", deskripsi: "Meningkatkan kemampuan berbahasa Inggris." },
      ],
      "Semester 3": [
        { nama: "Silvikultur", deskripsi: "Ilmu dan seni menumbuhkan dan memelihara hutan." },
        { nama: "Fisiologi Pohon", deskripsi: "Mempelajari proses-proses vital dalam kehidupan pohon." },
        { nama: "Inventarisasi Hutan", deskripsi: "Teknik mengumpulkan data tentang sumber daya hutan." },
        { nama: "Perlindungan Hutan", deskripsi: "Mempelajari cara melindungi hutan dari hama, penyakit, dan kebakaran." },
        { nama: "Sosiologi Kehutanan", deskripsi: "Studi tentang masyarakat di dalam dan sekitar hutan." },
        { nama: "Ekonomi Kehutanan", deskripsi: "Aspek ekonomi dalam pengelolaan hutan." },
        { nama: "Penginderaan Jauh", deskripsi: "Penggunaan citra satelit untuk pemantauan hutan." },
        { nama: "Praktikum Ekologi Hutan", deskripsi: "Kegiatan lapangan untuk studi ekologi." },
      ],
      "Semester 4": [
        { nama: "Manajemen Hutan", deskripsi: "Prinsip-prinsip perencanaan dan pengelolaan hutan lestari." },
        { nama: "Teknologi Hasil Hutan Kayu", deskripsi: "Mempelajari pengolahan dan pemanfaatan kayu." },
        { nama: "Konservasi Sumber Daya Hutan", deskripsi: "Mempelajari perlindungan keanekaragaman hayati." },
        { nama: "Hidrologi Hutan", deskripsi: "Studi tentang siklus air di ekosistem hutan." },
        { nama: "Kebijakan dan Perundangan Kehutanan", deskripsi: "Mempelajari peraturan terkait kehutanan." },
        { nama: "Sistem Informasi Geografis (SIG)", deskripsi: "Penerapan SIG untuk analisis spasial kehutanan." },
        { nama: "Praktikum Silvikultur", deskripsi: "Latihan pembibitan dan penanaman pohon." },
        { nama: "Penyuluhan Kehutanan", deskripsi: "Teknik berkomunikasi dengan masyarakat kehutanan." },
      ],
      "Semester 5": [
        { nama: "Perencanaan Hutan", deskripsi: "Menyusun rencana pengelolaan hutan jangka panjang." },
        { nama: "Teknologi Hasil Hutan Bukan Kayu", deskripsi: "Mempelajari pemanfaatan rotan, madu, getah, dll." },
        { nama: "Manajemen Daerah Aliran Sungai", deskripsi: "Pengelolaan terpadu wilayah DAS." },
        { nama: "Ekowisata", deskripsi: "Pengembangan pariwisata berbasis alam yang berkelanjutan." },
        { nama: "Metodologi Penelitian", deskripsi: "Mempelajari cara merancang penelitian kehutanan." },
        { nama: "Mata Kuliah Pilihan: Agroforestri", deskripsi: "Kombinasi kegiatan kehutanan dengan pertanian." },
        { nama: "Mata Kuliah Pilihan: Manajemen Satwaliar", deskripsi: "Pengelolaan populasi satwa liar." },
        { nama: "Proyek Kehutanan", deskripsi: "Mengerjakan proyek terapan di bidang kehutanan." },
      ],
      "Semester 6": [
        { nama: "Evaluasi Proyek Kehutanan", deskripsi: "Menilai keberhasilan proyek-proyek kehutanan." },
        { nama: "Kewirausahaan Kehutanan", deskripsi: "Mempelajari peluang bisnis di sektor kehutanan." },
        { nama: "Manajemen Hutan Tanaman Industri", deskripsi: "Pengelolaan hutan untuk produksi kayu." },
        { nama: "Perubahan Iklim dan Kehutanan", deskripsi: "Peran hutan dalam mitigasi dan adaptasi perubahan iklim." },
        { nama: "Mata Kuliah Pilihan: Bioteknologi Hutan", deskripsi: "Penerapan bioteknologi untuk pemuliaan pohon." },
        { nama: "Mata Kuliah Pilihan: Reklamasi Tambang", deskripsi: "Rehabilitasi lahan bekas tambang." },
        { nama: "Etika Lingkungan dan Profesi", deskripsi: "Membahas tanggung jawab etis rimbawan." },
        { nama: "Kerja Praktik/Magang", deskripsi: "Magang di perusahaan kehutanan atau instansi pemerintah." }
      ],
      "Semester 7": [
        { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat." },
        { nama: "Seminar Proposal Skripsi", deskripsi: "Presentasi rencana penelitian untuk skripsi." }
      ],
      "Semester 8": [
        { nama: "Skripsi", deskripsi: "Karya ilmiah hasil penelitian mandiri." }
      ]
    },
  // === SOSHUM ===
  'akuntansi': {
    "Semester 1": [
      { nama: "Pengantar Bisnis", deskripsi: "Memberikan gambaran umum tentang dunia bisnis, bentuk-bentuk badan usaha, dan fungsi-fungsi bisnis." },
      { nama: "Pengantar Akuntansi I", deskripsi: "Mempelajari dasar-dasar siklus akuntansi untuk perusahaan jasa." },
      { nama: "Pengantar Ekonomi Mikro", deskripsi: "Menganalisis perilaku individu dan perusahaan dalam pengambilan keputusan ekonomi." },
      { nama: "Matematika Ekonomi", deskripsi: "Penerapan konsep matematika dalam analisis masalah ekonomi." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
      { nama: "Bahasa Indonesia", deskripsi: "Mengembangkan keterampilan berbahasa Indonesia yang baik dan benar." },
      { nama: "Bahasa Inggris", deskripsi: "Meningkatkan kemampuan berbahasa Inggris untuk bisnis." },
    ],
    "Semester 2": [
      { nama: "Pengantar Akuntansi II", deskripsi: "Lanjutan dari Pengantar Akuntansi I, berfokus pada akuntansi untuk perusahaan dagang." },
      { nama: "Pengantar Ekonomi Makro", deskripsi: "Mempelajari fenomena ekonomi secara keseluruhan, termasuk inflasi dan pengangguran." },
      { nama: "Pengantar Manajemen", deskripsi: "Mempelajari fungsi-fungsi dasar manajemen: perencanaan, pengorganisasian, pengarahan, dan pengendalian." },
      { nama: "Statistika Ekonomi", deskripsi: "Penerapan metode statistika dalam analisis data ekonomi dan bisnis." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Hukum Bisnis", deskripsi: "Mempelajari aspek-aspek hukum yang berkaitan dengan kegiatan bisnis." },
      { nama: "Aplikasi Komputer Bisnis", deskripsi: "Penggunaan perangkat lunak seperti spreadsheet dan database untuk keperluan bisnis." },
      { nama: "Komunikasi Bisnis", deskripsi: "Keterampilan komunikasi efektif dalam konteks profesional dan bisnis." },
    ],
    "Semester 3": [
      { nama: "Akuntansi Keuangan Menengah I", deskripsi: "Pembahasan mendalam tentang kerangka konseptual dan standar akuntansi keuangan." },
      { nama: "Akuntansi Biaya", deskripsi: "Mempelajari cara mengakumulasi, mengalokasikan, dan mengendalikan biaya produksi." },
      { nama: "Manajemen Keuangan", deskripsi: "Menganalisis keputusan investasi, pendanaan, dan dividen perusahaan." },
      { nama: "Sistem Informasi Akuntansi", deskripsi: "Mempelajari bagaimana sistem informasi digunakan untuk menangkap dan memproses data akuntansi." },
      { nama: "Perpajakan I", deskripsi: "Pengantar konsep dan ketentuan umum perpajakan di Indonesia." },
      { nama: "Manajemen Pemasaran", deskripsi: "Mempelajari strategi untuk menciptakan dan memberikan nilai kepada pelanggan." },
      { nama: "Etika Bisnis dan Profesi", deskripsi: "Membahas dilema etis dalam dunia bisnis dan profesi akuntan." },
      { nama: "Praktikum Akuntansi Dasar", deskripsi: "Latihan praktis siklus akuntansi menggunakan software." },
    ],
    "Semester 4": [
      { nama: "Akuntansi Keuangan Menengah II", deskripsi: "Lanjutan pembahasan standar akuntansi keuangan untuk liabilitas, ekuitas, dan investasi." },
      { nama: "Akuntansi Manajemen", deskripsi: "Penggunaan informasi akuntansi untuk pengambilan keputusan manajerial." },
      { nama: "Auditing I", deskripsi: "Mempelajari konsep dan standar profesional dalam pemeriksaan laporan keuangan." },
      { nama: "Perpajakan II", deskripsi: "Pembahasan lanjutan tentang PPh Badan dan PPN." },
      { nama: "Manajemen Strategis", deskripsi: "Mempelajari proses perumusan dan implementasi strategi untuk mencapai tujuan organisasi." },
      { nama: "Sistem Pengendalian Manajemen", deskripsi: "Desain dan implementasi sistem untuk memastikan strategi organisasi dijalankan." },
      { nama: "Metodologi Penelitian", deskripsi: "Mempelajari pendekatan dan teknik dalam merancang penelitian di bidang akuntansi." },
      { nama: "Praktikum Akuntansi Biaya", deskripsi: "Latihan kasus perhitungan dan analisis biaya." },
    ],
    "Semester 5": [
      { nama: "Akuntansi Keuangan Lanjutan I", deskripsi: "Membahas topik-topik akuntansi kompleks seperti kombinasi bisnis dan konsolidasi." },
      { nama: "Auditing II", deskripsi: "Fokus pada penerapan prosedur audit dalam praktik." },
      { nama: "Teori Akuntansi", deskripsi: "Mengkaji landasan teoretis dan perkembangan pemikiran dalam akuntansi." },
      { nama: "Akuntansi Sektor Publik", deskripsi: "Akuntansi yang diterapkan pada organisasi pemerintah dan nirlaba." },
      { nama: "Analisis Laporan Keuangan", deskripsi: "Teknik menganalisis laporan keuangan untuk menilai kinerja dan kesehatan finansial perusahaan." },
      { nama: "Mata Kuliah Pilihan: Akuntansi Syariah", deskripsi: "Peminatan yang mempelajari akuntansi dari perspektif syariah." },
      { nama: "Mata Kuliah Pilihan: Akuntansi Forensik", deskripsi: "Peminatan yang berfokus pada investigasi kecurangan finansial." },
      { nama: "Praktikum Auditing", deskripsi: "Simulasi proses audit menggunakan kertas kerja audit." },
    ],
    "Semester 6": [
      { nama: "Akuntansi Keuangan Lanjutan II", deskripsi: "Pembahasan lanjutan mengenai akuntansi multinasional dan instrumen keuangan." },
      { nama: "Audit Sistem Informasi", deskripsi: "Proses audit yang berfokus pada pengendalian dalam sistem informasi." },
      { nama: "Seminar Akuntansi Keuangan", deskripsi: "Diskusi mendalam tentang isu-isu terkini dalam standar dan praktik akuntansi keuangan." },
      { nama: "Kewirausahaan", deskripsi: "Mempelajari konsep dasar dalam memulai dan mengelola bisnis." },
      { nama: "Mata Kuliah Pilihan: Perpajakan Internasional", deskripsi: "Peminatan yang mendalami aspek pajak dalam transaksi lintas negara." },
      { nama: "Mata Kuliah Pilihan: Pasar Modal", deskripsi: "Peminatan yang mempelajari akuntansi untuk entitas di pasar modal." },
      { nama: "Mata Kuliah Pilihan: Valuasi Bisnis", deskripsi: "Peminatan yang mendalami teknik penilaian bisnis." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Program magang di kantor akuntan publik, perusahaan, atau instansi pemerintah." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat." },
      { nama: "Seminar Proposal Skripsi", deskripsi: "Presentasi dan diskusi proposal penelitian untuk skripsi." }
    ],
    "Semester 8": [
      { nama: "Skripsi", deskripsi: "Karya ilmiah hasil penelitian mandiri sebagai syarat kelulusan." }
    ]
  },
  'manajemen': {
    "Semester 1": [
      { nama: "Pengantar Bisnis", deskripsi: "Gambaran umum tentang dunia bisnis, fungsi-fungsi organisasi, dan lingkungan bisnis." },
      { nama: "Pengantar Manajemen", deskripsi: "Mempelajari fungsi-fungsi dasar manajemen: perencanaan, pengorganisasian, pengarahan, dan pengendalian." },
      { nama: "Pengantar Akuntansi I", deskripsi: "Dasar-dasar pencatatan dan pelaporan keuangan perusahaan." },
      { nama: "Pengantar Ekonomi Mikro", deskripsi: "Analisis perilaku konsumen, produsen, dan struktur pasar." },
      { nama: "Matematika Bisnis", deskripsi: "Aplikasi konsep matematika dalam pemecahan masalah bisnis." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
      { nama: "Bahasa Indonesia", deskripsi: "Pengembangan kemampuan komunikasi bisnis dan penulisan laporan." }
    ],
    "Semester 2": [
      { nama: "Manajemen Pemasaran", deskripsi: "Mempelajari strategi produk, harga, promosi, dan distribusi (4P)." },
      { nama: "Manajemen Sumber Daya Manusia", deskripsi: "Fokus pada rekrutmen, pelatihan, kompensasi, dan hubungan industrial." },
      { nama: "Pengantar Ekonomi Makro", deskripsi: "Studi tentang variabel ekonomi agregat seperti PDB, inflasi, dan pengangguran." },
      { nama: "Statistika Bisnis", deskripsi: "Penerapan metode statistika untuk pengambilan keputusan bisnis." },
      { nama: "Pengantar Akuntansi II", deskripsi: "Lanjutan akuntansi dengan fokus pada perusahaan dagang dan perseroan." },
      { nama: "Hukum Bisnis", deskripsi: "Aspek-aspek hukum yang mengatur kegiatan bisnis seperti kontrak dan badan usaha." },
      { nama: "Bahasa Inggris Bisnis", deskripsi: "Komunikasi bisnis dalam konteks global." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." }
    ],
    "Semester 3": [
      { nama: "Manajemen Keuangan", deskripsi: "Analisis keputusan investasi, pendanaan, dan kebijakan dividen perusahaan." },
      { nama: "Manajemen Operasi", deskripsi: "Mempelajari pengelolaan proses produksi barang dan jasa secara efisien." },
      { nama: "Perilaku Organisasi", deskripsi: "Studi tentang perilaku individu dan kelompok dalam sebuah organisasi." },
      { nama: "Sistem Informasi Manajemen", deskripsi: "Peran teknologi informasi dalam mendukung pengambilan keputusan manajerial." },
      { nama: "Komunikasi Bisnis", deskripsi: "Teknik komunikasi lisan dan tulisan yang efektif di lingkungan kerja." },
      { nama: "Riset Pemasaran", deskripsi: "Metode pengumpulan dan analisis data untuk memahami pasar dan konsumen." },
      { nama: "Etika Bisnis", deskripsi: "Membahas dilema etis dan tanggung jawab sosial perusahaan." },
      { nama: "Aplikasi Komputer Bisnis", deskripsi: "Penggunaan perangkat lunak spreadsheet dan presentasi untuk analisis bisnis." }
    ],
    "Semester 4": [
      { nama: "Manajemen Strategis", deskripsi: "Proses perumusan, implementasi, dan evaluasi strategi untuk keunggulan kompetitif." },
      { nama: "Anggaran Perusahaan", deskripsi: "Teknik penyusunan dan pengendalian anggaran sebagai alat perencanaan." },
      { nama: "Manajemen Kinerja", deskripsi: "Sistem untuk mengukur dan meningkatkan kinerja karyawan dan organisasi." },
      { nama: "Kewirausahaan", deskripsi: "Proses mengidentifikasi peluang dan memulai bisnis baru." },
      { nama: "Pasar Uang dan Modal", deskripsi: "Mekanisme dan instrumen yang diperdagangkan di pasar keuangan." },
      { nama: "Perilaku Konsumen", deskripsi: "Studi tentang bagaimana konsumen membuat keputusan pembelian." },
      { nama: "Manajemen Lintas Budaya", deskripsi: "Tantangan dan strategi mengelola tim dan bisnis di lingkungan global." },
      { nama: "Metodologi Penelitian Bisnis", deskripsi: "Langkah-langkah merancang dan melakukan penelitian dalam konteks bisnis." }
    ],
    "Semester 5": [
      { nama: "Manajemen Inovasi", deskripsi: "Mempelajari cara mengelola kreativitas dan inovasi dalam organisasi." },
      { nama: "Studi Kelayakan Bisnis", deskripsi: "Analisis untuk menilai kelayakan sebuah ide bisnis dari berbagai aspek." },
      { nama: "Manajemen Proyek", deskripsi: "Teknik perencanaan, pelaksanaan, dan pengendalian proyek." },
      { nama: "Analisis Investasi dan Portofolio", deskripsi: "Evaluasi sekuritas dan pembentukan portofolio investasi yang optimal." },
      { nama: "Mata Kuliah Pilihan: Pemasaran Digital", deskripsi: "Peminatan yang mendalami strategi pemasaran online." },
      { nama: "Mata Kuliah Pilihan: Keuangan Korporat", deskripsi: "Peminatan yang mendalami keputusan keuangan perusahaan." },
      { nama: "Mata Kuliah Pilihan: Manajemen Talenta", deskripsi: "Peminatan yang berfokus pada pengelolaan SDM unggul." },
      { nama: "Seminar Manajemen", deskripsi: "Diskusi dan presentasi mengenai isu-isu terkini di bidang manajemen." }
    ],
    "Semester 6": [
      { nama: "Simulasi Bisnis", deskripsi: "Aplikasi terintegrasi dari semua konsep manajemen dalam sebuah simulasi pasar." },
      { nama: "Manajemen Risiko", deskripsi: "Identifikasi, analisis, dan mitigasi risiko dalam bisnis." },
      { nama: "Manajemen Rantai Pasok", deskripsi: "Pengelolaan aliran barang, informasi, dan keuangan dari pemasok hingga konsumen." },
      { nama: "Kepemimpinan", deskripsi: "Teori dan praktik kepemimpinan yang efektif dalam organisasi." },
      { nama: "Mata Kuliah Pilihan: Pemasaran Jasa", deskripsi: "Karakteristik dan strategi unik dalam pemasaran layanan." },
      { nama: "Mata Kuliah Pilihan: Bisnis Internasional", deskripsi: "Peminatan yang mendalami operasi bisnis lintas negara." },
      { nama: "Mata Kuliah Pilihan: Pengembangan Organisasi", deskripsi: "Strategi untuk meningkatkan efektivitas dan kesehatan organisasi." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Pengalaman kerja di perusahaan untuk menerapkan teori manajemen." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat, seringkali membantu UMKM." },
      { nama: "Proposal Skripsi", deskripsi: "Penyusunan dan presentasi rencana penelitian bisnis untuk tugas akhir." }
    ],
    "Semester 8": [
      { nama: "Skripsi", deskripsi: "Karya ilmiah hasil penelitian mandiri di bidang manajemen sebagai syarat kelulusan." }
    ]
  },
  'ilmu-komunikasi': {
    "Semester 1": [
      { nama: "Pengantar Ilmu Komunikasi", deskripsi: "Dasar-dasar teori, model, dan ruang lingkup ilmu komunikasi." },
      { nama: "Komunikasi Massa", deskripsi: "Mempelajari media massa (TV, radio, koran) dan dampaknya terhadap masyarakat." },
      { nama: "Psikologi Komunikasi", deskripsi: "Memahami proses mental yang terjadi saat manusia berkomunikasi." },
      { nama: "Sosiologi Komunikasi", deskripsi: "Kajian tentang peran komunikasi dalam membentuk struktur dan interaksi sosial." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
      { nama: "Bahasa Indonesia", deskripsi: "Keterampilan menulis efektif untuk berbagai keperluan komunikasi." },
      { nama: "Bahasa Inggris", deskripsi: "Kemampuan memahami literatur dan berkomunikasi dalam konteks global." }
    ],
    "Semester 2": [
      { nama: "Teori Komunikasi", deskripsi: "Pendalaman berbagai teori komunikasi, dari klasik hingga kontemporer." },
      { nama: "Komunikasi Antarpribadi", deskripsi: "Studi tentang proses komunikasi antara dua orang atau dalam kelompok kecil." },
      { nama: "Dasar-Dasar Jurnalistik", deskripsi: "Teknik dasar peliputan, penulisan berita, dan etika jurnalistik." },
      { nama: "Dasar-Dasar Public Relations", deskripsi: "Pengenalan fungsi dan praktik kehumasan dalam membangun citra organisasi." },
      { nama: "Komunikasi Visual", deskripsi: "Prinsip-prinsip desain dan analisis pesan melalui media visual." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Statistika Sosial", deskripsi: "Penerapan statistika untuk penelitian di bidang ilmu sosial." },
      { nama: "Teknologi Komunikasi", deskripsi: "Mempelajari perkembangan teknologi dari media cetak hingga digital." }
    ],
    "Semester 3": [
      { nama: "Metode Penelitian Komunikasi Kuantitatif", deskripsi: "Cara merancang dan melakukan penelitian komunikasi menggunakan pendekatan angka dan statistik." },
      { nama: "Komunikasi Organisasi", deskripsi: "Studi tentang aliran komunikasi dan dinamika dalam sebuah perusahaan atau organisasi." },
      { nama: "Fotografi Jurnalistik", deskripsi: "Teknik pengambilan foto yang memiliki nilai berita dan bercerita." },
      { nama: "Penulisan Naskah PR", deskripsi: "Praktik menulis siaran pers, artikel, dan materi publikasi lainnya untuk humas." },
      { nama: "Periklanan", deskripsi: "Prinsip-prinsip dasar, strategi kreatif, dan perencanaan media dalam periklanan." },
      { nama: "Komunikasi Politik", deskripsi: "Peran komunikasi dalam proses politik, kampanye, dan pembentukan opini publik." },
      { nama: "Etika dan Filsafat Komunikasi", deskripsi: "Mengkaji landasan etis dan filosofis dalam praktik komunikasi." },
      { nama: "Praktikum Jurnalistik Cetak", deskripsi: "Simulasi kerja di redaksi media cetak, dari peliputan hingga layout." }
    ],
    "Semester 4": [
      { nama: "Metode Penelitian Komunikasi Kualitatif", deskripsi: "Cara merancang dan melakukan penelitian komunikasi melalui wawancara mendalam, observasi, dan analisis teks." },
      { nama: "Media Relations", deskripsi: "Strategi membangun dan menjaga hubungan baik antara organisasi dengan media massa." },
      { nama: "Produksi Siaran Radio & Podcast", deskripsi: "Teknik produksi program audio, dari penulisan naskah hingga penyiaran." },
      { nama: "Manajemen Kampanye PR", deskripsi: "Perencanaan, pelaksanaan, dan evaluasi program kampanye Public Relations." },
      { nama: "Copywriting", deskripsi: "Seni menulis naskah iklan yang persuasif untuk berbagai media." },
      { nama: "Komunikasi Lintas Budaya", deskripsi: "Memahami dan mengatasi tantangan komunikasi antar individu dari latar belakang budaya yang berbeda." },
      { nama: "Hukum Media", deskripsi: "Mempelajari peraturan perundang-undangan yang mengatur media dan komunikasi." },
      { nama: "Praktikum Produksi TV", deskripsi: "Latihan produksi program televisi, termasuk peran kamera, sutradara, dan editor." }
    ],
    "Semester 5": [
      { nama: "Perencanaan Media Periklanan", deskripsi: "Strategi memilih media yang tepat untuk mencapai target audiens secara efektif dan efisien." },
      { nama: "Manajemen Krisis dan Reputasi", deskripsi: "Teknik komunikasi untuk menangani krisis yang dapat merusak citra organisasi." },
      { nama: "Jurnalisme Online", deskripsi: "Adaptasi praktik jurnalisme untuk platform digital dan media sosial." },
      { nama: "Komunikasi Pemasaran Terpadu", deskripsi: "Integrasi berbagai alat komunikasi (PR, iklan, promosi) untuk mencapai tujuan pemasaran." },
      { nama: "Mata Kuliah Pilihan: Branding", deskripsi: "Peminatan yang mendalami proses membangun dan mengelola merek." },
      { nama: "Mata Kuliah Pilihan: Sinematografi", deskripsi: "Peminatan yang mendalami seni dan teknik perfilman." },
      { nama: "Mata Kuliah Pilihan: Komunikasi Kesehatan", deskripsi: "Peminatan yang berfokus pada kampanye dan komunikasi di sektor kesehatan." },
      { nama: "Seminar Proposal Penelitian", deskripsi: "Presentasi usulan penelitian untuk tugas akhir/skripsi." }
    ],
    "Semester 6": [
      { nama: "Manajemen Media Massa", deskripsi: "Mempelajari aspek bisnis dan pengelolaan organisasi media." },
      { nama: "Produksi Film Dokumenter", deskripsi: "Proses pembuatan film non-fiksi, dari riset hingga pasca-produksi." },
      { nama: "Strategi Kreatif Periklanan", deskripsi: "Pengembangan ide-ide besar (big idea) untuk kampanye iklan." },
      { nama: "Public Speaking & Presentasi", deskripsi: "Teknik berbicara di depan umum dan presentasi yang efektif dan persuasif." },
      { nama: "Kewirausahaan Komunikasi", deskripsi: "Mempelajari peluang bisnis di industri kreatif dan komunikasi." },
      { nama: "Mata Kuliah Pilihan: Analisis Media Sosial", deskripsi: "Peminatan yang menggunakan data untuk menganalisis tren di media sosial." },
      { nama: "Mata Kuliah Pilihan: Event Management", deskripsi: "Peminatan yang berfokus pada perencanaan dan pelaksanaan acara." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Magang di stasiun TV, agensi PR, agensi iklan, atau media online." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian masyarakat, seringkali dalam bentuk penyuluhan atau pembuatan media komunitas." },
      { nama: "Isu-Isu Kontemporer dalam Komunikasi", deskripsi: "Diskusi dan analisis fenomena komunikasi terkini." }
    ],
    "Semester 8": [
      { nama: "Skripsi/Tugas Karya Akhir", deskripsi: "Penelitian ilmiah atau pembuatan karya (film, kampanye) sebagai syarat kelulusan." }
    ]
  },
  'ilmu-hukum': {
    "Semester 1": [
      { nama: "Pengantar Ilmu Hukum", deskripsi: "Memperkenalkan konsep-konsep dasar, sumber, dan sistem hukum secara umum." },
      { nama: "Pengantar Hukum Indonesia", deskripsi: "Gambaran umum tentang tata hukum dan sistem peradilan yang berlaku di Indonesia." },
      { nama: "Ilmu Negara", deskripsi: "Mempelajari konsep-konsep dasar negara, seperti asal-usul, tujuan, dan bentuk negara." },
      { nama: "Ilmu Sosial dan Politik Dasar", deskripsi: "Memberikan fondasi pemahaman tentang struktur masyarakat dan dinamika politik." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
      { nama: "Bahasa Indonesia", deskripsi: "Keterampilan menyusun argumen dan dokumen hukum dalam Bahasa Indonesia." },
      { nama: "Bahasa Inggris Hukum", deskripsi: "Pengenalan terminologi hukum dalam Bahasa Inggris." }
    ],
    "Semester 2": [
      { nama: "Hukum Perdata", deskripsi: "Mempelajari hukum yang mengatur hubungan antar individu (hukum orang, benda, perikatan, waris)." },
      { nama: "Hukum Pidana", deskripsi: "Mengkaji tentang tindak pidana, pertanggungjawaban pidana, dan sanksi." },
      { nama: "Hukum Tata Negara", deskripsi: "Studi tentang organisasi negara, lembaga-lembaga negara, dan hak asasi manusia." },
      { nama: "Hukum Administrasi Negara", deskripsi: "Mempelajari hukum yang mengatur tindakan dan kewenangan pemerintah." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Sosiologi Hukum", deskripsi: "Melihat hukum sebagai gejala sosial dan interaksinya dengan masyarakat." },
      { nama: "Filsafat Hukum", deskripsi: "Mengkaji hakikat, tujuan, dan landasan filosofis dari hukum." },
      { nama: "Asas-Asas Manajemen", deskripsi: "Pengenalan dasar-dasar manajemen yang relevan untuk kantor hukum." }
    ],
    "Semester 3": [
      { nama: "Hukum Acara Perdata", deskripsi: "Proses dan prosedur beracara di pengadilan perdata, dari gugatan hingga eksekusi." },
      { nama: "Hukum Acara Pidana", deskripsi: "Proses peradilan pidana, mulai dari penyidikan, penuntutan, hingga persidangan." },
      { nama: "Hukum Dagang", deskripsi: "Mempelajari aturan khusus yang berlaku bagi para pedagang dan kegiatan perniagaan." },
      { nama: "Hukum Internasional", deskripsi: "Hukum yang mengatur hubungan antar negara dan subjek hukum internasional lainnya." },
      { nama: "Hukum Lingkungan", deskripsi: "Ketentuan hukum yang bertujuan untuk melindungi dan mengelola lingkungan hidup." },
      { nama: "Hukum Agraria", deskripsi: "Mempelajari hukum yang mengatur tentang pertanahan di Indonesia." },
      { nama: "Antropologi Hukum", deskripsi: "Studi tentang praktik-praktik hukum pada masyarakat sederhana atau adat." },
      { nama: "Penemuan Hukum (Rechtsvinding)", deskripsi: "Mempelajari metode interpretasi yang digunakan hakim untuk menemukan hukum." }
    ],
    "Semester 4": [
      { nama: "Hukum Perjanjian", deskripsi: "Pendalaman mengenai syarat sahnya perjanjian, wanprestasi, dan jenis-jenis perjanjian khusus." },
      { nama: "Hukum Perseroan Terbatas", deskripsi: "Mengkaji secara spesifik tentang pendirian, organ, dan pembubaran PT." },
      { nama: "Hukum Acara Tata Usaha Negara", deskripsi: "Prosedur penyelesaian sengketa antara warga negara dengan badan/pejabat TUN." },
      { nama: "Hukum Adat", deskripsi: "Mempelajari sistem hukum yang hidup dan berlaku di kalangan masyarakat adat." },
      { nama: "Hukum Islam", deskripsi: "Pengantar mengenai sumber dan prinsip-prinsip dasar hukum dalam Islam." },
      { nama: "Kriminologi", deskripsi: "Studi ilmiah tentang kejahatan sebagai fenomena sosial." },
      { nama: "Metode Penelitian Hukum", deskripsi: "Teknik merancang dan melaksanakan penelitian hukum, baik normatif maupun empiris." },
      { nama: "Etika Profesi Hukum", deskripsi: "Kode etik dan tanggung jawab profesi bagi hakim, jaksa, advokat, dan notaris." }
    ],
    "Semester 5": [
      { nama: "Hukum Ketenagakerjaan", deskripsi: "Mengatur hubungan antara pekerja dan pengusaha, termasuk PHK dan serikat pekerja." },
      { nama: "Hukum Perbankan", deskripsi: "Aspek hukum dari kegiatan usaha bank dan produk-produk perbankan." },
      { nama: "Hukum Hak Kekayaan Intelektual", deskripsi: "Perlindungan hukum atas hak cipta, paten, merek, dan desain industri." },
      { nama: "Hukum Pajak", deskripsi: "Dasar-dasar dan ketentuan formal maupun material dalam perpajakan." },
      { nama: "Teknik Pembuatan Perjanjian", deskripsi: "Praktik menyusun dan menganalisis berbagai jenis kontrak bisnis." },
      { nama: "Mata Kuliah Pilihan: Hukum Pidana Khusus", deskripsi: "Peminatan yang mendalami tindak pidana korupsi, terorisme, atau narkotika." },
      { nama: "Mata Kuliah Pilihan: Hukum Bisnis", deskripsi: "Peminatan yang mendalami hukum pasar modal, asuransi, atau kepailitan." },
      { nama: "Perancangan Undang-Undang", deskripsi: "Teknik dan proses pembentukan peraturan perundang-undangan." }
    ],
    "Semester 6": [
      { nama: "Hukum Waris", deskripsi: "Pendalaman mengenai hukum waris menurut KUHPerdata, adat, dan Islam." },
      { nama: "Praktek Kemahiran Hukum (Moot Court)", deskripsi: "Simulasi persidangan untuk melatih keterampilan beracara." },
      { nama: "Alternatif Penyelesaian Sengketa", deskripsi: "Mempelajari metode penyelesaian sengketa di luar pengadilan, seperti mediasi dan arbitrase." },
      { nama: "Kapita Selekta Hukum Pidana", deskripsi: "Pembahasan isu-isu dan kasus-kasus pidana terkini." },
      { nama: "Mata Kuliah Pilihan: Hukum Internasional Lanjutan", deskripsi: "Peminatan yang mendalami hukum laut, diplomatik, atau humaniter." },
      { nama: "Mata Kuliah Pilihan: Hukum Tata Negara Lanjutan", deskripsi: "Peminatan yang mendalami pemilu, partai politik, atau perbandingan konstitusi." },
      { nama: "Legal Opinion dan Legal Due Diligence", deskripsi: "Praktik memberikan pendapat hukum dan uji tuntas hukum untuk transaksi bisnis." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Magang di kantor hukum, pengadilan, kejaksaan, atau lembaga pemerintah." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian masyarakat, seringkali dalam bentuk penyuluhan hukum." },
      { nama: "Seminar Proposal Skripsi", deskripsi: "Presentasi usulan penelitian hukum untuk tugas akhir." }
    ],
    "Semester 8": [
      { nama: "Skripsi", deskripsi: "Karya tulis ilmiah hasil penelitian hukum mandiri sebagai syarat kelulusan." }
    ]
  },
  'psikologi': {
    "Semester 1": [
      { nama: "Pengantar Psikologi", deskripsi: "Gambaran umum tentang sejarah, ruang lingkup, dan berbagai mahzab dalam psikologi." },
      { nama: "Biopsikologi", deskripsi: "Mempelajari dasar-dasar biologis dari perilaku dan proses mental, termasuk sistem saraf dan otak." },
      { nama: "Filsafat Manusia", deskripsi: "Kajian filosofis tentang hakikat manusia yang menjadi dasar pemahaman psikologi." },
      { nama: "Sosiologi dan Antropologi", deskripsi: "Memberikan pemahaman dasar tentang struktur sosial dan budaya yang mempengaruhi individu." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib yang membahas nilai-nilai spiritual dan etika." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara dan ideologi bangsa." },
      { nama: "Bahasa Indonesia", deskripsi: "Keterampilan menulis laporan dan karya ilmiah di bidang psikologi." },
      { nama: "Bahasa Inggris", deskripsi: "Kemampuan membaca dan memahami literatur psikologi internasional." }
    ],
    "Semester 2": [
      { nama: "Psikologi Perkembangan I", deskripsi: "Studi tentang perubahan perilaku dan kognitif manusia dari masa konsepsi hingga remaja." },
      { nama: "Psikologi Kepribadian I", deskripsi: "Pengantar teori-teori kepribadian klasik, seperti psikoanalisis dan behaviorisme." },
      { nama: "Psikologi Sosial I", deskripsi: "Mempelajari bagaimana pikiran, perasaan, dan perilaku individu dipengaruhi oleh orang lain." },
      { nama: "Statistika Psikologi", deskripsi: "Dasar-dasar statistika deskriptif dan inferensial untuk penelitian psikologi." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Metode Penelitian Kuantitatif", deskripsi: "Prinsip dan langkah-langkah dalam merancang penelitian psikologi dengan pendekatan kuantitatif." },
      { nama: "Observasi dan Wawancara", deskripsi: "Pelatihan keterampilan dasar dalam pengumpulan data melalui observasi dan wawancara." },
      { nama: "Faal Umum", deskripsi: "Mempelajari fungsi normal dari sistem organ tubuh manusia." }
    ],
    "Semester 3": [
      { nama: "Psikologi Perkembangan II", deskripsi: "Lanjutan studi perkembangan pada masa dewasa awal, madya, hingga lanjut usia." },
      { nama: "Psikologi Kepribadian II", deskripsi: "Membahas teori-teori kepribadian humanistik, kognitif, dan kontemporer." },
      { nama: "Psikologi Kognitif", deskripsi: "Studi tentang proses mental seperti persepsi, memori, berpikir, dan pemecahan masalah." },
      { nama: "Psikometri", deskripsi: "Ilmu tentang pengukuran psikologis, termasuk validitas dan reliabilitas alat tes." },
      { nama: "Kode Etik Psikologi", deskripsi: "Mempelajari prinsip-prinsip etis yang harus dipegang oleh psikolog dan ilmuwan psikologi." },
      { nama: "Psikologi Belajar", deskripsi: "Teori-teori tentang bagaimana manusia dan hewan belajar perilaku baru." },
      { nama: "Psikologi Lintas Budaya", deskripsi: "Memahami bagaimana budaya mempengaruhi perilaku dan proses mental manusia." },
      { nama: "Praktikum Statistika", deskripsi: "Aplikasi statistika menggunakan perangkat lunak seperti SPSS." }
    ],
    "Semester 4": [
      { nama: "Psikologi Klinis", deskripsi: "Pengantar asesmen, diagnosis, dan intervensi untuk gangguan psikologis." },
      { nama: "Psikologi Industri dan Organisasi (PIO)", deskripsi: "Penerapan prinsip psikologi di tempat kerja, seperti seleksi, pelatihan, dan motivasi." },
      { nama: "Psikologi Pendidikan", deskripsi: "Mempelajari proses belajar mengajar dan faktor-faktor psikologis yang mempengaruhinya." },
      { nama: "Konstruksi Alat Ukur Psikologi", deskripsi: "Proses merancang dan mengembangkan instrumen atau tes psikologi." },
      { nama: "Metode Penelitian Kualitatif", deskripsi: "Prinsip dan langkah-langkah penelitian psikologi dengan pendekatan non-numerik." },
      { nama: "Kesehatan Mental", deskripsi: "Konsep kesehatan mental, faktor risiko, dan promosi kesejahteraan psikologis." },
      { nama: "Psikologi Abnormal", deskripsi: "Studi tentang berbagai jenis gangguan mental, gejala, dan penyebabnya." },
      { nama: "Praktikum Asesmen Individual", deskripsi: "Latihan administrasi dan skoring tes inteligensi." }
    ],
    "Semester 5": [
      { nama: "Psikologi Eksperimen", deskripsi: "Merancang dan melaksanakan eksperimen untuk menguji hipotesis tentang perilaku." },
      { nama: "Psikodiagnostik", deskripsi: "Proses integrasi data dari berbagai sumber (tes, wawancara) untuk membuat diagnosis psikologis." },
      { nama: "Asesmen dan Intervensi PIO", deskripsi: "Teknik-teknik asesmen (misal: assessment center) dan intervensi (misal: pelatihan) di organisasi." },
      { nama: "Dinamika Kelompok", deskripsi: "Mempelajari proses dan interaksi yang terjadi dalam kelompok." },
      { nama: "Psikologi Konseling", deskripsi: "Dasar-dasar teori dan teknik dalam membantu individu mengatasi masalah pribadi." },
      { nama: "Mata Kuliah Pilihan: Psikologi Forensik", deskripsi: "Peminatan yang menerapkan psikologi dalam sistem hukum." },
      { nama: "Mata Kuliah Pilihan: Psikologi Anak Berkebutuhan Khusus", deskripsi: "Peminatan yang berfokus pada anak dengan kondisi khusus." },
      { nama: "Praktikum Asesmen Kelompok", deskripsi: "Latihan melakukan asesmen dan intervensi dalam seting kelompok." }
    ],
    "Semester 6": [
      { nama: "Psikologi Kognisi Sosial", deskripsi: "Mempelajari bagaimana kita berpikir tentang diri kita sendiri dan orang lain." },
      { nama: "Rancangan Penelitian Skripsi", deskripsi: "Penyusunan proposal penelitian yang komprehensif untuk tugas akhir." },
      { nama: "Intervensi Psikologi", deskripsi: "Pengenalan berbagai bentuk intervensi psikologis, baik individual maupun kelompok." },
      { nama: "Kewirausahaan", deskripsi: "Mempelajari konsep dasar dalam memulai praktik atau bisnis berbasis psikologi." },
      { nama: "Mata Kuliah Pilihan: Psikologi Keluarga", deskripsi: "Peminatan yang mendalami dinamika dan intervensi dalam keluarga." },
      { nama: "Mata Kuliah Pilihan: Psikologi Konsumen", deskripsi: "Peminatan yang mempelajari perilaku konsumen dari sudut pandang psikologi." },
      { nama: "Mata Kuliah Pilihan: Psikologi Positif", deskripsi: "Peminatan yang berfokus pada kebahagiaan dan kesejahteraan manusia." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Magang di biro psikologi, rumah sakit, sekolah, atau perusahaan." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian masyarakat, seringkali terkait dengan psikoedukasi." },
      { nama: "Seminar Proposal Skripsi", deskripsi: "Presentasi dan diskusi proposal penelitian untuk skripsi." }
    ],
    "Semester 8": [
      { nama: "Skripsi", deskripsi: "Karya ilmiah hasil penelitian mandiri sebagai syarat kelulusan." }
    ]
  },
  'ilmu-hubungan-internasional': {
    "Semester 1": [
      { nama: "Pengantar Ilmu Hubungan Internasional", deskripsi: "Dasar-dasar teori, konsep, dan aktor dalam hubungan internasional." },
      { nama: "Pengantar Ilmu Politik", deskripsi: "Mempelajari konsep-konsep dasar dalam ilmu politik." },
      { nama: "Sejarah Diplomasi", deskripsi: "Studi tentang perkembangan praktik diplomasi dari masa ke masa." },
      { nama: "Hukum Internasional", deskripsi: "Pengantar hukum yang mengatur hubungan antar negara." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara." },
      { nama: "Bahasa Indonesia", deskripsi: "Pengembangan kemampuan penulisan akademik." },
      { nama: "Bahasa Inggris Akademik", deskripsi: "Kemampuan membaca dan menulis dalam konteks akademik HI." }
    ],
    "Semester 2": [
      { nama: "Teori Hubungan Internasional", deskripsi: "Pendalaman mazhab-mazhab utama dalam teori HI (Realisme, Liberalisme, dll)." },
      { nama: "Politik Luar Negeri Indonesia", deskripsi: "Analisis arah dan implementasi politik luar negeri Indonesia." },
      { nama: "Organisasi Internasional", deskripsi: "Studi tentang PBB dan organisasi-organisasi internasional lainnya." },
      { nama: "Ekonomi Politik Internasional", deskripsi: "Mempelajari interaksi antara politik dan ekonomi di tingkat global." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Metodologi Penelitian Sosial", deskripsi: "Dasar-dasar merancang penelitian di bidang ilmu sosial." },
      { nama: "Masyarakat Transnasional", deskripsi: "Peran aktor non-negara (NGO, MNC) dalam politik global." },
      { nama: "Bahasa Asing Pilihan I (e.g. Mandarin)", deskripsi: "Mempelajari bahasa asing sebagai penunjang." }
    ],
    "Semester 3": [
      { nama: "Politik dan Pemerintahan Asia Tenggara", deskripsi: "Studi kawasan yang berfokus pada negara-negara ASEAN." },
      { nama: "Keamanan Internasional", deskripsi: "Mengkaji isu-isu keamanan tradisional dan non-tradisional." },
      { nama: "Globalisasi dan Isu-Isu Global", deskripsi: "Analisis fenomena globalisasi dan dampaknya." },
      { nama: "Diplomasi dan Negosiasi", deskripsi: "Teknik dan praktik dalam berdiplomasi dan bernegosiasi." },
      { nama: "Politik Perbandingan", deskripsi: "Membandingkan sistem politik di berbagai negara." },
      { nama: "Statistika Sosial", deskripsi: "Penerapan statistika untuk penelitian sosial." },
      { nama: "Kajian Strategis", deskripsi: "Analisis strategi militer dan kebijakan pertahanan." },
      { nama: "Bahasa Asing Pilihan II", deskripsi: "Lanjutan pembelajaran bahasa asing." }
    ],
    "Semester 4": [
      { nama: "Studi Pembangunan", deskripsi: "Teori dan praktik pembangunan di negara-negara berkembang." },
      { nama: "Hak Asasi Manusia", deskripsi: "Studi tentang norma dan perlindungan HAM internasional." },
      { nama: "Studi Kawasan: Asia Timur", deskripsi: "Analisis politik dan ekonomi di Tiongkok, Jepang, dan Korea." },
      { nama: "Resolusi Konflik", deskripsi: "Mempelajari teori dan metode penyelesaian konflik internasional." },
      { nama: "Studi Media dan Komunikasi Global", deskripsi: "Peran media dalam membentuk opini dan kebijakan global." },
      { nama: "Bisnis Internasional", deskripsi: "Aspek-aspek bisnis dalam konteks lintas negara." },
      { nama: "Praktik Diplomasi", deskripsi: "Simulasi sidang PBB dan latihan negosiasi." },
      { nama: "Metode Penelitian HI", deskripsi: "Teknik penelitian kualitatif dan kuantitatif khusus untuk HI." }
    ],
    "Semester 5": [
      { nama: "Studi Kawasan: Eropa", deskripsi: "Analisis politik dan ekonomi di Uni Eropa dan sekitarnya." },
      { nama: "Gender dalam Hubungan Internasional", deskripsi: "Perspektif feminis dan gender dalam analisis isu global." },
      { nama: "Studi Perdamaian dan Keamanan", deskripsi: "Pendekatan-pendekatan untuk menciptakan perdamaian." },
      { nama: "Politik Lingkungan Global", deskripsi: "Tata kelola isu-isu lingkungan di tingkat internasional." },
      { nama: "Mata Kuliah Pilihan: Terorisme Global", deskripsi: "Peminatan pada isu terorisme dan kontra-terorisme." },
      { nama: "Mata Kuliah Pilihan: Diplomasi Publik", deskripsi: "Peminatan pada diplomasi yang menargetkan masyarakat asing." },
      { nama: "Mata Kuliah Pilihan: Ekonomi Politik Pembangunan", deskripsi: "Peminatan pada aspek ekonomi politik di negara berkembang." },
      { nama: "Seminar Isu-Isu Kontemporer HI", deskripsi: "Diskusi mendalam tentang perkembangan terkini dalam politik global." }
    ],
    "Semester 6": [
      { nama: "Etika Hubungan Internasional", deskripsi: "Membahas dilema moral dalam kebijakan luar negeri." },
      { nama: "Kapita Selekta Hubungan Internasional", deskripsi: "Pembahasan topik-topik pilihan yang relevan." },
      { nama: "Studi Kawasan: Amerika", deskripsi: "Analisis politik dan kebijakan luar negeri Amerika Serikat." },
      { nama: "Kewirausahaan Sosial", deskripsi: "Menciptakan bisnis yang berdampak sosial secara global." },
      { nama: "Mata Kuliah Pilihan: Hukum Humaniter", deskripsi: "Peminatan pada hukum perang dan perlindungan korban konflik." },
      { nama: "Mata Kuliah Pilihan: Keamanan Siber", deskripsi: "Peminatan pada isu keamanan di ranah digital." },
      { nama: "Mata Kuliah Pilihan: Tata Kelola Global", deskripsi: "Peminatan pada mekanisme pengaturan isu-isu global." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Magang di kementerian, kedutaan besar, atau NGO internasional." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat." },
      { nama: "Seminar Proposal Skripsi", deskripsi: "Presentasi rencana penelitian untuk tugas akhir." }
    ],
    "Semester 8": [
      { nama: "Skripsi", deskripsi: "Karya ilmiah hasil penelitian mandiri sebagai syarat kelulusan." }
    ]
  },
  'sastra-inggris': {
    "Semester 1": [
      { nama: "Structure I", deskripsi: "Dasar-dasar tata bahasa Inggris, termasuk tenses dan parts of speech." },
      { nama: "Reading I", deskripsi: "Keterampilan membaca pemahaman untuk teks-teks dasar." },
      { nama: "Writing I", deskripsi: "Keterampilan menulis paragraf yang koheren dan terstruktur." },
      { nama: "Speaking I", deskripsi: "Latihan percakapan sehari-hari dan diskusi sederhana." },
      { nama: "Listening I", deskripsi: "Latihan pemahaman mendengarkan untuk percakapan dasar." },
      { nama: "Pengantar Kesusastraan", deskripsi: "Pengenalan genre sastra: puisi, prosa, dan drama." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara." },
    ],
    "Semester 2": [
      { nama: "Structure II", deskripsi: "Tata bahasa tingkat lanjut, termasuk klausa dan kalimat kompleks." },
      { nama: "Reading II", deskripsi: "Membaca kritis untuk teks-teks akademik dan non-akademik." },
      { nama: "Writing II", deskripsi: "Menulis esai argumentatif dan ekspositori." },
      { nama: "Speaking II", deskripsi: "Latihan presentasi dan debat." },
      { nama: "Listening II", deskripsi: "Pemahaman mendengarkan untuk kuliah dan berita." },
      { nama: "Prose", deskripsi: "Analisis novel dan cerita pendek." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Bahasa Indonesia", deskripsi: "Pengembangan kemampuan penulisan akademik." },
    ],
    "Semester 3": [
      { nama: "Introduction to Linguistics", deskripsi: "Pengantar studi ilmiah tentang bahasa." },
      { nama: "Poetry", deskripsi: "Analisis puisi, termasuk elemen-elemen seperti rima, meter, dan majas." },
      { nama: "Drama", deskripsi: "Analisis naskah drama dan pertunjukan teater." },
      { nama: "Academic Writing", deskripsi: "Menulis karya ilmiah seperti paper dan artikel." },
      { nama: "Public Speaking", deskripsi: "Teknik berbicara di depan umum secara efektif." },
      { nama: "Phonetics and Phonology", deskripsi: "Studi tentang bunyi bahasa dan sistemnya." },
      { nama: "English for Tourism", deskripsi: "Bahasa Inggris untuk keperluan industri pariwisata." },
      { nama: "Translation I", deskripsi: "Teori dan praktik dasar penerjemahan Inggris-Indonesia." },
    ],
    "Semester 4": [
      { nama: "Sociolinguistics", deskripsi: "Hubungan antara bahasa dan masyarakat." },
      { nama: "Psycholinguistics", deskripsi: "Hubungan antara bahasa dan pikiran." },
      { nama: "Literary Criticism", deskripsi: "Mempelajari berbagai pendekatan teori untuk menganalisis sastra." },
      { nama: "British Studies", deskripsi: "Kajian budaya, sejarah, dan masyarakat Inggris." },
      { nama: "American Studies", deskripsi: "Kajian budaya, sejarah, dan masyarakat Amerika." },
      { nama: "Discourse Analysis", deskripsi: "Analisis bahasa dalam penggunaan nyata, baik lisan maupun tulisan." },
      { nama: "Creative Writing", deskripsi: "Latihan menulis karya kreatif seperti puisi dan cerpen." },
      { nama: "Translation II", deskripsi: "Penerjemahan tingkat lanjut Indonesia-Inggris." },
    ],
    "Semester 5": [
      { nama: "Research Methodology", deskripsi: "Cara merancang dan melakukan penelitian di bidang sastra atau linguistik." },
      { nama: "Semantics and Pragmatics", deskripsi: "Studi tentang makna dalam bahasa." },
      { nama: "Popular Literature", deskripsi: "Analisis karya-karya sastra populer seperti fiksi ilmiah dan detektif." },
      { nama: "English for Business", deskripsi: "Bahasa Inggris untuk komunikasi bisnis dan korespondensi." },
      { nama: "Mata Kuliah Pilihan: Shakespeare", deskripsi: "Studi mendalam tentang karya-karya William Shakespeare." },
      { nama: "Mata Kuliah Pilihan: Postcolonial Literature", deskripsi: "Sastra dari negara-negara bekas jajahan Inggris." },
      { nama: "Mata Kuliah Pilihan: TEFL", deskripsi: "Teaching English as a Foreign Language." },
      { nama: "Seminar", deskripsi: "Presentasi dan diskusi topik penelitian." },
    ],
    "Semester 6": [
      { nama: "World Englishes", deskripsi: "Studi tentang variasi bahasa Inggris di seluruh dunia." },
      { nama: "Journalism", deskripsi: "Dasar-dasar penulisan berita dan reportase dalam bahasa Inggris." },
      { nama: "Editing and Proofreading", deskripsi: "Keterampilan menyunting dan mengoreksi naskah." },
      { nama: "Entrepreneurship in Creative Industry", deskripsi: "Peluang bisnis di industri kreatif." },
      { nama: "Mata Kuliah Pilihan: Film Studies", deskripsi: "Analisis film sebagai teks budaya." },
      { nama: "Mata Kuliah Pilihan: Australian Studies", deskripsi: "Kajian budaya dan sastra Australia." },
      { nama: "Mata Kuliah Pilihan: Corpus Linguistics", deskripsi: "Analisis bahasa menggunakan data korpus besar." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Magang di penerbitan, media, atau lembaga pendidikan." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat." },
      { nama: "Proposal Skripsi", deskripsi: "Penyusunan dan presentasi rencana penelitian untuk skripsi." }
    ],
    "Semester 8": [
      { nama: "Skripsi", deskripsi: "Karya ilmiah hasil penelitian mandiri di bidang sastra atau linguistik." }
    ]
  },
  'ilmu-ekonomi': {
    "Semester 1": [
      { nama: "Pengantar Ekonomi Mikro", deskripsi: "Menganalisis perilaku individu dan perusahaan dalam pengambilan keputusan ekonomi." },
      { nama: "Pengantar Bisnis", deskripsi: "Memberikan gambaran umum tentang dunia bisnis dan fungsi-fungsinya." },
      { nama: "Matematika Ekonomi I", deskripsi: "Penerapan konsep kalkulus dan aljabar dalam analisis ekonomi." },
      { nama: "Pengantar Akuntansi I", deskripsi: "Mempelajari dasar-dasar siklus akuntansi." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara." },
      { nama: "Bahasa Indonesia", deskripsi: "Pengembangan kemampuan penulisan akademik." },
      { nama: "Bahasa Inggris", deskripsi: "Meningkatkan kemampuan berbahasa Inggris untuk ekonomi." },
    ],
    "Semester 2": [
      { nama: "Pengantar Ekonomi Makro", deskripsi: "Mempelajari fenomena ekonomi secara keseluruhan (agregat)." },
      { nama: "Statistika Ekonomi I", deskripsi: "Penerapan statistika deskriptif dan probabilitas dalam ekonomi." },
      { nama: "Matematika Ekonomi II", deskripsi: "Matematika lanjut untuk optimisasi dan model dinamis." },
      { nama: "Pengantar Akuntansi II", deskripsi: "Lanjutan akuntansi untuk perusahaan dagang." },
      { nama: "Hukum Bisnis", deskripsi: "Aspek-aspek hukum yang mengatur kegiatan bisnis." },
      { nama: "Sejarah Pemikiran Ekonomi", deskripsi: "Studi tentang perkembangan teori-teori ekonomi." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Sosiologi Ekonomi", deskripsi: "Melihat fenomena ekonomi dari perspektif sosiologis." }
    ],
    "Semester 3": [
      { nama: "Teori Ekonomi Mikro I", deskripsi: "Pendalaman teori perilaku konsumen dan produsen." },
      { nama: "Teori Ekonomi Makro I", deskripsi: "Pendalaman model-model ekonomi makro klasik dan Keynesian." },
      { nama: "Statistika Ekonomi II", deskripsi: "Fokus pada statistika inferensial dan uji hipotesis." },
      { nama: "Ekonomi Pembangunan I", deskripsi: "Teori dan isu-isu pembangunan di negara berkembang." },
      { nama: "Ekonomi Moneter I", deskripsi: "Studi tentang uang, perbankan, dan kebijakan moneter." },
      { nama: "Ekonomi Publik I", deskripsi: "Peran pemerintah dalam perekonomian, termasuk pajak." },
      { nama: "Manajemen Keuangan", deskripsi: "Analisis keputusan investasi dan pendanaan." },
      { nama: "Aplikasi Komputer", deskripsi: "Penggunaan software statistika seperti Eviews atau Stata." },
    ],
    "Semester 4": [
      { nama: "Teori Ekonomi Mikro II", deskripsi: "Fokus pada struktur pasar, kegagalan pasar, dan teori permainan." },
      { nama: "Teori Ekonomi Makro II", deskripsi: "Model-model makroekonomi modern dan dinamis." },
      { nama: "Ekonometrika I", deskripsi: "Penerapan metode statistik untuk menganalisis data ekonomi (model regresi)." },
      { nama: "Ekonomi Internasional I", deskripsi: "Teori perdagangan internasional." },
      { nama: "Ekonomi Regional", deskripsi: "Analisis ekonomi pada level sub-nasional (daerah)." },
      { nama: "Ekonomi Sumber Daya Manusia", deskripsi: "Analisis pasar tenaga kerja dan investasi SDM." },
      { nama: "Metodologi Penelitian Ekonomi", deskripsi: "Cara merancang dan melakukan penelitian di bidang ekonomi." },
      { nama: "Ekonomi Industri", deskripsi: "Studi tentang struktur, perilaku, dan kinerja industri." }
    ],
    "Semester 5": [
      { nama: "Ekonomi Pembangunan II", deskripsi: "Isu-isu lanjutan dalam pembangunan seperti kemiskinan dan ketimpangan." },
      { nama: "Ekonomi Moneter II", deskripsi: "Kebijakan moneter dalam praktik dan isu-isu terkini." },
      { nama: "Ekonomi Publik II", deskripsi: "Analisis pengeluaran pemerintah dan jaminan sosial." },
      { nama: "Ekonometrika II", deskripsi: "Model ekonometrika lanjutan, termasuk data panel dan time series." },
      { nama: "Ekonomi Internasional II", deskripsi: "Fokus pada keuangan internasional dan neraca pembayaran." },
      { nama: "Mata Kuliah Pilihan: Ekonomi Pertanian", deskripsi: "Peminatan pada sektor pertanian." },
      { nama: "Mata Kuliah Pilihan: Ekonomi Syariah", deskripsi: "Peminatan pada prinsip ekonomi Islam." },
      { nama: "Seminar Ekonomi Pembangunan", deskripsi: "Diskusi mendalam tentang isu-isu pembangunan." }
    ],
    "Semester 6": [
      { nama: "Evaluasi Proyek", deskripsi: "Teknik untuk menilai kelayakan dan dampak suatu proyek." },
      { nama: "Perekonomian Indonesia", deskripsi: "Analisis struktur dan perkembangan ekonomi Indonesia." },
      { nama: "Ekonomi Kelembagaan", deskripsi: "Peran institusi (aturan main) dalam kinerja ekonomi." },
      { nama: "Ekonomi Sumber Daya Alam & Lingkungan", deskripsi: "Pengelolaan sumber daya alam yang berkelanjutan." },
      { nama: "Mata Kuliah Pilihan: Ekonomi Perkotaan", deskripsi: "Peminatan pada masalah ekonomi di kota." },
      { nama: "Mata Kuliah Pilihan: Ekonomi Keuangan", deskripsi: "Peminatan pada pasar modal dan derivatif." },
      { nama: "Etika Ekonomi", deskripsi: "Membahas dilema etis dalam kebijakan dan perilaku ekonomi." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Magang di lembaga pemerintah, bank, atau lembaga riset." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian kepada masyarakat." },
      { nama: "Seminar Proposal Skripsi", deskripsi: "Presentasi rencana penelitian untuk skripsi." }
    ],
    "Semester 8": [
      { nama: "Skripsi", deskripsi: "Karya ilmiah hasil penelitian ekonomi mandiri." }
    ]
  },
  'sosiologi': {
    "Semester 1": [
      { nama: "Pengantar Sosiologi", deskripsi: "Konsep dasar, sejarah, dan tokoh-tokoh utama dalam sosiologi." },
      { nama: "Pengantar Antropologi", deskripsi: "Memberikan pemahaman dasar tentang budaya dan masyarakat." },
      { nama: "Pengantar Ilmu Politik", deskripsi: "Mempelajari konsep-konsep dasar dalam ilmu politik." },
      { nama: "Filsafat Ilmu Sosial", deskripsi: "Landasan filosofis dalam memahami realitas sosial." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara." },
      { nama: "Bahasa Indonesia", deskripsi: "Pengembangan kemampuan penulisan akademik." },
      { nama: "Bahasa Inggris", deskripsi: "Kemampuan membaca literatur sosiologi internasional." }
    ],
    "Semester 2": [
      { nama: "Teori Sosiologi Klasik", deskripsi: "Mempelajari pemikiran Karl Marx, Max Weber, dan Emile Durkheim." },
      { nama: "Struktur Sosial Indonesia", deskripsi: "Analisis lapisan sosial, etnisitas, dan agama di Indonesia." },
      { nama: "Metode Penelitian Sosial", deskripsi: "Dasar-dasar merancang penelitian sosial, kualitatif dan kuantitatif." },
      { nama: "Statistika Sosial", deskripsi: "Penerapan statistika untuk analisis data sosial." },
      { nama: "Sosiologi Keluarga", deskripsi: "Studi tentang institusi keluarga dan perubahannya." },
      { nama: "Sosiologi Pedesaan", deskripsi: "Analisis masyarakat dan perubahan sosial di daerah pedesaan." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Perubahan Sosial", deskripsi: "Teori dan faktor-faktor yang mendorong perubahan dalam masyarakat." }
    ],
    "Semester 3": [
      { nama: "Teori Sosiologi Modern", deskripsi: "Pemikiran sosiolog abad ke-20 seperti Fungsionalisme dan Teori Konflik." },
      { nama: "Metode Penelitian Kuantitatif", deskripsi: "Teknik survei, kuesioner, dan analisis data kuantitatif." },
      { nama: "Sosiologi Perkotaan", deskripsi: "Studi tentang kehidupan, masalah, dan dinamika masyarakat kota." },
      { nama: "Sosiologi Politik", deskripsi: "Hubungan antara kekuasaan, negara, dan masyarakat." },
      { nama: "Sosiologi Agama", deskripsi: "Peran agama dalam kehidupan sosial." },
      { nama: "Sosiologi Ekonomi", deskripsi: "Pendekatan sosiologis terhadap fenomena ekonomi." },
      { nama: "Masalah Sosial", deskripsi: "Analisis isu-isu seperti kemiskinan, kejahatan, dan ketimpangan." },
      { nama: "Praktikum Statistika Sosial", deskripsi: "Aplikasi software statistika (spt. SPSS) untuk data sosial." }
    ],
    "Semester 4": [
      { nama: "Teori Sosiologi Postmodern", deskripsi: "Pemikiran sosiolog kontemporer seperti Foucault dan Bourdieu." },
      { nama: "Metode Penelitian Kualitatif", deskripsi: "Teknik wawancara mendalam, observasi, dan studi kasus." },
      { nama: "Sosiologi Pendidikan", deskripsi: "Peran pendidikan dalam mobilitas sosial dan reproduksi ketimpangan." },
      { nama: "Sosiologi Hukum", deskripsi: "Interaksi antara sistem hukum dan masyarakat." },
      { nama: "Gerakan Sosial", deskripsi: "Studi tentang bagaimana kelompok-kelompok sosial memperjuangkan perubahan." },
      { nama: "Sosiologi Industri", deskripsi: "Analisis hubungan kerja dan organisasi dalam masyarakat industri." },
      { nama: "Sistem Sosial Budaya Indonesia", deskripsi: "Kajian mendalam tentang keragaman sosial dan budaya Indonesia." },
      { nama: "Kapitalisme dan Masyarakat", deskripsi: "Analisis sosiologis terhadap sistem kapitalisme." }
    ],
    "Semester 5": [
      { nama: "Sosiologi Komunikasi", deskripsi: "Peran media dan komunikasi dalam membentuk realitas sosial." },
      { nama: "Sosiologi Gender", deskripsi: "Analisis konstruksi sosial gender dan ketidaksetaraan." },
      { nama: "Sosiologi Korupsi", deskripsi: "Mempelajari akar sosial dari praktik korupsi." },
      { nama: "Pembangunan Masyarakat", deskripsi: "Teori dan praktik pemberdayaan komunitas." },
      { nama: "Mata Kuliah Pilihan: Sosiologi Kesehatan", deskripsi: "Aspek sosial dari kesehatan dan penyakit." },
      { nama: "Mata Kuliah Pilihan: Sosiologi Lingkungan", deskripsi: "Hubungan antara masyarakat dan lingkungan alam." },
      { nama: "Mata Kuliah Pilihan: Sosiologi Digital", deskripsi: "Dampak internet dan media sosial pada masyarakat." },
      { nama: "Seminar Proposal Penelitian", deskripsi: "Presentasi usulan penelitian untuk skripsi." }
    ],
    "Semester 6": [
      { nama: "Analisis Data Kualitatif", deskripsi: "Teknik mengolah dan menganalisis data dari wawancara dan observasi." },
      { nama: "Teori Kritis", deskripsi: "Studi tentang kritik ideologi dan kekuasaan dalam masyarakat." },
      { nama: "Sosiologi Pembangunan", deskripsi: "Kritik dan alternatif terhadap model-model pembangunan." },
      { nama: "Globalisasi dan Masyarakat", deskripsi: "Dampak globalisasi pada berbagai aspek kehidupan sosial." },
      { nama: "Mata Kuliah Pilihan: Sosiologi Kriminalitas", deskripsi: "Analisis sosial tentang kejahatan dan peradilan." },
      { nama: "Mata Kuliah Pilihan: Sosiologi Migrasi", deskripsi: "Studi tentang perpindahan penduduk dan dampaknya." },
      { nama: "Etika Penelitian Sosial", deskripsi: "Tanggung jawab etis peneliti sosial." },
      { nama: "Kerja Praktik/Magang", deskripsi: "Magang di lembaga penelitian, LSM, atau instansi pemerintah." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian dan penelitian di masyarakat." },
      { nama: "Penulisan Karya Ilmiah", deskripsi: "Praktik penulisan skripsi sesuai kaidah akademik." }
    ],
    "Semester 8": [
      { nama: "Skripsi", deskripsi: "Karya ilmiah hasil penelitian sosiologis mandiri." }
    ]
  },
  'antropologi-budaya': {
    "Semester 1": [
      { nama: "Pengantar Antropologi", deskripsi: "Ruang lingkup, sejarah, dan konsep dasar antropologi." },
      { nama: "Pengantar Sosiologi", deskripsi: "Memberikan pemahaman dasar tentang struktur sosial." },
      { nama: "Pengantar Arkeologi", deskripsi: "Studi tentang kebudayaan masa lalu melalui tinggalan materi." },
      { nama: "Asas-Asas Ilmu Budaya", deskripsi: "Landasan pemahaman tentang konsep kebudayaan." },
      { nama: "Pendidikan Agama", deskripsi: "Mata kuliah wajib." },
      { nama: "Pancasila", deskripsi: "Mempelajari Pancasila sebagai dasar negara." },
      { nama: "Bahasa Indonesia", deskripsi: "Pengembangan kemampuan penulisan akademik dan etnografi." },
      { nama: "Bahasa Inggris", deskripsi: "Kemampuan membaca literatur antropologi internasional." }
    ],
    "Semester 2": [
      { nama: "Teori Antropologi Klasik", deskripsi: "Mempelajari pemikiran tokoh-tokoh awal seperti Tylor, Morgan, dan Boas." },
      { nama: "Etnografi", deskripsi: "Metode penelitian utama antropologi: penelitian lapangan partisipatoris." },
      { nama: "Antropologi Fisik", deskripsi: "Studi tentang evolusi dan keragaman biologis manusia." },
      { nama: "Organisasi Sosial", deskripsi: "Studi tentang sistem kekerabatan, perkawinan, dan kelompok sosial." },
      { nama: "Sistem Religi", deskripsi: "Analisis kepercayaan, mitos, dan ritus dalam berbagai kebudayaan." },
      { nama: "Etnografi Indonesia", deskripsi: "Kajian tentang keragaman suku bangsa dan budaya di Indonesia." },
      { nama: "Pendidikan Kewarganegaraan", deskripsi: "Membahas hak dan kewajiban warga negara." },
      { nama: "Manusia dan Lingkungan", deskripsi: "Hubungan timbal balik antara manusia, budaya, dan lingkungan." }
    ],
    "Semester 3": [
      { nama: "Teori Antropologi Modern", deskripsi: "Pemikiran antropolog abad ke-20 seperti Fungsionalisme dan Strukturalisme." },
      { nama: "Metode Penelitian Etnografi", deskripsi: "Teknik pengumpulan data: wawancara mendalam dan observasi partisipasi." },
      { nama: "Antropologi Ekonomi", deskripsi: "Studi tentang sistem produksi, distribusi, dan konsumsi dalam berbagai budaya." },
      { nama: "Antropologi Politik", deskripsi: "Studi tentang kekuasaan, kepemimpinan, dan konflik dalam masyarakat." },
      { nama: "Kesenian dalam Perspektif Budaya", deskripsi: "Memahami seni sebagai ekspresi budaya." },
      { nama: "Bahasa dan Kebudayaan", deskripsi: "Hubungan antara bahasa, pikiran, dan cara pandang dunia." },
      { nama: "Statistika Sosial", deskripsi: "Dasar-dasar statistika untuk penelitian sosial budaya." },
      { nama: "Praktikum Etnografi", deskripsi: "Latihan melakukan penelitian lapangan skala kecil." }
    ],
    "Semester 4": [
      { nama: "Teori Antropologi Kontemporer", deskripsi: "Pemikiran-pemikiran mutakhir seperti posmodernisme dan globalisasi." },
      { nama: "Antropologi Hukum", deskripsi: "Studi tentang sistem hukum dan penyelesaian sengketa di berbagai masyarakat." },
      { nama: "Antropologi Gender dan Seksualitas", deskripsi: "Analisis konstruksi budaya tentang gender dan seksualitas." },
      { nama: "Globalisasi dan Budaya", deskripsi: "Dampak globalisasi terhadap budaya lokal." },
      { nama: "Antropologi Terapan", deskripsi: "Penerapan antropologi untuk memecahkan masalah praktis." },
      { nama: "Kajian Asia Tenggara", deskripsi: "Studi kawasan yang berfokus pada budaya di Asia Tenggara." },
      { nama: "Penulisan Etnografi", deskripsi: "Teknik menulis laporan penelitian etnografi yang deskriptif dan analitis." },
      { nama: "Antropologi Visual", deskripsi: "Penggunaan media foto dan film dalam penelitian dan representasi budaya." }
    ],
    "Semester 5": [
      { nama: "Antropologi Kesehatan", deskripsi: "Memahami konsep sehat-sakit dan sistem pengobatan dari perspektif budaya." },
      { nama: "Antropologi Perkotaan", deskripsi: "Studi tentang kehidupan dan budaya di kota-kota." },
      { nama: "Antropologi Pariwisata", deskripsi: "Analisis dampak pariwisata terhadap masyarakat dan budaya lokal." },
      { nama: "Kajian Media dan Budaya Populer", deskripsi: "Analisis kritis terhadap produk-produk budaya populer." },
      { nama: "Mata Kuliah Pilihan: Antropologi Maritim", deskripsi: "Studi tentang masyarakat pesisir dan laut." },
      { nama: "Mata Kuliah Pilihan: Antropologi Agama", deskripsi: "Pendalaman studi tentang fenomena keagamaan." },
      { nama: "Mata Kuliah Pilihan: Kajian Museum", deskripsi: "Studi tentang peran museum dalam merepresentasikan budaya." },
      { nama: "Seminar Proposal Penelitian", deskripsi: "Presentasi usulan penelitian lapangan untuk skripsi." }
    ],
    "Semester 6": [
      { nama: "Analisis Data Etnografi", deskripsi: "Teknik mengolah dan menganalisis data kualitatif dari penelitian lapangan." },
      { nama: "Dinamika Masyarakat Indonesia", deskripsi: "Analisis isu-isu sosial budaya kontemporer di Indonesia." },
      { nama: "Budaya dan Pembangunan", deskripsi: "Peran kebudayaan dalam proses pembangunan." },
      { nama: "Etnisitas dan Nasionalisme", deskripsi: "Studi tentang identitas etnik dan pembentukan negara-bangsa." },
      { nama: "Mata Kuliah Pilihan: Antropologi Makanan", deskripsi: "Studi tentang makanan sebagai fenomena budaya." },
      { nama: "Mata Kuliah Pilihan: Antropologi Bencana", deskripsi: "Respon budaya terhadap bencana alam." },
      { nama: "Etika Penelitian Antropologi", deskripsi: "Tanggung jawab etis peneliti terhadap komunitas yang diteliti." },
      { nama: "Magang/Penelitian Lapangan Mandiri", deskripsi: "Pengalaman penelitian etnografi yang lebih mendalam." }
    ],
    "Semester 7": [
      { nama: "Kuliah Kerja Nyata (KKN)", deskripsi: "Program pengabdian dan penelitian di masyarakat." },
      { nama: "Analisis dan Penulisan Skripsi", deskripsi: "Proses bimbingan intensif untuk penulisan skripsi." }
    ],
    "Semester 8": [
      { nama: "Skripsi (Etnografi)", deskripsi: "Karya tulis ilmiah hasil penelitian lapangan mandiri." }
    ]
  },
};

// Curated list of 20 majors
const newJurusanData = [
  // SAINTEK (10)
  { "fakultas": "TEKNIK", "nama_prodi": "TEKNOLOGI INFORMASI", "kelompok_ujian": "SAINTEK" },
  { "fakultas": "MIPA", "nama_prodi": "ILMU KOMPUTER", "kelompok_ujian": "SAINTEK" },
  { "fakultas": "TEKNIK", "nama_prodi": "TEKNIK SIPIL", "kelompok_ujian": "SAINTEK" },
  { "fakultas": "KEDOKTERAN", "nama_prodi": "PENDIDIKAN DOKTER", "kelompok_ujian": "SAINTEK" },
  { "fakultas": "FARMASI", "nama_prodi": "FARMASI", "kelompok_ujian": "SAINTEK" },
  { "fakultas": "TEKNIK", "nama_prodi": "ARSITEKTUR", "kelompok_ujian": "SAINTEK" },
  { "fakultas": "MIPA", "nama_prodi": "STATISTIKA", "kelompok_ujian": "SAINTEK" },
  { "fakultas": "BIOLOGI", "nama_prodi": "BIOLOGI", "kelompok_ujian": "SAINTEK" },
  { "fakultas": "TEKNIK", "nama_prodi": "TEKNIK MESIN", "kelompok_ujian": "SAINTEK" },
  { "fakultas": "KEHUTANAN", "nama_prodi": "KEHUTANAN", "kelompok_ujian": "SAINTEK" },
  // SOSHUM (10)
  { "fakultas": "EKONOMIKA DAN BISNIS", "nama_prodi": "AKUNTANSI", "kelompok_ujian": "SOSHUM" },
  { "fakultas": "EKONOMIKA DAN BISNIS", "nama_prodi": "MANAJEMEN", "kelompok_ujian": "SOSHUM" },
  { "fakultas": "ISIPOL", "nama_prodi": "ILMU KOMUNIKASI", "kelompok_ujian": "SOSHUM" },
  { "fakultas": "HUKUM", "nama_prodi": "ILMU HUKUM", "kelompok_ujian": "SOSHUM" },
  { "fakultas": "PSIKOLOGI", "nama_prodi": "PSIKOLOGI", "kelompok_ujian": "SOSHUM" },
  { "fakultas": "ISIPOL", "nama_prodi": "ILMU HUBUNGAN INTERNASIONAL", "kelompok_ujian": "SOSHUM" },
  { "fakultas": "ILMU BUDAYA", "nama_prodi": "SASTRA INGGRIS", "kelompok_ujian": "SOSHUM" },
  { "fakultas": "EKONOMIKA DAN BISNIS", "nama_prodi": "ILMU EKONOMI", "kelompok_ujian": "SOSHUM" },
  { "fakultas": "ISIPOL", "nama_prodi": "SOSIOLOGI", "kelompok_ujian": "SOSHUM" },
  { "fakultas": "ILMU BUDAYA", "nama_prodi": "ANTROPOLOGI BUDAYA", "kelompok_ujian": "SOSHUM" },
];

export const JURUSAN_DATA: Jurusan[] = newJurusanData.map(j => {
  const namaProdiTitleCase = toTitleCase(j.nama_prodi);
  const id = createId(namaProdiTitleCase);
  const isSaintek = j.kelompok_ujian === 'SAINTEK';
  const fakultasTitleCase = toTitleCase(j.fakultas);

  // Default values
  let deskripsi = `Mempelajari seluk beluk ${namaProdiTitleCase} di Fakultas ${fakultasTitleCase} untuk mempersiapkan karir di bidang terkait.`;
  let gajiRataRata = isSaintek ? 7000000 : 6000000;
  let jumlahLapanganPekerjaan = isSaintek ? 100000 : 150000;
  let proyeksiPertumbuhan = isSaintek ? 9 : 7;
  let waktuDapatKerjaBulan = isSaintek ? 6 : 7;
  
  // Overwrite with specific data if available
  if (id === 'teknologi-informasi') {
    deskripsi = 'Jurusan yang mempelajari tentang penggunaan teknologi komputer untuk mengolah dan mendistribusikan data menggunakan perangkat lunak, perangkat keras, dan otak manusia (brainware).';
    gajiRataRata = 8000000; jumlahLapanganPekerjaan = 150000; proyeksiPertumbuhan = 15; waktuDapatKerjaBulan = 4;
  }
  if (id === 'ilmu-komputer') {
    deskripsi = 'Jurusan yang berfokus pada ilmu teori komputasi, pengembangan algoritma, dan rekayasa perangkat lunak. Lebih mendalam pada aspek \'mengapa\' di balik teknologi.';
    gajiRataRata = 8500000; jumlahLapanganPekerjaan = 140000; proyeksiPertumbuhan = 16; waktuDapatKerjaBulan = 4;
  }
   if (id === 'ilmu-komunikasi') {
    deskripsi = 'Jurusan yang mempelajari proses penyampaian pesan secara efektif agar dapat diterima dan dipahami oleh khalayak. Mencakup komunikasi massa, public relations, dan periklanan.';
    gajiRataRata = 6500000; jumlahLapanganPekerjaan = 250000; proyeksiPertumbuhan = 8; waktuDapatKerjaBulan = 6;
  }
  if (id === 'manajemen') {
    deskripsi = 'Mempelajari bagaimana merencanakan, membangun, dan menjalankan sebuah bisnis. Fokus pada aspek pemasaran, keuangan, sumber daya manusia, dan operasional.';
    gajiRataRata = 7500000; jumlahLapanganPekerjaan = 300000; proyeksiPertumbuhan = 10; waktuDapatKerjaBulan = 5;
  }
  if (id === 'pendidikan-dokter') {
    deskripsi = 'Pendidikan untuk menjadi seorang dokter. Mempelajari ilmu medis, anatomi tubuh manusia, penyakit, dan cara pengobatannya.';
    gajiRataRata = 15000000; jumlahLapanganPekerjaan = 80000; proyeksiPertumbuhan = 7; waktuDapatKerjaBulan = 12;
  }
  if (id === 'teknik-sipil') {
    deskripsi = 'Mempelajari perancangan, pembangunan, dan pemeliharaan infrastruktur seperti gedung, jembatan, jalan, dan sistem pengairan. Menggabungkan aspek teknis, manajerial, dan lingkungan.';
    gajiRataRata = 7000000; jumlahLapanganPekerjaan = 95000; proyeksiPertumbuhan = 9; waktuDapatKerjaBulan = 6;
  }
   if (id === 'psikologi') {
    deskripsi = 'Ilmu yang mempelajari perilaku dan proses mental manusia. Mendalami pemikiran, perasaan, dan alasan di balik tindakan individu maupun kelompok.';
    gajiRataRata = 5500000; jumlahLapanganPekerjaan = 180000; proyeksiPertumbuhan = 11; waktuDapatKerjaBulan = 6;
  }
  if (id === 'akuntansi') {
    deskripsi = 'Seni pencatatan, penggolongan, dan peringkasan transaksi keuangan serta penafsiran hasilnya. Sangat penting untuk kesehatan finansial perusahaan.';
    gajiRataRata = 6000000; jumlahLapanganPekerjaan = 280000; proyeksiPertumbuhan = 7; waktuDapatKerjaBulan = 5;
  }
  if (id === 'ilmu-hukum') {
    deskripsi = 'Mempelajari sistem hukum yang berlaku, termasuk norma, aturan, dan sanksi. Menganalisis masalah hukum dan mencari solusinya berdasarkan peraturan.';
    gajiRataRata = 7200000; jumlahLapanganPekerjaan = 160000; proyeksiPertumbuhan = 6; waktuDapatKerjaBulan = 7;
  }
  if (id === 'farmasi') {
    deskripsi = 'Mempelajari segala seluk-beluk mengenai obat, mulai dari identifikasi, sintesis, pengembangan, distribusi, hingga cara kerja obat di dalam tubuh.';
    gajiRataRata = 6800000; jumlahLapanganPekerjaan = 70000; proyeksiPertumbuhan = 8; waktuDapatKerjaBulan = 7;
  }
  if (id === 'teknik-mesin') {
    deskripsi = 'Jurusan yang berfokus pada perancangan, pengembangan, dan produksi mesin dan sistem mekanis. Melibatkan prinsip fisika, material, dan energi untuk menciptakan solusi teknis.';
    gajiRataRata = 7500000; jumlahLapanganPekerjaan = 110000; proyeksiPertumbuhan = 5; waktuDapatKerjaBulan = 6;
  }
  if (id === 'ilmu-hubungan-internasional') {
    deskripsi = 'Mempelajari interaksi antar negara, organisasi internasional, dan aktor non-negara dalam panggung global. Menganalisis isu-isu seperti diplomasi, keamanan, dan ekonomi politik internasional.';
    gajiRataRata = 7000000; jumlahLapanganPekerjaan = 120000; proyeksiPertumbuhan = 7; waktuDapatKerjaBulan = 8;
  }
  if (id === 'ilmu-ekonomi') {
    deskripsi = 'Studi tentang bagaimana masyarakat mengelola sumber daya yang langka. Menganalisis produksi, distribusi, dan konsumsi barang dan jasa, serta kebijakan ekonomi.';
    gajiRataRata = 8000000; jumlahLapanganPekerjaan = 200000; proyeksiPertumbuhan = 9; waktuDapatKerjaBulan = 6;
  }
  if (id === 'sosiologi') {
    deskripsi = 'Ilmu yang mempelajari masyarakat, interaksi sosial, dan struktur sosial. Menganalisis pola perilaku kelompok, institusi sosial, dan perubahan sosial.';
    gajiRataRata = 5000000; jumlahLapanganPekerjaan = 90000; proyeksiPertumbuhan = 5; waktuDapatKerjaBulan = 8;
  }


  return {
    id: id,
    nama: namaProdiTitleCase,
    fakultas: fakultasTitleCase,
    kategori: isSaintek ? 'Saintek' : 'Soshum',
    deskripsi: deskripsi,
    kurikulum: allKurikulum[id],
    gajiRataRata: gajiRataRata,
    jumlahLapanganPekerjaan: jumlahLapanganPekerjaan,
    proyeksiPertumbuhan: proyeksiPertumbuhan,
    waktuDapatKerjaBulan: waktuDapatKerjaBulan,
  };
});

export const INTEREST_QUESTIONS: InterestQuestion[] = [
    { id: 1, text: "Saya lebih suka merakit furnitur sendiri daripada membeli yang sudah jadi.", type: 'R', imageUrl: "https://images.unsplash.com/photo-1600122114322-1205584d4355?q=80&w=800&auto=format&fit=crop" },
    { id: 2, text: "Saya tertarik untuk mempelajari cara kerja mesin mobil atau motor.", type: 'R', imageUrl: "https://images.unsplash.com/photo-1553775282-20af80779644?q=80&w=800&auto=format&fit=crop" },
    { id: 3, text: "Bekerja di alam terbuka, seperti di taman atau hutan, terdengar menyenangkan bagi saya.", type: 'R', imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=800&auto=format&fit=crop" },
    { id: 4, text: "Saya merasa puas saat bisa memperbaiki alat elektronik yang rusak.", type: 'R', imageUrl: "https://images.unsplash.com/photo-1620932934088-fbdb2923b78b?q=80&w=800&auto=format&fit=crop" },
    { id: 5, text: "Saya suka membaca artikel ilmiah atau menonton dokumenter tentang penemuan baru.", type: 'I', imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop" },
    { id: 6, text: "Saya senang memecahkan teka-teki logika atau soal matematika yang menantang.", type: 'I', imageUrl: "https://images.unsplash.com/photo-1550592704-6c76defa9985?q=80&w=800&auto=format&fit=crop" },
    { id: 7, text: "Saya tertarik untuk melakukan penelitian di laboratorium.", type: 'I', imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop" },
    { id: 8, text: "Saya suka menganalisis data untuk menemukan pola atau tren tersembunyi.", type: 'I', imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" },
    { id: 9, text: "Saya sering mencoret-coret atau menggambar saat bosan.", type: 'A', imageUrl: "https://images.unsplash.com/photo-1583149432413-4e32042189a8?q=80&w=800&auto=format&fit=crop" },
    { id: 10, text: "Saya menikmati merancang ulang tata letak kamar saya agar terlihat lebih estetis.", type: 'A', imageUrl: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop" },
    { id: 11, text: "Menulis cerita fiksi, puisi, atau lirik lagu adalah hobi saya.", type: 'A', imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop" },
    { id: 12, text: "Saya ingin belajar cara mengedit foto atau video secara profesional.", type: 'A', imageUrl: "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=800&auto=format&fit=crop" },
    { id: 13, text: "Saya merasa senang ketika bisa membantu teman yang sedang kesulitan.", type: 'S', imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop" },
    { id: 14, text: "Saya suka bekerja dalam tim daripada bekerja sendirian.", type: 'S', imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop" },
    { id: 15, text: "Menjadi sukarelawan untuk kegiatan sosial adalah sesuatu yang ingin saya lakukan.", type: 'S', imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop" },
    { id: 16, text: "Saya pandai menjelaskan konsep yang sulit kepada orang lain.", type: 'S', imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop" },
    { id: 17, text: "Saya suka memimpin sebuah proyek atau tim.", type: 'E', imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" },
    { id: 18, text: "Saya merasa tertantang untuk meyakinkan orang lain agar setuju dengan ide saya.", type: 'E', imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop" },
    { id: 19, text: "Saya tertarik untuk memulai bisnis saya sendiri suatu hari nanti.", type: 'E', imageUrl: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop" },
    { id: 20, text: "Berbicara di depan umum tidak membuat saya takut, justru bersemangat.", type: 'E', imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop" },
    { id: 21, text: "Saya suka membuat daftar tugas (to-do list) dan merencanakan jadwal saya.", type: 'C', imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop" },
    { id: 22, text: "Saya merasa nyaman bekerja dengan angka dan data.", type: 'C', imageUrl: "https://images.unsplash.com/photo-1611118495123-24d6934a34a3?q=80&w=800&auto=format&fit=crop" },
    { id: 23, text: "Saya lebih suka mengikuti instruksi yang jelas daripada harus berimprovisasi.", type: 'C', imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop" },
    { id: 24, text: "Mengorganisir file di komputer atau rak buku membuat saya merasa puas.", type: 'C', imageUrl: "https://images.unsplash.com/photo-1588218732386-20f49375e533?q=80&w=800&auto=format&fit=crop" },
    { id: 25, text: "Saya teliti dan memperhatikan detail-detail kecil yang mungkin terlewat oleh orang lain.", type: 'C', imageUrl: "https://images.unsplash.com/photo-1516131206008-dd041a372dd4?q=80&w=800&auto=format&fit=crop" },
];


export const INTEREST_PROFILES_DETAIL: { [key: string]: InterestResult } = {
    R: { 
        profile: "Realis (The Doer)", 
        imageUrl: "https://images.unsplash.com/photo-1519962149459-328acb818359?q=80&w=1200&auto=format&fit=crop",
        description: "Tipe Realis adalah individu yang praktis, membumi, dan mekanis. Anda menikmati pekerjaan yang melibatkan penggunaan tangan, alat, mesin, atau bekerja dengan alam. Anda lebih suka solusi nyata yang bisa dilihat dan disentuh daripada teori abstrak. Kejujuran, kepraktisan, dan keandalan adalah nilai-nilai yang Anda junjung tinggi.",
        strengths: ["Keterampilan mekanik yang baik", "Praktis dan efisien", "Mahir memecahkan masalah konkret", "Menyukai aktivitas fisik dan outdoor", "Cekatan dan dapat diandalkan"],
        weaknesses: ["Kurang menyukai tugas-tugas sosial", "Cenderung kaku dan kurang fleksibel", "Kadang kesulitan mengekspresikan ide secara verbal", "Kurang tertarik pada pekerjaan abstrak atau teoritis"],
    },
    I: { 
        profile: "Investigatif (The Thinker)", 
        imageUrl: "https://images.unsplash.com/photo-1518152006812-edb29b3d39ac?q=80&w=1200&auto=format&fit=crop",
        description: "Tipe Investigatif adalah pemikir yang analitis, ingin tahu, dan observatif. Anda menikmati proses mengumpulkan informasi, memecahkan masalah yang kompleks, dan memahami bagaimana sesuatu bekerja. Anda didorong oleh rasa penasaran dan lebih suka bekerja secara mandiri untuk mengeksplorasi ide-ide. Presisi dan logika adalah fondasi Anda.",
        strengths: ["Kemampuan analitis dan logis yang kuat", "Berorientasi pada detail", "Sangat observatif dan teliti", "Menyukai tantangan intelektual", "Mandiri dan persisten dalam memecahkan masalah"],
        weaknesses: ["Cenderung menghindari peran kepemimpinan", "Kadang terlalu kritis atau perfeksionis", "Kurang nyaman dengan situasi yang sangat sosial atau emosional", "Bisa terjebak dalam 'analysis paralysis'"],
    },
    A: { 
        profile: "Artistik (The Creator)", 
        imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
        description: "Tipe Artistik adalah individu yang kreatif, ekspresif, dan imajinatif. Anda berkembang dalam situasi yang tidak terstruktur di mana Anda dapat menggunakan intuisi dan kreativitas untuk menghasilkan sesuatu yang baru. Anda menghargai keindahan, orisinalitas, dan ekspresi diri, baik melalui tulisan, musik, seni visual, atau pertunjukan.",
        strengths: ["Sangat kreatif dan inovatif", "Ekspresif dan komunikatif secara non-verbal", "Memiliki intuisi yang kuat", "Berpikiran terbuka dan fleksibel", "Mampu melihat dunia dari perspektif unik"],
        weaknesses: ["Kadang kurang terorganisir atau tidak praktis", "Sensitif terhadap kritik", "Cenderung menghindari aturan ketat dan rutinitas", "Mungkin kesulitan dengan tugas yang sangat detail dan repetitif"],
    },
    S: { 
        profile: "Sosial (The Helper)", 
        imageUrl: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1200&auto=format&fit=crop",
        description: "Tipe Sosial adalah penolong yang empatik, kooperatif, dan berorientasi pada orang lain. Anda mendapatkan kepuasan dari membantu, mengajar, merawat, dan berinteraksi dengan orang lain. Anda adalah pendengar yang baik dan pandai membangun hubungan. Keterampilan komunikasi dan kerja sama tim adalah kekuatan terbesar Anda.",
        strengths: ["Empati dan kepedulian yang tinggi", "Keterampilan interpersonal dan komunikasi yang luar biasa", "Suka bekerja sama dalam tim", "Pandai mengajar dan menjelaskan", "Sabar dan suportif"],
        weaknesses: ["Cenderung menghindari konflik", "Kadang kesulitan mengambil keputusan yang sulit atau tidak populer", "Bisa mengabaikan kebutuhan diri sendiri demi orang lain", "Kurang tertarik pada pekerjaan yang sangat teknis atau mekanis"],
    },
    E: { 
        profile: "Enterprising (The Persuader)", 
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
        description: "Tipe Enterprising adalah individu yang ambisius, persuasif, dan bersemangat. Anda menikmati peran kepemimpinan, mempengaruhi orang lain, dan mencapai tujuan organisasi atau finansial. Anda berani mengambil risiko, kompetitif, dan memiliki energi tinggi. Anda melihat peluang di mana orang lain melihat tantangan.",
        strengths: ["Keterampilan kepemimpinan dan persuasi yang kuat", "Percaya diri dan tegas", "Berorientasi pada tujuan dan hasil", "Energik dan optimis", "Pandai berjejaring (networking)"],
        weaknesses: ["Cenderung tidak sabar dengan detail", "Mungkin terlihat terlalu dominan atau agresif", "Kurang menyukai pekerjaan analitis yang mendalam", "Bisa mengambil risiko yang terlalu besar"],
    },
    C: { 
        profile: "Konvensional (The Organizer)", 
        imageUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop",
        description: "Tipe Konvensional adalah pengorganisir yang teliti, efisien, dan taat aturan. Anda unggul dalam lingkungan yang terstruktur di mana Anda dapat bekerja dengan data, angka, dan prosedur yang jelas. Anda menghargai ketertiban, akurasi, dan keandalan. Anda adalah tulang punggung yang memastikan semua sistem berjalan lancar.",
        strengths: ["Sangat terorganisir dan efisien", "Teliti dan berorientasi pada detail", "Dapat diandalkan dan bertanggung jawab", "Mahir dalam mengikuti prosedur dan aturan", "Praktis dan metodis"],
        weaknesses: ["Kurang menyukai ambiguitas atau perubahan mendadak", "Cenderung kaku dan kurang fleksibel", "Mungkin kurang nyaman dengan peran kepemimpinan", "Cenderung menghindari tugas yang tidak terstruktur atau kreatif"],
    },
};