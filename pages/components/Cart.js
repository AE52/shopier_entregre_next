import { useContext } from 'react';
import CartContext from '../context/CartContext';
import { useRouter } from 'next/router';

export default function Cart({ user, setIsGuestCheckout }) {
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

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-gray-900 p-6 transition-transform transform z-50 ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`} 
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
                      <button 
                        onClick={() => decrementQuantity(item.id)} 
                        className="bg-gray-800 text-white px-2 py-1 rounded-md"
                      >
                        -
                      </button>
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
                      <button 
                        onClick={() => incrementQuantity(item.id)} 
                        className="bg-gray-800 text-white px-2 py-1 rounded-md"
                      >
                        +
                      </button>
                    </div>
                    <span>{(item.price * item.quantity).toFixed(2)} TL</span>
                  </div>
                </div>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-colors"
                  onClick={() => removeFromCart(item.id)}
                >
                  Çıkart
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-lg font-bold text-white">Toplam: {calculateTotal().toFixed(2)} TL</div>

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
        </>
      ) : (
        <p className="text-gray-500">Sepetiniz boş</p>
      )}
    </div>
  );
}
