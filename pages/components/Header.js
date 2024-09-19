"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";

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

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      document.body.style.overflow = "hidden"; // Menü açıldığında sayfa kaydırmasını engelle
    } else {
      document.body.style.overflow = "auto"; // Menü kapandığında kaydırmayı geri getir
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-black ">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <h1 className="text-4xl font-bold text-white">
          <Link href="/">aeCards</Link>
        </h1>
        <div className="md:hidden">
          {/* Hamburger Menü Butonu (Mobile) */}
          <button onClick={toggleMenu} className="text-white text-3xl">
            {menuOpen ? "✖" : "☰"} {/* Menü açma/kapatma ikonu */}
          </button>
        </div>
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-white font-bold hover:text-purple-300"
            >
              {item.name}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Çıkış Yap
            </button>
          )}
        </nav>
      </div>

      {/* Hamburger Menü (Mobile) */}
      <motion.div
        initial={{ x: "100%" }}
        animate={menuOpen ? { x: 0 } : { x: "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed top-0 right-0 w-2/3 h-full bg-black text-white z-[9999] flex flex-col items-start p-8 shadow-lg"
      >
        <button
          onClick={toggleMenu}
          className="text-4xl text-white self-end mb-4 focus:outline-none"
        >
          ✖ {/* Menü kapatma butonu */}
        </button>

        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="text-2xl font-bold hover:text-purple-300 mb-6"
            onClick={toggleMenu} // Menü tıklanınca kapanır
          >
            {item.name}
          </Link>
        ))}

        {/* Kullanıcı çıkış yapma */}
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
