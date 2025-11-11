import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// IMPOR DIGANTI DARI FIREBASE KE SUPABASE
// PERBAIKAN: Path diubah dari 'services' ke 'lib' agar sesuai struktur folder Anda
import { supabase } from "../services/supabaseClient";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email dan password tidak boleh kosong.");
      setLoading(false);
      return;
    }

    try {
      // LOGIKA DIGANTI DARI FIREBASE KE SUPABASE
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        throw authError; // Lemparkan error untuk ditangani oleh catch block
      }

      // onAuthStateChanged in AppContext will handle setting the user state
      navigate("/account");
    } catch (err: any) {
      // PENANGANAN ERROR DIGANTI UNTUK SUPABASE
      const errorMessage = err.message || "";
      if (errorMessage.includes("Invalid login credentials")) {
        setError("Email atau password yang Anda masukkan salah.");
      } else if (errorMessage.includes("Invalid email format")) {
        setError("Format email tidak valid.");
      } else {
        setError("Gagal masuk. Silakan coba beberapa saat lagi.");
        console.error("Login error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- TIDAK ADA PERUBAHAN DESAIN DI BAWAH INI ---
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl animate-boing-in">
        <h1 className="text-3xl font-bold text-center mb-6">
          Masuk ke Akun Anda
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center">
              {error}
            </p>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-500"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border-b-4 border-teal-800 rounded-full shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400 disabled:border-teal-500"
              M
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
