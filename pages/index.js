import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    item_name: '',
    order_id: '',
    buyer_name: '',
    buyer_surname: '',
    buyer_email: '',
    buyer_phone: '',
    city: '',
    billing_address: '',
    ucret: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/generate-payment-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const htmlForm = await res.text();
    document.write(htmlForm); // Oluşan HTML formunu sayfaya yazdırıyoruz
    document.close();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Shopier Payment</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Item Name', name: 'item_name' },
            { label: 'Order ID', name: 'order_id' },
            { label: 'Buyer Name', name: 'buyer_name' },
            { label: 'Buyer Surname', name: 'buyer_surname' },
            { label: 'Buyer Email', name: 'buyer_email', type: 'email' },
            { label: 'Buyer Phone', name: 'buyer_phone', type: 'tel' },
            { label: 'City', name: 'city' },
            { label: 'Billing Address', name: 'billing_address' },
            { label: 'Price', name: 'ucret', type: 'number' },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type || 'text'}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Pay with Shopier
          </button>
        </form>
      </div>
    </div>
  );
}
