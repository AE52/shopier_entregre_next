import { useState, useEffect } from 'react';
import { supabase } from '@/pages/lib/supabase';
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
  const [sortOrder, setSortOrder] = useState('desc'); // Varsayılan sıralama 'desc' yani en yüksekten en düşüğe

  useEffect(() => {
    const fetchProducts = async () => {
      let { data: products, error } = await supabase.from('products').select('*');
      if (!error) {
        setProducts(products);
      }
    };
    fetchProducts();
  }, []);

  // Ürünleri sıralama
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.price - b.price; // Fiyata göre artan
    }
    return b.price - a.price; // Fiyata göre azalan (varsayılan)
  });

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

        {/* Sıralama seçenekleri */}
        <div className="flex justify-end mb-4">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded"
          >
            <option value="desc">En Yüksek Fiyattan En Düşüğe</option>
            <option value="asc">En Düşük Fiyattan En Yükseğe</option>
          </select>
        </div>

        {/* Ürün listesi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {sortedProducts.map((product) => (
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
