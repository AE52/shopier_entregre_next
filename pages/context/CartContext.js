import { createContext, useState, useEffect } from 'react';

// CartContext oluşturuyoruz
const CartContext = createContext();

// CartProvider bileşeni ile context'i sağlayacağız
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sepeti localStorage'dan yükleme
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Sepet değiştiğinde localStorage'ı güncelleme
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Sepeti açıp kapatma fonksiyonu
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Sepete ürün ekleme
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingProductIndex > -1) {
        // Ürün zaten sepetteyse miktarını artır
        return prevCart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Yeni ürünü sepete ekle
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Sepet miktarını güncelleme
  const updateCartQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Sepetten ürün çıkarma
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  // Toplam fiyatı hesaplama
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Miktarı artırma
  const incrementQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Miktarı azaltma
  const decrementQuantity = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.find(item => item.id === productId);
      if (item.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // Miktar 1'den fazla değilse ürünü çıkar
        return prevCart.filter(item => item.id !== productId);
      }
    });
  };

  // Checkout işlemi
  const handleCheckout = async () => {
    const totalValue = calculateTotal();
    console.log('Checkout başlatılıyor, toplam:', totalValue);
    // Gerçek checkout mantığını burada ekleyin
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        toggleCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        calculateTotal,
        incrementQuantity,
        decrementQuantity,
        handleCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
