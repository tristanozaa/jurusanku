import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';


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
        // 1. Create user in Supabase Authentication
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (signUpError) {
          if (signUpError.message.includes("User already registered")) {
            setError('Email ini sudah terdaftar. Silakan masuk.');
          } else {
            throw signUpError;
          }
          setLoading(false);
          return; // Stop execution
        }
        
        if (data.user) {
          // 2. Create a corresponding user document in our public 'users' table
          // Note: Supabase handles the user entry in the 'auth.users' table automatically.
          // We add a public profile for app-specific data.
          // RLS policies should be set up in Supabase to allow this insert.
          const { error: insertError } = await supabase
            .from('users')
            .insert({ id: data.user.id, subscription_status: 'free' });

            if (insertError) {
              // This is a tricky state. User is created in auth but profile creation failed.
              // AppContext has logic to handle this on next login.
              // For now, we'll log it and show a generic error.
              console.error("Error creating user profile:", insertError);
              throw new Error("Gagal membuat profil pengguna setelah pendaftaran.");
            }
        } else {
          // This case could happen if email confirmation is required.
          // For this app's flow, we'll assume it's not and a user object is always returned on success.
          // If confirmation is on, you'd show a "Please check your email" message.
           setError('Pendaftaran berhasil, silakan verifikasi email Anda jika diperlukan.');
           setLoading(false);
           return;
        }


        // 3. Navigate to account page, onAuthStateChanged will handle the rest
        // A successful sign up also signs the user in.
        alert('Pendaftaran berhasil! Anda akan dialihkan ke halaman akun.');
        navigate('/account');

    } catch (err: any) {
        setError(err.message || 'Gagal membuat akun. Silakan coba lagi.');
        console.error("Registration error:", err);
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