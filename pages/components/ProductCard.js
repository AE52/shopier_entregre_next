import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="border rounded-lg shadow-lg p-4 bg-gray-900 flex flex-col justify-between">
      <Link href={`/product/${product.id}`}>
        <div className="cursor-pointer flex flex-col items-center">
          <Image
            src={product.image_url}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-full object-cover rounded-md"
          />
          <h2 className="text-xl md:text-2xl font-bold mt-4 text-center">{product.name}</h2>
          <p className="text-md md:text-lg text-center">Fiyat: {product.price} TL</p>
        </div>
      </Link>

      <button
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 mt-4 w-full rounded-md hover:opacity-90 transition-opacity"
        onClick={() => addToCart(product)}
      >
        Sepete Ekle
      </button>
    </div>
  );
}
