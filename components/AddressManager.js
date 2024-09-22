import { useState } from 'react';

export default function AddressManager({ addresses = [], addAddress }) {
  const [newAddress, setNewAddress] = useState({
    billing_address: '',
    city: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    addAddress(newAddress);
    setNewAddress({ billing_address: '', city: '' }); // Formu sıfırla
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Adreslerim</h3>

      <ul className="mb-4">
        {/* Güvenli bir şekilde addresses kontrolü */}
        {addresses && addresses.length > 0 ? (
          addresses.map((address, index) => (
            <li key={index} className="text-white">
              {address.billing_address}, {address.city}
            </li>
          ))
        ) : (
          <p className="text-gray-500">Henüz eklenmiş bir adres yok.</p>
        )}
      </ul>

      <form onSubmit={handleAddAddress} className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="billing_address">
            Fatura Adresi
          </label>
          <input
            id="billing_address"
            name="billing_address"
            type="text"
            value={newAddress.billing_address}
            onChange={handleInputChange}
            className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="city">
            Şehir
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={newAddress.city}
            onChange={handleInputChange}
            className="w-full p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-4 w-full rounded-md hover:opacity-90 transition-opacity"
        >
          Adres Ekle
        </button>
      </form>
    </div>
  );
}
