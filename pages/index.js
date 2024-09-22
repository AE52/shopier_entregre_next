import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';

export default function Home({
  cart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  calculateTotal,
  isCartOpen,
  toggleCart,
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Ürünleri yükle
    const fetchProducts = async () => {
      let { data: products, error } = await supabase.from('products').select('*');
      if (!error) {
        setProducts(products);
      }
    };
    fetchProducts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-gradient-to-r from-black via-purple-900 to-black text-white"
    >
      <Header toggleCart={toggleCart} cartItems={cart} />
      <div className="flex-1 container mx-auto p-8 pt-20">
        <h1 className="text-5xl font-bold text-center mb-8">Kart Mağazası</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>

      <Cart
        cart={cart}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        calculateTotal={calculateTotal}
        isCartOpen={isCartOpen}
        toggleCart={toggleCart}
      />
      <Footer />
    </motion.div>
  );
}
