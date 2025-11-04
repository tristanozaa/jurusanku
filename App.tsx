
import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JurusanPage from './pages/JurusanPage';
import TesMinatPage from './pages/TesMinatPage';
import KonsultasiAIPage from './pages/KonsultasiAIPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import { AppContextProvider, useAppContext } from './context/AppContext';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser, loadingAuth } = useAppContext();
    
    if (loadingAuth) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};


const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAppContext();

  const navLinks = [
    { path: '/', name: 'Beranda' },
    { path: '/jurusan', name: 'Info Jurusan' },
    { path: '/tes-minat', name: 'Tes Minat' },
    { path: '/konsultasi', name: 'Konsultasi AI' },
  ];

  const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className={`block md:inline-block w-full md:w-auto text-left md:text-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          isActive
            ? 'bg-teal-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-teal-100 hover:text-teal-700'
        }`}
      >
        {children}
      </Link>
    );
  };
  
  const AuthLinks: React.FC = () => {
    if (currentUser) {
        return <NavLink to="/account">Akun</NavLink>;
    }
    return (
        <>
            <NavLink to="/login">Masuk</NavLink>
            <Link 
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block md:inline-block w-full md:w-auto text-left md:text-center px-4 py-2 rounded-full text-sm font-semibold bg-stone-500 text-white hover:bg-stone-600 transition-all duration-300 shadow hover:shadow-md"
            >
                Daftar Gratis
            </Link>
        </>
    );
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-extrabold text-teal-600">
              Jurusanku
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path}>
                  {link.name}
                </NavLink>
              ))}
              <div className="border-l border-gray-300 h-6 mx-4"></div>
              <AuthLinks />
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-600 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path}>
                {link.name}
              </NavLink>
            ))}
             <div className="border-t border-gray-200 my-2"></div>
             <AuthLinks />
          </div>
        </div>
      )}
    </header>
  );
};


const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-500">
          &copy; {new Date().getFullYear()} Jurusanku. Dibuat dengan dedikasi untuk masa depan Anda.
        </div>
      </div>
    </footer>
  );
};


function AppRoutes() {
  return (
      <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/jurusan" element={<JurusanPage />} />
              <Route path="/tes-minat" element={<TesMinatPage />} />
              <Route path="/konsultasi" element={
                <ProtectedRoute>
                    <KonsultasiAIPage />
                </ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute>
                    <AccountPage />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
  )
}

function App() {
  return (
    <AppContextProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppContextProvider>
  );
}

export default App;