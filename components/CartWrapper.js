import { useEffect, useState } from 'react';
import Cart from './Cart'; // Cart bileşenini doğru bir yoldan içeri aktardığınızdan emin olun
import { supabase } from '../lib/supabase'; // Supabase istemcisini içe aktarın

const CartWrapper = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const getUserAndAddresses = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Kullanıcı alınırken hata oluştu:', error.message);
      } else {
        setUser(user);
        if (user) {
          const { data: addresses, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user.id);
          if (error) {
            console.error('Adresler alınırken hata oluştu:', error.message);
          } else {
            setAddresses(addresses);
          }
        }
      }
    };
    getUserAndAddresses();
  }, []);

  return <Cart user={user} addresses={addresses} />;
};

export default CartWrapper; // Varsayılan olarak CartWrapper bileşenini export ediyoruz
