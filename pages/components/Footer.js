import { motion } from 'framer-motion';
import Link from 'next/link'; // Link bileşeni

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-black py-8 mt-16 text-white"
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        {/* Trendyol Grubu */}
        <div>
          <h3 className="font-bold mb-4 text-xl">aeCards</h3>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-purple-400">Biz Kimiz</Link></li>
            <li><Link href="/career" className="hover:text-purple-400">Kariyer</Link></li>
            <li><Link href="/sustainability" className="hover:text-purple-400">Sürdürülebilirlik</Link></li>
            <li><Link href="/contact" className="hover:text-purple-400">İletişim</Link></li>
          </ul>
        </div>

        {/* Kampanyalar */}
        <div>
          <h3 className="font-bold mb-4 text-xl">Kampanyalar</h3>
          <ul className="space-y-2">
            <li><Link href="/kampanyalar" className="hover:text-purple-400">Kampanyalar</Link></li>
            <li><Link href="/credit" className="hover:text-purple-400">Alışveriş Kredisi</Link></li>
            <li><Link href="/membership" className="hover:text-purple-400">Elit Üyelik</Link></li>
            <li><Link href="/fırsatlar" className="hover:text-purple-400">aeCards Fırsatları</Link></li>
          </ul>
        </div>

        {/* Satıcı */}
        <div>
          <h3 className="font-bold mb-4 text-xl">Satıcı</h3>
          <ul className="space-y-2">
            <li><Link href="/sell" className="hover:text-purple-400">aeCards'da Satış Yap</Link></li>
            <li><Link href="/basics" className="hover:text-purple-400">Temel Kavramlar</Link></li>
            <li><Link href="/academy" className="hover:text-purple-400">aeCards Akademi</Link></li>
          </ul>
        </div>

        {/* Yardım */}
        <div>
          <h3 className="font-bold mb-4 text-xl">Yardım</h3>
          <ul className="space-y-2">
            <li><Link href="/faq" className="hover:text-purple-400">Sıkça Sorulan Sorular</Link></li>
            <li><Link href="/support" className="hover:text-purple-400">Canlı Yardım</Link></li>
            <li><Link href="/returns" className="hover:text-purple-400">İade İşlemleri</Link></li>
            <li><Link href="/guidelines" className="hover:text-purple-400">İşlem Rehberi</Link></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 px-4">
        {/* Güvenlik Sertifikaları */}
        <div className="text-center md:text-left">
          <h3 className="font-bold mb-4 text-xl">Güvenlik Sertifikası</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            {/* Sertifikalar */}
            <img src="/security1.png" alt="Güvenlik Sertifikası" className="h-10" />
            <img src="/security2.png" alt="Güvenlik Sertifikası" className="h-10" />
            <img src="/security3.png" alt="Güvenlik Sertifikası" className="h-10" />
          </div>
        </div>

        {/* Güvenli Alışveriş */}
        <div className="text-center">
          <h3 className="font-bold mb-4 text-xl">Güvenli Alışveriş</h3>
          <div className="flex justify-center space-x-4">
            {/* Ödeme Yöntemleri */}
            <img src="/visa.png" alt="Visa" className="h-10" />
            <img src="/mastercard.png" alt="Mastercard" className="h-10" />
            <img src="/amex.png" alt="Amex" className="h-10" />
          </div>
        </div>

        {/* Mobil Uygulamalar */}
        <div className="text-center md:text-right">
          <h3 className="font-bold mb-4 text-xl">Mobil Uygulamalar</h3>
          <div className="flex justify-center md:justify-end space-x-4">
            {/* Uygulama Linkleri */}
            <img src="/appstore.png" alt="App Store" className="h-10" />
            <img src="/googleplay.png" alt="Google Play" className="h-10" />
            <img src="/huawei.png" alt="Huawei AppGallery" className="h-10" />
          </div>
        </div>
      </div>

      {/* Alt Footer */}
      <div className="container mx-auto mt-8 px-4 border-t border-gray-700 pt-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} aeCards. Tüm hakları saklıdır.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <Link href="/terms" className="hover:text-purple-400">Kullanım Koşulları</Link>
          <Link href="/privacy" className="hover:text-purple-400">Gizlilik Politikası</Link>
          <Link href="/cookies" className="hover:text-purple-400">Çerez Politikası</Link>
        </div>
      </div>
    </motion.footer>
  );
}
