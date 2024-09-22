import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const CartWrapper = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const getUserAndAddresses = async () => {
      // Kullanıcıyı Supabase'den al
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Kullanıcı alınırken hata oluştu:', error.message);
      } else {
        console.log('Kullanıcı:', user); // Burada kullanıcı bilgisini loglayın
        setUser(user);

        // Eğer kullanıcı varsa adresleri de al
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

  return (
    // User ve addresses prop'larını Cart bileşenine geçiriyoruz
    <Cart user={user} addresses={addresses} />
  );
};
