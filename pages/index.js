import Image from 'next/image'; // Import Image bileşeni
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Footer from './components/Footer';
import Header from './components/Header';

export default function Home() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); // Kullanıcı giriş durumu
  const router = useRouter();
  const cartRef = useRef(null);  // Sepeti hedeflemek için ref

  // Kullanıcı giriş durumu için kontrol
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null); // Kullanıcı varsa set et, yoksa null
    };
    checkUser();
  }, []);

  const products = [
    { id: 1, name: 'Dünyanın en iyi Sol kanadı', price: 2000, image: '/eren.jpg' },
    { id: 2, name: 'Dünyanın en iyi 10 numarası', price: 1000, image: '/aras.jpg' },
    { id: 3, name: 'Berat', price: 50, image: '/berat.jpg' },
  ];

  // Ürün sepete eklenince sepete kaydır
  const addToCart = (product) => {
    setCart([...cart, product]);

    // Sepete kaydır (scroll)
    if (cartRef.current) {
      cartRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sepetten ürün çıkarma fonksiyonu
  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index); // İlgili indexteki ürünü çıkar
    setCart(newCart);
  };

  // Satın al işlemi
  const handleCheckout = async () => {
    if (!user) {
      // Eğer kullanıcı giriş yapmamışsa login sayfasına yönlendir
      router.push('/login');
    } else {
      // Giriş yapmışsa ödeme işlemi başlasın
      const orderData = {
        order_id: Math.floor(Math.random() * 1000000),
        item_name: cart.map(p => p.name).join(', '),
        buyer_name: user.user_metadata.full_name,
        buyer_email: user.email,
        ucret: cart.reduce((total, product) => total + product.price, 0),
      };

      const res = await fetch('/api/generate-payment-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const html = await res.text();
      document.write(html); // Ödeme formu döndüğünde sayfaya yazdırılır
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col justify-between bg-gradient-to-r from-black via-purple-900 to-black text-white"
    >
      <Header />
      
      <div className="container mx-auto p-8">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
          Kart Mağazası
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="border rounded-lg shadow-lg p-4 bg-gray-900">
              <div className="flex justify-center">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  width={300} 
                  height={200} 
                  className="w-full h-64 object-contain rounded-md" // object-contain ile tam sığdırma
                />
              </div>
              <h2 className="text-2xl font-bold mt-4 text-center">{product.name}</h2>
              <p className="text-lg text-center">Fiyat: {product.price} TL</p>
              <button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 mt-4 w-full rounded-md hover:opacity-90 transition-opacity"
                onClick={() => addToCart(product)}
              >
                Sepete Ekle
              </button>
            </div>
          ))}
        </div>

        {/* Sepet Alanı */}
        {cart.length > 0 && (
          <div ref={cartRef} className="mt-8 bg-gray-800 p-4 rounded-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Sepetiniz</h2>
            <ul>
              {cart.map((item, index) => (
                <li key={index} className="mb-4 flex justify-between items-center">
                  <span>{item.name} - {item.price} TL</span>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-colors"
                    onClick={() => removeFromCart(index)}
                  >
                    Çıkart
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 mt-4 w-full rounded-md hover:opacity-90 transition-opacity"
              onClick={handleCheckout}
            >
              Satın Al
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </motion.div>
  );
}
