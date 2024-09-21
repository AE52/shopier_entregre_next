import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Footer from './components/Footer';
import Header from './components/Header';
import Link from 'next/link';

export default function Home() {
  const [cart, setCart] = useState([]);  // Sepet State
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false); // Misafir Kullanıcı Modu
  const [guestDetails, setGuestDetails] = useState({
    full_name: '',
    surname: '',
    email: '',
    phone: '',
    billing_address: '',
    city: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  // Kullanıcı oturumu kontrolü
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        const { data: cartItems } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', session.user.id);

        if (cartItems) {
          setCart(cartItems);
        }
      }
    };
    checkUser();
  }, []);

  // Ürünleri çekme
  useEffect(() => {
    const fetchProducts = async () => {
      let { data: products, error } = await supabase
        .from('products')
        .select('*');
      if (!error) {
        setProducts(products);
      }
    };
    fetchProducts();
  }, []);

  // Sepete ekleme fonksiyonu
  const addToCart = async (product) => {
    if (!product.price) {
      alert('Bu ürün için fiyat bilgisi mevcut değil.');
      return;
    }

    if (!user) {
      const newCartItem = {
        product_id: product.id,
        name: product.name,
        price: product.price,  // Ürün fiyatı kontrol ediliyor
        quantity: 1,
        user_id: 'guest',
      };
      setCart([...cart, newCartItem]);
    } else {
      const existingProductIndex = cart.findIndex((item) => item.product_id === product.id);
      if (existingProductIndex > -1) {
        const newCart = [...cart];
        newCart[existingProductIndex].quantity += 1;
        setCart(newCart);
        await supabase
          .from('cart')
          .update({ quantity: newCart[existingProductIndex].quantity })
          .eq('product_id', product.id)
          .eq('user_id', user.id);
      } else {
        const newCartItem = {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          user_id: user.id,
        };
        setCart([...cart, newCartItem]);
        await supabase.from('cart').insert([newCartItem]);
      }
    }

    setIsCartOpen(true);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleGuestInputChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails({ ...guestDetails, [name]: value });
  };

  // Misafir kullanıcı checkout işlemi
  const handleGuestCheckout = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert("Sepetiniz boş.");
      return;
    }

    if (!guestDetails.full_name || !guestDetails.surname || !guestDetails.email || 
        !guestDetails.phone || !guestDetails.billing_address || !guestDetails.city) {
      setErrorMessage('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const totalValue = calculateTotal();
      const orderData = {
        order_id: Math.floor(Math.random() * 1000000),
        item_name: cart.map(item => `${item.quantity} tane ${item.name}`).join(', '),
        buyer_name: guestDetails.full_name,
        buyer_surname: guestDetails.surname,
        buyer_email: guestDetails.email,
        buyer_phone: guestDetails.phone,
        billing_address: guestDetails.billing_address,
        city: guestDetails.city,
        total_order_value: totalValue,  // Toplam tutar API'ye doğru şekilde gönderiliyor
      };
  
      const res = await fetch('/api/generate-payment-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      const html = await res.text();
      document.write(html);
    } catch (error) {
      console.error("Ödeme işlemi sırasında hata oluştu:", error);
      alert("Ödeme işlemi sırasında bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
    } else {
      const totalValue = calculateTotal();
      const orderData = {
        order_id: Math.floor(Math.random() * 1000000),
        item_name: cart.map(item => `${item.quantity} tane ${item.name}`).join(', '),
        buyer_name: user.user_metadata.full_name,
        buyer_surname: user.user_metadata.surname || '',
        buyer_email: user.email,
        buyer_phone: user.user_metadata.phone || '',
        billing_address: user.user_metadata.billing_address,
        city: user.user_metadata.city,
        total_order_value: totalValue,  // Toplam tutar burada doğru hesaplanıyor
      };

      const res = await fetch('/api/generate-payment-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const html = await res.text();
      document.write(html);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user || !user.id) {
      console.log('Kullanıcı oturum açmadı.');
      return;
    }
  
    const newCart = cart.filter(item => item.product_id !== productId);
    setCart(newCart);
  
    await supabase
      .from('cart')
      .delete()
      .eq('product_id', productId)
      .eq('user_id', user.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-gradient-to-r from-black via-purple-900 to-black text-white"
      style={{ overflowX: 'hidden' }}
    >
      <Header toggleCart={toggleCart} cartItems={cart} />

      <div className="flex-1 container mx-auto p-8 pt-20">
        <h1 className="text-5xl font-bold text-center mb-8">Kart Mağazası</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg shadow-lg p-4 bg-gray-900 flex flex-col justify-between">
              <Link href={`/product/${product.id}`}>
                <div className="cursor-pointer flex flex-col items-center">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <h2 className="text-xl md:text-2xl font-bold mt-4 text-center">{product.name}</h2>
                  <p className="text-md md:text-lg text-center">Fiyat: {product.price} TL</p>
                </div>
              </Link>

              <button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 mt-4 w-full rounded-md hover:opacity-90 transition-opacity"
                onClick={() => addToCart(product)}
              >
                Sepete Ekle
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sepet Paneli */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-gray-900 p-6 transition-transform transform z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ maxHeight: '100vh', overflowY: 'auto' }}>
  <h2 className="text-2xl font-bold mb-4">Sepetiniz</h2>
  <button onClick={toggleCart} className="absolute top-4 right-6 text-white text-xl">✖</button>

  {cart.length > 0 ? (
    <>
      <ul>
        {cart.map((item, index) => (
          <li key={index} className="mb-4 flex justify-between items-center">
            <span>{item.name}</span>
            <span>{item.price} TL</span>
            <button
              className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-colors"
              onClick={() => removeFromCart(item.product_id)}
            >
              Çıkart
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-lg font-bold">Toplam: {calculateTotal()} TL</div>

      {/* Misafir veya Kayıt/Giriş Seçenekleri */}
      <div className="mt-4">
        {!user && (
          <div className="flex flex-col gap-4">
            <button
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 w-full rounded-md hover:opacity-90 transition-opacity"
              onClick={() => setIsGuestCheckout(true)}
            >
              Kayıt Olmadan Devam Et
            </button>
            <button
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-4 w-full rounded-md hover:opacity-90 transition-opacity"
              onClick={() => router.push('/login')}
            >
              Kayıt Ol veya Giriş Yap
            </button>
          </div>
        )}
        {user && (
          <button
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 mt-4 w-full rounded-md hover:opacity-90 transition-opacity"
            onClick={handleCheckout}
          >
            Satın Al
          </button>
        )}
      </div>

      {/* Misafir Bilgi Formu */}
      {isGuestCheckout && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-4 w-full max-w-lg mx-auto sm:px-4 sm:w-full sm:max-w-xs">
          <h3 className="text-xl font-bold text-center mb-4">Misafir Alışverişi Bilgileri</h3>
          <form onSubmit={handleGuestCheckout}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="full_name">Ad</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={guestDetails.full_name}
                onChange={handleGuestInputChange}
                className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="surname">Soyad</label>
              <input
                id="surname"
                name="surname"
                type="text"
                value={guestDetails.surname}
                onChange={handleGuestInputChange}
                className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">E-posta</label>
              <input
                id="email"
                name="email"
                type="email"
                value={guestDetails.email}
                onChange={handleGuestInputChange}
                className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="phone">Telefon</label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={guestDetails.phone}
                onChange={handleGuestInputChange}
                className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="billing_address">Fatura Adresi</label>
              <input
                id="billing_address"
                name="billing_address"
                type="text"
                value={guestDetails.billing_address}
                onChange={handleGuestInputChange}
                className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="city">Şehir</label>
              <input
                id="city"
                name="city"
                type="text"
                value={guestDetails.city}
                onChange={handleGuestInputChange}
                className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 w-full rounded-md hover:opacity-90 transition-opacity"
            >
              Misafir Olarak Satın Al
            </button>
          </form>
        </div>
      )}
    </>
  ) : (
    <p className="text-gray-500">Sepetiniz boş</p>
  )}
</div>


      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleCart}
        ></div>
      )}

      <Footer />
    </motion.div>
  );
}
