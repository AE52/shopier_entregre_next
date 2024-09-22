import { useCart } from '../context/CartContext'
export default function CheckoutForm({ guestDetails, handleGuestInputChange, handleGuestCheckout, errorMessage }) {
    return (
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
    );
  }
  