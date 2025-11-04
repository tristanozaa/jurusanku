
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { startChatSession, sendMessageToAI } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PremiumPaywall: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center bg-white rounded-2xl p-8 animate-boing-in shadow-xl border-t-4 border-stone-400">
        <h2 className="text-2xl font-bold text-stone-600 mb-2">Akses Konsultasi Eksklusif</h2>
        <p className="text-gray-700 max-w-md mb-6">
            Dapatkan bimbingan personal dari konsultan AI kami. Diskusikan hasil tes Anda dan ajukan pertanyaan untuk memantapkan pilihan masa depan Anda.
        </p>
        <Link to="/account" className="bg-stone-500 text-white font-bold py-3 px-6 rounded-full hover:bg-stone-600 transition-colors text-lg shadow-md">
            Upgrade ke Akun Premium
        </Link>
    </div>
);


const KonsultasiAIPage: React.FC = () => {
  const { interestResult, recommendedMajors, currentUser } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  const isPremium = currentUser?.subscriptionStatus === 'premium';

  useEffect(() => {
    if (!sessionStarted && isPremium) {
      startChatSession(
        interestResult?.profile || null, 
        recommendedMajors || null
      );
      
      let initialText = "Halo, saya adalah konsultan karir AI dari Jurusanku. Saya siap membantu Anda. Apakah ada yang ingin Anda diskusikan mengenai pilihan jurusan?";
      if (interestResult) {
          initialText = `Halo! Berdasarkan hasil tes, profil minat Anda adalah '${interestResult.profile}'. Ini adalah wawasan yang menarik.`;
          if (recommendedMajors && recommendedMajors.length > 0) {
              const majorNames = recommendedMajors.map(j => j.nama).join(' atau ');
              initialText += ` Oleh karena itu, jurusan seperti ${majorNames} berpotensi sangat cocok untuk Anda. Apakah ada di antaranya yang menarik perhatian Anda?`;
          } else {
              initialText += " Silakan ceritakan, apa yang Anda pikirkan mengenai profil ini atau jurusan yang Anda inginkan?";
          }
      }

      const initialModelMessage: ChatMessage = {
        role: 'model',
        text: initialText
      };

      setMessages([initialModelMessage]);
      setSessionStarted(true);
    }
  }, [interestResult, recommendedMajors, sessionStarted, isPremium]);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await sendMessageToAI(input);
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      setError(err.message || 'Gagal berkomunikasi dengan konsultan. Coba lagi.');
      const errorMessage: ChatMessage = { role: 'model', text: "Mohon maaf, terjadi gangguan koneksi. Silakan coba ajukan pertanyaan Anda kembali nanti."};
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPremium) {
      return (
          <div className="h-[75vh]">
            <PremiumPaywall />
          </div>
      );
  }

  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-2xl shadow-2xl animate-boing-in">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-center text-gray-800">Konsultasi dengan AI</h1>
      </div>
      <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg px-4 py-3 rounded-2xl shadow ${msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-lg px-4 py-3 rounded-2xl shadow bg-gray-200 text-gray-800">
                    <LoadingSpinner size="sm" />
                </div>
            </div>
        )}
      </div>
      <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
        {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
        <form onSubmit={handleSend} className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan Anda di sini..."
            className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-teal-600 text-white rounded-full p-3 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default KonsultasiAIPage;