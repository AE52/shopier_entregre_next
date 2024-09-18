import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-black py-8 mt-16"
    >
      <div className="text-center">
        <p className="text-lg font-semibold text-white">
          &copy; {new Date().getFullYear()} aeCards. Tüm hakları saklıdır.
        </p>
        <div className="mt-4">
          <a
            href="#"
            className="text-pink-500 hover:text-pink-400 mx-2 transition-colors"
          >
            Instagram
          </a>
          <a
            href="#"
            className="text-purple-500 hover:text-purple-400 mx-2 transition-colors"
          >
            Twitter
          </a>
          <a
            href="#"
            className="text-blue-500 hover:text-blue-400 mx-2 transition-colors"
          >
            Facebook
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
