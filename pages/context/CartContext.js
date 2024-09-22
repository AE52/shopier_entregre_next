import { createContext, useState, useEffect } from 'react';

// CartContext oluşturuyoruz
const CartContext = createContext();

// CartProvider bileşeni ile context'i sağlayacağız
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Sepet
  const [isCartOpen, setIsCartOpen] = useState(false); // Sepetin açık olup olmadığı
  const [guestCheckout, setGuestCheckout] = useState(false); // Misafir alışverişi durumu

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

  // Sepete ürün ekleme fonksiyonu
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

  // Sepet miktarını güncelleme fonksiyonu
  const updateCartQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Sepetten ürün çıkarma fonksiyonu
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  // Toplam fiyatı hesaplama fonksiyonu
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Miktarı artırma fonksiyonu
  const incrementQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Miktarı azaltma fonksiyonu
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
// handleCheckout fonksiyonunu CartContext.js dosyasından düzenliyoruz
const handleCheckout = async (checkoutDetails) => {
  const totalValue = calculateTotal(); // Toplam sepet tutarını hesaplıyoruz
  
  // checkoutDetails içeriği misafir veya kullanıcı bilgilerini içeriyor
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: Math.floor(Math.random() * 1000000), // Rastgele sipariş ID'si
        item_name: cart.map((item) => item.name).join(', '), // Ürün adları
        buyer_name: checkoutDetails.buyer_name, // Misafir veya kullanıcının adı
        buyer_surname: checkoutDetails.buyer_surname, // Misafir veya kullanıcının soyadı
        buyer_email: checkoutDetails.buyer_email, // Misafir veya kullanıcının e-postası
        buyer_phone: checkoutDetails.buyer_phone, // Misafir veya kullanıcının telefonu
        billing_address: checkoutDetails.billing_address, // Adres
        city: checkoutDetails.city, // Şehir
        total_order_value: totalValue, // Toplam tutar
      }),
    });

    if (response.ok) {
      const html = await response.text();
      const newWindow = window.open();
      newWindow.document.write(html);

      // Başarılı ödeme sonrası sepeti temizliyoruz
      setCart([]);
      setIsCartOpen(false);
    } else {
      console.error('Checkout failed:', response.statusText);
    }
  } catch (error) {
    console.error('Checkout error:', error);
  }
};

  

  // Guest checkout işlemini başlatma ve durumu değiştirme fonksiyonu
  const setIsGuestCheckout = (value) => {
    setGuestCheckout(value);
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
        guestCheckout, // Guest checkout durumu
        setIsGuestCheckout, // Guest checkout fonksiyonu
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
