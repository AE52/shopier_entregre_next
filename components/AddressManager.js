import { useState, useEffect } from 'react';

export default function AddressManager({ addresses, addAddress }) {
  // Yeni adres formu için state
  const [newAddress, setNewAddress] = useState({
    name: '',
    surname: '',
    phone: '',
    billing_address: '',
    city: '',
  });

  // Eğer var olan adres bilgisi varsa, bu bilgileri doldur
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setNewAddress({
        name: addresses[0].name || '',
        surname: addresses[0].surname || '',
        phone: addresses[0].phone || '',
        billing_address: addresses[0].billing_address || '',
        city: addresses[0].city || '',
      });
    }
  }, [addresses]);

  // Formdaki input değişikliklerini yakalayan fonksiyon
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Adres ekleme fonksiyonu
  const handleAddAddress = (e) => {
    e.preventDefault();
    addAddress(newAddress); // Yeni adresi üst bileşene ilet
    setNewAddress({ name: '', surname: '', phone: '', billing_address: '', city: '' }); // Formu sıfırla
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Adres Bilgisi</h3>
      <form onSubmit={handleAddAddress}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Ad</label>
          <input
            type="text"
            name="name"
            value={newAddress.name}
            onChange={handleInputChange}
            className="w-full p-2 rounded-md bg-gray-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Soyad</label>
          <input
            type="text"
            name="surname"
            value={newAddress.surname}
            onChange={handleInputChange}
            className="w-full p-2 rounded-md bg-gray-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Telefon</label>
          <input
            type="tel"
            name="phone"
            value={newAddress.phone}
            onChange={handleInputChange}
            className="w-full p-2 rounded-md bg-gray-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Adres</label>
          <input
            type="text"
            name="billing_address"
            value={newAddress.billing_address}
            onChange={handleInputChange}
            className="w-full p-2 rounded-md bg-gray-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Şehir</label>
          <input
            type="text"
            name="city"
            value={newAddress.city}
            onChange={handleInputChange}
            className="w-full p-2 rounded-md bg-gray-200"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Adres Ekle / Güncelle
        </button>
      </form>
    </div>
  );
}
