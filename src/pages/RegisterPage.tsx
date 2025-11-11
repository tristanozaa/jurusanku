import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// IMPOR SUPABASE (menggantikan firebase)
// PERBAIKAN: Mengubah path impor agar sesuai dengan struktur services
import { supabase } from "../services/supabaseClient"; // Pastikan path ini benar

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi sisi klien (tetap sama)
    if (!email || !password || !confirmPassword) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok. Silakan coba lagi.");
      return;
    }
    if (password.length < 6) {
      setError("Password harus terdiri dari minimal 6 karakter.");
      return;
    }
    setLoading(true);

    try {
      // 1. Buat pengguna di Supabase Authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error(
          "Pendaftaran berhasil tapi data pengguna tidak kembali."
        );
      }

      // 2. Buat dokumen pengguna di tabel 'users' (meniru logika Firestore Anda)
      // Pastikan Anda memiliki tabel 'users' di Supabase
      const { error: dbError } = await supabase
        .from("users") // Asumsi Anda punya tabel 'users'
        .insert({
          id: authData.user.id, // Menghubungkan ke auth.users.id
          email: authData.user.email,
          subscriptionStatus: "free",
          // 'createdAt' biasanya diatur oleh database dengan `default: now()`
        });

      if (dbError) {
        // Jika ini gagal, pengguna dibuat di Auth tapi tidak di DB.
        // Sebaiknya tangani ini, tapi untuk sekarang kita laporkan errornya.
        throw new Error(
          `Akun dibuat, tapi gagal menyimpan profil: ${dbError.message}`
        );
      }

      // 3. Navigasi ke halaman akun
      setShowConfirmation(true);
    } catch (err: any) {
      // Menangani error Supabase
      if (err.message.includes("User already registered")) {
        setError("Email ini sudah terdaftar. Silakan masuk.");
      } else if (err.message.includes("Invalid email")) {
        setError("Format email tidak valid. Mohon periksa kembali.");
      } else {
        setError(err.message || "Gagal membuat akun. Silakan coba lagi.");
        console.error("Registration error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Bagian JSX (tampilan) tidak diubah sama sekali
  return (
    <>
      <div className="flex justify-center items-center py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl animate-boing-in">
          <h1 className="text-3xl font-bold text-center mb-6">
            Buat Akun Baru
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
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
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
                {loading ? "Memproses..." : "Daftar"}
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full animate-boing-in">
            <div className="mx-auto bg-green-100 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Pendaftaran Berhasil!</h2>
            <p className="text-gray-600 mb-6">
              Akun Anda telah berhasil dibuat. Silakan cek email Anda untuk
              verifikasi (fitur simulasi) dan masuk untuk melanjutkan.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-full hover:bg-teal-700 transition-colors shadow-lg"
            >
              Lanjutkan Masuk
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPage;
