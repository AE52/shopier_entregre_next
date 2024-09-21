import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Footer from './components/Footer';
import Header from './components/Header';
import Cart from './components/Cart';
import ProductCard from './components/ProductCard';
import CheckoutForm from './components/CheckoutForm';

export default function Home() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
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
    if (!product.price) {
      alert('Bu ürün için fiyat bilgisi mevcut değil.');
      return;
    }

    if (!user) {
      const newCartItem = {
        product_id: product.id,
        name: product.name,
        price: product.price,
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

  const updateCartQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map((item) =>
      item.product_id === productId ? { ...item, quantity: parseInt(newQuantity) } : item
    );
    setCart(newCart);

    if (user) {
      await supabase
        .from('cart')
        .update({ quantity: parseInt(newQuantity) })
        .eq('product_id', productId)
        .eq('user_id', user.id);
    }
  };

  const incrementQuantity = (productId) => {
    const item = cart.find((item) => item.product_id === productId);
    if (item) {
      updateCartQuantity(productId, item.quantity + 1);
    }
  };

  const decrementQuantity = (productId) => {
    const item = cart.find((item) => item.product_id === productId);
    if (item) {
      updateCartQuantity(productId, item.quantity - 1);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
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
        total_order_value: totalValue,
      };

      try {
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
    }
  };

  const handleGuestCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Sepetiniz boş.");
      return;
    }

    if (!guestDetails.full_name || !guestDetails.surname || !guestDetails.email || !guestDetails.phone || !guestDetails.billing_address || !guestDetails.city) {
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
        total_order_value: totalValue,
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

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const removeFromCart = async (productId) => {
    if (!user || !user.id) {
      setCart(cart.filter((item) => item.product_id !== productId));
      return;
    }

    const newCart = cart.filter((item) => item.product_id !== productId);
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
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>

      <Cart
  isCartOpen={isCartOpen}  // Sepetin açık olup olmadığını belirten prop
  cart={cart}
  toggleCart={toggleCart}
  updateCartQuantity={updateCartQuantity}
  incrementQuantity={incrementQuantity}
  decrementQuantity={decrementQuantity}
  removeFromCart={removeFromCart}
  calculateTotal={calculateTotal}
  user={user}
  setIsGuestCheckout={setIsGuestCheckout}
/>


      {isGuestCheckout && (
        <CheckoutForm
          guestDetails={guestDetails}
          handleGuestInputChange={handleGuestInputChange}
          handleGuestCheckout={handleGuestCheckout}
          errorMessage={errorMessage}
        />
      )}

      <Footer />
    </motion.div>
  );
}
