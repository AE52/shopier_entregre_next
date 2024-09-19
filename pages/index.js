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
  const router = useRouter();

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

  const addToCart = async (product) => {
    if (!user) {
      router.push('/login');
      return;
    }

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
      const newCartItem = { product_id: product.id, name: product.name, price: product.price, quantity: 1, user_id: user.id };
      setCart([...cart, newCartItem]);

      await supabase
        .from('cart')
        .insert([newCartItem]);
    }

    setIsCartOpen(true);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
    } else {
      // Her bir ürünün ismini ve adetini birleştiriyoruz
      const formattedItems = cart.map(item => `${item.quantity} tane ${item.name}`).join(', ');
  
      const orderData = {
        order_id: Math.floor(Math.random() * 1000000),
        item_name: formattedItems,  // Adet ve ürün isimleriyle birlikte gönderiliyor
        buyer_name: user.user_metadata.full_name,
        buyer_email: user.email,
        total: calculateTotal(),  // Toplam ücreti hesapla
      };
  
      const res = await fetch('/api/generate-payment-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      const html = await res.text();
      document.write(html);  // Ödeme formunu görüntüle
    }
  };
  

  const removeFromCart = async (productId) => {
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
      <Header toggleCart={toggleCart} cartItems={cart} /> {/* cartItems prop olarak gönderiliyor */}

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

      {/* Sepet paneli */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-gray-900 p-6 transition-transform transform z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
            <button
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 mt-4 w-full rounded-md hover:opacity-90 transition-opacity"
              onClick={handleCheckout}
            >
              Satın Al
            </button>
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
