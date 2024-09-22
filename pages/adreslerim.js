"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Adreslerim() {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    surname: "",
    phone: "",
    address: "",
    city: "",
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchAddresses(session.user.id);
      } else {
        router.push("/login");
      }
    };

    const fetchAddresses = async (userId) => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId);
      if (!error) {
        setAddresses(data);
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const addAddress = async () => {
    const { name, surname, phone, address, city } = newAddress;
    if (!name || !surname || !phone || !address || !city) return;

    const { data, error } = await supabase
      .from("addresses")
      .insert([{ ...newAddress, user_id: user.id }]);

    if (!error) {
      setAddresses([...addresses, data[0]]);
      setNewAddress({
        name: "",
        surname: "",
        phone: "",
        address: "",
        city: "",
      });
    }
  };

  const deleteAddress = async (id) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (!error) {
      setAddresses(addresses.filter((address) => address.id !== id));
    }
  };

  if (loading) {
    return <p className="text-center py-6 text-lg font-medium text-white">Yükleniyor...</p>;
  }

  return (
    <>
      {/* Import Header */}
      <Header />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 bg-black text-white">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-400">Adreslerim</h1>

        {/* Responsive Form */}
        <div className="max-w-lg mx-auto mb-6 bg-gray-900 p-6 rounded-lg shadow-lg">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ad"
              value={newAddress.name}
              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
              className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Soyad"
              value={newAddress.surname}
              onChange={(e) => setNewAddress({ ...newAddress, surname: e.target.value })}
              className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Telefon"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Adres"
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Şehir"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={addAddress}
            className="w-full bg-purple-600 text-white py-3 mt-4 rounded-md hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Adres Ekle
          </button>
        </div>

        {/* Address List */}
        <ul className="max-w-lg mx-auto bg-gray-800 shadow-md rounded-md p-6">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <li
                key={address.id}
                className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0"
              >
                <div>
                  <p><strong>{address.name} {address.surname}</strong></p>
                  <p>{address.phone}</p>
                  <p>{address.address}</p>
                  <p>{address.city}</p>
                </div>
                <button
                  onClick={() => deleteAddress(address.id)}
                  className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Sil
                </button>
              </li>
            ))
          ) : (
            <p className="text-center">Kayıtlı adres bulunmamaktadır.</p>
          )}
        </ul>
      </main>

      {/* Import Footer */}
      <Footer />
    </>
  );
}
