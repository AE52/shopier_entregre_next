import { useRouter } from 'next/router';
import { useContext } from 'react'; // useContext hook'unu ekleyelim
import CartContext from '../context/CartContext'; // CartContext'i import edelim

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useContext(CartContext); // CartContext'ten addToCart fonksiyonunu alıyoruz

  const handleProductClick = () => {
    // Ürün sayfasına yönlendirme
    router.push(`/product/${product.id}`);
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 text-center flex flex-col justify-between h-full">
      {/* Fotoğraf alanına tıklanabilir özellik ekliyoruz */}
      <div 
        className="w-full h-64 overflow-hidden rounded-lg cursor-pointer"
        onClick={handleProductClick}
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-lg font-bold mt-4">{product.name}</h2>
      <p className="text-sm text-gray-400 mt-2">Fiyat: {product.price} TL</p>
      <button
        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 mt-4 rounded"
        onClick={() => addToCart(product)} // Sepete ekleme fonksiyonunu çağırıyoruz
      >
        Sepete Ekle
      </button>
    </div>
  );
}
