import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../services/firebase';


const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || !confirmPassword) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok. Silakan coba lagi.');
      return;
    }
    if (password.length < 6) {
        setError('Password harus terdiri dari minimal 6 karakter.');
        return;
    }
    setLoading(true);
    
    try {
        // 1. Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user!;

        // 2. Create a corresponding user document in Firestore
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            email: user.email,
            subscriptionStatus: 'free',
            createdAt: serverTimestamp(),
        });

        // 3. Navigate to account page, onAuthStateChanged will handle the rest
        navigate('/account');

    } catch (err: any) {
        // Handle Firebase auth errors
        if (err.code === 'auth/email-already-in-use') {
            setError('Email ini sudah terdaftar. Silakan masuk.');
        } else if (err.code === 'auth/invalid-email') {
            setError('Format email tidak valid. Mohon periksa kembali.');
        } else {
            setError('Gagal membuat akun. Silakan coba lagi.');
            console.error("Registration error:", err);
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl animate-boing-in">
        <h1 className="text-3xl font-bold text-center mb-6">Buat Akun Baru</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-500"
              placeholder="kamu@email.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-500"
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Ulangi Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-500"
              placeholder="Ketik ulang password di atas"
              autoComplete="new-password"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border-b-4 border-teal-800 rounded-full shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400 disabled:border-teal-500"
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </div>
        </form>
         <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
