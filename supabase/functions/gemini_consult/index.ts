// Ini adalah KODE BACKEND AMAN Anda
// (Berjalan di Supabase, BUKAN di browser)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai'; // Gunakan 'npm:'
import { Jurusan } from '../_shared/types.ts'; // Asumsi Anda punya file 'types' di shared

// 1. Ambil Kunci API Anda dengan aman dari Supabase Secrets
// Jangan PERNAH letakkan kunci ini di kode frontend
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY tidak ditemukan di Supabase Secrets");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

serve(async (req) => {
    // Tangani CORS (PENTING untuk frontend)
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*', // Di produksi, ganti dengan URL web Anda
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            },
        });
    }

    try {
        // 2. Ambil data dari frontend
        const {
            message,
            history,
            interestProfile,
            recommendedMajors
        } = await req.json();

        if (!message || !history) {
            throw new Error("Pesan dan riwayat chat diperlukan.");
        }

        // 3. Bangun System Instruction (logika dari file Anda)
        let systemInstruction = `Anda adalah konsultan jurusan universitas dari 'Jurusanku' yang ramah dan berpengetahuan. Persona Anda adalah konsultan karir pribadi, bukan sebuah AI. Berinteraksilah dengan pengguna dalam gaya percakapan yang profesional namun tetap santai. Selalu berkomunikasi dengan nada yang suportif dan memotivasi dalam Bahasa Indonesia. Hindari penggunaan bahasa gaul atau terlalu informal. Tujuan Anda adalah membantu siswa SMA di Indonesia menemukan jurusan yang tepat.`;

        if (interestProfile) {
            systemInstruction += ` Pengguna memiliki profil minat '${interestProfile}'.`;
        }
        if (recommendedMajors && recommendedMajors.length > 0) {
            const majorNames = (recommendedMajors as Jurusan[]).map(j => j.nama).join(', ');
            systemInstruction += ` Berdasarkan algoritma kami, jurusan berikut direkomendasikan untuknya: ${majorNames}. Gunakan ini sebagai titik awal pembicaraan.`;
        }
        systemInstruction += ` Gunakan konteks ini untuk memberikan rekomendasi yang personal dan memandu percakapan.`;

        // 4. Inisialisasi model dan kirim pesan
        // Perhatikan: Chat di-inisialisasi setiap saat (stateless)
        // Riwayat dikelola oleh frontend
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: systemInstruction,
        });

        const chat = model.startChat({ history: history });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        // 5. Kirim kembali HANYA teks respons
        return new Response(JSON.stringify({ reply: text }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Sesuaikan di produksi
            },
        });

    } catch (error) {
        console.error("Error di Supabase Function:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});