import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Link from 'next/link';
import Footer from './components/Footer';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);  // Bu sayfanın istemci tarafında render edildiğini işaretliyoruz
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    }, {
      data: { full_name: fullName },
    });
    if (error) {
      setError(error.message);
    } else {
      router.push('/login'); // Kayıt başarılıysa login sayfasına yönlendir
    }
  };

  if (!isRendered) {
    return null;  // Sunucu tarafında render edilmesini engelliyoruz
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col justify-center items-center bg-black text-white"
    >
      <Header />
      <h1 className="text-5xl font-bold mb-8 text-gradient bg-gradient-to-r from-purple-500 to-indigo-500">Kayıt Ol</h1>
      <form onSubmit={handleRegister} className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Ad Soyad"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 mb-4 text-black rounded-md focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 text-black rounded-md focus:outline-none"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 text-black rounded-md focus:outline-none"
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
        >
          Kayıt Ol
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
      <p className="mt-4">
        Hesabın var mı?{' '}
        <Link href="/login" className="text-indigo-400 hover:underline">
          Giriş Yap
        </Link>
      </p>
      <Footer />
    </motion.div>
  );
}
