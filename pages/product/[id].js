import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import Cart from '../../components/Cart';
import CartContext from '../../context/CartContext'; // Import CartContext

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  
  // Access addToCart from CartContext
  const { addToCart } = useContext(CartContext);


  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        let { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (product) setProduct(product);
      };
      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return <p className="text-center text-white">Yükleniyor...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col justify-between bg-gradient-to-r from-black via-purple-900 to-black text-white"
    >
      <Header />

      <div className="container mx-auto p-4 md:p-8 py-20">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 md:mb-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
          {product.name}
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-full md:w-1/2">
            <Image
              src={product.image_url}
              alt={product.name}
              width={500}
              height={400}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left">
            <p className="text-base md:text-lg mb-4">{product.description}</p>
            <p className="text-lg md:text-2xl font-bold mb-4">Fiyat: {product.price} TL</p>
            <button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 w-full md:w-auto rounded-md hover:opacity-90 transition-opacity"
              onClick={() => addToCart(product)} // Use addToCart from CartContext
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>

      <Cart />
      <Footer />
    </motion.div>
  );
}
