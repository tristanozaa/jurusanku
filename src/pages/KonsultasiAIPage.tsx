// Ini adalah KODE FRONTEND Anda (Aman)
// (File ini yang Anda impor di App.tsx)

import React from 'react';
import { supabase } from '../services/supabaseClient'; // Path ke klien Supabase Anda
import { useAppContext } from '../context/AppContext';

// Definisikan tipe untuk riwayat chat
type ChatMessage = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

const KonsultasiAIPage: React.FC = () => {
  const [message, setMessage] = React.useState('');
  const [chatHistory, setChatHistory] = React.useState<ChatMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Ambil konteks (jika ada)
  const { interestProfile, recommendedMajors } = useAppContext();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || loading) return;

    setLoading(true);
    setError('');

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: message }],
    };

    // Optimistic update: Tampilkan pesan pengguna segera
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setMessage('');

    try {
      // 1. Panggil Supabase Edge Function (Backend)
      const { data, error: funcError } = await supabase.functions.invoke('gemini-consult', {
        body: {
          message: message,
          history: newHistory.slice(0, -1), // Kirim riwayat SEBELUM pesan baru
          interestProfile: interestProfile,
          recommendedMajors: recommendedMajors
        },
      });

      if (funcError) {
        throw funcError;
      }

      const modelMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: data.reply }],
      };

      // 2. Tambahkan respons dari AI ke riwayat
      setChatHistory(prevHistory => [...prevHistory, modelMessage]);

    } catch (err: any) {
      setError(err.message || 'Gagal terhubung ke AI. Coba lagi nanti.');
      // Rollback optimistic update jika gagal
      setChatHistory(prevHistory => prevHistory.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] max-w-2xl mx-auto bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold text-center p-4 border-b">Konsultasi AI</h1>

      {/* Area Chat */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-3 rounded-lg max-w-xs ${msg.role === 'user'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-800'
                }`}
            >
              {msg.parts[0].text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-gray-200 text-gray-500">
              Mengetik...
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ketik pesan Anda..."
          className="flex-1 block w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !message}
          className="px-6 py-2 border-b-4 border-teal-800 rounded-full shadow-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400"
        >
          Kirim
        </button>
      </form>
      {error && <p className="p-2 text-center text-red-600">{error}</p>}
    </div>
  );
};

export default KonsultasiAIPage;