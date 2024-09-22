import React, { useState, useEffect } from "react";
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
  const [error, setError] = useState(null);
  const router = useRouter();

  // Kullanıcıyı getir ve adresleri yükle
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        setError("Oturum doğrulaması sırasında bir hata oluştu.");
        console.error("Auth Error: ", authError);
        return;
      }

      if (session) {
        setUser(session.user);
        console.log("Kullanıcı bulundu:", session.user);
        fetchAddresses(session.user.id);
      } else {
        console.log("Kullanıcı bulunamadı, login sayfasına yönlendiriliyor...");
        router.push("/login");
      }
    };

    const fetchAddresses = async (userId) => {
      console.log("Adresler yükleniyor...");
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        setError("Adresler yüklenirken bir hata oluştu.");
        console.error("Adres yükleme hatası:", error);
      } else {
        setAddresses(data);
        console.log("Adresler başarıyla yüklendi:", data);
      }

      setLoading(false);
    };

    fetchUser();
  }, [router]);

  // Adres ekleme fonksiyonu
  const addAddress = async (e) => {
    e.preventDefault();
    
    // Form verilerini kontrol et
    const { name, surname, phone, address, city } = newAddress;
    if (!name || !surname || !phone || !address || !city) {
      setError("Lütfen tüm alanları doldurun.");
      console.warn("Eksik alanlar mevcut:", newAddress);
      return;
    }

    try {
      console.log("Yeni adres ekleniyor:", newAddress);
      const { data, error } = await supabase
        .from("addresses")
        .insert([{ ...newAddress, user_id: user.id }])
        .select();

      if (error) {
        setError("Adres eklenirken bir hata oluştu.");
        console.error("Adres ekleme hatası:", error);
      } else {
        setAddresses([...addresses, data[0]]);
        setNewAddress({
          name: "",
          surname: "",
          phone: "",
          address: "",
          city: "",
        });
        setError(null);
        console.log("Adres başarıyla eklendi:", data[0]);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      setError("Beklenmeyen bir hata oluştu.");
    }
  };

  // Adres silme fonksiyonu
  const deleteAddress = async (id) => {
    try {
      const { error } = await supabase.from("addresses").delete().eq("id", id);
      if (error) {
        setError("Adres silinirken bir hata oluştu.");
        console.error("Adres silme hatası:", error);
      } else {
        setAddresses(addresses.filter((address) => address.id !== id));
        console.log("Adres başarıyla silindi:", id);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      setError("Beklenmeyen bir hata oluştu.");
    }
  };

  if (loading) {
    return <p className="text-center py-6 text-lg font-medium">Yükleniyor...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Adreslerim</h1>

        {/* Adres ekleme formu */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Yeni Adres Ekle</h2>
          <form onSubmit={addAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <input
    type="text"
    placeholder="Ad"
    value={newAddress.name} // name olarak güncellendi
    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
  <input
    type="text"
    placeholder="Soyad"
    value={newAddress.surname} // surname olarak güncellendi
    onChange={(e) => setNewAddress({ ...newAddress, surname: e.target.value })}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
  <input
    type="text"
    placeholder="Telefon"
    value={newAddress.phone} // phone olarak güncellendi
    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
  <input
    type="text"
    placeholder="Adres"
    value={newAddress.address} // address olarak güncellendi
    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
  <input
    type="text"
    placeholder="Şehir"
    value={newAddress.city} // city olarak güncellendi
    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
  <button
    type="submit"
    className="md:col-span-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
  >
    Adres Ekle
  </button>
</form>


        </div>

        {/* Hata mesajı */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Adres listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{address.name} {address.surname}</h3>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  <p className="text-sm text-gray-600">{address.address}</p>
                  <p className="text-sm text-gray-600">{address.city}</p>
                  <button
                    onClick={() => deleteAddress(address.id)}
                    className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600">Kayıtlı adres bulunmamaktadır.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
