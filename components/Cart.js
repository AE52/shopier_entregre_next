import { useContext, useState, useEffect } from 'react';
import CartContext from '../context/CartContext';
import { useRouter } from 'next/router';
import AddressManager from './AddressManager';
import { supabase } from '../lib/supabase'; // Supabase istemcinizi içe aktardığınızdan emin olun

export default function Cart({ user, addresses, addAddress }) { // Buradaki addAddress prop olarak geliyor
  const {
    cart,
    toggleCart,
    updateCartQuantity,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    calculateTotal,
    isCartOpen,
    handleCheckout,
  } = useContext(CartContext);

  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(''); // Seçilen adres
  const [isGuestCheckout, setIsGuestCheckout] = useState(false); // Misafir alışveriş durumu
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    billing_address: '',
    city: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);

  // Kullanıcı oturum kontrolü için
  const [currentUser, setCurrentUser] = useState(null);

  // Kullanıcıyı supabase üzerinden alıyoruz
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Kullanıcı alınırken hata oluştu:', error.message);
      } else {
        setCurrentUser(user);
      }
    };
    fetchUser();
  }, []);

  // Checkout işlemi için güncellenmiş handleCheckoutClick
  const handleCheckoutClick = async (e) => {  
    e.preventDefault(); // Sayfa yenilenmesini engeller

    if (currentUser) {
      // Giriş yapmış kullanıcılar için
      if (addresses && addresses.length === 0) {
        router.push('/adreslerim');
      } else if (selectedAddress === '') {
        setErrorMessage('Lütfen bir adres seçin.');
      } else {
        handleCheckout({
          buyer_name: currentUser.first_name || currentUser.email,
          buyer_surname: currentUser.last_name || '',
          buyer_email: currentUser.email,
          buyer_phone: currentUser.phone || '',
          billing_address: selectedAddress.billing_address,
          city: selectedAddress.city,
        });
      }
    } else if (isGuestCheckout) {
      // Misafir checkout
      if (
        !guestDetails.firstName ||
        !guestDetails.lastName ||
        !guestDetails.email ||
        !guestDetails.phone ||
        !guestDetails.billing_address ||
        !guestDetails.city
      ) {
        setErrorMessage('Lütfen tüm bilgileri doldurun.');
      } else {
        handleCheckout({
          buyer_name: guestDetails.firstName,
          buyer_surname: guestDetails.lastName,
          buyer_email: guestDetails.email,
          buyer_phone: guestDetails.phone,
          billing_address: guestDetails.billing_address,
          city: guestDetails.city,
        });
      }
    }
  };

  // Misafir bilgilerini güncelleme fonksiyonu
  const handleGuestInputChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-gray-900 p-6 transition-transform transform z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ maxHeight: '100vh', overflowY: 'auto' }}
    >
      <h2 className="text-2xl font-bold mb-4 text-white">Sepetiniz</h2>
      <button onClick={toggleCart} className="absolute top-4 right-6 text-white text-xl">✖</button>

      {cart.length > 0 ? (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="mb-4 flex justify-between items-center text-white">
                <div className="flex flex-col w-full">
                  <span className="font-semibold">{item.name}</span>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <button onClick={() => decrementQuantity(item.id)} className="bg-gray-800 text-white px-2 py-1 rounded-md">-</button>
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value);
                          if (!isNaN(newQuantity)) {
                            updateCartQuantity(item.id, newQuantity);
                          }
                        }}
                        className="w-10 text-center mx-2 bg-gray-800 text-white rounded-md"
                      />
                      <button onClick={() => incrementQuantity(item.id)} className="bg-gray-800 text-white px-2 py-1 rounded-md">+</button>
                    </div>
                    <span>{(item.price * item.quantity).toFixed(2)} TL</span>
                  </div>
                </div>
                <button className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-colors" onClick={() => removeFromCart(item.id)}>Çıkart</button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-lg font-bold text-white">Toplam: {calculateTotal().toFixed(2)} TL</div>

          {/* Kullanıcı giriş yapmışsa */}
          {currentUser ? (
            addresses && addresses.length > 0 ? (
              <>
                <label className="block text-sm font-medium mb-2 text-white">Teslimat Adresi Seç</label>
                <select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="" disabled>Adres Seçiniz</option>
                  {addresses.map((address, index) => (
                    <option key={index} value={address}>
                      {address.billing_address}, {address.city}
                    </option>
                  ))}
                </select>

                <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 mt-4 w-full rounded-md hover:opacity-90 transition-opacity" onClick={handleCheckoutClick}>
                  Satın Al
                </button>
              </>
            ) : (
              <div>
                <p className="text-red-500 mb-4">Lütfen önce adres ekleyin.</p>
                <AddressManager addresses={addresses} addAddress={addAddress} />
              </div>
            )
          ) : (
            // Kullanıcı giriş yapmamışsa
            isGuestCheckout ? (
              <div>
                <p className="text-white mb-4">Misafir olarak devam ediyorsunuz. Lütfen bilgilerinizi girin.</p>
                <form onSubmit={handleCheckoutClick}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white">Ad</label>
                    <input
                      type="text"
                      name="firstName"
                      value={guestDetails.firstName}
                      onChange={handleGuestInputChange}
                      className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white">Soyad</label>
                    <input
                      type="text"
                      name="lastName"
                      value={guestDetails.lastName}
                      onChange={handleGuestInputChange}
                      className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white">E-posta</label>
                    <input
                      type="email"
                      name="email"
                      value={guestDetails.email}
                      onChange={handleGuestInputChange}
                      className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={guestDetails.phone}
                      onChange={handleGuestInputChange}
                      className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white">Adres</label>
                    <input
                      type="text"
                      name="billing_address"
                      value={guestDetails.billing_address}
                      onChange={handleGuestInputChange}
                      className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white">Şehir</label>
                    <input
                      type="text"
                      name="city"
                      value={guestDetails.city}
                      onChange={handleGuestInputChange}
                      className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 w-full rounded-md hover:opacity-90 transition-opacity"
                    onClick={handleCheckoutClick}
                  >
                    Satın Al
                  </button>
                </form>
              </div>
            ) : (
              // Misafir ya da giriş yapma seçenekleri
              <div className="flex flex-col gap-4 mt-4">
      <button
        className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 w-full rounded-md hover:opacity-90 transition-opacity"
        onClick={() => {
          setIsGuestCheckout(true);
        }}
      >
        Misafir Olarak Devam Et
      </button>
      <button
        className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-4 w-full rounded-md hover:opacity-90 transition-opacity"
        onClick={() => router.push('/login')}
      >
        Giriş Yap veya Kayıt Ol
      </button>
    </div>
  )
)}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </>
      ) : (
        <p className="text-gray-500">Sepetiniz boş</p>
      )}
    </div>
  );
}
