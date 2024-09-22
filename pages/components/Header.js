"use client";

import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import { FiShoppingCart } from "react-icons/fi";
import CartContext from '../context/CartContext';

const navItems = [
  { path: "/", name: "Anasayfa" },
  { path: "/siparislerim", name: "Siparişlerim" },
  { path: "/hakkimizda", name: "Hakkımızda" },
  { path: "/iletisim", name: "İletişim" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { toggleCart, cart } = useContext(CartContext);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = menuOpen ? "auto" : "hidden";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-black shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <h1 className="text-4xl font-bold text-white">
          <Link href="/">aeCards</Link>
        </h1>

        <div className="flex items-center space-x-4 relative">
          {/* Sepet İkonu ve Ürün Sayısı */}
          <button onClick={toggleCart} className="text-white text-3xl relative">
            <FiShoppingCart />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {cart.length}
              </span>
            )}
          </button>

          {/* Hamburger Menü Butonu */}
          <button onClick={toggleMenu} className="text-white text-3xl">
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Hamburger Menü */}
      <motion.div
        initial={{ x: "100%" }}
        animate={menuOpen ? { x: 0 } : { x: "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed top-0 right-0 h-full w-full max-w-xs bg-black text-white z-[9999] flex flex-col items-start p-8 shadow-lg"
        style={{ width: menuOpen ? "100%" : "0" }}
      >
        <button
          onClick={toggleMenu}
          className={`text-4xl text-white self-end mb-4 focus:outline-none ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          ✖
        </button>

        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="text-2xl font-bold hover:text-purple-300 mb-6"
            onClick={toggleMenu}
          >
            {item.name}
          </Link>
        ))}

        {/* Kullanıcı Girişi Olmamışsa */}
        {!user && (
          <div className="flex flex-col space-y-4 mt-8">
            <Link
              href="/login"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/signup"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Kayıt Ol
            </Link>
          </div>
        )}

        {/* Kullanıcı Giriş Yapmışsa Çıkış Yap */}
        {user && (
          <button
            onClick={() => {
              handleLogout();
              toggleMenu();
            }}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors mt-auto"
          >
            Çıkış Yap
          </button>
        )}
      </motion.div>
    </header>
  );
}