
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AccountPage: React.FC = () => {
    const { currentUser, logout, upgradeAccount } = useAppContext();
    const navigate = useNavigate();
    const [upgraded, setUpgraded] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const handleUpgrade = () => {
        upgradeAccount();
        setUpgraded(true);
    };

    if (!currentUser) {
        return <p>Loading...</p>;
    }

    const isPremium = currentUser.subscriptionStatus === 'premium';

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl animate-boing-in">
            <h1 className="text-3xl font-bold text-center mb-6">Profil Anda</h1>

            <div className="space-y-4 text-center mb-8">
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p>
                    <strong>Status Akun:</strong>
                    <span className={`ml-2 font-bold px-3 py-1 rounded-full text-sm ${
                        isPremium 
                        ? 'bg-stone-200 text-stone-800' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                        {isPremium ? 'Premium' : 'Gratis'}
                    </span>
                </p>
            </div>
            
            {upgraded && (
                 <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center mb-6">
                    Berhasil! Akun Anda telah ditingkatkan ke Premium. Semua fitur eksklusif kini tersedia.
                </div>
            )}

            {!isPremium && !upgraded && (
                <div className="bg-teal-50 border border-teal-200 p-6 rounded-xl text-center mb-8">
                    <h2 className="text-xl font-bold text-teal-800 mb-2">Tingkatkan ke Akun Premium</h2>
                    <p className="text-teal-700 mb-4">
                        Dapatkan akses penuh ke semua fitur unggulan kami untuk membantu Anda membuat keputusan yang lebih baik:
                    </p>
                    <ul className="text-left list-disc list-inside text-teal-700 mb-4 mx-auto max-w-md">
                        <li><strong>Data Karir Lengkap</strong> (estimasi pendapatan, ketersediaan lowongan, dll)</li>
                        <li><strong>Konsultasi AI Tanpa Batas</strong></li>
                    </ul>
                    <button 
                        onClick={handleUpgrade}
                        className="bg-stone-500 text-white font-bold py-2 px-6 rounded-full hover:bg-stone-600 transition-colors text-lg shadow-md"
                    >
                        Upgrade Sekarang
                    </button>
                </div>
            )}
            
            <div className="text-center">
                <button
                    onClick={handleLogout}
                    className="w-full md:w-auto text-center py-2 px-6 border-b-4 border-red-700 rounded-full shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Keluar
                </button>
            </div>
        </div>
    );
};

export default AccountPage;